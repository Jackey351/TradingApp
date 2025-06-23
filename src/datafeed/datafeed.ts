import { BinanceAdapter } from '../adapters/BinanceAdapter';

export interface SymbolInfo {
  symbol: string;
  ticker: string;
  description: string;
  exchange: string;
  type: string;
}

export interface TVSymbolInfo {
  ticker: string;
  name: string;
  description: string;
  type: string;
  session: string;
  timezone: string;
  exchange: string;
  minmov: number;
  pricescale: number;
  has_intraday: boolean;
  visible_plots_set: string;
  has_weekly_and_monthly: boolean;
  supported_resolutions: string[];
  volume_precision: number;
  data_status: string;
}

export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const configurationData = {
  supported_resolutions: ['1', '5', '60', '240', '1D'],
  exchanges: [{ value: 'Binance', name: 'Binance', desc: 'Binance' }],
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

function binanceInterval(resolution: string): string {
  if (resolution === '1D') return '1d';
  if (resolution === '240') return '4h';
  if (resolution === '60') return '1h';
  return resolution + 'm';
}

const defaultPairs: SymbolInfo[] = [
  {
    symbol: 'BTCUSDT',
    ticker: 'BTC/USDT',
    description: 'BTC/USDT',
    exchange: 'Binance',
    type: 'crypto',
  },
  {
    symbol: 'ETHUSDT',
    ticker: 'ETH/USDT',
    description: 'ETH/USDT',
    exchange: 'Binance',
    type: 'crypto',
  },
  {
    symbol: 'SOLUSDT',
    ticker: 'SOL/USDT',
    description: 'SOL/USDT',
    exchange: 'Binance',
    type: 'crypto',
  },
];

const adapter = new BinanceAdapter();

export const datafeed = {
  onReady: (cb: (config: typeof configurationData) => void) =>
    setTimeout(() => cb(configurationData), 0),

  searchSymbols: async (
    userInput: string,
    onResultReadyCallback: (symbols: SymbolInfo[]) => void
  ) => {
    const filtered = defaultPairs.filter((pair) =>
      pair.ticker.toLowerCase().includes(userInput.toLowerCase())
    );
    onResultReadyCallback(filtered);
  },

  resolveSymbol: (
    symbolName: string,
    onSymbolResolvedCallback: (info: TVSymbolInfo) => void,
    onResolveErrorCallback: (err: string) => void
  ) => {
    const found = defaultPairs.find(
      (pair) => pair.symbol === symbolName || pair.ticker === symbolName
    );
    if (!found) {
      onResolveErrorCallback('Symbol not found');
      return;
    }
    const symbolInfo: TVSymbolInfo = {
      ticker: found.symbol,
      name: found.symbol,
      description: found.description,
      type: found.type,
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: found.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      visible_plots_set: 'ohlc',
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming',
    };
    setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
  },

  getBars: async (
    symbolInfo: TVSymbolInfo,
    resolution: string,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onHistoryCallback: (bars: Bar[], meta: { noData: boolean }) => void,
    onErrorCallback: (err: any) => void
  ) => {
    const { from, to } = periodParams;
    const interval = binanceInterval(resolution);
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbolInfo.name}&interval=${interval}&startTime=${from * 1000}&endTime=${to * 1000}&limit=1000`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (!Array.isArray(data)) {
        onHistoryCallback([], { noData: true });
        return;
      }
      const bars: Bar[] = data.map((k: any) => ({
        time: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));
      onHistoryCallback(bars, { noData: bars.length === 0 });
    } catch (err) {
      onErrorCallback(err);
    }
  },

  subscribeBars: (
    symbolInfo: TVSymbolInfo,
    resolution: string,
    onRealtimeCallback: (bar: Bar) => void,
    subscriberUID: string
  ) => {
    const interval = binanceInterval(resolution);

    const unsub = adapter.subscribeKlines(
      symbolInfo.name,
      interval as any,
      (kline) => {
        const bar: Bar = {
          time: kline.openTime,
          open: kline.open,
          high: kline.high,
          low: kline.low,
          close: kline.close,
          volume: kline.volume,
        };
        onRealtimeCallback(bar);
      }
    );
    (window as any)[`tv_unsub_${subscriberUID}`] = unsub;
  },

  unsubscribeBars: (subscriberUID: string) => {
    const unsub = (window as any)[`tv_unsub_${subscriberUID}`];
    if (unsub) {
      unsub();
      delete (window as any)[`tv_unsub_${subscriberUID}`];
    }
  },
};
