import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useMarketStore } from './marketStore';
import { useExchangeStore } from './exchangeStore';
import { Order, Position } from '../types';

// Mock the exchange store
vi.mock('./exchangeStore', () => ({
  useExchangeStore: {
    getState: vi.fn(),
  },
}));

describe('useMarketStore', () => {
  let mockUpdateOrder: any;
  let mockSetPositions: any;

  beforeEach(() => {
    // Reset mocks and state before each test
    vi.clearAllMocks();
    useMarketStore.setState({
      rawOrderBook: null,
      orderBook: null,
      klines: [],
    });

    mockUpdateOrder = vi.fn();
    mockSetPositions = vi.fn();

    (useExchangeStore.getState as any).mockReturnValue({
      orders: [],
      positions: [],
      selectedPair: 'BTCUSDT',
      updateOrder: mockUpdateOrder,
      setPositions: mockSetPositions,
    });
  });

  it('setRawOrderBook should update the rawOrderBook state', () => {
    const ob = { bids: [], asks: [], lastUpdateId: 1 };
    useMarketStore.getState().setRawOrderBook(ob);
    expect(useMarketStore.getState().rawOrderBook).toEqual(ob);
  });

  it('setKlines should update the klines state', () => {
    const klines = [{ openTime: 1, open: 1, high: 1, low: 1, close: 1, volume: 1, closeTime: 1, quoteAssetVolume: 1, numberOfTrades: 1, takerBuyBaseAssetVolume: 1, takerBuyQuoteAssetVolume: 1 }];
    useMarketStore.getState().setKlines(klines);
    expect(useMarketStore.getState().klines).toEqual(klines);
  });

  describe('setOrderBook order matching', () => {
    it('should fill a PENDING BUY order and create a new LONG position', () => {
      const buyOrder: Order = { id: '1', symbol: 'BTCUSDT', side: 'BUY', quantity: 1, price: 100, status: 'PENDING', timestamp: 0, type: 'LIMIT' };
      (useExchangeStore.getState as any).mockReturnValue({
        orders: [buyOrder],
        positions: [],
        selectedPair: 'BTCUSDT',
        updateOrder: mockUpdateOrder,
        setPositions: mockSetPositions,
      });

      const orderBook = { bids: [{ price: 100, quantity: 1, total: 1 }], asks: [], lastUpdateId: 2 };
      useMarketStore.getState().setOrderBook(orderBook);

      expect(mockUpdateOrder).toHaveBeenCalledWith('1', { status: 'FILLED' });
      expect(mockSetPositions).toHaveBeenCalled();
      const newPositions = mockSetPositions.mock.calls[0][0];
      expect(newPositions[0].symbol).toBe('BTCUSDT');
      expect(newPositions[0].side).toBe('LONG');
    });

    it('should fill a PENDING SELL order and create a new SHORT position', () => {
      const sellOrder: Order = { id: '2', symbol: 'BTCUSDT', side: 'SELL', quantity: 1, price: 100, status: 'PENDING', timestamp: 0, type: 'LIMIT' };
      (useExchangeStore.getState as any).mockReturnValue({
        orders: [sellOrder],
        positions: [],
        selectedPair: 'BTCUSDT',
        updateOrder: mockUpdateOrder,
        setPositions: mockSetPositions,
      });

      const orderBook = { bids: [], asks: [{ price: 100, quantity: 1, total: 1 }], lastUpdateId: 2 };
      useMarketStore.getState().setOrderBook(orderBook);

      expect(mockUpdateOrder).toHaveBeenCalledWith('2', { status: 'FILLED' });
      expect(mockSetPositions).toHaveBeenCalled();
      const newPositions = mockSetPositions.mock.calls[0][0];
      expect(newPositions[0].side).toBe('SHORT');
    });

    it('should update an existing LONG position', () => {
      const buyOrder: Order = { id: '1', symbol: 'BTCUSDT', side: 'BUY', quantity: 1, price: 101, status: 'PENDING', timestamp: 0, type: 'LIMIT' };
      const existingPosition: Position = { symbol: 'BTCUSDT', side: 'LONG', quantity: 1, entryPrice: 100, markPrice: 100, unrealizedPnl: 0, unrealizedPnlPercent: 0, timestamp: 0 };
      (useExchangeStore.getState as any).mockReturnValue({
        orders: [buyOrder],
        positions: [existingPosition],
        selectedPair: 'BTCUSDT',
        updateOrder: mockUpdateOrder,
        setPositions: mockSetPositions,
      });

      const orderBook = { bids: [{ price: 101, quantity: 1, total: 1 }], asks: [], lastUpdateId: 3 };
      useMarketStore.getState().setOrderBook(orderBook);

      expect(mockSetPositions).toHaveBeenCalled();
      const newPositions = mockSetPositions.mock.calls[0][0];
      expect(newPositions[0].quantity).toBe(2);
      expect(newPositions[0].entryPrice).toBe(100.5);
    });

    it('should update an existing SHORT position', () => {
        const sellOrder: Order = { id: '2', symbol: 'BTCUSDT', side: 'SELL', quantity: 1, price: 99, status: 'PENDING', timestamp: 0, type: 'LIMIT' };
        const existingPosition: Position = { symbol: 'BTCUSDT', side: 'SHORT', quantity: 1, entryPrice: 100, markPrice: 100, unrealizedPnl: 0, unrealizedPnlPercent: 0, timestamp: 0 };
        (useExchangeStore.getState as any).mockReturnValue({
          orders: [sellOrder],
          positions: [existingPosition],
          selectedPair: 'BTCUSDT',
          updateOrder: mockUpdateOrder,
          setPositions: mockSetPositions,
        });
  
        const orderBook = { bids: [], asks: [{ price: 99, quantity: 1, total: 1 }], lastUpdateId: 4 };
        useMarketStore.getState().setOrderBook(orderBook);
  
        expect(mockSetPositions).toHaveBeenCalled();
        const newPositions = mockSetPositions.mock.calls[0][0];
        expect(newPositions[0].quantity).toBe(2);
        expect(newPositions[0].entryPrice).toBe(99.5);
      });

    it('should not fill an order if the symbol does not match', () => {
        const buyOrder: Order = { id: '1', symbol: 'ETHUSDT', side: 'BUY', quantity: 1, price: 100, status: 'PENDING', timestamp: 0, type: 'LIMIT' };
        (useExchangeStore.getState as any).mockReturnValue({
          orders: [buyOrder],
          positions: [],
          selectedPair: 'BTCUSDT', // Different from order symbol
          updateOrder: mockUpdateOrder,
          setPositions: mockSetPositions,
        });
  
        const orderBook = { bids: [{ price: 100, quantity: 1, total: 1 }], asks: [], lastUpdateId: 2 };
        useMarketStore.getState().setOrderBook(orderBook);
  
        expect(mockUpdateOrder).not.toHaveBeenCalled();
        expect(mockSetPositions).not.toHaveBeenCalled();
      });
  });
}); 