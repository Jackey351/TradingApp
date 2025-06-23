// Trading pair types
export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  minPrice: number;
  maxPrice: number;
  tickSize: number;
  minQty: number;
  maxQty: number;
  stepSize: number;
}

// Order book types
export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdateId: number;
}

// Trade types
export interface Trade {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: number;
}

// Kline/Candlestick types
export interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

export type Timeframe = '1m' | '5m' | '1h' | '4h' | '1d';

// Order types
export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  quantity: number;
  price?: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  timestamp: number;
  postOnly?: boolean;
}

// Position types
export interface Position {
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  timestamp: number;
}

// Exchange adapter interface
export interface ExchangeAdapter {
  name: string;
  getTradingPairs(): Promise<TradingPair[]>;
  getOrderBook(symbol: string, limit?: number): Promise<OrderBook>;
  getKlines(
    symbol: string,
    timeframe: Timeframe,
    limit?: number
  ): Promise<Kline[]>;
  getTrades(symbol: string, limit?: number): Promise<Trade[]>;
  subscribeOrderBook(
    symbol: string,
    callback: (data: OrderBook) => void
  ): () => void;
  subscribeTrades(symbol: string, callback: (data: Trade) => void): () => void;
  subscribeKlines(
    symbol: string,
    timeframe: Timeframe,
    callback: (data: Kline) => void
  ): () => void;
  placeOrder(order: Omit<Order, 'id' | 'status' | 'timestamp'>): Promise<Order>;
  cancelOrder(orderId: string): Promise<boolean>;
  getOrders(symbol?: string): Promise<Order[]>;
  getPositions(): Promise<Position[]>;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Connection status
export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

// Chart overlay types
export interface ChartOverlay {
  id: string;
  type: 'VWAP' | 'EMA' | 'SMA' | 'BB';
  params: Record<string, number>;
  visible: boolean;
}

// Layout types
export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

// Performance metrics
export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
}
