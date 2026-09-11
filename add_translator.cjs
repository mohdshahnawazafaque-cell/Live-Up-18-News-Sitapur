const fs = require('fs');

// 1. Update index.html with Google Translate and React Crash Prevention
let indexCode = fs.readFileSync('index.html', 'utf8');

const injection = `    <style>
      .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
      body { top: 0px !important; position: static !important; }
      #google_translate_element { display: none !important; }
      .skiptranslate > iframe { display: none !important; }
    </style>
    <script>
      // Prevent React crashes from Google Translate DOM mutations
      if (typeof Node === 'function' && Node.prototype) {
        const originalRemoveChild = Node.prototype.removeChild;
        Node.prototype.removeChild = function(child) {
          if (child.parentNode !== this) {
            return child;
          }
          return originalRemoveChild.apply(this, arguments);
        };
        const originalInsertBefore = Node.prototype.insertBefore;
        Node.prototype.insertBefore = function(newNode, referenceNode) {
          if (referenceNode && referenceNode.parentNode !== this) {
            return newNode;
          }
          return originalInsertBefore.apply(this, arguments);
        };
      }
    </script>
  </head>
  <body>
    <div id="google_translate_element"></div>
    <script type="text/javascript">
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'hi',
          includedLanguages: 'hi,en,ur',
          autoDisplay: false
        }, 'google_translate_element');
      }
    </script>
    <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    <div id="root"></div>`;

if(!indexCode.includes('google_translate_element')) {
    indexCode = indexCode.replace(/<\/head>\s*<body>\s*<div id="root"><\/div>/, injection);
    fs.writeFileSync('index.html', indexCode);
}


// 2. Update LanguageContext.tsx to set the googtrans cookie and trigger reload
const contextContent = `import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'hi' | 'en' | 'ur';

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
    if (saved && (saved === 'hi' || saved === 'en' || saved === 'ur')) {
      setLanguageState(saved);
      if (saved === 'ur') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    } else {
      setLanguageState('hi');
      localStorage.setItem('liveup18_lang', 'hi');
      document.documentElement.dir = 'ltr';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('liveup18_lang', lang);
    
    if (lang === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    const domain = window.location.hostname;
    // Set cookie for Google Translate
    if (lang === 'hi') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + domain;
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + domain;
    } else {
      document.cookie = \`googtrans=/hi/\${lang}; path=/;\`;
      document.cookie = \`googtrans=/hi/\${lang}; path=/; domain=\${domain}\`;
      document.cookie = \`googtrans=/hi/\${lang}; path=/; domain=.\${domain}\`;
    }
    
    // Reload page to let Google Translate script pick up the new cookie instantly
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const getLocalizedText = (item: any, field: string, lang: Language): string => {
  // Google Translate will auto-translate the DOM. 
  // We still provide specific fields if they were manually written by admin, otherwise default to base content.
  if (lang === 'en' && item[\`\${field}En\`]) return item[\`\${field}En\`];
  if (lang === 'ur' && item[\`\${field}Ur\`]) return item[\`\${field}Ur\`];
  
  if (field === 'headline') return item['headlineHi'] || item['headline'] || item['title'] || '';
  if (field === 'shortSummary') return item['shortSummaryHi'] || item['shortSummary'] || '';
  if (field === 'content') return item['contentHi'] || item['content'] || '';
  return item[field] || '';
};

export const getLocalizedArray = (item: any, field: string, lang: Language): string[] => {
  if (lang === 'en' && item[\`\${field}En\`] && item[\`\${field}En\`].length > 0) return item[\`\${field}En\`];
  if (lang === 'ur' && item[\`\${field}Ur\`] && item[\`\${field}Ur\`].length > 0) return item[\`\${field}Ur\`];
  
  if (field === 'keyPoints') return item['keyPointsHi'] || item['keyPoints'] || [];
  return item[field] || [];
};
`;

fs.writeFileSync('src/context/LanguageContext.tsx', contextContent);
