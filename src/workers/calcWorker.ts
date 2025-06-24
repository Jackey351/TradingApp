// src/workers/calcWorker.ts
export interface CalcRequest {
  type: 'aggregate' | 'pnl';
  payload: any;
}

export interface CalcResponse {
  type: 'aggregate' | 'pnl';
  result: any;
}

self.onmessage = (e: MessageEvent<CalcRequest>) => {
  const { type, payload } = e.data;
  if (type === 'aggregate') {
    // 价格聚合逻辑（累计深度）
    const { bids, asks } = payload;
    const aggBids = [];
    let total = 0;
    for (const bid of bids) {
      total += bid.quantity;
      aggBids.push({ ...bid, total });
    }
    const aggAsks = [];
    total = 0;
    for (const ask of asks) {
      total += ask.quantity;
      aggAsks.push({ ...ask, total });
    }
    (self as any).postMessage({
      type: 'aggregate',
      result: { bids: aggBids, asks: aggAsks },
    });
  } else if (type === 'pnl') {
    // 盈亏计算逻辑
    const { positions, prices } = payload;
    const result = positions.map((pos: any) => {
      const price = prices[pos.symbol];
      const pnl =
        (price - pos.entryPrice) *
        pos.quantity *
        (pos.side === 'LONG' ? 1 : -1);
      const pnlPercent = pos.entryPrice
        ? ((price - pos.entryPrice) / pos.entryPrice) *
          100 *
          (pos.side === 'LONG' ? 1 : -1)
        : 0;
      return { ...pos, pnl, pnlPercent };
    });
    (self as any).postMessage({ type: 'pnl', result });
  }
};
