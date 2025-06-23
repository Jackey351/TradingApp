import React, { useMemo, useRef, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import VirtualizedList from './VirtualizedList';
import { useMarketStore } from '../stores/marketStore';
import { OrderBookEntry } from '../types';
import { useCalcWorker } from '@/hooks/useCalcWorker';

const OrderBook = () => {
  const { rawOrderBook, orderBook, setOrderBook } = useMarketStore();
  const [displayOrderBook, setDisplayOrderBook] = useState(orderBook);
  const rafRef = useRef<number | null>(null);

  // Throttled rendering: when orderBook changes, update only in animation frames
  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      setDisplayOrderBook(orderBook);
      rafRef.current = null;
    });
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [orderBook]);

  const bids = useMemo(() => displayOrderBook?.bids || [], [displayOrderBook]);
  const asks = useMemo(
    () => (displayOrderBook?.asks ? [...displayOrderBook.asks].reverse() : []),
    [displayOrderBook]
  );

  const maxCumulative = useMemo(() => {
    return Math.max(
      bids.length ? bids[bids.length - 1].total : 0,
      asks.length ? asks[asks.length - 1].total : 0
    );
  }, [bids, asks]);

  const asksListRef = useRef<any>(null);
  const bidsListRef = useRef<any>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!hasScrolled && asksListRef.current && asks.length > 0) {
      asksListRef.current.scrollToItem(asks.length - 1, 'end');
      setHasScrolled(true);
    }
  }, [asks, hasScrolled]);

  const { aggregateOrderBook } = useCalcWorker();

  useEffect(() => {
    if (!rawOrderBook?.bids || !rawOrderBook?.asks) return;
    let cancelled = false;
    aggregateOrderBook(rawOrderBook.bids, rawOrderBook.asks).then((agg) => {
      if (!cancelled)
        setOrderBook({ ...agg, lastUpdateId: rawOrderBook.lastUpdateId });
    });
    return () => {
      cancelled = true;
    };
  }, [rawOrderBook]);

  const Row = ({
    index,
    style,
    data,
    type,
  }: {
    index: number;
    style: React.CSSProperties;
    data: OrderBookEntry[];
    type: 'bid' | 'ask';
  }) => {
    const entry = data[index];
    if (!entry) return null;
    const cumulativeTotal = entry.total;
    const depthPercentage = (cumulativeTotal / maxCumulative) * 100;
    const backgroundStyle = {
      background: `linear-gradient(to left, ${type === 'bid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'} ${depthPercentage}%, transparent ${depthPercentage}%)`,
    };

    return (
      <div
        style={{ ...style, ...backgroundStyle }}
        className="flex justify-between items-center text-xs px-2 py-1"
      >
        <span
          className={`${type === 'bid' ? 'text-green-500' : 'text-red-500'} flex-1`}
        >
          {entry.price.toFixed(2)}
        </span>
        <span className="flex-2">{entry.quantity.toFixed(4)}</span>
        <span className="flex-1 text-right">
          {(entry.price * entry.quantity).toFixed(2)}
        </span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold p-4">Order Book</h3>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2 py-1 border-b border-t border-gray-200 dark:border-gray-700">
        <span className="flex-1">Price (USDT)</span>
        <span className="flex-2">Amount</span>
        <span className="flex-1 text-right">Total</span>
      </div>
      <div className="flex-grow flex flex-col">
        {/* Asks */}
        <div className="flex-1">
          <AutoSizer>
            {({ height, width }) => (
              <VirtualizedList
                ref={asksListRef}
                height={height}
                itemCount={asks.length}
                itemSize={24}
                width={width}
                itemData={asks}
                itemKey={(index: number) => `${asks[index]?.price}-${index}`}
              >
                {(props: any) => <Row {...props} type="ask" />}
              </VirtualizedList>
            )}
          </AutoSizer>
        </div>

        {/* Last Price */}
        <div className="py-2 text-center text-lg font-bold border-t border-b border-gray-200 dark:border-gray-700">
          <span className="text-green-500">{bids[0]?.price.toFixed(2)}</span>
        </div>

        {/* Bids */}
        <div className="flex-1">
          <AutoSizer>
            {({ height, width }) => (
              <VirtualizedList
                ref={bidsListRef}
                height={height}
                itemCount={bids.length}
                itemSize={24}
                width={width}
                itemData={bids}
                itemKey={(index: number) => `${bids[index]?.price}-${index}`}
              >
                {(props: any) => <Row {...props} type="bid" />}
              </VirtualizedList>
            )}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
