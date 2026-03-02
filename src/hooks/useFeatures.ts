// Custom hooks for all platform features
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Generate unique user ID (stored in localStorage)
export const getUserId = () => {
  let userId = localStorage.getItem('coinsclarity_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('coinsclarity_user_id', userId);
  }
  return userId;
};

// ============ STOCK ANALYSIS HOOKS ============

interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  currency: string;
  exchange: string;
  isMock?: boolean;
}

interface StockMention {
  symbol: string;
  name: string;
}

interface Sentiment {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  confidence: 'high' | 'medium' | 'low';
}

// Hook: Get stock mentions and prices for an article
export const useArticleStocks = (articleId: string | undefined) => {
  const [stocks, setStocks] = useState<{ mentions: StockMention[]; prices: StockPrice[] }>({ mentions: [], prices: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    
    setLoading(true);
    api.get(`/news/${articleId}/stocks`)
      .then(res => setStocks(res.data))
      .catch(() => setStocks({ mentions: [], prices: [] }))
      .finally(() => setLoading(false));
  }, [articleId]);

  return { stocks, loading };
};

// Hook: Get sentiment analysis
export const useArticleSentiment = (articleId: string | undefined) => {
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    
    setLoading(true);
    api.get(`/news/${articleId}/sentiment`)
      .then(res => setSentiment(res.data.sentiment))
      .catch(() => setSentiment(null))
      .finally(() => setLoading(false));
  }, [articleId]);

  return { sentiment, loading };
};

// Hook: Get AI summary (TLDR)
export const useArticleSummary = (articleId: string | undefined) => {
  const [summary, setSummary] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    
    setLoading(true);
    api.get(`/news/${articleId}/summary`)
      .then(res => {
        setSummary(res.data.summary || []);
        setSentiment(res.data.sentiment || null);
      })
      .catch(() => {
        setSummary([]);
        setSentiment(null);
      })
      .finally(() => setLoading(false));
  }, [articleId]);

  return { summary, sentiment, loading };
};

