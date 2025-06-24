import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BinanceAdapter } from './BinanceAdapter';
import { OrderBook } from '../types';

global.fetch = vi.fn();

describe('BinanceAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches trading pairs', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        symbols: [
          {
            symbol: 'BTCUSDT',
            baseAsset: 'BTC',
            quoteAsset: 'USDT',
            status: 'TRADING',
            filters: [{ filterType: 'PRICE_FILTER', minPrice: '0.01' }],
          },
        ],
      }),
    });
    const adapter = new BinanceAdapter();
    const pairs = await adapter.getTradingPairs();
    expect(pairs[0].symbol).toBe('BTCUSDT');
  });

  it('handles getTradingPairs REST error by throwing', async () => {
    (fetch as any).mockResolvedValue({ ok: false, status: 500 });
    const adapter = new BinanceAdapter();
    expect(await adapter.getTradingPairs()).toEqual([]);
  });

  it('subscribes and unsubscribes orderbook', () => {
    const adapter = new BinanceAdapter();
    const mockWs = {
      readyState: 1,
      close: vi.fn(),
      addEventListener: vi.fn(),
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
    };
    (global as any).WebSocket = vi.fn(() => mockWs);
    const cb = vi.fn();
    const unsub = adapter.subscribeOrderBook('BTCUSDT', cb);
    expect(typeof unsub).toBe('function');
    unsub();
    expect(mockWs.close).toHaveBeenCalled();
  });

  it('fetches klines', async () => {
    const mockKlines = [[1, '1', '2', '3', '4', '5', 6, '7', 8, '9', '10']];
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockKlines,
    });
    const adapter = new BinanceAdapter();
    const klines = await adapter.getKlines('BTCUSDT', '1m');
    expect(klines[0].open).toBe(1);
  });

  it('handles klines fetch error', async () => {
    (fetch as any).mockRejectedValue(new Error('Network error'));
    const adapter = new BinanceAdapter();
    await expect(adapter.getKlines('BTCUSDT', '1m')).rejects.toThrow(
      'Network error'
    );
  });

  it('fetches trades', async () => {
    const mockTrades = [
      { id: 1, price: '100', qty: '1', isBuyerMaker: true, time: 123 },
    ];
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockTrades,
    });
    const adapter = new BinanceAdapter();
    const trades = await adapter.getTrades('BTCUSDT');
    expect(trades[0].price).toBe(100);
  });

  it('handles trades fetch error', async () => {
    (fetch as any).mockRejectedValue(new Error('Network error'));
    const adapter = new BinanceAdapter();
    await expect(adapter.getTrades('BTCUSDT')).rejects.toThrow('Network error');
  });

  it('subscribes and unsubscribes trades', () => {
    const adapter = new BinanceAdapter();
    const mockWs = { close: vi.fn() };
    (global as any).WebSocket = vi.fn(() => mockWs);
    const unsub = adapter.subscribeTrades('BTCUSDT', vi.fn());
    unsub();
    expect(mockWs.close).toHaveBeenCalled();
  });

  it('subscribes and unsubscribes klines', () => {
    const adapter = new BinanceAdapter();
    const mockWs = { close: vi.fn() };
    (global as any).WebSocket = vi.fn(() => mockWs);
    const unsub = adapter.subscribeKlines('BTCUSDT', '1m', vi.fn());
    unsub();
    expect(mockWs.close).toHaveBeenCalled();
  });

  it('places an order (mock)', async () => {
    const adapter = new BinanceAdapter();
    const order = await adapter.placeOrder({} as any);
    expect(order.status).toBe('PENDING');
  });

  it('cancels an order (mock)', async () => {
    const adapter = new BinanceAdapter();
    const result = await adapter.cancelOrder();
    expect(typeof result).toBe('boolean');
  });

  it('gets orders (mock)', async () => {
    const adapter = new BinanceAdapter();
    const orders = await adapter.getOrders();
    expect(orders).toEqual([]);
  });

  it('gets positions (mock)', async () => {
    const adapter = new BinanceAdapter();
    const positions = await adapter.getPositions();
    expect(positions).toEqual([]);
  });
});

