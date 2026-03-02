// Floating WhatsApp Share Button
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  const shareToWhatsApp = () => {
    const text = `📈 Check out BharatMarket - Your #1 source for Indian Stock Market News!\n\n🔥 Live market updates\n📊 FII/DII data\n🎯 Stock recommendations\n\n${window.location.origin}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-72 bg-surface-800 rounded-2xl border border-surface-700 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">BharatMarket</p>
                    <p className="text-white/70 text-xs">Share with friends</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-300 text-sm mb-4">
                Share BharatMarket with your friends and help them stay updated with the latest market news! 🚀
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Real-time market updates
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Breaking news alerts
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Expert analysis
                </div>
              </div>

              <button
                onClick={shareToWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
                Share on WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen ? 'bg-surface-700' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Pulse Animation */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500"
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </div>
  );
}

