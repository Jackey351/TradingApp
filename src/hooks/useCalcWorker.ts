import { useRef, useEffect, useCallback } from 'react';

export function useCalcWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/calcWorker.ts', import.meta.url),
      { type: 'module' }
    );
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const calcPnL = useCallback(
    (positions: any[], prices: Record<string, number>): Promise<any[]> => {
      return new Promise((resolve) => {
        if (!workerRef.current) return resolve([]);
        const handler = (e: MessageEvent) => {
          if (e.data.type === 'pnl') {
            resolve(e.data.result);
            workerRef.current?.removeEventListener('message', handler);
          }
        };
        workerRef.current.addEventListener('message', handler);
        workerRef.current.postMessage({
          type: 'pnl',
          payload: { positions, prices },
        });
      });
    },
    []
  );

  const aggregateOrderBook = useCallback(
    (bids: any[], asks: any[]): Promise<{ bids: any[]; asks: any[] }> => {
      return new Promise((resolve) => {
        if (!workerRef.current) return resolve({ bids: [], asks: [] });
        const handler = (e: MessageEvent) => {
          if (e.data.type === 'aggregate') {
            resolve(e.data.result);
            workerRef.current?.removeEventListener('message', handler);
          }
        };
        workerRef.current.addEventListener('message', handler);
        workerRef.current.postMessage({
          type: 'aggregate',
          payload: { bids, asks },
        });
      });
    },
    []
  );

  return { calcPnL, aggregateOrderBook };
}
