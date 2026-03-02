import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { NewsArticle } from '../types';
import { useTranslatedText } from './TranslatedText';

interface Props {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'compact';
}

// Map source to category for branding
const getCategoryTag = (sourceName?: string): string => {
  if (!sourceName) return 'News';
  const s = sourceName.toLowerCase();
  if (s.includes('market') || s.includes('trading')) return 'Markets';
  if (s.includes('stock') || s.includes('companies')) return 'Stocks';
  if (s.includes('ipo')) return 'IPO';
  if (s.includes('commodit')) return 'Commodities';
  if (s.includes('forex') || s.includes('currency')) return 'Forex';
  if (s.includes('mutual') || s.includes('money') || s.includes('finance')) return 'Finance';
  if (s.includes('econom')) return 'Economy';
  if (s.includes('entertainment') || s.includes('bollywood') || s.includes('celebr') || s.includes('movie') || s.includes('film') || s.includes('showbiz')) return 'Entertainment';
  if (s.includes('politic') || s.includes('national') || s.includes('india')) return 'Politics';
  if (s.includes('world') || s.includes('international') || s.includes('global') || s.includes('foreign')) return 'World';
  if (s.includes('sport') || s.includes('cricket')) return 'Sports';
  if (s.includes('tech') || s.includes('gadget')) return 'Tech';
  if (s.includes('lifestyle') || s.includes('life')) return 'Lifestyle';
  if (s.includes('break') || s.includes('top') || s.includes('headline') || s.includes('express')) return 'Breaking';
  if (s.includes('analysis') || s.includes('expert')) return 'Analysis';
  return 'News';
};

// Category-specific gradient colors for fallback images
const getCategoryGradient = (category: string): string => {
  const gradients: Record<string, string> = {
    'Markets': '1a1a2e/00c853',
    'Stocks': '1a1a2e/4caf50',
    'Finance': '1a1a2e/ff9800',
    'Economy': '1a1a2e/2196f3',
    'Entertainment': '2d1b4e/e91e63',
    'Bollywood': '4a1942/ff4081',
    'Politics': '1a237e/3f51b5',
    'World': '0d3b66/00bcd4',
    'Sports': '1b5e20/8bc34a',
    'Tech': '1a1a2e/9c27b0',
    'Lifestyle': '4e342e/ff7043',
    'Breaking': 'b71c1c/ff5252',
    'News': '1a1a2e/ff9933',
  };
  return gradients[category] || gradients['News'];
};

export default function NewsCard({ article, variant = 'default' }: Props) {
  const timeAgo = article.pubDate
    ? formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })
    : '';

  const categoryTag = getCategoryTag(article.source_name);
  const gradient = getCategoryGradient(categoryTag);
  
  // Translation hooks
  const { translated: title, loading: titleLoading } = useTranslatedText(article.title || '');
  const { translated: description } = useTranslatedText(article.description || '');
  
  // Better fallback with category-specific colors
  const fallbackImage = `https://placehold.co/800x450/${gradient}?text=${encodeURIComponent(categoryTag)}&font=raleway`;
  
  // Check if image URL is valid
  const imageUrl = article.image_url && article.image_url.startsWith('http') 
    ? article.image_url 
    : fallbackImage;

  if (variant === 'featured') {
    return (
      <Link
        to={`/article/${article.article_id}`}
        className="group relative block rounded-2xl overflow-hidden card-hover"
      >
        <div className="aspect-[16/9] relative">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold bg-saffron-500 text-surface-900 rounded-full">
            {categoryTag}
          </span>
          <h2 className={`text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-saffron-400 transition-colors ${titleLoading ? 'animate-pulse' : ''}`}>
            {title}
          </h2>
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {timeAgo}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/article/${article.article_id}`}
        className="group flex gap-4 p-3 rounded-xl hover:bg-surface-700/30 transition-all"
      >
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold text-saffron-400 uppercase tracking-wide">{categoryTag}</span>
          <h3 className={`text-sm font-medium text-white line-clamp-2 group-hover:text-saffron-400 transition-colors ${titleLoading ? 'animate-pulse' : ''}`}>
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{timeAgo}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={`/article/${article.article_id}`}
      className="group block bg-surface-800 rounded-2xl overflow-hidden border border-surface-700/50 card-hover"
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-surface-900/80 backdrop-blur-sm text-saffron-400 rounded-md">
          {categoryTag}
        </span>
      </div>
      <div className="p-5">
        <h3 className={`text-lg font-semibold text-white line-clamp-2 mb-2 group-hover:text-saffron-400 transition-colors ${titleLoading ? 'animate-pulse' : ''}`}>
          {title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {timeAgo}
          </span>
          <span className="flex items-center gap-1 text-saffron-500 opacity-0 group-hover:opacity-100 transition-opacity">
            Read <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