// Hook: Stock search
export const useStockSearch = () => {
  const [results, setResults] = useState<StockMention[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.get(`/stocks/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
};

// Hook: Stock news ("Why is X moving?")
export const useStockNews = (symbol: string | undefined) => {
  const [data, setData] = useState<{ stock: StockMention | null; price: StockPrice | null; articles: any[] }>({
    stock: null,
    price: null,
    articles: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;
    
    setLoading(true);
    api.get(`/stocks/${symbol}/news`)
      .then(res => setData({
        stock: res.data.stock,
        price: res.data.price,
        articles: res.data.articles || []
      }))
      .catch(() => setData({ stock: null, price: null, articles: [] }))
      .finally(() => setLoading(false));
  }, [symbol]);

  return { ...data, loading };
};

// ============ MARKET HOOKS ============

interface MarketStatus {
  status: 'pre-market' | 'live' | 'post-market' | 'closed';
  message: string;
  istTime: string;
  nextOpen: string | null;
}

// Hook: Market status
export const useMarketStatus = () => {
  const [status, setStatus] = useState<MarketStatus | null>(null);

  const fallbackStatus: MarketStatus = { status: 'closed', message: 'Market data unavailable' };
  useEffect(() => {
    const fetchStatus = () => {
      api.get('/market/status')
        .then(res => setStatus(res.data))
        .catch(() => setStatus(fallbackStatus));
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return status;
};

// Hook: Market indices (NIFTY, SENSEX, etc.)
export const useMarketIndices = () => {
  const [indices, setIndices] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackIndices: StockPrice[] = [
    { symbol: 'NIFTY 50', name: 'NIFTY 50', price: 24650.5, changePercent: 0.51, currency: 'INR', exchange: 'NSE' },
    { symbol: 'SENSEX', name: 'SENSEX', price: 81245.75, changePercent: 0.52, currency: 'INR', exchange: 'BSE' },
  ];
  useEffect(() => {
    const fetchIndices = () => {
      api.get('/market/indices')
        .then(res => setIndices(res.data.data || []))
        .catch(() => setIndices(fallbackIndices))
        .finally(() => setLoading(false));
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return { indices, loading };
};

// ============ WATCHLIST HOOKS ============

// Hook: Watchlist management
export const useWatchlist = () => {
  const [stocks, setStocks] = useState<string[]>([]);
  const [prices, setPrices] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  // Load watchlist
  useEffect(() => {
    api.get(`/watchlist/${userId}`)
      .then(res => {
        setStocks(res.data.data?.stocks || []);
        setPrices(res.data.data?.prices || []);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [userId]);

  // Add to watchlist
  const addStock = useCallback(async (symbol: string) => {
    const newStocks = [...new Set([...stocks, symbol.toUpperCase()])];
    setStocks(newStocks);
    await api.post('/watchlist/save', { userId, stocks: newStocks });
  }, [stocks, userId]);

  // Remove from watchlist
  const removeStock = useCallback(async (symbol: string) => {
    const newStocks = stocks.filter(s => s !== symbol.toUpperCase());
    setStocks(newStocks);
    await api.post('/watchlist/save', { userId, stocks: newStocks });
  }, [stocks, userId]);

  // Check if stock is in watchlist
  const isWatching = useCallback((symbol: string) => {
    return stocks.includes(symbol.toUpperCase());
  }, [stocks]);

  return { stocks, prices, loading, addStock, removeStock, isWatching };
};

// Hook: Watchlist news
export const useWatchlistNews = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    api.get(`/watchlist/${userId}/news`)
      .then(res => setArticles(res.data.data || []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [userId]);

  return { articles, loading };
};

// ============ BOOKMARKS HOOKS ============

// Hook: Bookmarks management
export const useBookmarks = () => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  // Load bookmarks
  useEffect(() => {
    api.get(`/bookmarks/${userId}`)
      .then(res => {
        const data = res.data.data || [];
        setArticles(data);
        setBookmarkedIds(data.map((a: any) => a.article_id));
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [userId]);

  // Add bookmark
  const addBookmark = useCallback(async (articleId: string) => {
    setBookmarkedIds(prev => [...prev, articleId]);
    await api.post('/bookmarks/save', { userId, articleId });
  }, [userId]);

  // Remove bookmark
  const removeBookmark = useCallback(async (articleId: string) => {
    setBookmarkedIds(prev => prev.filter(id => id !== articleId));
    setArticles(prev => prev.filter(a => a.article_id !== articleId));
    await api.post('/bookmarks/remove', { userId, articleId });
  }, [userId]);

  // Check if bookmarked
  const isBookmarked = useCallback((articleId: string) => {
    return bookmarkedIds.includes(articleId);
  }, [bookmarkedIds]);

  return { bookmarkedIds, articles, loading, addBookmark, removeBookmark, isBookmarked };
};

// ============ TEXT-TO-SPEECH HOOK ============

export const useTextToSpeech = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported || !text) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  const toggle = useCallback((text: string) => {
    if (speaking) {
      stop();
    } else {
      speak(text);
    }
  }, [speaking, speak, stop]);

  return { speaking, supported, speak, stop, toggle };
};

// ============ DARK MODE HOOK ============

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('coinsclarity_dark_mode');
    return stored ? stored === 'true' : true; // Default dark
  });

  useEffect(() => {
    localStorage.setItem('coinsclarity_dark_mode', String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark(prev => !prev), []);

  return { isDark, toggle };
};

// ============ RELATED ARTICLES HOOK ============

export const useRelatedArticles = (articleId: string | undefined) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    
    setLoading(true);
    api.get(`/news/${articleId}/related`)
      .then(res => setArticles(res.data.data || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [articleId]);

  return { articles, loading };
};

// ============ ARTICLE META (READING TIME) HOOK ============

export const useArticleMeta = (articleId: string | undefined) => {
  const [meta, setMeta] = useState<{ readingTime: number; wordCount: number } | null>(null);

  useEffect(() => {
    if (!articleId) return;
    
    api.get(`/news/${articleId}/meta`)
      .then(res => setMeta(res.data.data))
      .catch(() => null);
  }, [articleId]);

  return meta;
};

// ============ EARNINGS CALENDAR HOOK ============

interface Earning {
  symbol: string;
  name: string;
  date: string;
  quarter: string;
  daysUntil: number;
  isPast: boolean;
}

export const useEarningsCalendar = (days = 30) => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/earnings/upcoming?days=${days}`)
      .then(res => setEarnings(res.data.data || []))
      .catch(() => setEarnings([]))
      .finally(() => setLoading(false));
  }, [days]);

  return { earnings, loading };
};

