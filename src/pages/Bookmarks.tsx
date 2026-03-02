// Bookmarks Page
import { motion } from 'framer-motion';
import { Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../hooks/useFeatures';
import NewsCard from '../components/NewsCard';

export default function Bookmarks() {
  const { articles, loading, removeBookmark } = useBookmarks();

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
              <Bookmark className="w-6 h-6 text-saffron-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bookmarks</h1>
              <p className="text-sm text-gray-400">{articles.length} saved articles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-800 rounded-2xl h-80"></div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <motion.div
                key={article.article_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <NewsCard article={article} />
                <button
                  onClick={() => removeBookmark(article.article_id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Bookmark className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">No bookmarks yet</h2>
            <p className="text-gray-400 mb-6">Save articles to read them later</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-500 text-white font-semibold hover:bg-saffron-600 transition-colors"
            >
              Browse News
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}

