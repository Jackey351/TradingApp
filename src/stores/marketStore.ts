import { create } from 'zustand';
import { OrderBook, Kline } from '../types';
import { useExchangeStore } from './exchangeStore';

interface MarketState {
  rawOrderBook: OrderBook | null;
  orderBook: OrderBook | null;
  klines: Kline[];
  setRawOrderBook: (orderBook: OrderBook) => void;
  setOrderBook: (orderBook: OrderBook) => void;
  setKlines: (klines: Kline[]) => void;
}

export const useMarketStore = create<MarketState>()((set) => ({
  rawOrderBook: null,
  orderBook: null,
  klines: [],
  setRawOrderBook: (ob) => set({ rawOrderBook: ob }),
  setOrderBook: (orderBook) => {
    set({ orderBook });
    // Auto-match open orders for the current symbol
    const exchange = useExchangeStore.getState();
    const { orders, updateOrder, positions, setPositions } = exchange;
    let updated = false;
    const newPositions = [...positions];
    const bestBid = orderBook?.bids?.[0]?.price ?? 0;
    const bestAsk = orderBook?.asks?.[0]?.price ?? 0;
    const selectedPair = exchange.selectedPair;
    orders.forEach((order) => {
      if (order.status !== 'PENDING' || order.price === undefined) return;
      if (order.symbol !== selectedPair) return;
      // BUY: fill if price >= bestBid
      if (order.side === 'BUY' && order.price >= bestBid) {
        updateOrder(order.id, { status: 'FILLED' });
        // Update positions
        const posSide = 'LONG';
        const existing = newPositions.find(
          (p) => p.symbol === order.symbol && p.side === posSide
        );
        if (existing) {
          const totalQty = existing.quantity + order.quantity;
          const newEntryPrice =
            (existing.entryPrice * existing.quantity +
              order.price * order.quantity) /
            totalQty;
          Object.assign(existing, {
            quantity: totalQty,
            entryPrice: newEntryPrice,
            markPrice: order.price,
            unrealizedPnl: (order.price - newEntryPrice) * totalQty,
            unrealizedPnlPercent:
              ((order.price - newEntryPrice) / newEntryPrice) * 100,
            timestamp: Date.now(),
          });
        } else {
          newPositions.push({
            symbol: order.symbol,
            side: posSide,
            quantity: order.quantity,
            entryPrice: order.price,
            markPrice: order.price,
            unrealizedPnl: 0,
            unrealizedPnlPercent: 0,
            timestamp: Date.now(),
          });
        }
        updated = true;
      }
      // SELL: fill if price <= bestAsk
      if (order.side === 'SELL' && order.price <= bestAsk) {
        updateOrder(order.id, { status: 'FILLED' });
        // Update positions
        const posSide = 'SHORT';
        const existing = newPositions.find(
          (p) => p.symbol === order.symbol && p.side === posSide
        );
        if (existing) {
          const totalQty = existing.quantity + order.quantity;
          const newEntryPrice =
            (existing.entryPrice * existing.quantity +
              order.price * order.quantity) /
            totalQty;
          Object.assign(existing, {
            quantity: totalQty,
            entryPrice: newEntryPrice,
            markPrice: order.price,
            unrealizedPnl: (order.price - newEntryPrice) * totalQty * -1,
            unrealizedPnlPercent:
              ((order.price - newEntryPrice) / newEntryPrice) * 100 * -1,
            timestamp: Date.now(),
          });
        } else {
          newPositions.push({
            symbol: order.symbol,
            side: posSide,
            quantity: order.quantity,
            entryPrice: order.price,
            markPrice: order.price,
            unrealizedPnl: 0,
            unrealizedPnlPercent: 0,
            timestamp: Date.now(),
          });
        }
        updated = true;
      }
    });
    if (updated) {
      setPositions(newPositions);
    }
  },
  setKlines: (klines) => set({ klines }),
}));