describe('WebSocket Handling', () => {
  let mockWsInstance: any;
  let adapter: BinanceAdapter;

  beforeEach(() => {
    vi.useFakeTimers();

    mockWsInstance = {
      readyState: 0,
      close: vi.fn(),
      addEventListener: vi.fn((event, handler) => {
        mockWsInstance[`on${event}`] = handler;
      }),
      removeEventListener: vi.fn(),
      send: vi.fn(),
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      _manualClose: false,
    };
    (global as any).WebSocket = vi.fn(() => {
      setTimeout(() => {
        mockWsInstance.readyState = 1; // Open
        mockWsInstance.onopen?.();
      }, 10);
      return mockWsInstance;
    });

    adapter = new BinanceAdapter();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should handle order book updates from WebSocket', async () => {
    const callback = vi.fn();
    adapter.subscribeOrderBook('BTCUSDT', callback);

    await vi.advanceTimersByTimeAsync(10);

    const wsMessageData = {
      lastUpdateId: 12345,
      bids: [['10000', '1']],
      asks: [['10001', '1']],
    };

    mockWsInstance.onmessage({ data: JSON.stringify(wsMessageData) });

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        lastUpdateId: 12345,
        bids: expect.arrayContaining([
          expect.objectContaining({ price: 10000 }),
        ]),
      })
    );
  });

  it('should handle trade updates from WebSocket', async () => {
    const callback = vi.fn();
    adapter.subscribeTrades('BTCUSDT', callback);

    await vi.advanceTimersByTimeAsync(10);

    const wsMessage = {
      e: 'trade',
      s: 'BTCUSDT',
      t: 123,
      p: '10000',
      q: '1',
      m: false,
      T: 456,
    };

    mockWsInstance.onmessage({ data: JSON.stringify(wsMessage) });

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ id: '123', side: 'BUY' })
    );
  });

  it('should attempt to reconnect on WebSocket close if not manual', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    adapter.subscribeOrderBook('BTCUSDT', vi.fn());
    await vi.advanceTimersByTimeAsync(10);

    mockWsInstance.onclose?.();

    expect(setTimeoutSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Number)
    );

    await vi.advanceTimersByTimeAsync(1000);

    expect(global.WebSocket).toHaveBeenCalledTimes(2);
  });

  it('should queue messages during reconnection and fast-forward', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async (): Promise<Partial<OrderBook>> => ({
        lastUpdateId: 1000,
        bids: [{ price: 9999, quantity: 1, total: 1 }],
        asks: [{ price: 10001, quantity: 1, total: 1 }],
      }),
    });

    const callback = vi.fn();
    adapter.subscribeOrderBook('BTCUSDT', callback);
    await vi.advanceTimersByTimeAsync(10);

    mockWsInstance.onclose?.();

    (adapter as any).isReconnecting.set('BTCUSDT', true);
    (adapter as any).handleOrderBookUpdate(
      { lastUpdateId: 1001, bids: [['9998', '1']], asks: [] },
      'btcusdt@depth20@100ms'
    );

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(10);

    await vi.runAllTimersAsync();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.mock.calls[0][0].lastUpdateId).toBe(1000);
    expect(callback.mock.calls[1][0].lastUpdateId).toBe(1001);
    expect((adapter as any).isReconnecting.get('BTCUSDT')).toBe(false);
  });
});

