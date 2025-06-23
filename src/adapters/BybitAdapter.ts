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

export class BybitAdapter implements ExchangeAdapter {
  name = 'Bybit';
  private readonly REST_BASE_URL = 'https://api.bybit.com/v5/market';
  private readonly WS_BASE_URL = 'wss://stream.bybit.com/v5/public/spot';
  private wsMap: Map<string, WebSocket> = new Map();
  private callbacks: Map<string, Array<(...args: any[]) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.REST_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (json.retCode !== 0) {
        throw new Error(`Bybit API error: ${json.retMsg}`);
      }
      return json.result as T;
    } catch (error) {
      console.error('Bybit API request failed:', error);
      throw error;
    }
  }

  private connectWebSocket(topics: string[], manual = false) {
    const topicParam = topics.join(',');
    if (this.wsMap.has(topicParam)) {
      const oldWs = this.wsMap.get(topicParam);
      if (oldWs) {
        (oldWs as any)._manualClose = manual;
        oldWs.close();
      }
      this.wsMap.delete(topicParam);
    }
    const ws = new WebSocket(this.WS_BASE_URL);
    (ws as any)._manualClose = manual;
    this.wsMap.set(topicParam, ws);

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      // 订阅topics
      ws.send(
        JSON.stringify({
          op: 'subscribe',
          args: topics,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Bybit WS parse error:', error);
      }
    };

    ws.onclose = () => {
      const wasManual = (ws as any)._manualClose;
      this.wsMap.delete(topicParam);
      if (!wasManual) {
        this.scheduleReconnect(topics);
      }
    };

    ws.onerror = (error) => {
      console.error('Bybit WS error:', error);
    };
  }

  private handleWebSocketMessage(data: any) {
    if (data.topic?.startsWith('orderbook')) {
      this.handleOrderBookUpdate(data);
    } else if (data.topic?.startsWith('trade')) {
      this.handleTradeUpdate(data);
    } else if (data.topic?.startsWith('kline')) {
      this.handleKlineUpdate(data);
    }
  }

  private handleOrderBookUpdate(data: any) {
    const callbackKey = `orderbook:${data.topic}`;
    const callbacks = this.callbacks.get(callbackKey) || [];
    if (!data.data) return;
    const orderBook: OrderBook = {
      bids: (data.data.b ?? []).map((bid: [string, string]) => ({
        price: parseFloat(bid[0]),
        quantity: parseFloat(bid[1]),
        total: 0,
      })),
      asks: (data.data.a ?? []).map((ask: [string, string]) => ({
        price: parseFloat(ask[0]),
        quantity: parseFloat(ask[1]),
        total: 0,
      })),
      lastUpdateId: data.data.u,
    };
    callbacks.forEach((cb) => cb(orderBook));
  }

  private handleTradeUpdate(data: any) {
    const callbackKey = `trade:${data.topic}`;
    const callbacks = this.callbacks.get(callbackKey) || [];
    if (!data.data) return;
    (Array.isArray(data.data) ? data.data : [data.data]).forEach(
      (trade: any) => {
        const t: Trade = {
          id: trade.T.toString(),
          symbol: trade.s,
          price: parseFloat(trade.p),
          quantity: parseFloat(trade.v),
          side: trade.S === 'Sell' ? 'SELL' : 'BUY',
          timestamp: Number(trade.T),
        };
        callbacks.forEach((cb) => cb(t));
      }
    );
  }

  private handleKlineUpdate(data: any) {
    const callbackKey = `kline:${data.topic}`;
    const callbacks = this.callbacks.get(callbackKey) || [];
    if (!data.data) return;
    const k = data.data;
    const kline: Kline = {
      openTime: Number(k.t),
      open: parseFloat(k.o),
      high: parseFloat(k.h),
      low: parseFloat(k.l),
      close: parseFloat(k.c),
      volume: parseFloat(k.v),
      closeTime: Number(k.T),
      quoteAssetVolume: 0,
      numberOfTrades: 0,
      takerBuyBaseAssetVolume: 0,
      takerBuyQuoteAssetVolume: 0,
    };
    callbacks.forEach((cb) => cb(kline));
  }

  private scheduleReconnect(topics: string[]) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => this.connectWebSocket(topics, false), delay);
    }
  }

  async getTradingPairs(): Promise<TradingPair[]> {
    // Bybit: /instruments?category=spot
    const result = await this.makeRequest<any>('/instruments?category=spot');
    return result.list.map((item: any) => ({
      symbol: item.symbol,
      baseAsset: item.baseCoin,
      quoteAsset: item.quoteCoin,
      minPrice: parseFloat(item.priceFilter?.minPrice ?? '0'),
      maxPrice: parseFloat(item.priceFilter?.maxPrice ?? '999999'),
      tickSize: parseFloat(item.priceFilter?.tickSize ?? '0.01'),
      minQty: parseFloat(item.lotSizeFilter?.minOrderQty ?? '0'),
      maxQty: parseFloat(item.lotSizeFilter?.maxOrderQty ?? '999999'),
      stepSize: parseFloat(item.lotSizeFilter?.basePrecision ?? '0.01'),
    }));
  }

  async getOrderBook(symbol: string, limit: number = 20): Promise<OrderBook> {
    // Bybit: /orderbook?category=spot&symbol=BTCUSDT
    const result = await this.makeRequest<any>(
      `/orderbook?category=spot&symbol=${symbol}&limit=${limit}`
    );
    return {
      bids: result.b.map((bid: [string, string]) => ({
        price: parseFloat(bid[0]),
        quantity: parseFloat(bid[1]),
        total: 0,
      })),
      asks: result.a.map((ask: [string, string]) => ({
        price: parseFloat(ask[0]),
        quantity: parseFloat(ask[1]),
        total: 0,
      })),
      lastUpdateId: result.u,
    };
  }

  async getKlines(
    symbol: string,
    timeframe: Timeframe,
    limit: number = 500
  ): Promise<Kline[]> {
    // Bybit: /kline?category=spot&symbol=BTCUSDT&interval=1&limit=500
    // Map timeframe to Bybit interval
    const tfMap: Record<Timeframe, string> = {
      '1m': '1',
      '5m': '5',
      '1h': '60',
      '4h': '240',
      '1d': 'D',
    };
    const interval = tfMap[timeframe] || '1';
    const result = await this.makeRequest<any>(
      `/kline?category=spot&symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    return result.list.map((k: any[]) => ({
      openTime: Number(k[0]),
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
      closeTime: Number(k[6]),
      quoteAssetVolume: parseFloat(k[7]),
      numberOfTrades: Number(k[8]),
      takerBuyBaseAssetVolume: parseFloat(k[9]),
      takerBuyQuoteAssetVolume: parseFloat(k[10]),
    }));
  }

  async getTrades(symbol: string, limit: number = 100): Promise<Trade[]> {
    // Bybit: /recent-trade?category=spot&symbol=BTCUSDT&limit=100
    const result = await this.makeRequest<any>(
      `/recent-trade?category=spot&symbol=${symbol}&limit=${limit}`
    );
    return result.list.map((trade: any) => ({
      id: trade.i.toString(),
      symbol: trade.s,
      price: parseFloat(trade.p),
      quantity: parseFloat(trade.v),
      side: trade.S === 'Sell' ? 'SELL' : 'BUY',
      timestamp: Number(trade.T),
    }));
  }

  subscribeOrderBook(
    symbol: string,
    callback: (data: OrderBook) => void
  ): () => void {
    const topic = `orderbook.50.${symbol}`;
    const callbackKey = `orderbook:${topic}`;
    if (!this.callbacks.has(callbackKey)) this.callbacks.set(callbackKey, []);
    this.callbacks.get(callbackKey)!.push(callback);
    this.connectWebSocket([topic], false);
    return () => {
      const arr = this.callbacks.get(callbackKey);
      if (arr) {
        const idx = arr.indexOf(callback);
        if (idx > -1) arr.splice(idx, 1);
      }
      // 若无回调则关闭ws
      if (!this.callbacks.get(callbackKey)?.length) {
        const ws = this.wsMap.get(topic);
        if (ws) {
          (ws as any)._manualClose = true;
          ws.close();
        }
        this.wsMap.delete(topic);
      }
    };
  }

  subscribeTrades(symbol: string, callback: (data: Trade) => void): () => void {
    const topic = `trade.${symbol}`;
    const callbackKey = `trade:${topic}`;
    if (!this.callbacks.has(callbackKey)) this.callbacks.set(callbackKey, []);
    this.callbacks.get(callbackKey)!.push(callback);
    this.connectWebSocket([topic], false);
    return () => {
      const arr = this.callbacks.get(callbackKey);
      if (arr) {
        const idx = arr.indexOf(callback);
        if (idx > -1) arr.splice(idx, 1);
      }
      if (!this.callbacks.get(callbackKey)?.length) {
        const ws = this.wsMap.get(topic);
        if (ws) {
          (ws as any)._manualClose = true;
          ws.close();
        }
        this.wsMap.delete(topic);
      }
    };
  }

  subscribeKlines(
    symbol: string,
    timeframe: Timeframe,
    callback: (data: Kline) => void
  ): () => void {
    const tfMap: Record<Timeframe, string> = {
      '1m': '1',
      '5m': '5',
      '1h': '60',
      '4h': '240',
      '1d': 'D',
    };
    const interval = tfMap[timeframe] || '1';
    const topic = `kline.${interval}.${symbol}`;
    const callbackKey = `kline:${topic}`;
    if (!this.callbacks.has(callbackKey)) this.callbacks.set(callbackKey, []);
    this.callbacks.get(callbackKey)!.push(callback);
    this.connectWebSocket([topic], false);
    return () => {
      const arr = this.callbacks.get(callbackKey);
      if (arr) {
        const idx = arr.indexOf(callback);
        if (idx > -1) arr.splice(idx, 1);
      }
      if (!this.callbacks.get(callbackKey)?.length) {
        const ws = this.wsMap.get(topic);
        if (ws) {
          (ws as any)._manualClose = true;
          ws.close();
        }
        this.wsMap.delete(topic);
      }
    };
  }

  async placeOrder(
    _order: Omit<Order, 'id' | 'status' | 'timestamp'>
  ): Promise<Order> {
    throw new Error('BybitAdapter.placeOrder not implemented');
  }
  async cancelOrder(_orderId: string): Promise<boolean> {
    throw new Error('BybitAdapter.cancelOrder not implemented');
  }
  async getOrders(_symbol?: string): Promise<Order[]> {
    throw new Error('BybitAdapter.getOrders not implemented');
  }
  async getPositions(): Promise<Position[]> {
    throw new Error('BybitAdapter.getPositions not implemented');
  }
}
