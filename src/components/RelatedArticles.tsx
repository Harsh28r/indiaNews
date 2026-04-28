// Related Articles Component
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRelatedArticles } from '../hooks/useFeatures';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  articleId: string;
}

export default function RelatedArticles({ articleId }: Props) {
  const { articles, loading } = useRelatedArticles(articleId);

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-surface-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-saffron-400" />
          Related Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-700/50 rounded-xl h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 pt-8 border-t border-surface-700"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-saffron-400" />
        Related Articles
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article, i) => (
          <motion.div
            key={article.article_id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/article/${article.article_id}`}
              state={{ article }}
              className="flex gap-4 p-4 rounded-xl bg-surface-700/30 hover:bg-surface-700/50 transition-colors group"
            >
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium line-clamp-2 group-hover:text-saffron-400 transition-colors">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {article.pubDate && formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

