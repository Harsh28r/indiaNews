// TLDR Box - AI Summary with bullet points
import { motion } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTextToSpeech } from '../hooks/useFeatures';
import SentimentBadge from './SentimentBadge';

interface Props {
  summary: string[];
  sentiment?: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    confidence: 'high' | 'medium' | 'low';
  } | null;
  loading?: boolean;
}

export default function TLDRBox({ summary, sentiment, loading }: Props) {
  const [expanded, setExpanded] = useState(true);
  const { speaking, toggle, supported } = useTextToSpeech();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-saffron-500/10 to-indigo-500/10 rounded-2xl p-5 border border-saffron-500/20 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-surface-600 rounded-full"></div>
          <div className="h-5 w-20 bg-surface-600 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-surface-600 rounded w-full"></div>
          <div className="h-4 bg-surface-600 rounded w-3/4"></div>
          <div className="h-4 bg-surface-600 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!summary || summary.length === 0) return null;

  const fullText = summary.join('. ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-saffron-500/10 to-indigo-500/10 rounded-2xl p-5 border border-saffron-500/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-saffron-400" />
          <span className="text-saffron-400 font-semibold">TLDR</span>
          {sentiment && <SentimentBadge {...sentiment} size="sm" />}
        </div>
        
        <div className="flex items-center gap-2">
          {supported && (
            <button
              onClick={() => toggle(fullText)}
              className={`p-2 rounded-lg transition-colors ${
                speaking ? 'bg-saffron-500/20 text-saffron-400' : 'bg-surface-700 text-gray-400 hover:text-white'
              }`}
              title={speaking ? 'Stop reading' : 'Read aloud'}
            >
              {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg bg-surface-700 text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Summary Points */}
      {expanded && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="space-y-3"
        >
          {summary.map((point, i) => (
            <motion.li
              key={i}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 text-gray-300"
            >
              <span className="w-2 h-2 rounded-full bg-saffron-500 mt-2 flex-shrink-0"></span>
              <span>{point}</span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}

