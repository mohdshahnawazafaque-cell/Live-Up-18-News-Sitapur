import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NewsArticle } from '../types';

interface BookmarkContextType {
  savedArticles: NewsArticle[];
  toggleBookmark: (article: NewsArticle) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('liveup18_bookmarks');
    if (saved) {
      try {
        setSavedArticles(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing bookmarks");
      }
    }
  }, []);

  const toggleBookmark = (article: NewsArticle) => {
    setSavedArticles(prev => {
      const isSaved = prev.some(a => a.id === article.id);
      let updated;
      if (isSaved) {
        updated = prev.filter(a => a.id !== article.id);
      } else {
        updated = [article, ...prev];
      }
      localStorage.setItem('liveup18_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (id: string) => {
    return savedArticles.some(a => a.id === id);
  };

  return (
    <BookmarkContext.Provider value={{ savedArticles, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
