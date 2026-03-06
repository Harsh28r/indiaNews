// Footer Component with Branding & Social Links
import { Link } from 'react-router-dom';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Instagram, 
  Mail, 
  Rss,
  TrendingUp,
  Briefcase,
  Globe,
  Heart
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-800 border-t border-surface-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CoinsClarity</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted source for comprehensive news coverage. Markets, Business, Tech, Entertainment & Sports - all in one place.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/coinsclarity"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-700 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/coinsclarity"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-700 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/coinsclarity"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-700 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@coinsclarity"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-700 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/coinsclarity"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface-700 hover:bg-pink-500/20 text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-saffron-400" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/markets" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/earnings" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Earnings
                </Link>
              </li>
              <li>
                <Link to="/ipos" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  IPOs
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-saffron-400" />
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=markets" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link to="/?category=business" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/?category=tech" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/?category=entertainment" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link to="/?category=sports" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/?category=politics" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">
                  Politics
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-saffron-400" />
              Stay Connected
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get daily news digest delivered to your inbox
            </p>
            <a
              href="/#newsletter"
              className="inline-flex items-center gap-2 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-surface-900 font-semibold rounded-lg transition-colors text-sm mb-4"
            >
              <Mail className="w-4 h-4" />
              Subscribe Now
            </a>
            <div className="mt-4 space-y-2">
              <a
                href="/rss"
                className="flex items-center gap-2 text-gray-400 hover:text-saffron-400 text-sm transition-colors"
              >
                <Rss className="w-4 h-4" />
                RSS Feed
              </a>
              <a
                href="mailto:contact@coinsclarity.com"
                className="flex items-center gap-2 text-gray-400 hover:text-saffron-400 text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} CoinsClarity. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/about" className="text-gray-500 hover:text-saffron-400 transition-colors">
                About
              </Link>
              <Link to="/privacy" className="text-gray-500 hover:text-saffron-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-saffron-400 transition-colors">
                Terms of Service
              </Link>
              <a
                href="mailto:contact@coinsclarity.com"
                className="text-gray-500 hover:text-saffron-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500" /> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

