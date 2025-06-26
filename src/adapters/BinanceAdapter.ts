import {
  ExchangeAdapter,
  TradingPair,
  OrderBook,
  Trade,
  Kline,
  Order,
  Position,
  Timeframe,
} from '../types';

export class BinanceAdapter implements ExchangeAdapter {
  name = 'Binance';
  private wsMap: Map<string, WebSocket> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private callbacks: Map<string, Array<(...args: any[]) => void>> = new Map();
  private orderBookDeltaQueue: Map<string, any[]> = new Map(); // symbol -> delta queue
  private isReconnecting: Map<string, boolean> = new Map(); // symbol -> reconnecting
  private klineDeltaQueue: Map<string, any[]> = new Map(); // symbol+interval -> delta queue
  private isKlineReconnecting: Map<string, boolean> = new Map(); // symbol+interval -> reconnecting

  private readonly REST_BASE_URL = 'https://api.binance.com/api/v3';
  private readonly WS_BASE_URL = 'wss://stream.binance.com:9443/ws';

  constructor() {
    // this.setupReconnection();
  }

  //   private setupReconnection() {
  //     if (typeof window !== 'undefined') {
  //       window.addEventListener('online', () => {
  //         this.reconnect();
  //       });
  //     }
  //   }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.REST_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private connectWebSocket(streams: string[], manual = false) {
    const streamParam = streams.join('/');
    // If the ws already exists, close it first
    if (this.wsMap.has(streamParam)) {
      const oldWs = this.wsMap.get(streamParam);
      if (oldWs) {
        (oldWs as any)._manualClose = manual;
        oldWs.close();
      }
      this.wsMap.delete(streamParam);
    } else {
      // When switching the K-line chart time interval, close the current ws
      const item = [...this.wsMap.keys()].find(
        (item) => item.split('_')[0] === streamParam.split('_')[0]
      );
      if (item && this.wsMap.has(item)) {
        const oldWs = this.wsMap.get(item);
        if (oldWs) {
          (oldWs as any)._manualClose = manual;
          oldWs.close();
        }
        this.wsMap.delete(item);
      }
    }
    const ws = new WebSocket(`${this.WS_BASE_URL}/${streamParam}`);
    (ws as any)._manualClose = manual;
    this.wsMap.set(streamParam, ws);

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      // 如果是 orderbook，重连后快进
      if (streamParam.includes('@depth')) {
        const symbol = streamParam.split('@')[0].toUpperCase();
        if (this.isReconnecting.get(symbol)) {
          this.fastForwardOrderBook(symbol);
        }
      }
      // 如果是kline，重连后快进
      if (streamParam.includes('@kline_')) {
        const klineKey = streamParam;
        if (this.isKlineReconnecting.get(klineKey)) {
          this.fastForwardKline(klineKey);
        }
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data, streamParam);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      const wasManual = (ws as any)._manualClose;
      console.log('WebSocket disconnected:', streamParam, 'manual:', wasManual);
      this.wsMap.delete(streamParam);
      if (!wasManual) {
        // 仅网络异常断开才重连
        this.scheduleReconnect(streamParam);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleWebSocketMessage(data: any, streamParam?: string) {
    if (data.bids && data.asks) {
      this.handleOrderBookUpdate(data, streamParam);
    } else if (data.e === 'trade') {
      this.handleTradeUpdate(data);
    } else if (data.e === 'kline') {
      this.handleKlineUpdate(data, streamParam);
    }
  }

  private handleOrderBookUpdate(data: any, streamParam?: string) {
    const callbackKey = `orderbook`;
    const callbacks = this.callbacks.get(callbackKey) || [];
    const symbol = streamParam ? streamParam.split('@')[0].toUpperCase() : '';
    // Convert to our format
    const orderBook: OrderBook = {
      bids: data.bids.map((bid: [string, string]) => ({
        price: parseFloat(bid[0]),
        quantity: parseFloat(bid[1]),
        total: 0, // Will be calculated by aggregator
      })),
      asks: data.asks.map((ask: [string, string]) => ({
        price: parseFloat(ask[0]),
        quantity: parseFloat(ask[1]),
        total: 0, // Will be calculated by aggregator
      })),
      lastUpdateId: data.lastUpdateId,
    };
    // 如果正在重连，先把 delta 存队列
    if (symbol && this.isReconnecting.get(symbol)) {
      if (!this.orderBookDeltaQueue.has(symbol)) {
        this.orderBookDeltaQueue.set(symbol, []);
      }
      this.orderBookDeltaQueue.get(symbol)!.push(data);
      return;
    }
    callbacks.forEach((callback) => callback(orderBook));
  }

  private handleTradeUpdate(data: any) {
    const symbol = data.s.toLowerCase();
    const callbackKey = `${symbol}`;
    const callbacks = this.callbacks.get(callbackKey) || [];

    const trade: Trade = {
      id: data.t.toString(),
      symbol: data.s,
      price: parseFloat(data.p),
      quantity: parseFloat(data.q),
      side: data.m ? 'SELL' : 'BUY',
      timestamp: data.T,
    };

    callbacks.forEach((callback) => callback(trade));
  }

  private handleKlineUpdate(data: any, streamParam?: string) {
    const timeframe = data.k.i;
    const callbackKey = `klines_${timeframe}`;
    const callbacks = this.callbacks.get(callbackKey) || [];
    const klineKey = streamParam || '';
    // 如果正在重连，先把 delta 存队列
    if (klineKey && this.isKlineReconnecting.get(klineKey)) {
      if (!this.klineDeltaQueue.has(klineKey)) {
        this.klineDeltaQueue.set(klineKey, []);
      }
      this.klineDeltaQueue.get(klineKey)!.push(data);
      return;
    }
    const kline: Kline = {
      openTime: data.k.t,
      open: parseFloat(data.k.o),
      high: parseFloat(data.k.h),
      low: parseFloat(data.k.l),
      close: parseFloat(data.k.c),
      volume: parseFloat(data.k.v),
      closeTime: data.k.T,
      quoteAssetVolume: parseFloat(data.k.q),
      numberOfTrades: data.k.n,
      takerBuyBaseAssetVolume: parseFloat(data.k.V),
      takerBuyQuoteAssetVolume: parseFloat(data.k.Q),
    };
    callbacks.forEach((callback) => callback(kline));
  }

  private async fastForwardOrderBook(symbol: string) {
    try {
      const snapshot = await this.getOrderBook(symbol, 20);
      const callbackKey = `orderbook`;
      const callbacks = this.callbacks.get(callbackKey) || [];
      callbacks.forEach((callback) => callback(snapshot));
      // 应用 delta 队列
      const deltas = this.orderBookDeltaQueue.get(symbol) || [];
      deltas.forEach((delta) => {
        const orderBook: OrderBook = {
          bids: delta.bids.map((bid: [string, string]) => ({
            price: parseFloat(bid[0]),
            quantity: parseFloat(bid[1]),
            total: 0,
          })),
          asks: delta.asks.map((ask: [string, string]) => ({
            price: parseFloat(ask[0]),
            quantity: parseFloat(ask[1]),
            total: 0,
          })),
          lastUpdateId: delta.lastUpdateId,
        };
        callbacks.forEach((callback) => callback(orderBook));
      });
      this.orderBookDeltaQueue.set(symbol, []);
      this.isReconnecting.set(symbol, false);
    } catch (e) {
      console.error('Fast forward order book failed:', e);
    }
  }

  private async fastForwardKline(klineKey: string) {
    // klineKey: e.g. btcusdt@kline_1m
    try {
      const [symbolRaw, klineRaw] = klineKey.split('@');
      const symbol = symbolRaw.toUpperCase();
      const interval = klineRaw.replace('kline_', '');
      const klines = await this.getKlines(
        symbol,
        interval as any,
        undefined,
        undefined,
        500
      );
      const timeframe = interval;
      const callbackKey = `klines_${timeframe}`;
      const callbacks = this.callbacks.get(callbackKey) || [];
      if (klines.length > 0) {
        callbacks.forEach((callback) => callback(klines[klines.length - 1]));
      }
      // 应用 delta 队列
      const deltas = this.klineDeltaQueue.get(klineKey) || [];
      deltas.forEach((delta) => {
        const kline: Kline = {
          openTime: delta.k.t,
          open: parseFloat(delta.k.o),
          high: parseFloat(delta.k.h),
          low: parseFloat(delta.k.l),
          close: parseFloat(delta.k.c),
          volume: parseFloat(delta.k.v),
          closeTime: delta.k.T,
          quoteAssetVolume: parseFloat(delta.k.q),
          numberOfTrades: delta.k.n,
          takerBuyBaseAssetVolume: parseFloat(delta.k.V),
          takerBuyQuoteAssetVolume: parseFloat(delta.k.Q),
        };
        callbacks.forEach((callback) => callback(kline));
      });
      this.klineDeltaQueue.set(klineKey, []);
      this.isKlineReconnecting.set(klineKey, false);
    } catch (e) {
      console.error('Fast forward kline failed:', e);
    }
  }

  private scheduleReconnect(streamParam: string) {
    const symbol = streamParam.split('@')[0].toUpperCase();
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      this.isReconnecting.set(symbol, true);
      if (streamParam.includes('@kline_')) {
        this.isKlineReconnecting.set(streamParam, true);
      }
      console.log({ streamParam1: streamParam });
      setTimeout(() => this.reconnect(streamParam), delay);
    }
  }

