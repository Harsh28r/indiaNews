// Breaking News Banner - Scrolling Alert Strip
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTrendingNews } from '../services/api';

interface BreakingArticle {
  article_id: string | null;
  link?: string | null;
  title: string;
  isBreaking: boolean;
  priority: 'high' | 'normal';
  pubDate: string;
}

export default function BreakingNewsBanner() {
  const [news, setNews] = useState<BreakingArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasBreaking, setHasBreaking] = useState(false);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        // Fetch trending news (this works reliably)
        const trendingRes = await fetchTrendingNews();
        
        if (trendingRes.success && trendingRes.data?.length > 0) {
          const urgentKeywords = ['breaking', 'urgent', 'flash', 'just in', 'alert', 'crash', 'surge', 'plunge', 'record', 'rbi', 'sebi'];
          
          const latestNews = trendingRes.data.slice(0, 5).map((article: any) => {
            const titleLower = article.title?.toLowerCase() || '';
            const isUrgent = urgentKeywords.some(k => titleLower.includes(k));
            
            // Use article_id if available, otherwise use link as external URL
            const hasArticleId = article.article_id && article.article_id !== 'welcome';
            
            return {
              article_id: hasArticleId ? article.article_id : null,
              link: article.link || null,
              title: article.title,
              isBreaking: isUrgent,
              priority: isUrgent ? 'high' as const : 'normal' as const,
              pubDate: article.pubDate
            };
          });
          
          setNews(latestNews);
          setHasBreaking(latestNews.some((n: BreakingArticle) => n.isBreaking));
          return;
        }
        
        // Fallback welcome message
        setNews([{
          article_id: 'welcome',
          title: '📰 Welcome to CoinsClarity Daily - Your Daily Dose of News | Markets • Crypto • Business • Tech • Entertainment',
          isBreaking: false,
          priority: 'normal',
          pubDate: new Date().toISOString()
        }]);
      } catch (error) {
        console.error('Failed to fetch breaking news:', error);
        setNews([{
          article_id: 'welcome',
          title: '📰 CoinsClarity Daily - Stay informed with Markets, Business, Tech & Entertainment news',
          isBreaking: false,
          priority: 'normal',
          pubDate: new Date().toISOString()
        }]);
      }
    };

    fetchBreaking();
    const interval = setInterval(fetchBreaking, 5 * 60 * 1000); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  // Rotate through news items
  useEffect(() => {
    if (news.length <= 1) return;
    
    const rotateInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(rotateInterval);
  }, [news.length]);

  if (!isVisible || news.length === 0) return null;

  const currentNews = news[currentIndex];
  const isUrgent = currentNews?.isBreaking || hasBreaking;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`relative overflow-hidden ${
          isUrgent 
            ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600' 
            : 'bg-gradient-to-r from-saffron-600 via-saffron-500 to-saffron-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 relative z-10">
          <div className="flex items-center justify-between gap-4">
            {/* Breaking Label */}
            <div className="flex items-center gap-2 shrink-0">
              {isUrgent ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-md"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Breaking</span>
                </motion.div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-md">
                  <Bell className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Latest</span>
                </div>
              )}
            </div>

            {/* News Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentNews?.article_id ? (
                    // Internal link to article page
                    <Link 
                      to={`/article/${currentNews.article_id}`}
                      state={{ article: currentNews }}
                      className="flex items-center gap-2 group cursor-pointer"
                    >
                      <p className="text-sm text-white font-medium truncate group-hover:underline">
                        {currentNews?.title}
                      </p>
                      <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
                    </Link>
                  ) : currentNews?.link ? (
                    // External link to source
                    <a 
                      href={currentNews.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 group cursor-pointer"
                    >
                      <p className="text-sm text-white font-medium truncate group-hover:underline">
                        {currentNews?.title}
                      </p>
                      <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
                    </a>
                  ) : (
                    // No link, just text
                    <p className="text-sm text-white font-medium truncate">
                      {currentNews?.title}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            {news.length > 1 && (
              <div className="flex items-center gap-1 shrink-0">
                {news.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors shrink-0 z-10 cursor-pointer"
              aria-label="Close banner"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Animated Background Pulse for Breaking */}
        {isUrgent && (
          <motion.div
            className="absolute inset-0 bg-white/10 pointer-events-none"
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

