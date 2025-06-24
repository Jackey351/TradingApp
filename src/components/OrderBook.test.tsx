import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import OrderBook from './OrderBook';
import { useMarketStore } from '../stores/marketStore';

// Mock AutoSizer to always provide fixed width/height
vi.mock('react-virtualized-auto-sizer', () => ({
  __esModule: true,
  default: ({ children }: any) => children({ height: 500, width: 500 }),
}));

// Mock VirtualizedList to render all items directly
vi.mock('./VirtualizedList', () => ({
  __esModule: true,
  default: React.forwardRef((props: any) => {
    const { itemCount, itemData, children } = props;
    return (
      <div>
        {Array.from({ length: itemCount }).map((_, idx) =>
          children({
            index: idx,
            style: {},
            data: itemData,
            type: props.type || 'bid',
          })
        )}
      </div>
    );
  }),
}));

vi.mock('../stores/marketStore');

describe('OrderBook', () => {
  it('renders bids and asks', async () => {
    (useMarketStore as any).mockReturnValue({
      orderBook: {
        bids: [{ price: 10000, quantity: 1, total: 1 }],
        asks: [{ price: 11000, quantity: 2, total: 2 }],
      },
      rawOrderBook: null,
      setOrderBook: vi.fn(),
      setRawOrderBook: vi.fn(),
      klines: [],
      setKlines: vi.fn(),
    });
    render(<OrderBook />);
    expect((await screen.findAllByText('10000.00')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('11000.00')).length).toBeGreaterThan(0);
  });

  it('renders empty state if no orderBook', () => {
    (useMarketStore as any).mockReturnValue({ orderBook: null });
    render(<OrderBook />);
    expect(screen.getByText('Order Book')).toBeInTheDocument();
  });
});
