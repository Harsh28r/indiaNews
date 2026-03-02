// Portfolio Tracker Page
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, TrendingUp, TrendingDown, RefreshCw, Trash2, Search, X } from 'lucide-react';
import { usePortfolio, useStockSearch } from '../hooks/useFeatures';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const { holdings, metrics, loading, addHolding, removeHolding, refresh } = usePortfolio();
  const { results, search } = useStockSearch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHolding, setNewHolding] = useState({ symbol: '', name: '', quantity: 0, buyPrice: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    search(q);
  };

  const selectStock = (symbol: string, name: string) => {
    setNewHolding({ ...newHolding, symbol, name });
    setSearchQuery('');
  };

  const handleAddHolding = () => {
    if (newHolding.symbol && newHolding.quantity > 0 && newHolding.buyPrice > 0) {
      addHolding(newHolding);
      setNewHolding({ symbol: '', name: '', quantity: 0, buyPrice: 0 });
      setShowAddModal(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="glass border-b border-surface-700/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-saffron-500/20">
                <Briefcase className="w-6 h-6 text-saffron-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Portfolio</h1>
                <p className="text-sm text-gray-400">Track your investments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="p-2 rounded-xl bg-surface-700 text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500 text-surface-900 font-semibold hover:bg-saffron-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Stock
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-800 rounded-2xl p-5 border border-surface-700/50">
            <p className="text-sm text-gray-400 mb-1">Invested</p>
            <p className="text-2xl font-bold text-white">
              ₹{metrics.totalInvested.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-surface-800 rounded-2xl p-5 border border-surface-700/50">
            <p className="text-sm text-gray-400 mb-1">Current Value</p>
            <p className="text-2xl font-bold text-white">
              ₹{metrics.currentValue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className={`rounded-2xl p-5 border ${
            metrics.totalPnL >= 0 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <p className="text-sm text-gray-400 mb-1">Total P&L</p>
            <div className="flex items-center gap-2">
              {metrics.totalPnL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <p className={`text-2xl font-bold ${metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.totalPnL >= 0 ? '+' : ''}₹{metrics.totalPnL.toLocaleString('en-IN')}
              </p>
            </div>
            <p className={`text-sm ${metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ({metrics.totalPnL >= 0 ? '+' : ''}{metrics.totalPnLPercent.toFixed(2)}%)
            </p>
          </div>
          <div className={`rounded-2xl p-5 border ${
            metrics.dayPnL >= 0 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <p className="text-sm text-gray-400 mb-1">Today's P&L</p>
            <p className={`text-2xl font-bold ${metrics.dayPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.dayPnL >= 0 ? '+' : ''}₹{metrics.dayPnL.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Holdings */}
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-800 rounded-xl h-20"></div>
            ))}
          </div>
        ) : holdings.length > 0 ? (
          <div className="bg-surface-800 rounded-2xl border border-surface-700/50 overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 bg-surface-700/30 text-sm text-gray-400 font-medium">
              <span>Stock</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Avg Price</span>
              <span className="text-right">LTP</span>
              <span className="text-right">P&L</span>
              <span></span>
            </div>
            
            {holdings.map((holding, i) => {
              const pnl = holding.pnl || 0;
              const pnlPercent = holding.pnlPercent || 0;
              
              return (
                <motion.div
                  key={holding.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-6 gap-4 p-4 border-t border-surface-700/50 items-center group"
                >
                  <Link to={`/stock/${holding.symbol}`} className="hover:text-saffron-400 transition-colors">
                    <span className="font-semibold text-white">{holding.symbol}</span>
                    <p className="text-xs text-gray-500 truncate">{holding.name}</p>
                  </Link>
                  <span className="text-right text-white">{holding.quantity}</span>
                  <span className="text-right text-white">₹{holding.buyPrice.toLocaleString('en-IN')}</span>
                  <span className="text-right text-white">₹{holding.currentPrice?.toLocaleString('en-IN') || '-'}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN')}
                    </span>
                    <p className={`text-xs ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ({pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                    </p>
                  </div>
                  <button
                    onClick={() => removeHolding(holding.symbol)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-800/50 rounded-2xl">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No holdings yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-xl bg-saffron-500 text-surface-900 font-semibold hover:bg-saffron-600 transition-colors"
            >
              Add Your First Stock
            </button>
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-800 rounded-2xl p-6 w-full max-w-md border border-surface-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Stock</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg bg-surface-700 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Stock Search */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Stock</label>
                {newHolding.symbol ? (
                  <div className="flex items-center justify-between p-3 bg-surface-700 rounded-xl">
                    <div>
                      <span className="text-saffron-400 font-semibold">{newHolding.symbol}</span>
                      <span className="text-gray-400 text-sm ml-2">{newHolding.name}</span>
                    </div>
                    <button
                      onClick={() => setNewHolding({ ...newHolding, symbol: '', name: '' })}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search stocks..."
                      className="w-full pl-10 pr-4 py-3 bg-surface-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                    />
                    {results.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-surface-700 rounded-xl border border-surface-600 overflow-hidden z-10">
                        {results.map(stock => (
                          <button
                            key={stock.symbol}
                            onClick={() => selectStock(stock.symbol, stock.name)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-surface-600 transition-colors text-left"
                          >
                            <span className="text-saffron-400 font-semibold">{stock.symbol}</span>
                            <span className="text-gray-400 text-sm">{stock.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newHolding.quantity || ''}
                  onChange={(e) => setNewHolding({ ...newHolding, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="Number of shares"
                  className="w-full px-4 py-3 bg-surface-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                />
              </div>

              {/* Buy Price */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Average Buy Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newHolding.buyPrice || ''}
                  onChange={(e) => setNewHolding({ ...newHolding, buyPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="Price per share"
                  className="w-full px-4 py-3 bg-surface-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                />
              </div>

              {/* Total Value */}
              {newHolding.quantity > 0 && newHolding.buyPrice > 0 && (
                <div className="p-4 bg-surface-700/50 rounded-xl">
                  <p className="text-sm text-gray-400">Total Invested</p>
                  <p className="text-xl font-bold text-white">
                    ₹{(newHolding.quantity * newHolding.buyPrice).toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              <button
                onClick={handleAddHolding}
                disabled={!newHolding.symbol || newHolding.quantity <= 0 || newHolding.buyPrice <= 0}
                className="w-full py-3 rounded-xl bg-saffron-500 text-surface-900 font-semibold hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Portfolio
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

