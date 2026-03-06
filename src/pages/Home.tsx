import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, TrendingUp, Briefcase, Globe, Film, Vote, Plane, Trophy, Smartphone, Sparkles, Flame } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import MarketWidget from '../components/MarketWidget';
import XTrending from '../components/XTrending';
import MarketMovers from '../components/MarketMovers';
import FIIDIIData from '../components/FIIDIIData';
import VideoSection from '../components/VideoSection';
import TrendingTopics from '../components/TrendingTopics';
import LiveActivity from '../components/LiveActivity';
import SocialProof from '../components/SocialProof';
import FakeAd from '../components/FakeAd';
import { fetchNews, fetchTrendingNews, fetchByCategory } from '../services/api';
import type { NewsArticle } from '../types';

const CATEGORIES = [
  { id: 'all', name: 'For You', icon: Sparkles },
  { id: 'trending', name: 'Trending', icon: Flame },
  { id: 'markets', name: 'Markets', icon: TrendingUp },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'entertainment', name: 'Entertainment', icon: Film },
  { id: 'politics', name: 'Politics', icon: Vote },
  { id: 'india', name: 'India', icon: Globe },
  { id: 'world', name: 'World', icon: Plane },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'tech', name: 'Tech', icon: Smartphone },
];

export default function Home() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [trending, setTrending] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setPage] = useState(1); // Using functional update pattern
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Infinite scroll ref
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadData = async (pageNum = 1, category = activeCategory) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      let newsRes;
      if (category === 'all') {
        newsRes = await fetchNews(pageNum, 12);
      } else {
        newsRes = await fetchByCategory(category, pageNum, 12);
      }
      
      const trendingRes = pageNum === 1 ? await fetchTrendingNews() : { data: trending };
      
      const newArticles = newsRes.data || [];
      
      // Check if there are more articles
      setHasMore(newArticles.length >= 12);
      
      if (pageNum === 1) {
        setNews(newArticles);
        setTrending(trendingRes.data || []);
      } else {
        setNews(prev => [...prev, ...newArticles]);
      }
    } catch (err) {
      setError('Failed to load news. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadData(1, activeCategory);
  }, [activeCategory]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
      setPage(prev => {
        const nextPage = prev + 1;
        loadData(nextPage, activeCategory);
        return nextPage;
      });
    }
  }, [hasMore, loading, loadingMore, activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px', // Load 200px before reaching bottom
      threshold: 0,
    });
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const featured = trending[0];
  const sideNews = trending.slice(1, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-saffron-500/5 via-transparent to-green-india/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-india/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-tricolor">Indian Market</span>
              <span className="text-white"> Intelligence</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real-time news, analysis, and insights from NSE, BSE, and beyond
            </p>
          </motion.div>

          {/* Market Widget - Live Indices */}
          <MarketWidget />

          {/* Featured Grid */}
          {trending.length > 0 && (
            <div className="grid lg:grid-cols-3 gap-6">
              {featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2"
                >
                  <NewsCard article={featured} variant="featured" />
                </motion.div>
              )}
              <div className="space-y-4">
                {sideNews.map((article, i) => (
                  <motion.div
                    key={article.article_id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <NewsCard article={article} variant="compact" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Video News Section */}
      {/* <VideoSection /> */}

      {/* Main News Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Latest News</h2>
              <button
                onClick={() => loadData(1, activeCategory)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg text-sm text-gray-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === id
                      ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-surface-900 shadow-lg'
                      : 'bg-surface-700/50 text-gray-400 hover:bg-surface-600 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Social Proof Banner */}
          <div className="mb-6">
            <SocialProof variant="banner" />
          </div>

          <div className="flex gap-6">
            {/* Main News Grid */}
            <div className="flex-1">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, i) => (
                  <React.Fragment key={article.article_id}>
                    {i === 6 && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <FakeAd variant="banner" />
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <NewsCard article={article} />
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>

              {loading && (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Infinite Scroll Loader */}
              <div ref={loaderRef} className="py-10">
                {loadingMore && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 p-6 bg-surface-800/50 rounded-2xl border border-surface-700/50 max-w-sm mx-auto"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 border-3 border-saffron-500/30 rounded-full" />
                      <div className="absolute inset-0 w-12 h-12 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">Loading more news</p>
                      <p className="text-sm text-gray-500">Please wait...</p>
                    </div>
                  </motion.div>
                )}
                
                {!hasMore && news.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 px-4 bg-surface-800/30 rounded-xl max-w-md mx-auto"
                  >
                    <span className="text-2xl mb-2 block">🎉</span>
                    <span className="text-gray-400">You've reached the end!</span>
                    <p className="text-sm text-gray-500 mt-1">Check back later for more updates</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Market Data */}
            <aside className="hidden xl:block w-80 shrink-0">
              <div className="sticky top-24 space-y-6">
                <MarketMovers />
                <FIIDIIData />
                <TrendingTopics />
                <FakeAd variant="sidebar" category="finance" />
                <LiveActivity />
                <FakeAd variant="sidebar" category="tech" />
                <XTrending />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Video Section - At the end */}
      <VideoSection />
    </div>
  );
}

