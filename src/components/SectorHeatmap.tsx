// Sector Heatmap - Visual Market Overview
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../services/api';

interface Sector {
  name: string;
  symbol: string;
  changePercent: number;
  marketCap: string;
  topStocks: string[];
  trend: 'bullish' | 'bearish' | 'neutral';
  volume: number;
}

export default function SectorHeatmap() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/market/sectors');
      if (res.data.success) {
        setSectors(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sector data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getHeatColor = (changePercent: number) => {
    if (changePercent >= 2) return 'from-green-500 to-green-600';
    if (changePercent >= 1) return 'from-green-400/80 to-green-500/80';
    if (changePercent >= 0.3) return 'from-green-400/50 to-green-500/50';
    if (changePercent > -0.3) return 'from-gray-500/50 to-gray-600/50';
    if (changePercent > -1) return 'from-red-400/50 to-red-500/50';
    if (changePercent > -2) return 'from-red-400/80 to-red-500/80';
    return 'from-red-500 to-red-600';
  };

  const getTextColor = (changePercent: number) => {
    if (Math.abs(changePercent) >= 1) return 'text-white';
    return 'text-gray-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-purple-500" />
          Sector Heatmap
        </h3>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-1.5 hover:bg-surface-600 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse h-20 bg-surface-700/30 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Heatmap Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {sectors.map((sector, i) => (
              <motion.div
                key={sector.symbol}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onMouseEnter={() => setHoveredSector(sector.symbol)}
                onMouseLeave={() => setHoveredSector(null)}
                className={`relative p-3 rounded-xl bg-gradient-to-br ${getHeatColor(sector.changePercent)} 
                  cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:z-10`}
              >
                <div className={`${getTextColor(sector.changePercent)}`}>
                  <p className="font-bold text-sm truncate">{sector.name}</p>
                  <p className="text-lg font-bold flex items-center gap-1">
                    {sector.changePercent >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {sector.changePercent >= 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
                  </p>
                </div>

                {/* Hover Tooltip */}
                {hoveredSector === sector.symbol && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-surface-800 
                      border border-surface-600 rounded-xl shadow-xl z-20 w-48"
                  >
                    <p className="text-white font-bold mb-1">{sector.name}</p>
                    <p className="text-xs text-gray-400 mb-2">Market Cap: {sector.marketCap}</p>
                    <p className="text-xs text-gray-400 mb-1">Top Stocks:</p>
                    <div className="flex flex-wrap gap-1">
                      {sector.topStocks.map(stock => (
                        <span key={stock} className="px-2 py-0.5 bg-surface-700 rounded text-[10px] text-gray-300">
                          {stock}
                        </span>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 
                      w-3 h-3 bg-surface-800 border-r border-b border-surface-600" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-red-500 to-red-600" />
              <span>-2%+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-red-400/50 to-red-500/50" />
              <span>-1%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-gray-500/50 to-gray-600/50" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400/50 to-green-500/50" />
              <span>+1%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-green-500 to-green-600" />
              <span>+2%+</span>
            </div>
          </div>

          {/* Market Summary */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <p className="text-green-400 font-bold">{sectors.filter(s => s.changePercent > 0.3).length}</p>
              <p className="text-[10px] text-gray-400">Bullish</p>
            </div>
            <div className="p-2 bg-gray-500/10 rounded-lg">
              <p className="text-gray-400 font-bold">{sectors.filter(s => Math.abs(s.changePercent) <= 0.3).length}</p>
              <p className="text-[10px] text-gray-400">Neutral</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <p className="text-red-400 font-bold">{sectors.filter(s => s.changePercent < -0.3).length}</p>
              <p className="text-[10px] text-gray-400">Bearish</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

