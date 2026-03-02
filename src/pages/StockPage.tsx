// Stock Page - "Why is X moving?" feature
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Star, StarOff, ExternalLink, Clock, Newspaper } from 'lucide-react';
import { useStockNews, useWatchlist } from '../hooks/useFeatures';
import NewsCard from '../components/NewsCard';
import SentimentBadge from '../components/SentimentBadge';
import { formatDistanceToNow } from 'date-fns';

export default function StockPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { stock, price, articles, loading } = useStockNews(symbol);
  const { isWatching, addStock, removeStock } = useWatchlist();
  
  const watching = symbol ? isWatching(symbol) : false;
  const isPositive = (price?.changePercent || 0) >= 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-4">Stock Not Found</h1>
        <Link to="/" className="text-saffron-400 hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="glass border-b border-surface-700/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 rounded-xl bg-surface-700/50 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-saffron-400">{stock.symbol}</h1>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{stock.name}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => watching ? removeStock(stock.symbol) : addStock(stock.symbol)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                watching 
                  ? 'bg-saffron-500/20 text-saffron-400' 
                  : 'bg-surface-700 text-gray-400 hover:text-white'
              }`}
            >
              {watching ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
              <span>{watching ? 'Watching' : 'Watch'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Price Card */}
        {price && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 mb-2">Current Price</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-white">
                    ₹{price.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                  <span className={`flex items-center gap-1 text-xl font-semibold ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {isPositive ? '+' : ''}{price.changePercent?.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {price.exchange} • {price.isMock ? 'Demo data' : 'Live'}
                </p>
              </div>

              <div className={`p-4 rounded-2xl ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {isPositive ? (
                  <TrendingUp className="w-10 h-10 text-green-400" />
                ) : (
                  <TrendingDown className="w-10 h-10 text-red-400" />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* News Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Newspaper className="w-6 h-6 text-saffron-400" />
            <h2 className="text-2xl font-bold text-white">
              Why is {stock.symbol} moving?
            </h2>
          </div>
          
          <p className="text-gray-400 mb-6">
            {articles.length} news articles found about {stock.name}
          </p>
        </div>

        {/* News Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <motion.div
                key={article.article_id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NewsCard article={article} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No recent news found for {stock.name}</p>
            <p className="text-gray-500 text-sm">Check back later for updates</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

