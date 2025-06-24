import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TradeTicket from './TradeTicket';
import { useExchangeStore } from '../stores/exchangeStore';
import toast from 'react-hot-toast';

vi.mock('../stores/exchangeStore');
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { error: vi.fn(), promise: vi.fn() },
}));

describe('TradeTicket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useExchangeStore as any).mockReturnValue({
      addOrder: vi.fn(),
      updateOrder: vi.fn(),
      positions: [],
      setPositions: vi.fn(),
      orderBook: { bids: [{ price: 10000 }], asks: [{ price: 11000 }] },
    });
  });

  it('renders and switches side', () => {
    render(<TradeTicket symbol="BTCUSDT" />);
    expect(screen.getByText('Buy')).toBeInTheDocument();
    expect(screen.getByText('Sell')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sell'));
    expect(screen.getByText('Sell BTC')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Buy'));
    expect(screen.getByText('Buy BTC')).toBeInTheDocument();
  });

  it('shows error on invalid input', () => {
    render(<TradeTicket symbol="BTCUSDT" />);
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '' },
    });
    fireEvent.submit(screen.getByTestId('trade-form'));
    expect(toast.error).toHaveBeenCalled();
  });

  it('submits order and shows toast', async () => {
    render(<TradeTicket symbol="BTCUSDT" />);
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: '10000' },
    });
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '0.1' },
    });
    fireEvent.submit(screen.getByTestId('trade-form'));
    expect(toast.promise).toHaveBeenCalled();
  });
});
