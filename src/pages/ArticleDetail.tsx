import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { fetchArticle } from '../services/api';
import type { NewsArticle } from '../types';
import { useArticleSummary, useArticleStocks, useRelatedArticles } from '../hooks/useFeatures';
import TLDRBox from '../components/TLDRBox';
import StockPill from '../components/StockPill';
import ArticleActions from '../components/ArticleActions';
import RelatedArticles from '../components/RelatedArticles';
import ReadingTime, { getReadingTime } from '../components/ReadingTime';
import NewsletterBox from '../components/NewsletterBox';

// Format article content with proper structure
const formatArticleContent = (content: string) => {
  if (!content) return null;
  
  // Split by newlines only - simpler and safer
  const lines = content
    .replace(/\r\n/g, '\n')
    .split(/\n+/)
    .map(l => l.trim())
    .filter(l => l.length > 0);
  
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let key = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key++} className="list-none space-y-3 my-6 pl-0">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-saffron-500 mt-2 flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3) return;

    // Detect bullet points (*, •, -, ►, ▪, →)
    const bulletMatch = trimmed.match(/^[\*\•\-\►\▪\→]\s*(.+)/);
    if (bulletMatch) {
      currentList.push(bulletMatch[1]);
      return;
    }

    // Flush any pending list before other elements
    flushList();

    // Detect headings (ends with : and short, or all caps, or question)
    const isHeading = 
      (trimmed.endsWith(':') && trimmed.length < 100 && !trimmed.includes('.')) ||
      (trimmed === trimmed.toUpperCase() && trimmed.length > 5 && trimmed.length < 80 && /^[A-Z\s]+$/.test(trimmed)) ||
      (trimmed.endsWith('?') && trimmed.length < 120);
    
    if (isHeading) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-saffron-500 rounded-full"></span>
          {trimmed.replace(/:$/, '')}
        </h3>
      );
      return;
    }

    // Detect key stats/numbers (lines with currency or percentages, but not too long)
    const hasStats = /(\$[\d,]+|₹[\d,\s]+|Rs\.?\s*[\d,\s]+lakh|Rs\.?\s*[\d,\s]+crore|\d+(\.\d+)?%)/.test(trimmed);
    if (hasStats && trimmed.length < 200 && trimmed.length > 15) {
      elements.push(
        <div key={key++} className="bg-gradient-to-r from-surface-700/80 to-surface-700/40 rounded-xl p-4 my-4 border-l-4 border-saffron-500">
          <p className="text-white font-medium">{trimmed}</p>
        </div>
      );
      return;
    }

    // Regular paragraph (only if substantial)
    if (trimmed.length > 30) {
      elements.push(
        <p key={key++} className="text-gray-300 leading-relaxed mb-5">
          {trimmed}
        </p>
      );
    }
  });

  // Flush any remaining list
  flushList();

  return elements.length > 0 ? elements : <p className="text-gray-400">Content not available.</p>;
};

export default function ArticleDetail() {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetchArticle(articleId);
        setArticle(res.data);
      } catch (err) {
        setError('Article not found or failed to load.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [articleId]);

  // Use custom hooks for article features
  const { summary, sentiment, loading: summaryLoading } = useArticleSummary(articleId);
  const { stocks, loading: stocksLoading } = useArticleStocks(articleId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-6">📰</div>
        <h1 className="text-2xl font-bold text-white mb-2">Article Not Found</h1>
        <p className="text-gray-400 mb-6">{error || "The article you're looking for doesn't exist."}</p>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-saffron-500 hover:bg-saffron-600 text-surface-900 font-semibold rounded-xl transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    );
  }

  const formattedDate = article.pubDate
    ? format(new Date(article.pubDate), 'MMMM d, yyyy • h:mm a')
    : '';

  const fallbackImage = `https://placehold.co/1200x600/1a1a2e/ff9933?text=${encodeURIComponent(
    article.source_name || 'News'
  )}`;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Header Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={article.image_url || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/50 to-transparent" />
        
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 glass rounded-xl text-white hover:bg-surface-700/50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Actions */}
        <div className="absolute top-6 right-6">
          {article && (
            <ArticleActions
              articleId={article.article_id}
              title={article.title}
              content={`${article.title}. ${article.description || ''}`}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10 pb-16">
        <div className="bg-surface-800 rounded-2xl p-8 border border-surface-700/50 shadow-2xl">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-saffron-500/20 text-saffron-400 rounded-full border border-saffron-500/30">
            {article.category?.[0] || 'Finance'}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-400 border-b border-surface-700 pb-6">
            {article.creator?.[0] && (
              <span className="flex items-center gap-2">
                <User size={16} />
                {article.creator[0]}
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {formattedDate}
              </span>
            )}
            <ReadingTime 
              minutes={getReadingTime(`${article.title} ${article.description || ''} ${article.content || ''}`)} 
            />
          </div>

          {/* Description - shown as lead */}
          {article.description && (
            <p className="text-xl text-gray-300 mb-8 leading-relaxed font-medium border-l-4 border-saffron-500 pl-4">
              {article.description}
            </p>
          )}

          {/* TLDR Box - AI Summary */}
          {(summary.length > 0 || summaryLoading) && (
            <div className="mb-8">
              <TLDRBox summary={summary} sentiment={sentiment} loading={summaryLoading} />
            </div>
          )}

          {/* Stock Mentions */}
          {stocks.prices.length > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-surface-700/30 border border-surface-700/50">
              <p className="text-sm text-gray-400 mb-3">📈 Stocks mentioned in this article:</p>
              <div className="flex flex-wrap gap-2">
                {stocks.prices.map((stock) => (
                  <Link key={stock.symbol} to={`/stock/${stock.symbol}`}>
                    <StockPill
                      symbol={stock.symbol}
                      name={stock.name}
                      price={stock.price}
                      changePercent={stock.changePercent}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Full Content - Formatted */}
          {article.content ? (
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              {formatArticleContent(article.content)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Loading full article content...</p>
            </div>
          )}

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.keywords.slice(0, 10).map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-surface-700 text-gray-400 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}

          {/* Actions & Back */}
          <div className="flex items-center justify-between pt-6 border-t border-surface-700">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 text-surface-900 font-semibold rounded-xl transition-all"
            >
              <ArrowLeft size={18} />
              More News
            </Link>
            <ArticleActions
              articleId={article.article_id}
              title={article.title}
              content={article.content || article.description || ''}
            />
          </div>

          {/* Related Articles */}
          <RelatedArticles articleId={article.article_id} />

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-surface-700">
            <NewsletterBox />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

