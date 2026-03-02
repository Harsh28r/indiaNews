// IPO Tracker Page
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, TrendingUp, TrendingDown, Users, Clock, CheckCircle } from 'lucide-react';
import { useIPOs } from '../hooks/useFeatures';
import { format, formatDistanceToNow } from 'date-fns';

type IPOStatus = 'all' | 'upcoming' | 'open' | 'listed';

export default function IPOTracker() {
  const [statusFilter, setStatusFilter] = useState<IPOStatus>('all');
  const { ipos, loading } = useIPOs(statusFilter);

  const statusTabs: { id: IPOStatus; label: string }[] = [
    { id: 'all', label: 'All IPOs' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'open', label: 'Open Now' },
    { id: 'listed', label: 'Recently Listed' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full animate-pulse">● OPEN</span>;
      case 'upcoming':
        return <span className="px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full">Upcoming</span>;
      case 'listed':
        return <span className="px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded-full">Listed</span>;
      default:
        return null;
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
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-saffron-500/20">
              <Rocket className="w-6 h-6 text-saffron-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">IPO Tracker</h1>
              <p className="text-sm text-gray-400">Track upcoming and recent IPOs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {statusTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-saffron-500 text-surface-900'
                  : 'bg-surface-700 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* IPO Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-800 rounded-2xl h-64"></div>
            ))}
          </div>
        ) : ipos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ipos.map((ipo, i) => (
              <motion.div
                key={ipo.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-800 rounded-2xl overflow-hidden border border-surface-700/50"
              >
                {/* Header */}
                <div className="p-6 border-b border-surface-700/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{ipo.name}</h3>
                      <p className="text-saffron-400 font-medium">{ipo.symbol}</p>
                    </div>
                    {getStatusBadge(ipo.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(ipo.openDate), 'MMM d')} - {format(new Date(ipo.closeDate), 'MMM d')}
                    </span>
                    <span>Issue: {ipo.issueSize}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {/* Price & Lot */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-700/30 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Price Band</p>
                      <p className="text-lg font-bold text-white">{ipo.priceRange}</p>
                    </div>
                    <div className="bg-surface-700/30 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Lot Size</p>
                      <p className="text-lg font-bold text-white">{ipo.lotSize} shares</p>
                    </div>
                  </div>

                  {/* GMP */}
                  {ipo.gmp !== null && (
                    <div className="flex items-center justify-between bg-green-500/10 rounded-xl p-3 border border-green-500/20">
                      <span className="text-sm text-gray-400">Grey Market Premium (GMP)</span>
                      <span className="text-lg font-bold text-green-400">+₹{ipo.gmp}</span>
                    </div>
                  )}

                  {/* Subscription */}
                  {ipo.subscription && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Subscription</p>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-surface-700/30 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Retail</p>
                          <p className="text-sm font-bold text-white">{ipo.subscription.retail}x</p>
                        </div>
                        <div className="bg-surface-700/30 rounded-lg p-2">
                          <p className="text-xs text-gray-500">NII</p>
                          <p className="text-sm font-bold text-white">{ipo.subscription.nii}x</p>
                        </div>
                        <div className="bg-surface-700/30 rounded-lg p-2">
                          <p className="text-xs text-gray-500">QIB</p>
                          <p className="text-sm font-bold text-white">{ipo.subscription.qib}x</p>
                        </div>
                        <div className="bg-saffron-500/20 rounded-lg p-2">
                          <p className="text-xs text-saffron-400">Total</p>
                          <p className="text-sm font-bold text-saffron-400">{ipo.subscription.total}x</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Listing Result */}
                  {ipo.status === 'listed' && ipo.listingPrice && (
                    <div className={`flex items-center justify-between rounded-xl p-3 border ${
                      (ipo.listingGain || 0) >= 0 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : 'bg-red-500/10 border-red-500/20'
                    }`}>
                      <div>
                        <p className="text-xs text-gray-500">Listing Price</p>
                        <p className="text-lg font-bold text-white">₹{ipo.listingPrice}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-lg font-bold ${
                        (ipo.listingGain || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {(ipo.listingGain || 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {(ipo.listingGain || 0) >= 0 ? '+' : ''}{ipo.listingGain}%
                      </div>
                    </div>
                  )}

                  {/* Listing Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Listing: {format(new Date(ipo.listingDate), 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No IPOs found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

