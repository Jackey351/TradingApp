import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import InstrumentSelector from './InstrumentSelector';
import { useExchangeStore } from '../stores/exchangeStore';

vi.mock('../stores/exchangeStore');

describe('InstrumentSelector', () => {
  const tradingPairs = [
    { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
    { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
  ];

  it('renders trading pairs and handles change', () => {
    (useExchangeStore as any).mockReturnValue({ tradingPairs });
    const onPairChange = vi.fn();
    render(
      <InstrumentSelector selectedPair="BTCUSDT" onPairChange={onPairChange} />
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('BTCUSDT');
    expect(screen.getByText('BTC/USDT')).toBeInTheDocument();
    expect(screen.getByText('ETH/USDT')).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'ETHUSDT' } });
    expect(onPairChange).toHaveBeenCalledWith('ETHUSDT');
  });
});
