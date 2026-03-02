import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { searchNews } from '../services/api';
import type { NewsArticle } from '../types';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const doSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await searchNews(query);
        setResults(res.data);
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [query]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon className="text-saffron-500" size={28} />
            <h1 className="text-3xl font-bold text-white">Search Results</h1>
          </div>
          {query && (
            <p className="text-gray-400">
              {loading ? 'Searching...' : `Found ${results.length} results for "${query}"`}
            </p>
          )}
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

        {!loading && results.length === 0 && query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
            <p className="text-gray-400">Try different keywords or check your spelling</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((article, i) => (
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
        )}
      </div>
    </div>
  );
}

