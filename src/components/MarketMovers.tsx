// Market Movers - Top Gainers & Losers
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export default function MarketMovers() {
  const [gainers, setGainers] = useState<Stock[]>([]);
  const [losers, setLosers] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/market/movers');
      if (res.data.success) {
        setGainers(res.data.data.gainers);
        setLosers(res.data.data.losers);
      }
    } catch (error) {
      console.error('Failed to fetch market movers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const formatVolume = (vol: number) => {
    if (vol >= 10000000) return `${(vol / 10000000).toFixed(1)}Cr`;
    if (vol >= 100000) return `${(vol / 100000).toFixed(1)}L`;
    return vol.toLocaleString();
  };

  const stocks = activeTab === 'gainers' ? gainers : losers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          {activeTab === 'gainers' ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
          Market Movers
        </h3>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-1.5 hover:bg-surface-600 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('gainers')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'gainers'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-surface-700/50 text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          Gainers
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'losers'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-surface-700/50 text-gray-400 hover:text-white'
          }`}
        >
          <TrendingDown className="w-4 h-4 inline mr-1" />
          Losers
        </button>
      </div>

      {/* Stock List */}
      <div className="space-y-2">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-surface-700/30 rounded-xl">
              <div className="h-4 bg-surface-600 rounded w-20"></div>
              <div className="h-4 bg-surface-600 rounded w-16"></div>
            </div>
          ))
        ) : (
          stocks.map((stock, i) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/stock/${stock.symbol}`}
                className="flex items-center justify-between p-3 bg-surface-700/30 hover:bg-surface-700/50 rounded-xl transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white group-hover:text-saffron-400 transition-colors">
                      {stock.symbol}
                    </span>
                    <span className="text-xs text-gray-500 px-2 py-0.5 bg-surface-600 rounded">
                      {stock.sector}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">₹{stock.price.toLocaleString()}</p>
                  <p className={`text-sm flex items-center justify-end gap-1 ${
                    stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stock.changePercent >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* Volume info */}
      {!loading && stocks.length > 0 && (
        <p className="text-[10px] text-gray-600 mt-3 text-center">
          Total Volume: {formatVolume(stocks.reduce((sum, s) => sum + s.volume, 0))}
        </p>
      )}
    </motion.div>
  );
}

