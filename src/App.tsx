import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import { useExchangeStore } from './stores/exchangeStore';

const TradingDashboard = lazy(() => import('./pages/TradingDashboard'));

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
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-500"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<TradingDashboard />} />
        </Routes>
      </Suspense>
      {showInstall && (
        <button
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={handleInstall}
        >
          Install to desktop
        </button>
      )}
    </div>
  );
}
