import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import Header from './components/Header';
import StockTicker from './components/StockTicker';
import BreakingNewsBanner from './components/BreakingNewsBanner';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Search from './pages/Search';
import Markets from './pages/Markets';
import Trending from './pages/Trending';
import StockPage from './pages/StockPage';
import Bookmarks from './pages/Bookmarks';
import Watchlist from './pages/Watchlist';
import Earnings from './pages/Earnings';
import IPOTracker from './pages/IPOTracker';
import Portfolio from './pages/Portfolio';
import Alerts from './pages/Alerts';

function App() {
  return (
    <TranslationProvider>
    <BrowserRouter>
      <div className="min-h-screen bg-surface-900">
        <BreakingNewsBanner />
        <StockTicker />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:articleId" element={<ArticleDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/stock/:symbol" element={<StockPage />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/ipos" element={<IPOTracker />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
        
        {/* Floating WhatsApp Button */}
        <FloatingWhatsApp />
        
        {/* Footer */}
        <footer className="border-t border-surface-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center">
                  <span className="text-surface-900 font-bold text-sm">₹</span>
                </div>
                <span className="text-sm text-gray-500">BharatMarket © 2026</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-saffron-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-saffron-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-saffron-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;
