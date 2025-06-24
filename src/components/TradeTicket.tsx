import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useExchangeStore } from '../stores/exchangeStore';
import { useMarketStore } from '../stores/marketStore';
import { Order } from '../types';
import { nanoid } from 'nanoid';

interface TradeTicketProps {
  symbol: string;
}

function sanitizeNumberInput(input: any): number {
  if (typeof input === 'string') {
    input = input.replace(/[^0-9.]/g, '');
  }
  const num = parseFloat(input);
  if (!isFinite(num) || isNaN(num) || num <= 0) return 0;
  return num;
}

const TradeTicket: React.FC<TradeTicketProps> = ({ symbol }) => {
  const { addOrder, updateOrder, positions, setPositions } = useExchangeStore();
  const { orderBook } = useMarketStore();
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [postOnly, setPostOnly] = useState(false);

  const bestAsk = orderBook?.asks[0]?.price || 0;
  const bestBid = orderBook?.bids[0]?.price || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = sanitizeNumberInput(price);
    const amountNum = sanitizeNumberInput(amount);

    if (
      isNaN(priceNum) ||
      isNaN(amountNum) ||
      priceNum <= 0 ||
      amountNum <= 0
    ) {
      toast.error('Invalid price or amount');
      return;
    }

    const newOrder: Order = {
      id: nanoid(),
      symbol,
      side,
      type: 'LIMIT',
      price: priceNum,
      quantity: amountNum,
      status: 'PENDING',
      timestamp: Date.now(),
      postOnly,
    };
    addOrder(newOrder);

    // check whether to trade directly
    const isBuy = side === 'BUY';
    const isSell = side === 'SELL';
    const canFill =
      (isBuy && priceNum >= bestBid) || (isSell && priceNum <= bestAsk);

    toast.promise(
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (canFill && Math.random() > 0.1) {
            updateOrder(newOrder.id, { status: 'FILLED' });
            // 更新 positions
            const posSide = side === 'BUY' ? 'LONG' : 'SHORT';
            const existing = positions.find(
              (p) => p.symbol === symbol && p.side === posSide
            );
            let newPositions;
            if (existing) {
              const totalQty = existing.quantity + amountNum;
              const newEntryPrice =
                (existing.entryPrice * existing.quantity +
                  priceNum * amountNum) /
                totalQty;
              newPositions = positions.map((p) =>
                p === existing
                  ? {
                      ...p,
                      quantity: totalQty,
                      entryPrice: newEntryPrice,
                      markPrice: priceNum,
                      unrealizedPnl:
                        (priceNum - newEntryPrice) *
                        totalQty *
                        (posSide === 'LONG' ? 1 : -1),
                      unrealizedPnlPercent:
                        ((priceNum - newEntryPrice) / newEntryPrice) *
                        100 *
                        (posSide === 'LONG' ? 1 : -1),
                      timestamp: Date.now(),
                      side: posSide as 'LONG' | 'SHORT',
                    }
                  : p
              );
            } else {
              newPositions = [
                ...positions,
                {
                  symbol,
                  side: posSide as 'LONG' | 'SHORT',
                  quantity: amountNum,
                  entryPrice: priceNum,
                  markPrice: priceNum,
                  unrealizedPnl: 0,
                  unrealizedPnlPercent: 0,
                  timestamp: Date.now(),
                },
              ];
            }
            setPositions(newPositions);
            resolve();
          } else if (!canFill) {
            // Cannot trade, remain PENDING, no positions updated
            resolve();
          } else {
            updateOrder(newOrder.id, { status: 'REJECTED' });
            reject();
          }
        }, 10);
      }),
      {
        loading: 'Submitting order...',
        success: 'Order accepted',
        error: 'Order rejected',
      }
    );

    setPrice('');
    setAmount('');
  };

  return (
    <div className="flex flex-col ">
      <h3 className="text-lg font-semibold p-4">Trade</h3>
      <div className="flex mb-4 px-4">
        <button
          onClick={() => setSide('BUY')}
          className={`flex-1 py-2 text-center rounded-l-md transition-colors ${side === 'BUY' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('SELL')}
          className={`flex-1 py-2 text-center rounded-r-md transition-colors ${side === 'SELL' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Sell
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 px-4" data-testid="trade-form">
        <div>
          <label
            htmlFor="price"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price (USDT)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="price"
              id="price"
              step="any"
              min={0}
              value={price}
              onChange={(e) =>
                setPrice(sanitizeNumberInput(e.target.value).toString())
              }
              className="trading-input"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-8 flex items-center">
              <button
                type="button"
                onClick={() => setPrice(bestBid.toString())}
                className="text-xs px-2 text-green-500"
              >
                Best Bid
              </button>
              <button
                type="button"
                onClick={() => setPrice(bestAsk.toString())}
                className="text-xs px-2 text-red-500"
              >
                Best Ask
              </button>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="amount"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Amount ({symbol.replace('USDT', '')})
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            step="any"
            min={0}
            value={amount}
            onChange={(e) =>
              setAmount(sanitizeNumberInput(e.target.value).toString())
            }
            className="trading-input mt-1"
            placeholder="0.00"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-sm font-medium">
            {(parseFloat(price) * parseFloat(amount) || 0).toFixed(2)} USDT
          </span>
        </div>
        <div className="flex items-center">
          <input
            id="post-only"
            name="post-only"
            type="checkbox"
            checked={postOnly}
            onChange={(e) => setPostOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label
            htmlFor="post-only"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            Post-Only
          </label>
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white font-semibold transition-colors ${side === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {side === 'BUY' ? 'Buy' : 'Sell'} {symbol.replace('USDT', '')}
        </button>
      </form>
    </div>
  );
};

export default TradeTicket;
