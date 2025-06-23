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
    expect(screen.getByDisplayValue('BTCUSDT')).toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue('BTCUSDT'), {
      target: { value: 'ETHUSDT' },
    });
    expect(onPairChange).toHaveBeenCalledWith('ETHUSDT');
  });

  it('handles timeframe change', () => {
    (useExchangeStore as any).mockReturnValue({ tradingPairs });
    const onTimeframeChange = vi.fn();
    render(
      <InstrumentSelector selectedPair="BTCUSDT" onPairChange={vi.fn()} />
    );
    fireEvent.click(screen.getByText('1d'));
    expect(onTimeframeChange).toHaveBeenCalledWith('1d');
  });
});
