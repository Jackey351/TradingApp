import React from 'react';
import { useExchangeStore } from '../stores/exchangeStore';

interface InstrumentSelectorProps {
  selectedPair: string;
  onPairChange: (symbol: string) => void;
}

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({
  selectedPair,
  onPairChange,
}) => {
  const { tradingPairs } = useExchangeStore();
  // const timeframes: Timeframe[] = ['1m', '5m', '1h', '4h', '1d'];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Trading Pair Dropdown */}
        <select
          value={selectedPair}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onPairChange(e.target.value)
          }
          className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm font-medium"
        >
          {tradingPairs.map((pair) => (
            <option key={pair.symbol} value={pair.symbol}>
              {pair.baseAsset}/{pair.quoteAsset}
            </option>
          ))}
        </select>
      </div>

      {/* Timeframe Selector */}
      {/* <div className="flex items-center space-x-2">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentTimeframe === tf
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tf}
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default InstrumentSelector;
