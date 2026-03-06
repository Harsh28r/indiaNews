// Trending Topics Widget
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTrendingNews } from '../services/api';

export default function TrendingTopics() {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const res = await fetchTrendingNews();
        if (res.data) {
          // Extract keywords/topics from trending articles
          const allKeywords = res.data
            .flatMap(article => article.keywords || [])
            .filter((kw, index, self) => self.indexOf(kw) === index)
            .slice(0, 10);
          
          setTopics(allKeywords);
        }
      } catch (err) {
        // Fallback topics
        setTopics(['Markets', 'Stocks', 'Business', 'Tech', 'Entertainment', 'Sports', 'Politics', 'India', 'World']);
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-saffron-400" />
          <h3 className="font-bold text-white">Trending Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse h-8 w-20 bg-surface-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-saffron-400" />
        <h3 className="font-bold text-white">Trending Topics</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <Link
            key={index}
            to={`/search?q=${encodeURIComponent(topic)}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-700/50 hover:bg-saffron-500/20 text-gray-300 hover:text-saffron-400 rounded-lg text-sm transition-colors"
          >
            <Hash className="w-3 h-3" />
            {topic}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

