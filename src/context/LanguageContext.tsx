import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('liveup18_lang') as Language;
    if (saved && (saved === 'hi' || saved === 'en')) {
      setLanguageState(saved);
    } else {
      setLanguageState('hi');
      localStorage.setItem('liveup18_lang', 'hi');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('liveup18_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Helper functions for content
export const getLocalizedText = (item: any, field: string, lang: Language): string => {
  if (lang === 'en' && item[`${field}En`]) {
    return item[`${field}En`];
  }
  
  if (field === 'headline') {
    return item['headlineHi'] || item['headline'] || item['title'] || '';
  }
  if (field === 'shortSummary') {
    return item['shortSummaryHi'] || item['shortSummary'] || '';
  }
  if (field === 'content') {
    return item['contentHi'] || item['content'] || '';
  }

  return item[field] || '';
};

export const getLocalizedArray = (item: any, field: string, lang: Language): string[] => {
  if (lang === 'en' && item[`${field}En`] && item[`${field}En`].length > 0) {
    return item[`${field}En`];
  }
  
  if (field === 'keyPoints') {
    return item['keyPointsHi'] || item['keyPoints'] || [];
  }
  return item[field] || [];
};