// ============ IPO TRACKER HOOK ============

interface IPO {
  name: string;
  symbol: string;
  priceRange: string;
  lotSize: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  issueSize: string;
  status: 'upcoming' | 'open' | 'listed';
  gmp: number | null;
  subscription: { retail: number; qib: number; nii: number; total: number } | null;
  listingPrice?: number;
  listingGain?: number;
}

export const useIPOs = (status: 'all' | 'upcoming' | 'open' | 'listed' = 'all') => {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/ipos?status=${status}`)
      .then(res => setIpos(res.data.data || []))
      .catch(() => setIpos([]))
      .finally(() => setLoading(false));
  }, [status]);

  return { ipos, loading };
};

// ============ PORTFOLIO HOOK ============

interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice?: number;
  changePercent?: number;
  pnl?: number;
  pnlPercent?: number;
}

interface PortfolioMetrics {
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayPnL: number;
}

export const usePortfolio = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalInvested: 0,
    currentValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    dayPnL: 0
  });
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  // Load portfolio
  const loadPortfolio = useCallback(() => {
    setLoading(true);
    api.get(`/portfolio/${userId}`)
      .then(res => {
        setHoldings(res.data.data?.holdings || []);
        setMetrics(res.data.data?.metrics || metrics);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    loadPortfolio();
    const interval = setInterval(loadPortfolio, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [loadPortfolio]);

  // Add holding
  const addHolding = useCallback(async (holding: Omit<Holding, 'currentPrice' | 'changePercent' | 'pnl' | 'pnlPercent'>) => {
    const newHoldings = [...holdings, holding];
    setHoldings(newHoldings);
    await api.post('/portfolio/save', { userId, holdings: newHoldings });
    loadPortfolio();
  }, [holdings, userId, loadPortfolio]);

  // Remove holding
  const removeHolding = useCallback(async (symbol: string) => {
    const newHoldings = holdings.filter(h => h.symbol !== symbol);
    setHoldings(newHoldings);
    await api.post('/portfolio/save', { userId, holdings: newHoldings });
  }, [holdings, userId]);

  return { holdings, metrics, loading, addHolding, removeHolding, refresh: loadPortfolio };
};

// ============ PRICE ALERTS HOOK ============

interface PriceAlert {
  _id: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  currentPrice?: number;
  isTriggered: boolean;
  percentAway?: string;
}

export const usePriceAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  // Load alerts
  useEffect(() => {
    api.get(`/alerts/${userId}`)
      .then(res => setAlerts(res.data.data || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, [userId]);

  // Create alert
  const createAlert = useCallback(async (symbol: string, targetPrice: number, direction: 'above' | 'below') => {
    const res = await api.post('/alerts/create', { userId, symbol, targetPrice, direction });
    if (res.data.success) {
      setAlerts(prev => [...prev, res.data.data]);
    }
    return res.data;
  }, [userId]);

  // Delete alert
  const deleteAlert = useCallback(async (alertId: string) => {
    await api.delete(`/alerts/${alertId}`);
    setAlerts(prev => prev.filter(a => a._id !== alertId));
  }, []);

  return { alerts, loading, createAlert, deleteAlert };
};

// ============ NEWSLETTER HOOK ============

export const useNewsletter = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = useCallback(async (email: string, preferences?: object) => {
    setLoading(true);
    try {
      const res = await api.post('/newsletter/subscribe', { email, preferences });
      if (res.data.success) {
        setSubscribed(true);
        localStorage.setItem('newsletter_subscribed', 'true');
      }
      return res.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to subscribe' };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSubscribed(localStorage.getItem('newsletter_subscribed') === 'true');
  }, []);

  return { subscribed, loading, subscribe };
};

// ============ SHARE HOOK ============

export const useShare = () => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const share = useCallback(async (data: { title: string; text: string; url: string }) => {
    if (canShare) {
      try {
        await navigator.share(data);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, [canShare]);

  const shareToWhatsApp = useCallback((text: string, url: string) => {
    const message = encodeURIComponent(`${text}\n\n${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }, []);

  const shareToTwitter = useCallback((text: string, url: string) => {
    const tweet = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}&url=${encodeURIComponent(url)}`, '_blank');
  }, []);

  const copyLink = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { canShare, share, shareToWhatsApp, shareToTwitter, copyLink };
};

