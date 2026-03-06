import axios from 'axios';
import type { NewsArticle, ApiResponse } from '../types';

// Always use same-origin API path. On Vercel, vercel.json rewrites /api/* to backend.
const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Premium Indian news sources (no TOI) - better brands with more RSS feeds
const RSS_BY_CATEGORY: Record<string, string[]> = {
  all: [
    '/fetch-ht-top-rss', '/fetch-ndtv-top-rss', '/fetch-ie-top-rss',
    '/fetch-et-markets-rss', '/fetch-thehindu-india-rss', '/fetch-livemint-markets-rss',
    '/fetch-bs-markets-rss', '/fetch-bs-economy-rss'
  ],
  markets: [
    '/fetch-et-markets-rss', '/fetch-et-stocks-rss', '/fetch-livemint-markets-rss',
    '/fetch-bs-markets-rss', '/fetch-bs-companies-rss', '/fetch-et-commodities-rss'
  ],
  stocks: ['/fetch-et-stocks-rss', '/fetch-et-ipo-rss', '/fetch-bs-companies-rss', '/fetch-bs-markets-rss'],
  business: [
    '/fetch-bs-economy-rss', '/fetch-et-commodities-rss', '/fetch-et-forex-rss',
    '/fetch-livemint-money-rss', '/fetch-et-mutualfunds-rss', '/fetch-bs-markets-rss'
  ],
  entertainment: [
    '/fetch-ht-entertainment-rss', '/fetch-ndtv-entertainment-rss', 
    '/fetch-et-entertainment-rss', '/fetch-filmfare-rss'
  ],
  bollywood: ['/fetch-ht-entertainment-rss', '/fetch-filmfare-rss', '/fetch-ndtv-entertainment-rss', '/fetch-et-entertainment-rss'],
  politics: [
    '/fetch-ndtv-india-rss', '/fetch-ie-politics-rss',
    '/fetch-ht-india-rss', '/fetch-thehindu-india-rss'
  ],
  india: ['/fetch-ht-india-rss', '/fetch-ndtv-india-rss', '/fetch-thehindu-india-rss', '/fetch-ie-politics-rss'],
  world: [
    '/fetch-ht-world-rss', '/fetch-ndtv-world-rss',
    '/fetch-ie-world-rss', '/fetch-thehindu-world-rss'
  ],
  sports: ['/fetch-ht-cricket-rss', '/fetch-espn-india-rss', '/fetch-ndtv-india-rss'],
  tech: ['/fetch-et-tech-rss', '/fetch-gadgets360-rss', '/fetch-ndtv-india-rss'],
  lifestyle: ['/fetch-ht-lifestyle-rss', '/fetch-ndtv-india-rss'],
  trending: ['/fetch-ht-top-rss', '/fetch-ndtv-top-rss', '/fetch-ie-top-rss', '/fetch-thehindu-india-rss', '/fetch-livemint-markets-rss']
};

// Fetch news from all sources (default feed) - optimized
export const fetchNews = async (page = 1, limit = 20): Promise<ApiResponse<NewsArticle[]>> => {
  try {
    // Try News collection first (persisted articles)
    const { data } = await api.get(`/news?page=${page}&limit=${limit}`);
    if (data.data?.length > 0) return data;
  } catch {
    // fallback to RSS
  }

  // Fetch from RSS feeds
  return fetchByCategory('all', page, limit);
};

// Fetch by category (optimized - parallel requests, faster)
export const fetchByCategory = async (category: string, page = 1, limit = 12) => {
  const endpoints = RSS_BY_CATEGORY[category.toLowerCase()] || RSS_BY_CATEGORY.all;
  const slice = endpoints.slice(0, 6);
  const perFeed = Math.ceil(limit / Math.min(endpoints.length, 6));
  
  // Fetch all in parallel (backend handles rate limiting, no frontend delays needed)
  const promises = slice.map(endpoint => 
    api.get(`${endpoint}?page=${page}&limit=${perFeed}`)
      .then(r => ({ status: 'fulfilled' as const, value: r }))
      .catch(e => ({ status: 'rejected' as const, reason: e }))
  );
  
  const results = await Promise.all(promises);

  const articles: NewsArticle[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.data?.data) {
      articles.push(...result.value.data.data);
    }
  }

  // Sort by date, newest first
  articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  
  // Remove duplicates by link (more reliable than title)
  const seen = new Set<string>();
  const unique = articles.filter(a => {
    const key = a.link || a.article_id || a.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  return { success: true, data: unique.slice(0, limit) };
};

export const fetchArticle = async (articleId: string): Promise<ApiResponse<NewsArticle>> => {
  const { data } = await api.get(`/news/${articleId}`);
  return data;
};

export const searchNews = async (query: string, limit = 30): Promise<ApiResponse<NewsArticle[]>> => {
  const { data } = await api.get(`/search-db-news?query=${encodeURIComponent(query)}&limit=${limit}`);
  return data;
};

// Trending from Indian sources
export const fetchTrendingNews = async (): Promise<ApiResponse<NewsArticle[]>> => {
  return fetchByCategory('trending', 1, 10);
};

// Mock Indian indices data (replace with real API like NSE/BSE)
export const fetchIndianIndices = async () => {
  return {
    success: true,
    data: [
      { name: 'NIFTY 50', value: 24650.50, change: 125.30, changePercent: 0.51 },
      { name: 'SENSEX', value: 81245.75, change: 420.15, changePercent: 0.52 },
      { name: 'NIFTY BANK', value: 52180.20, change: -85.40, changePercent: -0.16 },
      { name: 'NIFTY IT', value: 38920.80, change: 245.60, changePercent: 0.63 },
      { name: 'NIFTY MIDCAP', value: 56340.15, change: 180.25, changePercent: 0.32 },
    ]
  };
};

export default api;
