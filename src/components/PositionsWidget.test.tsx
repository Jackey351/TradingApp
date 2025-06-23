import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import PositionsWidget from './PositionsWidget';
import { useExchangeStore } from '../stores/exchangeStore';

vi.mock('../stores/exchangeStore');

describe('PositionsWidget', () => {
  it('renders positions table with data', () => {
    (useExchangeStore as any).mockReturnValue({
      positions: [
        {
          symbol: 'BTCUSDT',
          side: 'LONG',
          quantity: 1,
          entryPrice: 10000,
          markPrice: 11000,
          unrealizedPnl: 1000,
          unrealizedPnlPercent: 10,
        },
      ],
    });
    render(<PositionsWidget />);
    expect(screen.getByText('BTCUSDT')).toBeInTheDocument();
    expect(screen.getByText('LONG')).toBeInTheDocument();
    expect(screen.getByText('10000.00')).toBeInTheDocument();
    expect(screen.getByText('11000.00')).toBeInTheDocument();
    expect(screen.getByText('1000.00 (10.00%)')).toBeInTheDocument();
  });

  it('shows no positions message', () => {
    (useExchangeStore as any).mockReturnValue({ positions: [] });
    render(<PositionsWidget />);
    expect(screen.getByText('No open positions')).toBeInTheDocument();
  });
}); 