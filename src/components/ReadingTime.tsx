// Reading Time Badge
import { Clock } from 'lucide-react';

interface Props {
  minutes: number;
  showIcon?: boolean;
  className?: string;
}

export default function ReadingTime({ minutes, showIcon = true, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-gray-400 ${className}`}>
      {showIcon && <Clock className="w-4 h-4" />}
      <span>{minutes} min read</span>
    </span>
  );
}

// Utility to calculate reading time from text
export const getReadingTime = (text: string): number => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

