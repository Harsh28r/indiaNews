// Video News Section - Trending YouTube Videos via RSS
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Youtube, ExternalLink, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Video {
  id: string;
  title: string;
  channel: string;
  channelId: string;
  thumbnail: string;
  publishedAt: string;
  views: string | null;
  url: string;
}

interface Channel {
  name: string;
  url: string;
}

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const videosPerPage = 4;
  const totalPages = Math.ceil(videos.length / videosPerPage);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/videos/trending');
      if (res.data.success) {
        setVideos(res.data.data || []);
        setChannels(res.data.channels || []);
      }
    } catch {
      setVideos([]);
      // Fallback to some default channels
      setChannels([
        { name: 'CNBC-TV18', url: 'https://www.youtube.com/@ABORAD' },
        { name: 'ET Now', url: 'https://www.youtube.com/@ETNowNewsNetwork' },
        { name: 'Zee Business', url: 'https://www.youtube.com/@zeaboradofficial' },
        { name: 'NDTV Profit', url: 'https://www.youtube.com/@ndtvprofit' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const currentVideos = videos.slice(
    currentPage * videosPerPage,
    (currentPage + 1) * videosPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <section className="py-12 px-4 bg-surface-800/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <Youtube className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Video News</h2>
              <p className="text-sm text-gray-400">Latest from Indian finance channels</p>
            </div>
          </div>
          
          {/* Navigation & Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchVideos}
              disabled={loading}
              className="p-2 bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors"
              title="Refresh videos"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {totalPages > 1 && (
              <>
                <button
                  onClick={prevPage}
                  className="p-2 bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <span className="text-sm text-gray-500 px-2">
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  className="p-2 bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-4xl bg-surface-800 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{selectedVideo.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{selectedVideo.channel}</span>
                  {selectedVideo.views && (
                    <>
                      <span>•</span>
                      <span>{selectedVideo.views} views</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatTimeAgo(selectedVideo.publishedAt)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && videos.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        )}

        {/* Video Grid */}
        {!loading && videos.length === 0 ? (
          <div className="text-center py-12">
            <Youtube className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No videos available. Check out the channels below!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {currentVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedVideo(video)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/480x270/1a1a2e/ff9933?text=${encodeURIComponent(video.channel)}`;
                    }}
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* Time Ago Badge */}
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                    {formatTimeAgo(video.publishedAt)}
                  </span>

                  {/* YouTube Badge */}
                  <div className="absolute top-2 left-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                  </div>
                </div>

                <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-saffron-400 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{video.channel}</span>
                  {video.views && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{video.views} views</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Channel Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-surface-700">
          <span className="text-sm text-gray-500">Watch more on:</span>
          {channels.map((channel) => (
            <a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-surface-700 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-sm rounded-full transition-colors"
            >
              <Youtube className="w-4 h-4" />
              {channel.name}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
