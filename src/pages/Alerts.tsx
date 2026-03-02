// Price Alerts Page
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Search, X, AlertTriangle } from 'lucide-react';
import { usePriceAlerts, useStockSearch } from '../hooks/useFeatures';
import { Link } from 'react-router-dom';

export default function Alerts() {
  const { alerts, loading, createAlert, deleteAlert } = usePriceAlerts();
  const { results, search } = useStockSearch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlert, setNewAlert] = useState({ symbol: '', targetPrice: 0, direction: 'above' as 'above' | 'below' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    search(q);
  };

  const selectStock = (symbol: string) => {
    setNewAlert({ ...newAlert, symbol });
    setSearchQuery('');
  };

  const handleCreateAlert = async () => {
    if (newAlert.symbol && newAlert.targetPrice > 0) {
      await createAlert(newAlert.symbol, newAlert.targetPrice, newAlert.direction);
      setNewAlert({ symbol: '', targetPrice: 0, direction: 'above' });
      setShowAddModal(false);
    }
  };

  const triggeredAlerts = alerts.filter(a => a.isTriggered);
  const activeAlerts = alerts.filter(a => !a.isTriggered);

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
                <Bell className="w-6 h-6 text-saffron-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Price Alerts</h1>
                <p className="text-sm text-gray-400">Get notified when prices hit your targets</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500 text-surface-900 font-semibold hover:bg-saffron-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Alert
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Triggered Alerts
            </h2>
            <div className="space-y-3">
              {triggeredAlerts.map(alert => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      {alert.direction === 'above' ? (
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <Link to={`/stock/${alert.symbol}`} className="font-semibold text-yellow-400 hover:underline">
                        {alert.symbol}
                      </Link>
                      <p className="text-sm text-gray-400">
                        Target: ₹{alert.targetPrice} ({alert.direction})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-yellow-400 font-semibold">₹{alert.currentPrice?.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-yellow-400">TARGET HIT!</p>
                    </div>
                    <button
                      onClick={() => deleteAlert(alert._id)}
                      className="p-2 rounded-lg bg-surface-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Active Alerts</h2>
          
          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-surface-800 rounded-xl h-20"></div>
              ))}
            </div>
          ) : activeAlerts.length > 0 ? (
            <div className="space-y-3">
              {activeAlerts.map(alert => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-800 border border-surface-700/50 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      alert.direction === 'above' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {alert.direction === 'above' ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <Link to={`/stock/${alert.symbol}`} className="font-semibold text-saffron-400 hover:underline">
                        {alert.symbol}
                      </Link>
                      <p className="text-sm text-gray-400">
                        Alert when price goes {alert.direction} ₹{alert.targetPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-semibold">₹{alert.currentPrice?.toLocaleString('en-IN')}</p>
                      <p className={`text-xs ${
                        alert.direction === 'above' 
                          ? (parseFloat(alert.percentAway || '0') < 0 ? 'text-green-400' : 'text-gray-400')
                          : (parseFloat(alert.percentAway || '0') > 0 ? 'text-green-400' : 'text-gray-400')
                      }`}>
                        {alert.percentAway}% away
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAlert(alert._id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-800/50 rounded-2xl">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No price alerts set</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 rounded-xl bg-saffron-500 text-surface-900 font-semibold hover:bg-saffron-600 transition-colors"
              >
                Create Your First Alert
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-800 rounded-2xl p-6 w-full max-w-md border border-surface-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Price Alert</h2>
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
                {newAlert.symbol ? (
                  <div className="flex items-center justify-between p-3 bg-surface-700 rounded-xl">
                    <span className="text-saffron-400 font-semibold">{newAlert.symbol}</span>
                    <button
                      onClick={() => setNewAlert({ ...newAlert, symbol: '' })}
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
                            onClick={() => selectStock(stock.symbol)}
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

              {/* Direction */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Alert when price goes</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewAlert({ ...newAlert, direction: 'above' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                      newAlert.direction === 'above'
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-surface-700 border-surface-600 text-gray-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    Above
                  </button>
                  <button
                    onClick={() => setNewAlert({ ...newAlert, direction: 'below' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                      newAlert.direction === 'below'
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-surface-700 border-surface-600 text-gray-400 hover:text-white'
                    }`}
                  >
                    <TrendingDown className="w-5 h-5" />
                    Below
                  </button>
                </div>
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Target Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newAlert.targetPrice || ''}
                  onChange={(e) => setNewAlert({ ...newAlert, targetPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter target price"
                  className="w-full px-4 py-3 bg-surface-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                />
              </div>

              <button
                onClick={handleCreateAlert}
                disabled={!newAlert.symbol || newAlert.targetPrice <= 0}
                className="w-full py-3 rounded-xl bg-saffron-500 text-surface-900 font-semibold hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Alert
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

