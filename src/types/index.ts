export interface NewsArticle {
  _id?: string;
  article_id: string;
  title: string;
  link: string;
  description?: string;
  content?: string;
  image_url?: string;
  pubDate: string;
  creator?: string[];
  source_name?: string;
  source_id?: string;
  category?: string[];
  keywords?: string[];
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
}

export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

