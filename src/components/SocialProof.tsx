// Social Proof Component - Shows active users, engagement
import { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp, Clock } from 'lucide-react';

interface SocialProofProps {
  articleId?: string;
  variant?: 'inline' | 'badge' | 'banner';
}

export default function SocialProof({ articleId, variant = 'inline' }: SocialProofProps) {
  const [readers, setReaders] = useState(0);
  const [subscribers, setSubscribers] = useState(0);

  useEffect(() => {
    // Generate realistic numbers that update periodically
    const baseReaders = Math.floor(Math.random() * 50) + 15; // 15-65 readers
    const baseSubscribers = 12500 + Math.floor(Math.random() * 500); // 12.5K-13K
    
    setReaders(baseReaders);
    setSubscribers(baseSubscribers);

    // Update readers count every 10-15 seconds to simulate activity
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
      setReaders(prev => Math.max(10, prev + change));
    }, 12000);

    return () => clearInterval(interval);
  }, [articleId]);

  if (variant === 'badge') {
    return (
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-saffron-400" />
          <span>{subscribers.toLocaleString()}+ readers</span>
        </div>
        {articleId && (
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>{readers} reading now</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-saffron-500/10 to-indigo-500/10 border border-saffron-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Users className="w-5 h-5 text-saffron-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Active Readers</p>
                <p className="text-sm font-semibold text-white">{subscribers.toLocaleString()}+</p>
              </div>
            </div>
            {articleId && (
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Reading Now</p>
                  <p className="text-sm font-semibold text-white">{readers} people</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Today's Views</p>
                <p className="text-sm font-semibold text-white">{(125000 + Math.floor(Math.random() * 10000)).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className="flex items-center gap-3 text-xs text-gray-400">
      {articleId && (
        <>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{readers} reading</span>
          </div>
          <span>•</span>
        </>
      )}
      <span>{subscribers.toLocaleString()}+ subscribers</span>
    </div>
  );
}

