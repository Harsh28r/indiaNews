// Article Actions - Share, Bookmark, Audio, etc.
import { motion } from 'framer-motion';
import { 
  Share2, Bookmark, BookmarkCheck, Volume2, VolumeX, 
  MessageCircle, Link2, Check, Twitter 
} from 'lucide-react';
import { useState } from 'react';
import { useBookmarks, useTextToSpeech, useShare } from '../hooks/useFeatures';

interface Props {
  articleId: string;
  title: string;
  content: string;
  url?: string;
}

export default function ArticleActions({ articleId, title, content, url }: Props) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { speaking, toggle, supported: ttsSupported } = useTextToSpeech();
  const { shareToWhatsApp, shareToTwitter, copyLink } = useShare();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const bookmarked = isBookmarked(articleId);
  const shareUrl = url || window.location.href;

  const handleCopyLink = async () => {
    const success = await copyLink(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(articleId);
    } else {
      addBookmark(articleId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Bookmark */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleBookmark}
        className={`p-3 rounded-xl transition-colors ${
          bookmarked 
            ? 'bg-saffron-500/20 text-saffron-400' 
            : 'bg-surface-700 text-gray-400 hover:text-white hover:bg-surface-600'
        }`}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
      >
        {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
      </motion.button>

      {/* Text-to-Speech */}
      {ttsSupported && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggle(content)}
          className={`p-3 rounded-xl transition-colors ${
            speaking 
              ? 'bg-saffron-500/20 text-saffron-400 animate-pulse' 
              : 'bg-surface-700 text-gray-400 hover:text-white hover:bg-surface-600'
          }`}
          title={speaking ? 'Stop reading' : 'Listen to article'}
        >
          {speaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      )}

      {/* Share Button */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="p-3 rounded-xl bg-surface-700 text-gray-400 hover:text-white hover:bg-surface-600 transition-colors"
          title="Share"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>

        {/* Share Menu */}
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 bg-surface-800 rounded-xl border border-surface-700 shadow-xl overflow-hidden z-50 min-w-[180px]"
          >
            <button
              onClick={() => { shareToWhatsApp(title, shareUrl); setShowShareMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-surface-700/50 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span>WhatsApp</span>
            </button>
            
            <button
              onClick={() => { shareToTwitter(title, shareUrl); setShowShareMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-surface-700/50 hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
              <span>Twitter</span>
            </button>
            
            <button
              onClick={() => { handleCopyLink(); setShowShareMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-surface-700/50 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

