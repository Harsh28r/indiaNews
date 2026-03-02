import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3 } from 'lucide-react';
import { fetchIndianIndices } from '../services/api';
import type { IndexData } from '../types';
import SectorHeatmap from '../components/SectorHeatmap';
import MarketMovers from '../components/MarketMovers';
import FIIDIIData from '../components/FIIDIIData';

export default function Markets() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIndices = async () => {
    try {
      setLoading(true);
      const res = await fetchIndianIndices();
      setIndices(res.data);
    } catch (err) {
      console.error('Failed to load indices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndices();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-saffron-500" size={28} />
              <h1 className="text-3xl font-bold text-white">Indian Markets</h1>
            </div>
            <p className="text-gray-400">Live indices and market data</p>
          </div>
          <button
            onClick={loadIndices}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg text-sm text-gray-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </motion.div>

        {/* Indices Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {indices.map((index, i) => (
            <motion.div
              key={index.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border transition-all ${
                index.change >= 0
                  ? 'bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20'
                  : 'bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{index.name}</h3>
                <div
                  className={`p-2 rounded-lg ${
                    index.change >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  {index.change >= 0 ? (
                    <TrendingUp className="text-green-market" size={20} />
                  ) : (
                    <TrendingDown className="text-red-market" size={20} />
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">
                  {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div
                className={`text-sm font-medium ${
                  index.change >= 0 ? 'text-green-market' : 'text-red-market'
                }`}
              >
                {index.change >= 0 ? '+' : ''}
                {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sector Heatmap */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Sector Performance</h2>
          <SectorHeatmap />
        </div>

        {/* Market Movers & FII/DII */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <MarketMovers />
          <FIIDIIData />
        </div>

        {/* Market Hours Info */}
        <div className="glass rounded-2xl p-6 border border-surface-600/50">
          <h2 className="text-xl font-bold text-white mb-4">Market Hours</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-surface-700/30 rounded-xl">
              <h3 className="text-sm font-medium text-gray-400 mb-1">NSE/BSE</h3>
              <p className="text-white font-semibold">9:15 AM - 3:30 PM IST</p>
              <p className="text-xs text-gray-500 mt-1">Monday - Friday</p>
            </div>
            <div className="p-4 bg-surface-700/30 rounded-xl">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Pre-Market</h3>
              <p className="text-white font-semibold">9:00 AM - 9:15 AM IST</p>
              <p className="text-xs text-gray-500 mt-1">Order collection</p>
            </div>
            <div className="p-4 bg-surface-700/30 rounded-xl">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Post-Market</h3>
              <p className="text-white font-semibold">3:40 PM - 4:00 PM IST</p>
              <p className="text-xs text-gray-500 mt-1">Closing session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

