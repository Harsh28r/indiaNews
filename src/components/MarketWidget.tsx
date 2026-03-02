// Market Widget - Shows indices and market status
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Clock, Radio } from 'lucide-react';
import { useMarketStatus, useMarketIndices } from '../hooks/useFeatures';

export default function MarketWidget() {
  const marketStatus = useMarketStatus();
  const { indices, loading } = useMarketIndices();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-500/20';
      case 'pre-market': return 'text-yellow-400 bg-yellow-500/20';
      case 'post-market': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="glass rounded-2xl p-4 mb-6">
      {/* Market Status */}
      {marketStatus && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {marketStatus.status === 'live' ? (
              <Radio className="w-4 h-4 text-green-400 animate-pulse" />
            ) : (
              <Clock className="w-4 h-4 text-gray-400" />
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(marketStatus.status)}`}>
              {marketStatus.status === 'live' ? '● LIVE' : marketStatus.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-400">{marketStatus.message}</span>
          </div>
        </div>
      )}

      {/* Indices */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0 animate-pulse bg-surface-700/50 rounded-xl p-4 min-w-[180px]">
              <div className="h-4 bg-surface-600 rounded w-20 mb-2"></div>
              <div className="h-6 bg-surface-600 rounded w-24"></div>
            </div>
          ))
        ) : (
          indices.map((index, i) => (
            <motion.div
              key={index.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 bg-surface-800/80 rounded-xl p-4 min-w-[180px] border border-surface-700/50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-400">{index.name}</span>
                <Activity className="w-3 h-3 text-gray-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">
                  {index.price?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className={`flex items-center text-sm font-medium ${
                  index.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {index.changePercent >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent?.toFixed(2)}%
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

