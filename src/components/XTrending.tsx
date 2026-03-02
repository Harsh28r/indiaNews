// Trending Topics Component - FREE Real-Time (Google Trends + Scraping)
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, ExternalLink, Hash, Users, RefreshCw, Zap, Globe } from 'lucide-react';
import api from '../services/api';

interface TrendingTopic {
  name: string;
  tweet_volume: number | null;
  url: string;
  category?: string;
  rank?: number;
  image?: string | null;
  articles?: Array<{ title: string; source: string; url: string }>;
}

interface TrendingResponse {
  success: boolean;
  data: TrendingTopic[];
  source?: 'google_trends' | 'google_realtime' | 'trends24' | 'fallback' | 'cached';
  cached?: boolean;
  location?: string;
  updatedAt?: string;
}

export default function XTrending() {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchTrends = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const res = await api.get<TrendingResponse>('/x/trending');
      setTrends(res.data.data || []);
      setSource(res.data.source || (res.data.cached ? 'cached' : 'unknown'));
      // Live if from Google Trends or trends24 (real-time free sources)
      setIsLive(['google_trends', 'google_realtime', 'trends24'].includes(res.data.source || ''));
      setLastUpdated(res.data.updatedAt ? new Date(res.data.updatedAt) : new Date());
    } catch {
      setTrends(getMockTrends());
      setSource('offline');
      setIsLive(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends(false);
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => fetchTrends(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTrends]);

  const formatVolume = (volume: number | null) => {
    if (!volume) return '';
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M posts`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K posts`;
    return `${volume} posts`;
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getSourceLabel = () => {
    switch (source) {
      case 'google_trends': return 'Google Trends';
      case 'google_realtime': return 'Google Real-time';
      case 'trends24': return 'Trends24';
      case 'cached': return 'Cached';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-white">Trending in India</span>
        </div>
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-surface-700 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-surface-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-white">Trending India</span>
          {isLive && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full">
              <Zap className="w-3 h-3" />
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTrends(true)}
            disabled={refreshing}
            className="p-1.5 hover:bg-surface-600 rounded-lg transition-colors"
            title="Refresh trends"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Last updated timestamp & source */}
      {lastUpdated && (
        <p className="text-[10px] text-gray-600 mb-3 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {formatTimeAgo(lastUpdated)}
          {getSourceLabel() && ` • ${getSourceLabel()}`}
        </p>
      )}

      <div className="space-y-1">
        {trends.slice(0, 8).map((trend, i) => (
          <motion.a
            key={trend.name}
            href={trend.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-700/50 transition-colors group"
          >
            <span className="text-sm text-gray-500 w-5">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                {trend.name.startsWith('#') ? (
                  <Hash className="w-3 h-3 text-[#1DA1F2]" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-gray-500" />
                )}
                <span className="font-medium text-white group-hover:text-[#1DA1F2] transition-colors truncate">
                  {trend.name.replace('#', '')}
                </span>
              </div>
              {trend.category && (
                <p className="text-xs text-gray-500">{trend.category}</p>
              )}
              {trend.tweet_volume && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Users className="w-3 h-3" />
                  {formatVolume(trend.tweet_volume)}
                </p>
              )}
            </div>
            <ExternalLink className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

// Mock trending topics for Indian stock market
function getMockTrends(): TrendingTopic[] {
  const trends = [
    { name: '#Nifty50', tweet_volume: 125000, category: 'Business & Finance', url: 'https://twitter.com/search?q=%23Nifty50' },
    { name: '#Sensex', tweet_volume: 98000, category: 'Business & Finance', url: 'https://twitter.com/search?q=%23Sensex' },
    { name: 'Reliance', tweet_volume: 45000, category: 'Business & Finance', url: 'https://twitter.com/search?q=Reliance' },
    { name: '#StockMarket', tweet_volume: 230000, category: 'Business & Finance', url: 'https://twitter.com/search?q=%23StockMarket' },
    { name: 'Adani', tweet_volume: 180000, category: 'Trending in India', url: 'https://twitter.com/search?q=Adani' },
    { name: '#BankNifty', tweet_volume: 52000, category: 'Business & Finance', url: 'https://twitter.com/search?q=%23BankNifty' },
    { name: 'TCS Results', tweet_volume: 28000, category: 'Business & Finance', url: 'https://twitter.com/search?q=TCS%20Results' },
    { name: '#Trading', tweet_volume: 320000, category: 'Business & Finance', url: 'https://twitter.com/search?q=%23Trading' },
    { name: 'HDFC Bank', tweet_volume: 15000, category: 'Business & Finance', url: 'https://twitter.com/search?q=HDFC%20Bank' },
    { name: '#MarketUpdate', tweet_volume: 42000, category: 'Business & Finance', url: 'https://twitter.com/search?q=%23MarketUpdate' },
  ];
  
  // Randomize volumes slightly
  return trends.map(t => ({
    ...t,
    tweet_volume: t.tweet_volume ? t.tweet_volume + Math.floor(Math.random() * 10000) : null
  }));
}

