const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Update NAV_ITEMS for Urdu
const navItemsRegex = /const NAV_ITEMS = \[[\s\S]*?\];/;
const newNavItems = `const NAV_ITEMS = [
  { en: "HOME", hi: "होम", ur: "ہوم", path: "/" },
  { en: "INDIA", hi: "भारत", ur: "بھارت", path: "/category/india" },
  { en: "UTTAR PRADESH", hi: "उत्तर प्रदेश", ur: "اتر پردیش", path: "/category/uttar-pradesh" },
  { en: "UP DISTRICTS", hi: "यूपी के ज़िले", ur: "یوپی کے اضلاع", path: "/districts" },
  { en: "POLITICS", hi: "राजनीति", ur: "سیاست", path: "/category/politics" },
  { en: "CRIME", hi: "क्राइम", ur: "جرائم", path: "/category/crime" },
  { en: "WEATHER", hi: "मौसम", ur: "موسم", path: "/category/weather" },
  { en: "BUSINESS", hi: "बिज़नेस", ur: "کاروبار", path: "/category/business" },
  { en: "SPORTS", hi: "खेल", ur: "کھیل", path: "/category/sports" },
  { en: "ENTERTAINMENT", hi: "मनोरंजन", ur: "تفریح", path: "/category/entertainment" },
  { en: "TECHNOLOGY", hi: "टेक", ur: "ٹیکنالوجی", path: "/category/technology" },
  { en: "EDUCATION", hi: "शिक्षा", ur: "تعلیم", path: "/category/education" },
  { en: "HEALTH", hi: "स्वास्थ्य", ur: "صحت", path: "/category/health" },
  { en: "WORLD", hi: "दुनिया", ur: "دنیا", path: "/category/world" },
  { en: "VIDEO NEWS", hi: "वीडियो", ur: "ویڈیو", path: "/category/video-news" },
  { en: "PHOTO GALLERY", hi: "फ़ोटो", ur: "تصاویر", path: "/category/photo-gallery" },
  { en: "TEAM", hi: "हमारी टीम", ur: "ہماری ٹیم", path: "/team" }
];`;
code = code.replace(navItemsRegex, newNavItems);

// Add language switcher in Top Nav
const topNavLangs = `
          <div className="flex gap-4 items-center">
            <select 
               value={language}
               onChange={(e) => setLanguage(e.target.value as 'hi' | 'en' | 'ur')}
               className="bg-transparent text-slate-300 border-none outline-none text-xs font-bold cursor-pointer hover:text-white"
            >
               <option value="hi" className="text-black">हिंदी</option>
               <option value="en" className="text-black">English</option>
               <option value="ur" className="text-black">اردو</option>
            </select>
            <span className="text-slate-600">|</span>`;
            
if (code.includes('<div className="flex gap-4 items-center">')) {
  // Try to find the exact block and replace it
  const regex = /<div className="flex gap-4 items-center">[\s\S]*?<Link to="\/admin"/;
  if(code.match(regex)) {
      code = code.replace(regex, topNavLangs + `\n            <Link to="/admin"`);
  }
}

// Ensure the item.hi : item.en is updated to support urdu in the map functions
code = code.replace(/language === 'hi' \? item\.hi : item\.en/g, "language === 'ur' ? item.ur : (language === 'hi' ? item.hi : item.en)");

fs.writeFileSync('src/components/Header.tsx', code);
