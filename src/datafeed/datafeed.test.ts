import { vi, describe, it, expect, afterEach } from 'vitest';
import { datafeed, TVSymbolInfo } from './datafeed';
import { BinanceAdapter } from '../adapters/BinanceAdapter';

vi.mock('../adapters/BinanceAdapter');

describe('datafeed', () => {
  global.fetch = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('onReady should call the callback with configuration data', async () => {
    await new Promise<void>(resolve => {
        datafeed.onReady((config) => {
            expect(config.supported_resolutions).toBeInstanceOf(Array);
            resolve();
        });
    });
  });

  it('searchSymbols should filter default pairs', async () => {
    await new Promise<void>(resolve => {
        datafeed.searchSymbols('BTC', symbols => {
            expect(symbols.length).toBe(1);
            expect(symbols[0].symbol).toBe('BTCUSDT');
            resolve();
        });
    });
  });

  it('resolveSymbol should find a symbol', async () => {
    await new Promise<void>(resolve => {
        datafeed.resolveSymbol('BTCUSDT', (symbolInfo) => {
            expect(symbolInfo.name).toBe('BTCUSDT');
            resolve();
        }, () => {});
    });
  });

  it('resolveSymbol should call error callback if symbol not found', async () => {
    await new Promise<void>(resolve => {
        datafeed.resolveSymbol('UNKNOWN', () => {}, (error) => {
            expect(error).toBe('Symbol not found');
            resolve();
        });
    });
  });

  describe('getBars', () => {
    const symbolInfo: TVSymbolInfo = { name: 'BTCUSDT', ticker: 'BTCUSDT' } as TVSymbolInfo;
    const periodParams = { from: 0, to: 1, firstDataRequest: true };

    it('should fetch and format bars correctly', async () => {
      const mockBars = [[1609459200000, '100', '110', '90', '105', '1000']];
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockBars,
      });
      await new Promise<void>(resolve => {
        datafeed.getBars(
            symbolInfo,
            '60',
            periodParams,
            (bars, meta) => {
              expect(bars.length).toBe(1);
              expect(bars[0].open).toBe(100);
              expect(meta.noData).toBe(false);
              resolve();
            },
            () => {}
          );
      });
    });

    it('should handle no data response', async () => {
        (fetch as any).mockResolvedValue({
          ok: true,
          json: async () => ({ msg: 'no data' }), // Not an array
        });
        await new Promise<void>(resolve => {
            datafeed.getBars(
                symbolInfo,
                '60',
                periodParams,
                (bars, meta) => {
                  expect(bars.length).toBe(0);
                  expect(meta.noData).toBe(true);
                  resolve();
                },
                () => {}
              );
        });
      });

    it('should call onErrorCallback on fetch failure', async () => {
      (fetch as any).mockRejectedValue(new Error('Network Error'));
      await new Promise<void>(resolve => {
        datafeed.getBars(
            symbolInfo,
            '60',
            periodParams,
            () => {},
            (error) => {
              expect(error.message).toBe('Network Error');
              resolve();
            }
          );
      });
    });
  });

  describe('subscribeBars / unsubscribeBars', () => {
    it('should subscribe and unsubscribe correctly', () => {
        const mockUnsub = vi.fn();
        const subscribeKlinesSpy = vi.spyOn(BinanceAdapter.prototype, 'subscribeKlines').mockReturnValue(mockUnsub);
    
        const symbolInfo: TVSymbolInfo = { name: 'BTCUSDT' } as TVSymbolInfo;
        const onRealtimeCallback = vi.fn();
        const subscriberUID = 'test_sub_1';
    
        datafeed.subscribeBars(symbolInfo, '1', onRealtimeCallback, subscriberUID);

        expect(subscribeKlinesSpy).toHaveBeenCalledWith('BTCUSDT', '1m', expect.any(Function));
        expect((window as any)[`tv_unsub_${subscriberUID}`]).toBe(mockUnsub);
    
        datafeed.unsubscribeBars(subscriberUID);
    
        expect(mockUnsub).toHaveBeenCalled();
        expect((window as any)[`tv_unsub_${subscriberUID}`]).toBeUndefined();
      });
  });
}); 