// Shorts Section - Short-form video/news content
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Eye, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTrendingNews } from '../services/api';
import type { NewsArticle } from '../types';

interface ShortItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  article?: NewsArticle;
}

export default function ShortsSection() {
  const [shorts, setShorts] = useState<ShortItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadShorts = async () => {
      try {
        setLoading(true);
        const res = await fetchTrendingNews(1, 12);
        if (res.data) {
          // Convert news articles to short items
          const shortItems: ShortItem[] = res.data
            .filter(item => item.image_url)
            .slice(0, 8)
            .map((article, index) => ({
              id: article.article_id || `short-${index}`,
              title: article.title.length > 60 ? article.title.slice(0, 60) + '...' : article.title,
              thumbnail: article.image_url || '',
              duration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
              views: formatViews(Math.floor(Math.random() * 50000) + 5000),
              category: article.category?.[0] || 'News',
              article
            }));
          setShorts(shortItems);
        }
      } catch (err) {
        // Fallback shorts
        setShorts([
          {
            id: '1',
            title: 'Stock Market Hits Record High - What You Need to Know',
            thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
            duration: '2:15',
            views: '45.2K',
            category: 'Markets'
          },
          {
            id: '2',
            title: 'Tech Giants Announce Major AI Breakthrough',
            thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
            duration: '1:45',
            views: '38.7K',
            category: 'Tech'
          },
          {
            id: '3',
            title: 'Crypto Market Analysis - Expert Predictions',
            thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
            duration: '2:30',
            views: '52.1K',
            category: 'Crypto'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadShorts();
  }, []);

  const formatViews = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const nextShorts = () => {
    setCurrentIndex(prev => Math.min(prev + 4, shorts.length - 4));
  };

  const prevShorts = () => {
    setCurrentIndex(prev => Math.max(prev - 4, 0));
  };

  const visibleShorts = shorts.slice(currentIndex, currentIndex + 4);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-saffron-400" />
          <h2 className="text-xl font-bold text-white">Shorts</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-700/50 rounded-xl aspect-[9/16]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-saffron-400" />
          <h2 className="text-xl font-bold text-white">Shorts</h2>
          <span className="text-xs text-gray-400 bg-surface-700 px-2 py-1 rounded-full">
            {shorts.length} videos
          </span>
        </div>
        {shorts.length > 4 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevShorts}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={nextShorts}
              disabled={currentIndex >= shorts.length - 4}
              className="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleShorts.map((short, index) => {
          const articleId = short.article?.article_id || short.id;
          return (
            <motion.div
              key={short.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/article/${articleId}`}
                state={{ article: short.article }}
                className="group relative block aspect-[9/16] rounded-xl overflow-hidden bg-surface-700"
              >
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/400x700/1a1a2e/ff9933?text=${encodeURIComponent(short.title.slice(0, 20))}`;
                  }}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {short.duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-saffron-500/90 rounded text-white text-xs font-semibold">
                  {short.category}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-saffron-400 transition-colors">
                    {short.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Eye className="w-3 h-3" />
                    <span>{short.views} views</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View All Link */}
      <div className="mt-6 text-center">
        <Link
          to="/shorts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-saffron-500/20 hover:bg-saffron-500/30 text-saffron-400 rounded-lg text-sm font-medium transition-colors"
        >
          View All Shorts
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

