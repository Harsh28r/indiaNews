// Watchlist Page - Full watchlist with news
import { motion } from 'framer-motion';
import { Star, Newspaper } from 'lucide-react';
import WatchlistPanel from '../components/WatchlistPanel';
import { useWatchlistNews } from '../hooks/useFeatures';
import NewsCard from '../components/NewsCard';

export default function Watchlist() {
  const { articles, loading: newsLoading } = useWatchlistNews();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="glass border-b border-surface-700/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-saffron-500/20">
              <Star className="w-6 h-6 text-saffron-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Watchlist</h1>
              <p className="text-sm text-gray-400">Track your favorite stocks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Watchlist Panel */}
          <div className="lg:col-span-1">
            <WatchlistPanel />
          </div>

          {/* News for Watchlist */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="w-5 h-5 text-saffron-400" />
              <h2 className="text-xl font-bold text-white">News about your stocks</h2>
            </div>

            {newsLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface-800 rounded-xl h-24"></div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article, i) => (
                  <motion.div
                    key={article.article_id || i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NewsCard article={article} variant="compact" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-surface-800/50 rounded-2xl">
                <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Add stocks to your watchlist to see related news</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

