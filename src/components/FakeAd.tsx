// Fake Advertisement Components
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, TrendingUp, Briefcase, Smartphone, Car, CreditCard } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  sponsor: string;
  category: 'finance' | 'tech' | 'auto' | 'shopping';
}

const adTemplates: Ad[] = [
  {
    id: '1',
    title: 'Start Trading Today',
    description: 'Join 10M+ traders. Zero commission fees.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300',
    cta: 'Get Started Free',
    sponsor: 'Trading Platform',
    category: 'finance'
  },
  {
    id: '2',
    title: 'Premium Credit Card',
    description: '5% cashback on all purchases. Apply now!',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300',
    cta: 'Apply Now',
    sponsor: 'Bank Name',
    category: 'finance'
  },
  {
    id: '3',
    title: 'Latest Smartphone',
    description: 'Pre-order now and save ₹5,000',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=300',
    cta: 'Pre-Order',
    sponsor: 'Tech Store',
    category: 'tech'
  },
  {
    id: '4',
    title: 'New Car Launch',
    description: 'Book your test drive today',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=300',
    cta: 'Book Now',
    sponsor: 'Auto Dealer',
    category: 'auto'
  },
  {
    id: '5',
    title: 'Investment Platform',
    description: 'Grow your wealth with smart investments',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300',
    cta: 'Invest Now',
    sponsor: 'Investment Co',
    category: 'finance'
  },
  {
    id: '6',
    title: 'Online Shopping Sale',
    description: 'Up to 70% off on electronics',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300',
    cta: 'Shop Now',
    sponsor: 'E-Commerce',
    category: 'shopping'
  }
];

interface FakeAdProps {
  variant?: 'banner' | 'sidebar' | 'inline' | 'native';
  category?: Ad['category'];
}

export default function FakeAd({ variant = 'banner', category }: FakeAdProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    // Select random ad, filter by category if provided
    const filteredAds = category 
      ? adTemplates.filter(a => a.category === category)
      : adTemplates;
    const randomAd = filteredAds[Math.floor(Math.random() * filteredAds.length)];
    setAd(randomAd);
  }, [category]);

  if (!ad || !showAd) return null;

  const getIcon = () => {
    switch (ad.category) {
      case 'finance':
        return <CreditCard className="w-4 h-4" />;
      case 'tech':
        return <Smartphone className="w-4 h-4" />;
      case 'auto':
        return <Car className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl overflow-hidden border border-surface-700/50"
      >
        <div className="relative">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/300x200/1a1a2e/ff9933?text=${encodeURIComponent(ad.title)}`;
            }}
          />
          <button
            onClick={() => setShowAd(false)}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="Close ad"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-[10px] flex items-center gap-1">
            {getIcon()}
            <span>Ad</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">Sponsored</p>
          <h3 className="text-sm font-semibold text-white mb-1">{ad.title}</h3>
          <p className="text-xs text-gray-400 mb-3">{ad.description}</p>
          <button className="w-full py-2 bg-saffron-500 hover:bg-saffron-600 text-surface-900 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
            {ad.cta}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-8 glass rounded-xl overflow-hidden border border-surface-700/50"
      >
        <div className="relative">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/800x300/1a1a2e/ff9933?text=${encodeURIComponent(ad.title)}`;
            }}
          />
          <button
            onClick={() => setShowAd(false)}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="Close ad"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/50 rounded-lg text-white text-xs flex items-center gap-1.5">
            {getIcon()}
            <span>Advertisement</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <p className="text-xs text-gray-400 mb-1">Sponsored by {ad.sponsor}</p>
            <h3 className="text-lg font-bold text-white mb-1">{ad.title}</h3>
            <p className="text-sm text-gray-300 mb-3">{ad.description}</p>
            <button className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-surface-900 font-semibold rounded-lg text-sm transition-colors flex items-center gap-2">
              {ad.cta}
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'native') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-6 p-4 glass rounded-xl border border-surface-700/50"
      >
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/100x100/1a1a2e/ff9933?text=${encodeURIComponent(ad.title.slice(0, 2))}`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-gray-500 bg-surface-700 px-2 py-0.5 rounded">Ad</span>
              <span className="text-[10px] text-gray-500">{ad.sponsor}</span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{ad.title}</h3>
            <p className="text-xs text-gray-400 mb-2 line-clamp-2">{ad.description}</p>
            <button className="text-xs text-saffron-400 hover:text-saffron-300 font-medium flex items-center gap-1">
              {ad.cta}
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Banner variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-6 glass rounded-xl overflow-hidden border border-surface-700/50"
    >
      <div className="relative">
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/800x200/1a1a2e/ff9933?text=${encodeURIComponent(ad.title)}`;
          }}
        />
        <button
          onClick={() => setShowAd(false)}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          aria-label="Close ad"
        >
          <X className="w-3 h-3" />
        </button>
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-[10px] flex items-center gap-1">
          {getIcon()}
          <span>Advertisement</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <p className="text-xs text-gray-400 mb-1">Sponsored by {ad.sponsor}</p>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-0.5">{ad.title}</h3>
              <p className="text-xs text-gray-300">{ad.description}</p>
            </div>
            <button className="px-3 py-1.5 bg-saffron-500 hover:bg-saffron-600 text-surface-900 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1">
              {ad.cta}
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

