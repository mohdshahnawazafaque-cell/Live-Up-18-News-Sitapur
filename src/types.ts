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
  tags?: string[];
  tagsEn?: string[];
  status?: "published" | "draft";
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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  mobile: string;
  details: string;
  photoUrl: string;
  createdAt: string;
}
export interface Comment {
  id: string;
  articleId: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface EPaper {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  active: boolean;
  createdAt: string;
}

export interface SiteConfig {
  id: string;
  liveTvUrl: string;
}
