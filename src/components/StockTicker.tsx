import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchIndianIndices } from '../services/api';
import type { IndexData } from '../types';

export default function StockTicker() {
  const [indices, setIndices] = useState<IndexData[]>([]);

  useEffect(() => {
    const loadIndices = async () => {
      try {
        const res = await fetchIndianIndices();
        setIndices(res.data);
      } catch (err) {
        console.error('Failed to load indices', err);
      }
    };
    loadIndices();
    const interval = setInterval(loadIndices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (indices.length === 0) return null;

  // Duplicate for seamless loop
  const tickerItems = [...indices, ...indices];

  return (
    <div className="bg-surface-800 border-b border-surface-700 overflow-hidden">
      <div className="flex animate-ticker">
        {tickerItems.map((index, i) => (
          <div
            key={`${index.name}-${i}`}
            className="flex items-center gap-3 px-6 py-2 whitespace-nowrap border-r border-surface-700/50"
          >
            <span className="text-sm font-medium text-gray-300">{index.name}</span>
            <span className="text-sm font-bold text-white">
              {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                index.change >= 0 ? 'text-green-market' : 'text-red-market'
              }`}
            >
              {index.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>
                {index.change >= 0 ? '+' : ''}
                {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

