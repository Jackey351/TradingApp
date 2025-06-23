import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import TradingDashboard from './pages/TradingDashboard';
import { useThemeStore } from './stores/themeStore';
import { useExchangeStore } from './stores/exchangeStore';

export default function App() {
  const { theme, initializeTheme } = useThemeStore();
  const { initializeExchange } = useExchangeStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    initializeTheme();
    initializeExchange();
  }, [initializeTheme, initializeExchange]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setShowInstall(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Routes>
        <Route path="/" element={<TradingDashboard />} />
      </Routes>
      {showInstall && (
        <button
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={handleInstall}
        >
          安装到桌面
        </button>
      )}
    </div>
  );
}
