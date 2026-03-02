// Earnings Calendar Page
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEarningsCalendar, usePriceAlerts } from '../hooks/useFeatures';
import { format } from 'date-fns';

export default function Earnings() {
  const { earnings, loading } = useEarningsCalendar(60);
  const { createAlert } = usePriceAlerts();

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (days <= 7) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-green-400 bg-green-500/20 border-green-500/30';
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
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-saffron-500/20">
              <Calendar className="w-6 h-6 text-saffron-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Earnings Calendar</h1>
              <p className="text-sm text-gray-400">Upcoming quarterly results</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-saffron-500/10 to-green-india/10 rounded-2xl p-6 mb-8 border border-saffron-500/20">
          <h2 className="text-lg font-semibold text-white mb-2">📈 Track Earnings Results</h2>
          <p className="text-gray-400 text-sm">
            Stay ahead of the market by tracking when companies announce their quarterly results. 
            Set price alerts to get notified about significant moves.
          </p>
        </div>

        {/* Earnings List */}
        {loading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-800 rounded-xl h-24"></div>
            ))}
          </div>
        ) : earnings.length > 0 ? (
          <div className="space-y-4">
            {earnings.map((earning, i) => (
              <motion.div
                key={earning.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-800 rounded-2xl p-6 border border-surface-700/50 hover:border-surface-600/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Days Until Badge */}
                    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border ${getUrgencyColor(earning.daysUntil)}`}>
                      <span className="text-2xl font-bold">{earning.daysUntil}</span>
                      <span className="text-xs">days</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/stock/${earning.symbol}`}
                          className="text-xl font-bold text-saffron-400 hover:underline"
                        >
                          {earning.symbol}
                        </Link>
                        <span className="px-2 py-0.5 text-xs bg-surface-700 text-gray-400 rounded-full">
                          {earning.quarter}
                        </span>
                      </div>
                      <p className="text-gray-400">{earning.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(earning.date), 'MMMM d, yyyy')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/stock/${earning.symbol}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">News</span>
                    </Link>
                    <button
                      onClick={() => createAlert(earning.symbol, 0, 'above')}
                      className="p-2 rounded-xl bg-saffron-500/20 text-saffron-400 hover:bg-saffron-500/30 transition-colors"
                      title="Set price alert"
                    >
                      <Bell className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No upcoming earnings in the next 60 days</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

