import React, { useEffect, useRef } from 'react';
import { datafeed } from '../datafeed/datafeed';
import { useThemeStore } from '@/stores/themeStore';

// 声明 window.datafeed 类型
declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol: string;
  timeframe: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  timeframe,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const { theme } = useThemeStore();

  const getLatestTheme = () => {
    let newTheme = theme;
    if (theme === 'system') {
      newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return newTheme;
  };

  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.changeTheme(getLatestTheme());
    }
  }, [theme]);

  useEffect(() => {
    // 动态加载 charting_library.standalone.js
    const script = document.createElement('script');
    script.src = '/charting_library/charting_library.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        // 销毁旧的 widget
        if (widgetRef.current && widgetRef.current.remove) {
          widgetRef.current.remove();
        }

        widgetRef.current = new window.TradingView.widget({
          symbol: symbol,
          interval: timeframe,
          container: containerRef.current.id,
          library_path: '/charting_library/',
          datafeed,
          locale: 'zh',
          width: '100%',
          height: 500,
          theme: getLatestTheme(),
          autosize: true,
        });
        // 添加VWAP和9周期EMA和自定义Pine Script指标
        widgetRef.current.onChartReady?.(() => {
          const chart = widgetRef.current.activeChart();
          // VWAP 黄色
          chart.createStudy('VWAP', false, false, {});
          // 9周期EMA 蓝色
          chart.createStudy(
            'Moving Average Exponential',
            false,
            false,
            { length: 9 },
            { 'plot.color.0': '#FFD600' }
          );
          chart.createStudy(
            'MACD',
            false,
            false,
            {}, // Pine参数，如有
            { 'plot.color.0': '#00FF00' } // 可选样式
          );
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      if (widgetRef.current && widgetRef.current.remove) {
        widgetRef.current.remove();
      }
      document.body.removeChild(script);
    };
  }, [symbol, timeframe]);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold p-4">Chart</h3>
      <div
        id="tv_chart_container"
        ref={containerRef}
        className="w-full h-[500px] border-t border-gray-200 dark:border-gray-700"
      />
    </div>
  );
};

export default TradingViewChart;
