// Live Activity Feed - Shows recent user activity
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookOpen, Heart, Share2 } from 'lucide-react';

interface Activity {
  id: string;
  action: 'read' | 'bookmarked' | 'shared' | 'subscribed';
  time: string;
  article?: string;
}

const activities: Activity[] = [
  { id: '1', action: 'read', time: '2m ago', article: 'Stock Market Hits All-Time High' },
  { id: '2', action: 'bookmarked', time: '5m ago', article: 'Tech Giants Announce New AI Features' },
  { id: '3', action: 'shared', time: '8m ago', article: 'Crypto Market Analysis' },
  { id: '4', action: 'subscribed', time: '12m ago' },
  { id: '5', action: 'read', time: '15m ago', article: 'Business News Update' },
  { id: '6', action: 'bookmarked', time: '18m ago', article: 'Entertainment Buzz' },
];

export default function LiveActivity() {
  const [currentActivities, setCurrentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Show 3 random activities
    const shuffled = [...activities].sort(() => Math.random() - 0.5);
    setCurrentActivities(shuffled.slice(0, 3));

    // Rotate activities every 8 seconds
    const interval = setInterval(() => {
      const shuffled = [...activities].sort(() => Math.random() - 0.5);
      setCurrentActivities(shuffled.slice(0, 3));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (action: Activity['action']) => {
    switch (action) {
      case 'read':
        return <BookOpen className="w-3 h-3 text-blue-400" />;
      case 'bookmarked':
        return <Heart className="w-3 h-3 text-red-400" />;
      case 'shared':
        return <Share2 className="w-3 h-3 text-green-400" />;
      case 'subscribed':
        return <User className="w-3 h-3 text-saffron-400" />;
    }
  };

  const getActionText = (activity: Activity) => {
    switch (activity.action) {
      case 'read':
        return 'read';
      case 'bookmarked':
        return 'bookmarked';
      case 'shared':
        return 'shared';
      case 'subscribed':
        return 'subscribed to newsletter';
    }
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="font-bold text-white text-sm">Live Activity</h3>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {currentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-xs"
            >
              <div className="mt-0.5">{getIcon(activity.action)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 truncate">
                  Someone {getActionText(activity)}
                  {activity.article && (
                    <span className="text-gray-500"> "{activity.article}"</span>
                  )}
                </p>
                <p className="text-gray-500 text-[10px] mt-0.5">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

