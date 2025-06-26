import { vi, describe, it, expect, beforeEach } from 'vitest';
import { datafeed, TVSymbolInfo } from './datafeed';

const mocks = vi.hoisted(() => {
  return {
    mockGetKlines: vi.fn(),
    mockSubscribeKlines: vi.fn(),
  };
});

vi.mock('../adapters/BinanceAdapter', () => {
  return {
    BinanceAdapter: vi.fn().mockImplementation(() => ({
      getKlines: mocks.mockGetKlines,
      subscribeKlines: mocks.mockSubscribeKlines,
    })),
  };
});

describe('datafeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('onReady should call the callback with configuration data', async () => {
    await new Promise<void>((resolve) => {
      datafeed.onReady((config) => {
        expect(config.supported_resolutions).toBeInstanceOf(Array);
        resolve();
      });
    });
  }, 10000);

  it('searchSymbols should filter default pairs', async () => {
    await new Promise<void>((resolve) => {
      datafeed.searchSymbols('BTC', (symbols) => {
        expect(symbols.length).toBe(1);
        expect(symbols[0].symbol).toBe('BTCUSDT');
        resolve();
      });
    });
  }, 10000);

  it('resolveSymbol should find a symbol', async () => {
    await new Promise<void>((resolve) => {
      datafeed.resolveSymbol(
        'BTCUSDT',
        (symbolInfo) => {
          expect(symbolInfo.name).toBe('BTCUSDT');
          resolve();
        },
        () => {}
      );
    });
  }, 10000);

  it('resolveSymbol should call error callback if symbol not found', async () => {
    await new Promise<void>((resolve) => {
      datafeed.resolveSymbol(
        'UNKNOWN',
        () => {},
        (error) => {
          expect(error).toBe('Symbol not found');
          resolve();
        }
      );
    });
  }, 10000);

  describe('getBars', () => {
    const symbolInfo: TVSymbolInfo = {
      name: 'BTCUSDT',
      ticker: 'BTCUSDT',
    } as TVSymbolInfo;
    const periodParams = { from: 0, to: 1, firstDataRequest: true };

    it('should fetch and format bars correctly', async () => {
      const mockKlines = [
        {
          openTime: 1609459200000,
          open: 100,
          high: 110,
          low: 90,
          close: 105,
          volume: 1000,
          closeTime: 1609462800000,
          quoteAssetVolume: 100000,
          numberOfTrades: 100,
          takerBuyBaseAssetVolume: 50000,
          takerBuyQuoteAssetVolume: 50000,
        },
      ];

      mocks.mockGetKlines.mockResolvedValue(mockKlines);

      await new Promise<void>((resolve) => {
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
    }, 10000);

    it('should handle no data response', async () => {
      mocks.mockGetKlines.mockResolvedValue({ msg: 'no data' });

      await new Promise<void>((resolve) => {
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
    }, 10000);

    it('should call onErrorCallback on fetch failure', async () => {
      mocks.mockGetKlines.mockRejectedValue(new Error('Network Error'));

      await new Promise<void>((resolve) => {
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
    }, 10000);
  });

  describe('subscribeBars / unsubscribeBars', () => {
    it('should subscribe and unsubscribe correctly', () => {
      const mockUnsub = vi.fn();
      mocks.mockSubscribeKlines.mockReturnValue(mockUnsub);

      const symbolInfo: TVSymbolInfo = { name: 'BTCUSDT' } as TVSymbolInfo;
      const onRealtimeCallback = vi.fn();
      const subscriberUID = 'test_sub_1';

      datafeed.subscribeBars(
        symbolInfo,
        '1',
        onRealtimeCallback,
        subscriberUID
      );

      expect(mocks.mockSubscribeKlines).toHaveBeenCalledWith(
        'BTCUSDT',
        '1m',
        expect.any(Function)
      );
      expect((window as any)[`tv_unsub_${subscriberUID}`]).toBe(mockUnsub);

      datafeed.unsubscribeBars(subscriberUID);

      expect(mockUnsub).toHaveBeenCalled();
      expect((window as any)[`tv_unsub_${subscriberUID}`]).toBeUndefined();
    });
  });
});
