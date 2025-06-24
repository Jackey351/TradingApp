import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TradeTicket from './TradeTicket';
import { useExchangeStore } from '../stores/exchangeStore';
import { useMarketStore } from '../stores/marketStore';
import { useCalcWorker } from '../hooks/useCalcWorker';

// Mock dependencies
vi.mock('../stores/exchangeStore');
vi.mock('../stores/marketStore');
vi.mock('../hooks/useCalcWorker');

describe('TradeTicket', () => {
  const mockAddOrder = vi.fn();
  const mockAggregateOrderBook = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useExchangeStore as any).mockReturnValue({
      addOrder: mockAddOrder,
      updateOrder: vi.fn(),
      positions: [],
      setPositions: vi.fn(),
      selectedPair: 'BTCUSDT',
    });

    (useMarketStore as any).mockReturnValue({
      orderBook: {
        bids: [{ price: 100, quantity: 1, total: 1 }],
        asks: [{ price: 101, quantity: 1, total: 1 }],
      },
    });

    (useCalcWorker as any).mockReturnValue({
      aggregateOrderBook: mockAggregateOrderBook.mockResolvedValue({
        bids: [{ price: 100, quantity: 1, total: 1 }],
        asks: [{ price: 101, quantity: 1, total: 1 }],
      }),
    });
  });

  it('should render correctly and allow changing side', () => {
    render(<TradeTicket symbol="BTCUSDT" />);
    
    // Default to BUY
    expect(screen.getAllByRole('button', { name: /^Buy$/i })[0]).toHaveClass('bg-green-600');

    // Switch to SELL tab
    fireEvent.click(screen.getAllByRole('button', { name: /Sell/i })[0]);
    // Check sell tab class
    expect(screen.getAllByRole('button', { name: /Sell/i })[0]).toHaveClass('bg-red-600');
  });

  it('should allow inputting price and quantity', () => {
    render(<TradeTicket symbol="BTCUSDT" />);
    
    const priceInput = screen.getByLabelText(/Price/i);
    const quantityInput = screen.getByLabelText(/Amount/i);

    fireEvent.change(priceInput, { target: { value: '12345' } });
    fireEvent.change(quantityInput, { target: { value: '0.5' } });

    expect(priceInput).toHaveValue(12345);
    expect(quantityInput).toHaveValue(0.5);
  });

  it('should call addOrder on form submission', async () => {
    render(<TradeTicket symbol="BTCUSDT" />);

    // Set side to BUY (tab)
    fireEvent.click(screen.getAllByRole('button', { name: /Buy/i })[0]);

    // Set price and quantity as strings
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '1' } });

    // Submit the form directly
    fireEvent.submit(screen.getByTestId('trade-form'));
    
    // Wait for any async effects
    await act(async () => {});

    // Check if addOrder was called
    expect(mockAddOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 1,
        price: 100,
      })
    );
  });

  it('should update total when quantity changes', () => {
    render(<TradeTicket symbol="BTCUSDT" />);

    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '2' } });

    // Find the "Total" span and check its sibling's content
    const totalLabel = screen.getByText('Total');
    const totalValue = totalLabel.nextElementSibling;

    expect(totalValue).toBeInTheDocument();
    expect(totalValue?.textContent).toContain('200.00');
  });
});
