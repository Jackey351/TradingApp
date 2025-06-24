import { useExchangeStore } from '../stores/exchangeStore';
import { useMarketStore } from '../stores/marketStore';
import { Position } from '../types';
import { useRef, useState, useEffect } from 'react';
import { useCalcWorker } from '@/hooks/useCalcWorker';

const PositionsWidget = () => {
  const { positions, selectedPair } = useExchangeStore();
  const { orderBook } = useMarketStore();
  const { calcPnL } = useCalcWorker();

  // Only show positions for the selected trading pair
  const filteredPositions = positions.filter((p) => p.symbol === selectedPair);

  // Get latest mark price
  const markPrice =
    orderBook?.bids?.[0]?.price || orderBook?.asks?.[0]?.price || 0;

  // For keyboard navigation
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const [pnlPositions, setPnLPositions] = useState<any[]>([]);

  useEffect(() => {
    if (!filteredPositions.length || !markPrice) return;
    let cancelled = false;
    // 构造 prices 对象，所有持仓 symbol 都用当前 markPrice
    const prices: Record<string, number> = {};
    filteredPositions.forEach((pos) => {
      prices[pos.symbol] = markPrice;
    });
    calcPnL(filteredPositions, prices).then((result) => {
      if (!cancelled) setPnLPositions(result);
    });
    return () => {
      cancelled = true;
    };
  }, [filteredPositions, markPrice]);

  const renderPositionRow = (position: Position, idx: number) => {
    // 查找 worker 计算后的 PnL
    const pnlData = pnlPositions.find(
      (p) => p.symbol === position.symbol && p.side === position.side
    );
    const pnl = pnlData?.pnl ?? 0;
    const pnlPercent = pnlData?.pnlPercent ?? 0;
    return (
      <tr
        key={position.symbol + position.side}
        role="row"
        tabIndex={0}
        ref={(el) => (rowRefs.current[idx] = el)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            rowRefs.current[idx + 1]?.focus();
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            rowRefs.current[idx - 1]?.focus();
          }
        }}
        className="trading-table-row outline-none"
      >
        <td role="cell" className="trading-table-cell">
          {position.symbol}
        </td>
        <td
          role="cell"
          className={`trading-table-cell ${position.side === 'LONG' ? 'text-green-500' : 'text-red-500'}`}
        >
          {position.side}
        </td>
        <td role="cell" className="trading-table-cell">
          {position.quantity}
        </td>
        <td role="cell" className="trading-table-cell">
          {position.entryPrice.toFixed(2)}
        </td>
        <td role="cell" className="trading-table-cell">
          {markPrice.toFixed(2)}
        </td>
        <td
          role="cell"
          className={`trading-table-cell ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}
        >
          {pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
        </td>
      </tr>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Positions & PnL</h3>
      <div className="overflow-x-auto">
        <table role="table" className="trading-table">
          <thead role="rowgroup" className="trading-table-header">
            <tr role="row">
              <th role="columnheader" className="trading-table-header-cell">
                Symbol
              </th>
              <th role="columnheader" className="trading-table-header-cell">
                Side
              </th>
              <th role="columnheader" className="trading-table-header-cell">
                Quantity
              </th>
              <th role="columnheader" className="trading-table-header-cell">
                Entry Price
              </th>
              <th role="columnheader" className="trading-table-header-cell">
                Mark Price
              </th>
              <th role="columnheader" className="trading-table-header-cell">
                Unrealized PnL
              </th>
            </tr>
          </thead>
          <tbody
            role="rowgroup"
            className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            {filteredPositions.length > 0 ? (
              filteredPositions.map(renderPositionRow)
            ) : (
              <tr role="row">
                <td
                  role="cell"
                  colSpan={6}
                  className="text-center py-4 text-gray-500"
                >
                  No open positions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsWidget;
