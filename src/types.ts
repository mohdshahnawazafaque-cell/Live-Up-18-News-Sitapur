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
