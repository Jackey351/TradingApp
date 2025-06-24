import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import PositionsWidget from './PositionsWidget';
import { useExchangeStore } from '../stores/exchangeStore';
import { useMarketStore } from '../stores/marketStore';
import { useCalcWorker } from '@/hooks/useCalcWorker';

vi.mock('../stores/exchangeStore');
vi.mock('../stores/marketStore');
vi.mock('@/hooks/useCalcWorker');

describe('PositionsWidget', () => {
  it('renders positions table with data', async () => {
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
      selectedPair: 'BTCUSDT',
    });
    (useMarketStore as any).mockReturnValue({
      orderBook: {
        bids: [{ price: 11000, quantity: 1, total: 1 }],
        asks: [{ price: 12000, quantity: 1, total: 1 }],
      },
    });
    (useCalcWorker as any).mockReturnValue({
      calcPnL: vi.fn().mockResolvedValue([
        { symbol: 'BTCUSDT', side: 'LONG', pnl: 1000, pnlPercent: 10 },
      ]),
    });
    render(<PositionsWidget />);
    expect(await screen.findByText('BTCUSDT')).toBeInTheDocument();
    expect(await screen.findByText('LONG')).toBeInTheDocument();
    expect(await screen.findByText('10000.00')).toBeInTheDocument();
    expect(await screen.findByText('11000.00')).toBeInTheDocument();
    expect(await screen.findByText('1000.00 (10.00%)')).toBeInTheDocument();
  });

  it('shows no positions message', () => {
    (useExchangeStore as any).mockReturnValue({ positions: [], selectedPair: 'BTCUSDT' });
    (useMarketStore as any).mockReturnValue({ orderBook: null });
    (useCalcWorker as any).mockReturnValue({ calcPnL: vi.fn().mockResolvedValue([]) });
    render(<PositionsWidget />);
    expect(screen.getByText('No open positions')).toBeInTheDocument();
  });
}); 