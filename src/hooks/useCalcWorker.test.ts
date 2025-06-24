import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCalcWorker } from './useCalcWorker';

// Mock Worker
const mockPostMessage = vi.fn();
const mockTerminate = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

class MockWorker {
  url: string;
  options: any;
  onmessage: any = null;

  constructor(url: string, options: any) {
    this.url = url;
    this.options = options;
  }

  postMessage = mockPostMessage;
  terminate = mockTerminate;
  addEventListener = mockAddEventListener;
  removeEventListener = mockRemoveEventListener;
}

const mockWorkerSpy = vi.fn(
  (url: string, options: any) => new MockWorker(url, options)
);
global.Worker = mockWorkerSpy as any;

describe('useCalcWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddEventListener.mockImplementation((_event, handler) => {
      // Store the handler to simulate message events
      (MockWorker as any).messageHandler = handler;
    });
  });

  it('should initialize and terminate the worker', () => {
    const { unmount } = renderHook(() => useCalcWorker());
    expect(mockWorkerSpy).toHaveBeenCalledWith(expect.any(URL), {
      type: 'module',
    });
    unmount();
    expect(mockTerminate).toHaveBeenCalled();
  });

  it('calcPnL should post a message and resolve with the result', async () => {
    const { result } = renderHook(() => useCalcWorker());
    const positions = [{ symbol: 'BTCUSDT', quantity: 1, entryPrice: 100 }];
    const prices = { BTCUSDT: 110 };

    const promise = result.current.calcPnL(positions, prices);

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'pnl',
      payload: { positions, prices },
    });

    // Simulate worker response
    act(() => {
      (MockWorker as any).messageHandler({
        data: { type: 'pnl', result: { pnl: 10 } },
      });
    });

    await expect(promise).resolves.toEqual({ pnl: 10 });
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    );
  });

  it('aggregateOrderBook should post a message and resolve with the result', async () => {
    const { result } = renderHook(() => useCalcWorker());
    const bids = [[100, 1]];
    const asks = [[101, 1]];

    const promise = result.current.aggregateOrderBook(bids, asks);

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'aggregate',
      payload: { bids, asks },
    });

    // Simulate worker response
    const aggregatedData = { bids: [[100, 1, 1]], asks: [[101, 1, 1]] };
    act(() => {
      (MockWorker as any).messageHandler({
        data: { type: 'aggregate', result: aggregatedData },
      });
    });

    await expect(promise).resolves.toEqual(aggregatedData);
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    );
  });

  it('should handle message events for other types without resolving', async () => {
    const { result } = renderHook(() => useCalcWorker());
    result.current.calcPnL([], {});

    act(() => {
      (MockWorker as any).messageHandler({
        data: { type: 'unrelated', result: {} },
      });
    });

    // We can check that the promise isn't resolved by checking that removeEventListener
    // was not called, as it's part of the resolution logic.
    expect(mockRemoveEventListener).not.toHaveBeenCalled();
  });
});
