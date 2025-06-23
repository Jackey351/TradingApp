import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  TradingPair,
  Order,
  Position,
  Timeframe,
  ConnectionStatus,
} from '../types';

interface ExchangeState {
  connectionStatus: ConnectionStatus;
  selectedPair: string;
  tradingPairs: TradingPair[];
  currentTimeframe: Timeframe;
  orders: Order[];
  positions: Position[];
  setConnectionStatus: (status: ConnectionStatus) => void;
  setSelectedPair: (symbol: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setPositions: (positions: Position[]) => void;
  initializeExchange: () => void;
}

const defaultPairs = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT' },
];

export const useExchangeStore = create<ExchangeState>()(
  persist(
    (set) => ({
      connectionStatus: 'disconnected',
      selectedPair: 'BTCUSDT',
      tradingPairs: [],
      currentTimeframe: '1h',
      orders: [],
      positions: [],
      setConnectionStatus: (status: ConnectionStatus) => set({ connectionStatus: status }),
      setSelectedPair: (symbol: string) => set({ selectedPair: symbol }),
      addOrder: (order: Order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrder: (orderId: string, updates: Partial<Order>) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, ...updates } : order
        ),
      })),
      setPositions: (positions: Position[]) => set({ positions }),
      initializeExchange: () => {
        set({ tradingPairs: defaultPairs as TradingPair[] });
      },
    }),
    {
      name: 'exchange-storage',
      partialize: (state) => ({
        selectedPair: state.selectedPair,
        currentTimeframe: state.currentTimeframe,
        orders: state.orders,
        positions: state.positions,
        tradingPairs: state.tradingPairs,
        connectionStatus: state.connectionStatus,
      }),
    }
  )
);
