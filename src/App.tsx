import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import { TranslationProvider } from './context/TranslationContext';
import Header from './components/Header';
import StockTicker from './components/StockTicker';
import BreakingNewsBanner from './components/BreakingNewsBanner';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FloatingAIChat from './components/FloatingAIChat';
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
import Footer from './components/Footer';

function App() {
  return (
    <HelmetProvider>
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
        <FloatingAIChat />
        
        {/* Vercel Web Analytics */}
        <Analytics />
        
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
    </TranslationProvider>
    </HelmetProvider>
  );
}

export default App;
