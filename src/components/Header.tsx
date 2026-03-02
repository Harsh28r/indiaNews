import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, TrendingUp, Newspaper, BarChart3, Star, Bookmark, Calendar, Rocket, Briefcase, Bell } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Newspaper },
    { to: '/markets', label: 'Markets', icon: BarChart3 },
    { to: '/trending', label: 'Trending', icon: TrendingUp },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
  ];
  
  const moreLinks = [
    { to: '/watchlist', label: 'Watchlist', icon: Star },
    { to: '/bookmarks', label: 'Saved', icon: Bookmark },
    { to: '/earnings', label: 'Earnings', icon: Calendar },
    { to: '/ipos', label: 'IPOs', icon: Rocket },
    { to: '/alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-surface-600/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center shadow-lg group-hover:glow-saffron transition-all">
              <span className="text-surface-900 font-bold text-lg">₹</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient-saffron">BharatMarket</h1>
              <p className="text-[10px] text-gray-500 -mt-1">Indian Stock News</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700/50 transition-all"
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar & Language */}
          <div className="hidden sm:flex items-center gap-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="w-56 lg:w-64 pl-10 pr-4 py-2 bg-surface-700/50 border border-surface-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/30 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </form>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-700/50 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-600/50">
            <div className="flex items-center gap-2 mb-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news..."
                    className="w-full pl-10 pr-4 py-2 bg-surface-700/50 border border-surface-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </form>
              <LanguageSwitcher />
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700/50 transition-all"
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              <div className="border-t border-surface-600/50 mt-2 pt-2">
                {moreLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700/50 transition-all"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

