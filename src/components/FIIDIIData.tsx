// FII/DII Institutional Flow Data
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, TrendingDown, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../services/api';

interface DayData {
  date: string;
  fii: { buy: number; sell: number; net: number };
  dii: { buy: number; sell: number; net: number };
}

interface FIIDIIResponse {
  success: boolean;
  data: {
    daily: DayData[];
    summary: {
      fiiNetTotal: number;
      diiNetTotal: number;
      trend: string;
    };
  };
}

export default function FIIDIIData() {
  const [data, setData] = useState<DayData[]>([]);
  const [summary, setSummary] = useState<{ fiiNetTotal: number; diiNetTotal: number; trend: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<FIIDIIResponse>('/market/fii-dii');
      if (res.data.success) {
        setData(res.data.data.daily ?? []);
        setSummary(res.data.data.summary ?? null);
      }
    } catch {
      setData([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCrores = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000) {
      return `${(value / 1000).toFixed(1)}K Cr`;
    }
    return `${value.toLocaleString()} Cr`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const todayData = data[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          FII / DII Activity
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
        <div className="space-y-3">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse h-20 bg-surface-700/30 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Today's Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* FII Card */}
            <div className={`p-4 rounded-xl ${
              todayData?.fii.net >= 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">FII (Today)</span>
                {todayData?.fii.net >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className={`text-xl font-bold ${todayData?.fii.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {todayData ? (todayData.fii.net >= 0 ? '+' : '') + formatCrores(todayData.fii.net) : '-'}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Buy: ₹{todayData?.fii.buy.toLocaleString()} Cr
              </p>
            </div>

            {/* DII Card */}
            <div className={`p-4 rounded-xl ${
              todayData?.dii.net >= 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">DII (Today)</span>
                {todayData?.dii.net >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className={`text-xl font-bold ${todayData?.dii.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {todayData ? (todayData.dii.net >= 0 ? '+' : '') + formatCrores(todayData.dii.net) : '-'}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Buy: ₹{todayData?.dii.buy.toLocaleString()} Cr
              </p>
            </div>
          </div>

          {/* Weekly Summary Bar */}
          {summary && (
            <div className="p-3 bg-surface-700/30 rounded-xl mb-4">
              <p className="text-xs text-gray-400 mb-2">5-Day Net Flow</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">FII</span>
                    <span className={summary.fiiNetTotal >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {summary.fiiNetTotal >= 0 ? '+' : ''}{formatCrores(summary.fiiNetTotal)}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${summary.fiiNetTotal >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(Math.abs(summary.fiiNetTotal) / 200, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">DII</span>
                    <span className={summary.diiNetTotal >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {summary.diiNetTotal >= 0 ? '+' : ''}{formatCrores(summary.diiNetTotal)}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${summary.diiNetTotal >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(Math.abs(summary.diiNetTotal) / 200, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Breakdown */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-2">Daily Breakdown</p>
            {data.slice(0, 5).map((day, i) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-2 bg-surface-700/20 rounded-lg text-xs"
              >
                <span className="text-gray-400 w-16">{formatDate(day.date)}</span>
                <span className={`w-20 text-right ${day.fii.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {day.fii.net >= 0 ? '+' : ''}{day.fii.net.toLocaleString()}
                </span>
                <span className={`w-20 text-right ${day.dii.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {day.dii.net >= 0 ? '+' : ''}{day.dii.net.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Trend Indicator */}
          {summary && (
            <div className={`mt-4 p-3 rounded-xl text-center ${
              summary.trend === 'FII Buying' ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              <p className="text-xs text-gray-400">Weekly Trend</p>
              <p className={`font-bold ${summary.trend === 'FII Buying' ? 'text-green-400' : 'text-red-400'}`}>
                {summary.trend === 'FII Buying' ? '📈' : '📉'} {summary.trend}
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

