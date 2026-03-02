// Watchlist Panel - Shows user's watched stocks
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, TrendingDown, X, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useWatchlist, useStockSearch } from '../hooks/useFeatures';
import { Link } from 'react-router-dom';

interface Props {
  compact?: boolean;
}

export default function WatchlistPanel({ compact = false }: Props) {
  const { stocks, prices, loading, addStock, removeStock } = useWatchlist();
  const { results, search } = useStockSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    search(q);
  };

  const handleAddStock = (symbol: string) => {
    addStock(symbol);
    setSearchQuery('');
    setShowSearch(false);
  };

  if (compact) {
    return (
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-saffron-400" />
            <span className="text-white font-semibold text-sm">Watchlist</span>
          </div>
          <Link to="/watchlist" className="text-saffron-400 text-xs hover:underline">
            View All
          </Link>
        </div>
        
        <div className="space-y-2">
          {stocks.slice(0, 5).map(symbol => {
            const price = prices.find(p => p.symbol === symbol);
            const isPositive = (price?.changePercent || 0) >= 0;
            
            return (
              <Link
                key={symbol}
                to={`/stock/${symbol}`}
                className="flex items-center justify-between p-2 rounded-lg bg-surface-800/50 hover:bg-surface-700/50 transition-colors"
              >
                <span className="text-white font-medium text-sm">{symbol}</span>
                {price && (
                  <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{price.changePercent?.toFixed(1)}%
                  </span>
                )}
              </Link>
            );
          })}
          
          {stocks.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-2">No stocks yet</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-saffron-500/20">
            <Star className="w-5 h-5 text-saffron-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Your Watchlist</h2>
            <p className="text-sm text-gray-400">{stocks.length} stocks tracked</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-xl bg-surface-700 text-gray-400 hover:text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search Box */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search stocks (e.g., Reliance, TCS)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-800 border border-surface-700 text-white placeholder-gray-500 focus:border-saffron-500/50 focus:outline-none"
                autoFocus
              />
            </div>
            
            {results.length > 0 && (
              <div className="mt-2 bg-surface-800 rounded-xl border border-surface-700 overflow-hidden">
                {results.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleAddStock(stock.symbol)}
                    className="w-full flex items-center justify-between p-3 hover:bg-surface-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-saffron-400 font-semibold">{stock.symbol}</span>
                      <span className="text-gray-400 text-sm">{stock.name}</span>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stocks List */}
      {loading ? (
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-700/50 rounded-xl p-4">
              <div className="flex justify-between">
                <div className="h-5 bg-surface-600 rounded w-20"></div>
                <div className="h-5 bg-surface-600 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : stocks.length > 0 ? (
        <div className="space-y-3">
          {stocks.map(symbol => {
            const price = prices.find(p => p.symbol === symbol);
            const isPositive = (price?.changePercent || 0) >= 0;
            
            return (
              <motion.div
                key={symbol}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50 border border-surface-700/50 group"
              >
                <Link to={`/stock/${symbol}`} className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-white font-semibold">{symbol}</span>
                      <p className="text-sm text-gray-400">{price?.name}</p>
                    </div>
                  </div>
                </Link>
                
                <div className="flex items-center gap-4">
                  {price && (
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        ₹{price.price?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                      <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? '+' : ''}{price.changePercent?.toFixed(2)}%
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => removeStock(symbol)}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Your watchlist is empty</p>
          <button
            onClick={() => setShowSearch(true)}
            className="text-saffron-400 hover:underline text-sm"
          >
            Add stocks to track
          </button>
        </div>
      )}
    </div>
  );
}

