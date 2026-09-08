export interface NewsArticle {
  id: string;
  category: string;
  state?: string;
  district?: string;
  headline: string;
  headlineEn?: string;
  featuredImage: string;
  publicationDate: string;
  updatedDate: string;
  author: string;
  shortSummary: string;
  shortSummaryEn?: string;
  keyPoints: string[];
  keyPointsEn?: string[];
  content: string;
  contentEn?: string;
  sourceAttribution: string;
  sourceUrl?: string;
  relatedNewsIds?: string[];
  isBreaking?: boolean;
  videoUrl?: string;
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface State {
  id: string;
  name: string;
  districts: string[];
}

export interface Advertisement {
  id: string;
  imageUrl: string;
  linkUrl: string;
  position: 'home_top' | 'home_middle' | 'article_sidebar' | 'article_bottom';
  active: boolean;
  createdAt: string;
}
