import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, RefreshCw, AlertCircle } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { fetchTrendingNews } from '../services/api';
import type { NewsArticle } from '../types';

export default function Trending() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchTrendingNews();
      setNews(res.data);
    } catch (err) {
      setError('Failed to load trending news.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Flame className="text-saffron-500" size={28} />
              <h1 className="text-3xl font-bold text-white">Trending Now</h1>
            </div>
            <p className="text-gray-400">Most popular stories right now</p>
          </div>
          <button
            onClick={loadTrending}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg text-sm text-gray-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </motion.div>

        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && news.length > 0 && (
          <>
            {/* Featured */}
            {news[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <NewsCard article={news[0]} variant="featured" />
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {news.slice(1).map((article, i) => (
                <motion.div
                  key={article.article_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {!loading && news.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-xl font-semibold text-white mb-2">No trending news yet</h2>
            <p className="text-gray-400">Check back later for trending stories</p>
          </div>
        )}
      </div>
    </div>
  );
}

