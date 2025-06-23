import { act } from 'react-dom/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { useExchangeStore } from './exchangeStore';
import { Order, Position } from '../types';

describe('exchangeStore', () => {
  beforeEach(() => {
    useExchangeStore.setState(useExchangeStore.getInitialState());
  });

  it('sets and gets selectedPair', () => {
    act(() => {
      useExchangeStore.getState().setSelectedPair('ETHUSDT');
    });
    expect(useExchangeStore.getState().selectedPair).toBe('ETHUSDT');
  });

  it('adds order and updates order', () => {
    const order: Order = {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'LIMIT',
      price: 10000,
      quantity: 1,
      postOnly: false,
      status: 'PENDING',
      timestamp: Date.now(),
    };
    act(() => {
      useExchangeStore.getState().addOrder(order);
    });
    expect(useExchangeStore.getState().orders.length).toBe(1);
    act(() => {
      useExchangeStore.getState().updateOrder('1', { status: 'FILLED' });
    });
    expect(useExchangeStore.getState().orders[0].status).toBe('FILLED');
  });

  it('sets positions', () => {
    const positions: Position[] = [
      {
        symbol: 'BTCUSDT',
        side: 'LONG',
        quantity: 1,
        entryPrice: 10000,
        markPrice: 11000,
        unrealizedPnl: 1000,
        unrealizedPnlPercent: 10,
        timestamp: Date.now(),
      },
    ];
    act(() => {
      useExchangeStore.getState().setPositions(positions);
    });
    expect(useExchangeStore.getState().positions.length).toBe(1);
  });
}); 