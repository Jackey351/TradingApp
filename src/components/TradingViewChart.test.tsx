import { render, cleanup, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import TradingViewChart from './TradingViewChart';
import { useThemeStore } from '../stores/themeStore';

vi.mock('../stores/themeStore');

describe('TradingViewChart', () => {
  let mockActiveChart: any;
  let mockWidgetInstance: any;
  let mockWidgetConstructor: any;

  const defaultProps = {
    symbol: 'BTCUSDT',
    timeframe: '1h',
  };

  beforeEach(() => {
    mockActiveChart = {
      createStudy: vi.fn(),
    };
    mockWidgetInstance = {
      onChartReady: vi.fn(),
      remove: vi.fn(),
      setSymbol: vi.fn(),
      changeTheme: vi.fn(),
      activeChart: vi.fn().mockReturnValue(mockActiveChart),
    };
    mockWidgetConstructor = vi.fn().mockReturnValue(mockWidgetInstance);

    vi.clearAllMocks();

    (useThemeStore as any).mockReturnValue({ theme: 'dark' });

    (window as any).TradingView = {
      widget: mockWidgetConstructor,
    };

    const originalCreateElement = document.createElement;
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'script') {
        const script = originalCreateElement.call(document, tag) as any;
        script.onload = () => {};
        setTimeout(() => {
          if (script.onload) {
            script.onload.call(script, new Event('load'));
          }
        }, 0);
        return script;
      }
      return originalCreateElement.call(document, tag);
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
    delete (window as any).TradingView;
  });

  it('should initialize TradingView Widget after script loads', async () => {
    render(<TradingViewChart {...defaultProps} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(mockWidgetConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: defaultProps.symbol,
        interval: '1h',
        library_path: '/charting_library/',
      })
    );
  });

  it('should call widget.remove() on unmount', async () => {
    const { unmount } = render(<TradingViewChart {...defaultProps} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    unmount();
    expect(mockWidgetInstance.remove).toHaveBeenCalled();
  });

  it('should not create a new widget on re-render if symbol and timeframe are the same', async () => {
    const { rerender } = render(<TradingViewChart {...defaultProps} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    rerender(<TradingViewChart {...defaultProps} />);

    expect(mockWidgetConstructor).toHaveBeenCalledTimes(1);
  });

  it('should change theme when theme store changes', async () => {
    const { rerender } = render(<TradingViewChart {...defaultProps} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    (useThemeStore as any).mockReturnValue({ theme: 'light' });
    mockWidgetInstance.activeChart.mockReturnValue(mockActiveChart);
    mockWidgetConstructor.mockReturnValue(mockWidgetInstance);

    rerender(<TradingViewChart {...defaultProps} />);

    expect(mockWidgetInstance.changeTheme).toHaveBeenCalledWith('light');
  });

  it('should handle "system" theme', async () => {
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    (useThemeStore as any).mockReturnValue({ theme: 'system' });
    mockWidgetInstance.activeChart.mockReturnValue(mockActiveChart);
    mockWidgetConstructor.mockReturnValue(mockWidgetInstance);

    render(<TradingViewChart {...defaultProps} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(mockWidgetConstructor).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'dark' })
    );
  });

  it('should recreate widget on symbol change', async () => {
    const { rerender } = render(<TradingViewChart {...defaultProps} />);
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // The widget should be created once
    expect(mockWidgetConstructor).toHaveBeenCalledTimes(1);

    // Change symbol
    mockWidgetInstance.activeChart.mockReturnValue(mockActiveChart);
    mockWidgetConstructor.mockReturnValue(mockWidgetInstance);
    rerender(<TradingViewChart {...defaultProps} symbol="ETHUSDT" />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Old widget should be removed, and a new one created
    expect(mockWidgetInstance.remove).toHaveBeenCalledTimes(2);
    expect(mockWidgetConstructor).toHaveBeenCalledTimes(2);
  });

  it('should call createStudy when chart is ready', async () => {
    // Let onChartReady be callable
    mockWidgetInstance.onChartReady.mockImplementation((cb: () => void) =>
      cb()
    );
    mockWidgetInstance.activeChart.mockReturnValue(mockActiveChart);
    mockWidgetConstructor.mockReturnValue(mockWidgetInstance);

    render(<TradingViewChart {...defaultProps} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(mockActiveChart.createStudy).toHaveBeenCalledWith(
      'VWAP',
      false,
      false,
      {}
    );
    expect(mockActiveChart.createStudy).toHaveBeenCalledWith(
      'Moving Average Exponential',
      false,
      false,
      { length: 9 },
      { 'plot.color.0': '#FFD600' }
    );
    expect(mockActiveChart.createStudy).toHaveBeenCalledWith(
      'MACD',
      false,
      false,
      {},
      { 'plot.color.0': '#00FF00' }
    );
  });
});
