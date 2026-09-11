import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Moon, Sun, PhoneCall, Bookmark, Film, Languages } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { format } from "date-fns";
import { hi, enUS } from "date-fns/locale";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import InstallPWA from "./InstallPWA";
import PushNotificationManager from "./PushNotificationManager";

const NAV_ITEMS = [
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
];

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy", { locale: language === 'hi' ? hi : enUS });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  
  return (
    <header className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white sticky top-0 z-50 border-b-2 border-slate-900 dark:border-white shadow-sm transition-colors">
      {/* Premium Top Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <div>{currentDate}</div>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-1">
              {language === 'hi' ? 'एडमिन' : 'Admin'}
            </Link>
            <div className="flex gap-3">
              <button onClick={() => setLanguage('en')} className={`transition-colors ${language === 'en' ? 'text-red-700 dark:text-red-500 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}>English</button>
              <button onClick={() => setLanguage('hi')} className={`transition-colors ${language === 'hi' ? 'text-red-700 dark:text-red-500 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}>हिंदी</button>
              <button onClick={() => setLanguage('ur')} className={`transition-colors ${language === 'ur' ? 'text-red-700 dark:text-red-500 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}>اردو</button>
            </div>
            <button onClick={toggleTheme} className="hover:text-slate-900 dark:hover:text-white transition-colors" title="Toggle Dark Mode">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Area */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden hover:text-red-600 transition-colors">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <Link to="/" className="flex-shrink-0 flex items-center z-10">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tighter text-slate-900 dark:text-white leading-none [text-shadow:1px_1px_0_#991b1b] italic">
                  LIVE UP
                </span>
                <span className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-red-600 dark:text-red-500 leading-none italic -ml-1">
                  18
                </span>
              </div>
              <div className="bg-red-700 dark:bg-red-600 px-3 sm:px-6 py-0.5 sm:py-1 rounded shadow-sm mt-1 sm:mt-1.5 ml-1">
                <span className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.4em] sm:tracking-[0.8em] text-white leading-none block ml-1">
                  NEWS
                </span>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex relative items-center">
            <Search size={16} className="absolute left-3 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'खोजें...' : 'Search...'}
              className="w-48 xl:w-64 bg-slate-100 dark:bg-slate-900 border-none text-slate-900 dark:text-white pl-9 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all text-sm font-medium placeholder-slate-400"
            />
          </form>
          <Link to="/shorts" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500" title="News Shorts">
            <Film size={20} />
          </Link>
          <Link to="/bookmarks" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500" title="Saved News">
            <Bookmark size={20} />
          </Link>
          <PushNotificationManager className="flex items-center gap-1.5 font-bold py-1.5 px-4 rounded-full text-xs transition-colors border shadow-sm ml-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-200 dark:text-black border-transparent" />
          <InstallPWA className="flex items-center gap-1.5 font-bold py-1.5 px-4 rounded-full text-xs transition-colors border shadow-sm bg-red-700 hover:bg-red-800 text-white border-transparent" />
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="border-t border-slate-100 dark:border-slate-800 hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between py-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.en} className="flex-1 text-center">
                <Link 
                  to={item.path}
                  className="block px-2 py-3 text-[11px] xl:text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors uppercase tracking-wider"
                >
                  {language === 'ur' ? item.ur : (language === 'hi' ? item.hi : item.en)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 shadow-xl border-t border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[85vh]">
          {/* Mobile Quick Actions Grid */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
            <InstallPWA className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-3 rounded-lg text-sm transition-colors shadow-sm w-full" />
            <PushNotificationManager className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 font-bold py-2.5 px-3 rounded-lg text-sm transition-colors shadow-sm w-full" />
            
            <div className="flex bg-white dark:bg-black rounded-lg p-1 justify-between col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
              <button onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={`flex-1 text-center py-2 text-xs font-bold rounded ${language === 'en' ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-600 dark:text-slate-400'}`}>English</button>
              <button onClick={() => { setLanguage('hi'); setIsMobileMenuOpen(false); }} className={`flex-1 text-center py-2 text-xs font-bold rounded ${language === 'hi' ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-600 dark:text-slate-400'}`}>हिंदी</button>
              <button onClick={() => { setLanguage('ur'); setIsMobileMenuOpen(false); }} className={`flex-1 text-center py-2 text-xs font-bold rounded ${language === 'ur' ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-600 dark:text-slate-400'}`}>اردو</button>
            </div>
            
            <div className="col-span-2 flex gap-3">
              <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                {theme === 'dark' ? <><Sun size={16} /> Light</> : <><Moon size={16} /> Dark</>}
              </button>
              <Link to="/shorts" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Film size={16} /> Shorts
              </Link>
              <Link to="/bookmarks" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Bookmark size={16} /> Saved
              </Link>
            </div>
          </div>
          
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.en}>
                <Link 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/50"
                >
                  {language === 'ur' ? item.ur : (language === 'hi' ? item.hi : item.en)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );

}
