import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import OrderBook from './OrderBook';
import { useExchangeStore } from '../stores/exchangeStore';

vi.mock('../stores/exchangeStore');

describe('OrderBook', () => {
  it('renders bids and asks', () => {
    (useExchangeStore as any).mockReturnValue({
      orderBook: {
        bids: [
          { price: 10000, quantity: 1, total: 1 },
        ],
        asks: [
          { price: 11000, quantity: 2, total: 2 },
        ],
      },
    });
    render(<OrderBook />);
    expect(screen.getByText('10000.00')).toBeInTheDocument();
    expect(screen.getByText('11000.00')).toBeInTheDocument();
  });

  it('renders empty state if no orderBook', () => {
    (useExchangeStore as any).mockReturnValue({ orderBook: null });
    render(<OrderBook />);
    expect(screen.getByText('Order Book')).toBeInTheDocument();
  });
}); 