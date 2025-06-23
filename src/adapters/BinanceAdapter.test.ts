import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BinanceAdapter } from './BinanceAdapter';

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
          { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', status: 'TRADING', filters: [{ filterType: 'PRICE_FILTER', minPrice: '0.01' }] },
        ],
      }),
    });
    const adapter = new BinanceAdapter();
    const pairs = await adapter.getTradingPairs();
    expect(pairs[0].symbol).toBe('BTCUSDT');
  });

  it('handles REST error', async () => {
    (fetch as any).mockResolvedValue({ ok: false, status: 500 });
    const adapter = new BinanceAdapter();
    await expect(adapter.getTradingPairs()).rejects.toThrow();
  });

  it('subscribes and unsubscribes orderbook', () => {
    const adapter = new BinanceAdapter();
    // mock ws
    (global as any).WebSocket = vi.fn(() => ({
      readyState: 1,
      close: vi.fn(),
      addEventListener: vi.fn(),
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
    }));
    const cb = vi.fn();
    const unsub = adapter.subscribeOrderBook('BTCUSDT', cb);
    expect(typeof unsub).toBe('function');
  });
}); 