  private reconnect(streamParam: string) {
    this.connectWebSocket([streamParam]);
  }

  private addCallback(key: string, callback: (...args: any[]) => void) {
    if (!this.callbacks.has(key)) {
      this.callbacks.set(key, []);
    }
    this.callbacks.get(key)!.push(callback);
  }

  private removeCallback(key: string, callback: (...args: any[]) => void) {
    console.log({ key });
    const callbacks = this.callbacks.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  async getTradingPairs(): Promise<TradingPair[]> {
    try {
      const exchangeInfo = await this.makeRequest<any>('/exchangeInfo');
      return exchangeInfo.symbols
        .filter(
          (symbol: any) =>
            symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT'
        )
        .map((symbol: any) => ({
          symbol: symbol.symbol,
          baseAsset: symbol.baseAsset,
          quoteAsset: symbol.quoteAsset,
          minPrice: parseFloat(
            symbol.filters.find((f: any) => f.filterType === 'PRICE_FILTER')
              ?.minPrice || '0'
          ),
          maxPrice: parseFloat(
            symbol.filters.find((f: any) => f.filterType === 'PRICE_FILTER')
              ?.maxPrice || '999999'
          ),
          tickSize: parseFloat(
            symbol.filters.find((f: any) => f.filterType === 'PRICE_FILTER')
              ?.tickSize || '0.01'
          ),
          minQty: parseFloat(
            symbol.filters.find((f: any) => f.filterType === 'LOT_SIZE')
              ?.minQty || '0'
          ),
          maxQty: parseFloat(
            symbol.filters.find((f: any) => f.filterType === 'LOT_SIZE')
              ?.maxQty || '999999'
          ),
          stepSize: parseFloat(
            symbol.filters.find((f: any) => f.filterType === 'LOT_SIZE')
              ?.stepSize || '0.01'
          ),
        }));
    } catch (error) {
      console.error('Failed to get trading pairs:', error);
      return [];
    }
  }

  async getOrderBook(symbol: string, limit: number = 20): Promise<OrderBook> {
    try {
      const data = await this.makeRequest<any>(
        `/depth?symbol=${symbol}&limit=${limit}`
      );

      return {
        bids: data.bids.map((bid: [string, string]) => ({
          price: parseFloat(bid[0]),
          quantity: parseFloat(bid[1]),
          total: 0,
        })),
        asks: data.asks.map((ask: [string, string]) => ({
          price: parseFloat(ask[0]),
          quantity: parseFloat(ask[1]),
          total: 0,
        })),
        lastUpdateId: data.lastUpdateId,
      };
    } catch (error) {
      console.error('Failed to get order book:', error);
      throw error;
    }
  }

  async getKlines(
    symbol: string,
    timeframe: Timeframe,
    from?: number,
    to?: number,
    limit: number = 500
  ): Promise<Kline[]> {
    try {
      const interval = this.mapTimeframeToBinanceInterval(timeframe);
      const data = await this.makeRequest<any[]>(
        `/klines?symbol=${symbol}&interval=${interval}${from ? `&startTime=${from * 1000}` : ''}${to ? `&endTime=${to * 1000}` : ''}&limit=${limit}`
      );

      return data.map((kline: any[]) => ({
        openTime: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
        closeTime: kline[6],
        quoteAssetVolume: parseFloat(kline[7]),
        numberOfTrades: kline[8],
        takerBuyBaseAssetVolume: parseFloat(kline[9]),
        takerBuyQuoteAssetVolume: parseFloat(kline[10]),
      }));
    } catch (error) {
      console.error('Failed to get klines:', error);
      throw error;
    }
  }

  async getTrades(symbol: string, limit: number = 100): Promise<Trade[]> {
    try {
      const data = await this.makeRequest<any[]>(
        `/trades?symbol=${symbol}&limit=${limit}`
      );

      return data.map((trade: any) => ({
        id: trade.id.toString(),
        symbol: trade.symbol,
        price: parseFloat(trade.price),
        quantity: parseFloat(trade.qty),
        side: trade.isBuyerMaker ? 'SELL' : 'BUY',
        timestamp: trade.time,
      }));
    } catch (error) {
      console.error('Failed to get trades:', error);
      throw error;
    }
  }

  subscribeOrderBook(
    symbol: string,
    callback: (data: OrderBook) => void
  ): () => void {
    const callbackKey = `orderbook`;
    const streamName = `${symbol.toLowerCase()}@depth20@100ms`;
    this.removeCallback(callbackKey, callback);
    this.addCallback(callbackKey, callback);
    this.connectWebSocket([streamName]);
    return () => {
      this.removeCallback(callbackKey, callback);
      const streamParam = streamName;
      if (this.wsMap.has(streamParam)) {
        const ws = this.wsMap.get(streamParam);
        if (ws) {
          (ws as any)._manualClose = true;
          ws.close();
        }
        this.wsMap.delete(streamParam);
      }
      // 清空 delta 队列和重连标记
      const symbolKey = streamName.split('@')[0].toUpperCase();
      this.orderBookDeltaQueue.delete(symbolKey);
      this.isReconnecting.delete(symbolKey);
    };
  }

  subscribeTrades(symbol: string, callback: (data: Trade) => void): () => void {
    const callbackKey = `${symbol.toLowerCase()}`;
    const streamName = `${symbol.toLowerCase()}@trade`;

    this.removeCallback(callbackKey, callback);
    this.addCallback(callbackKey, callback);
    this.connectWebSocket([streamName]);

    return () => {
      this.removeCallback(callbackKey, callback);

      const streamParam = streamName;
      if (this.wsMap.has(streamParam)) {
        const ws = this.wsMap.get(streamParam);
        if (ws) {
          (ws as any)._manualClose = true;
          ws.close();
        }
        this.wsMap.delete(streamParam);
      }
    };
  }

  subscribeKlines(
    symbol: string,
    timeframe: Timeframe,
    callback: (data: Kline) => void
  ): () => void {
    const callbackKey = `klines_${timeframe}`;
    const interval = this.mapTimeframeToBinanceInterval(timeframe);
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;

    this.removeCallback(callbackKey, callback);
    this.addCallback(callbackKey, callback);
    this.connectWebSocket([streamName]);

    return () => {
      this.removeCallback(callbackKey, callback);

      const streamParam = streamName;
      if (this.wsMap.has(streamParam)) {
        const ws = this.wsMap.get(streamParam);
        if (ws) {
          (ws as any)._manualClose = true;
          ws.close();
        }
        this.wsMap.delete(streamParam);
      }
      // 清空 delta 队列和重连标记
      this.klineDeltaQueue.delete(streamParam);
      this.isKlineReconnecting.delete(streamParam);
    };
  }

  async placeOrder(
    order: Omit<Order, 'id' | 'status' | 'timestamp'>
  ): Promise<Order> {
    // Mock implementation for now
    const mockOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING',
      timestamp: Date.now(),
    };

    // Simulate order processing
    setTimeout(() => {
      mockOrder.status = Math.random() > 0.1 ? 'FILLED' : 'REJECTED';
    }, 200);

    return mockOrder;
  }

  async cancelOrder(): Promise<boolean> {
    // Mock implementation
    return Math.random() > 0.1;
  }

  async getOrders(): Promise<Order[]> {
    // Mock implementation
    return [];
  }

  async getPositions(): Promise<Position[]> {
    // Mock implementation
    return [];
  }

  private mapTimeframeToBinanceInterval(timeframe: Timeframe): string {
    const mapping: Record<Timeframe, string> = {
      '1m': '1m',
      '5m': '5m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d',
    };
    return mapping[timeframe];
  }
}
