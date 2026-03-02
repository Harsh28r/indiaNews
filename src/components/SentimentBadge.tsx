// Sentiment Badge - Bullish/Bearish/Neutral indicator
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score?: number;
  confidence?: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md' | 'lg';
}

export default function SentimentBadge({ sentiment, score, confidence, size = 'md' }: Props) {
  const configs = {
    bullish: {
      icon: TrendingUp,
      label: 'Bullish',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/30'
    },
    bearish: {
      icon: TrendingDown,
      label: 'Bearish',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30'
    },
    neutral: {
      icon: Minus,
      label: 'Neutral',
      bgColor: 'bg-gray-500/20',
      textColor: 'text-gray-400',
      borderColor: 'border-gray-500/30'
    }
  };

  const config = configs[sentiment];
  const Icon = config.icon;

  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center ${sizes[size]} rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor} font-medium`}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
      {confidence === 'high' && (
        <span className="opacity-60 text-xs">●●●</span>
      )}
      {confidence === 'medium' && (
        <span className="opacity-60 text-xs">●●○</span>
      )}
      {confidence === 'low' && (
        <span className="opacity-60 text-xs">●○○</span>
      )}
    </motion.div>
  );
}

