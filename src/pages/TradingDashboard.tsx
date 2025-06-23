import { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import InstrumentSelector from '../components/InstrumentSelector';
import TradingViewChart from '../components/TradingViewChart';
import OrderBook from '../components/OrderBook';
import TradeTicket from '../components/TradeTicket';
import PositionsWidget from '../components/PositionsWidget';
import ThemeToggle from '../components/ThemeToggle';
import { useExchangeStore } from '../stores/exchangeStore';
import { BinanceAdapter } from '../adapters/BinanceAdapter';
import React from 'react';
import { useMarketStore } from '@/stores/marketStore';
import OpenOrdersWidget from '@/components/OpenOrdersWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ForwardedResponsiveGridLayout = React.forwardRef<any, any>((props, ref) =>
  React.createElement(ResponsiveGridLayout as any, { ...props, ref })
);

const defaultLayouts = {
  lg: [
    { i: 'instrument-selector', x: 0, y: 0, w: 12, h: 1 },
    { i: 'chart', x: 0, y: 1, w: 8, h: 8 },
    { i: 'order-book', x: 8, y: 1, w: 4, h: 8 },
    { i: 'trade-ticket', x: 8, y: 9, w: 4, h: 6 },
    { i: 'positions', x: 0, y: 8, w: 8, h: 3 },
    { i: 'open-orders', x: 0, y: 9, w: 8, h: 3 },
  ],
  md: [
    { i: 'instrument-selector', x: 0, y: 0, w: 10, h: 1 },
    { i: 'chart', x: 0, y: 1, w: 6, h: 8 },
    { i: 'order-book', x: 6, y: 1, w: 4, h: 8 },
    { i: 'trade-ticket', x: 8, y: 9, w: 4, h: 6 },
    { i: 'positions', x: 0, y: 9, w: 6, h: 3 },
    { i: 'open-orders', x: 0, y: 9, w: 6, h: 3 },
  ],
  sm: [
    { i: 'instrument-selector', x: 0, y: 0, w: 6, h: 1 },
    { i: 'chart', x: 0, y: 1, w: 4, h: 8 },
    { i: 'order-book', x: 6, y: 1, w: 2, h: 8 },
    { i: 'trade-ticket', x: 8, y: 9, w: 2, h: 6 },
    { i: 'positions', x: 0, y: 9, w: 4, h: 3 },
    { i: 'open-orders', x: 0, y: 9, w: 4, h: 3 },
  ],
  xs: [
    { i: 'instrument-selector', x: 0, y: 0, w: 4, h: 1 },
    { i: 'chart', x: 0, y: 1, w: 4, h: 8 },
    { i: 'order-book', x: 6, y: 1, w: 4, h: 8 },
    { i: 'trade-ticket', x: 8, y: 9, w: 4, h: 6 },
    { i: 'positions', x: 0, y: 9, w: 4, h: 3 },
    { i: 'open-orders', x: 0, y: 9, w: 4, h: 3 },
  ],
};

const TradingDashboard = () => {
  const {
    selectedPair,
    setSelectedPair,
    setConnectionStatus,
    currentTimeframe,
  } = useExchangeStore();

  const { setRawOrderBook, setKlines } = useMarketStore();

  const [adapter] = useState(() => new BinanceAdapter());
  useEffect(() => {
    const initializeData = async () => {
      try {
        setConnectionStatus('connecting');

        // Get initial data
        const [orderBook, klines] = await Promise.all([
          adapter.getOrderBook(selectedPair),
          adapter.getKlines(selectedPair, currentTimeframe),
        ]);

        setRawOrderBook(orderBook);
        setKlines(klines);
        setConnectionStatus('connected');

        // Subscribe to real-time updates
        const unsubscribeOrderBook = adapter.subscribeOrderBook(
          selectedPair,
          setRawOrderBook
        );

        return () => {
          unsubscribeOrderBook();
        };
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setConnectionStatus('error');
      }
    };

    const cleanup = initializeData();
    return () => {
      cleanup.then((unsubscribe) => unsubscribe?.());
    };
  }, [
    selectedPair,
    currentTimeframe,
    adapter,
    setConnectionStatus,
    setRawOrderBook,
    setKlines,
  ]);

  const handlePairChange = (symbol: string) => {
    setSelectedPair(symbol);
  };

  const handleLayoutChange = () => {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Trading App
            </h1>
            <ThemeToggle />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Connected to Binance</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4">
        <ForwardedResponsiveGridLayout
          className="layout"
          layouts={defaultLayouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
          draggableHandle=".drag-handle"
        >
          <div key="instrument-selector" className="trading-card p-4">
            <InstrumentSelector
              selectedPair={selectedPair}
              onPairChange={handlePairChange}
            />
          </div>
          <div key="chart" className="trading-card">
            <TradingViewChart
              symbol={selectedPair}
              timeframe={currentTimeframe}
            />
          </div>
          <div key="order-book" className="trading-card">
            <OrderBook />
          </div>
          <div key="trade-ticket" className="trading-card min-h-fit">
            <TradeTicket symbol={selectedPair} />
          </div>
          <div key="positions" className="trading-card p-4 overflow-auto">
            <PositionsWidget />
          </div>
          <div key="open-orders" className="trading-card p-4 overflow-auto">
            <OpenOrdersWidget />
          </div>
        </ForwardedResponsiveGridLayout>
      </div>
    </div>
  );
};

export default TradingDashboard;