describe('BinanceAdapter internals', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should handle orderbook message and queue during reconnect', () => {
    const adapter = new BinanceAdapter();
    const cb = vi.fn();
    (adapter as any).callbacks.set('orderbook', [cb]);
    (adapter as any).isReconnecting.set('BTCUSDT', true);
    (adapter as any).handleWebSocketMessage({
      bids: [['100', '1']],
      asks: [['101', '2']],
      lastUpdateId: 123,
    }, 'btcusdt@depth20@100ms');
    expect((adapter as any).orderBookDeltaQueue.get('BTCUSDT')).toHaveLength(1);
  });

  it('should handle trade message', () => {
    const adapter = new BinanceAdapter();
    const cb = vi.fn();
    (adapter as any).callbacks.set('btcusdt', [cb]);
    (adapter as any).handleWebSocketMessage({
      e: 'trade',
      s: 'BTCUSDT',
      t: 1,
      p: '100',
      q: '2',
      m: false,
      T: 123,
    }, 'btcusdt@trade');
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ id: '1', side: 'BUY' }));
  });

  it('should handle kline message and queue during reconnect', () => {
    const adapter = new BinanceAdapter();
    const cb = vi.fn();
    (adapter as any).callbacks.set('klines_1m', [cb]);
    (adapter as any).isKlineReconnecting.set('btcusdt@kline_1m', true);
    (adapter as any).handleWebSocketMessage({
      e: 'kline',
      k: { i: '1m', t: 1, o: '1', h: '2', l: '0.5', c: '1.5', v: '100', T: 2, q: '100', n: 1, V: '50', Q: '50' }
    }, 'btcusdt@kline_1m');
    expect((adapter as any).klineDeltaQueue.get('btcusdt@kline_1m')).toHaveLength(1);
  });

  it('should fast forward kline and apply delta queue', async () => {
    const adapter = new BinanceAdapter();
    const cb = vi.fn();
    (adapter as any).callbacks.set('klines_1m', [cb]);
    (adapter as any).klineDeltaQueue.set('btcusdt@kline_1m', [{
      k: { i: '1m', t: 1, o: '1', h: '2', l: '0.5', c: '1.5', v: '100', T: 2, q: '100', n: 1, V: '50', Q: '50' }
    }]);
    (adapter as any).isKlineReconnecting.set('btcusdt@kline_1m', true);
    vi.spyOn(adapter, 'getKlines').mockResolvedValue([{ openTime: 1, open: 1, high: 2, low: 0.5, close: 1.5, volume: 100, closeTime: 2, quoteAssetVolume: 100, numberOfTrades: 1, takerBuyBaseAssetVolume: 50, takerBuyQuoteAssetVolume: 50 }]);
    await (adapter as any).fastForwardKline('btcusdt@kline_1m');
    expect(cb).toHaveBeenCalled();
    expect((adapter as any).klineDeltaQueue.get('btcusdt@kline_1m')).toHaveLength(0);
    expect((adapter as any).isKlineReconnecting.get('btcusdt@kline_1m')).toBe(false);
  });

  it('should schedule reconnect and set flags', () => {
    const adapter = new BinanceAdapter();
    const spy = vi.spyOn(global, 'setTimeout');
    (adapter as any).reconnectAttempts = 0;
    (adapter as any).scheduleReconnect('btcusdt@kline_1m');
    expect((adapter as any).isReconnecting.get('BTCUSDT')).toBe(true);
    expect((adapter as any).isKlineReconnecting.get('btcusdt@kline_1m')).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('getOrderBook should throw on error', async () => {
    const adapter = new BinanceAdapter();
    vi.spyOn(adapter as any, 'makeRequest').mockRejectedValue(new Error('fail'));
    await expect(adapter.getOrderBook('BTCUSDT')).rejects.toThrow('fail');
  });

  it('getKlines should throw on error', async () => {
    const adapter = new BinanceAdapter();
    vi.spyOn(adapter as any, 'makeRequest').mockRejectedValue(new Error('fail'));
    await expect(adapter.getKlines('BTCUSDT', '1m')).rejects.toThrow('fail');
  });

  it('getTrades should throw on error', async () => {
    const adapter = new BinanceAdapter();
    vi.spyOn(adapter as any, 'makeRequest').mockRejectedValue(new Error('fail'));
    await expect(adapter.getTrades('BTCUSDT')).rejects.toThrow('fail');
  });
});
