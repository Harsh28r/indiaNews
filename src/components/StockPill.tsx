// Stock Pill - Inline stock mention with price
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Check, ExternalLink } from 'lucide-react';
import { useWatchlist } from '../hooks/useFeatures';

interface Props {
  symbol: string;
  name: string;
  price?: number;
  changePercent?: number;
  showAddToWatchlist?: boolean;
}

export default function StockPill({ symbol, name, price, changePercent, showAddToWatchlist = true }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { isWatching, addStock, removeStock } = useWatchlist();
  const watching = isWatching(symbol);

  const isPositive = (changePercent || 0) >= 0;

  return (
    <motion.span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-700/80 cursor-pointer hover:bg-surface-600/80 transition-colors"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      whileHover={{ scale: 1.02 }}
    >
      <span className="text-saffron-400 font-semibold text-sm">{symbol}</span>
      
      <AnimatePresence>
        {expanded && price && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex items-center gap-1 overflow-hidden"
          >
            <span className="text-white font-medium text-sm">
              ₹{price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{changePercent?.toFixed(1)}%
            </span>
            
            {showAddToWatchlist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  watching ? removeStock(symbol) : addStock(symbol);
                }}
                className={`ml-1 p-1 rounded-full transition-colors ${
                  watching ? 'bg-green-500/20 text-green-400' : 'bg-surface-600 text-gray-400 hover:text-white'
                }`}
              >
                {watching ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

