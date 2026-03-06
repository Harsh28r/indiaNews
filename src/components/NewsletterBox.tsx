// Newsletter Signup Box
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useNewsletter } from '../hooks/useFeatures';

export default function NewsletterBox() {
  const { subscribed, loading, subscribe } = useNewsletter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    const result = await subscribe(email);
    if (!result.success) {
      setError(result.message);
    }
  };

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-2xl p-6 border border-green-500/20 text-center"
      >
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-1">You're subscribed!</h3>
        <p className="text-sm text-gray-400">Check your inbox for the morning digest</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-saffron-500/10 to-indigo-500/10 rounded-2xl p-6 border border-saffron-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-saffron-500/20">
          <Mail className="w-5 h-5 text-saffron-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Morning Digest</h3>
          <p className="text-sm text-gray-400">Top 5 news delivered at 6 AM</p>
          <p className="text-xs text-saffron-400 mt-1">Join 12,500+ readers</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 bg-surface-800/50 rounded-xl text-white placeholder-gray-500 border border-surface-700 focus:border-saffron-500/50 focus:outline-none"
        />
        
        {error && <p className="text-sm text-red-400">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-saffron-500 text-surface-900 font-semibold hover:bg-saffron-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            'Subscribe Free'
          )}
        </button>
      </form>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

