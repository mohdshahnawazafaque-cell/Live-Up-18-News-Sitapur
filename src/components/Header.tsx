import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Moon, Sun, PhoneCall, Bookmark, Film } from "lucide-react";
import { format } from "date-fns";
import { hi, enUS } from "date-fns/locale";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import InstallPWA from "./InstallPWA";

const NAV_ITEMS = [
  { en: "HOME", hi: "होम", path: "/" },
  { en: "INDIA", hi: "भारत", path: "/category/india" },
  { en: "UTTAR PRADESH", hi: "उत्तर प्रदेश", path: "/category/uttar-pradesh" },
  { en: "UP DISTRICTS", hi: "यूपी के ज़िले", path: "/districts" },
  { en: "POLITICS", hi: "राजनीति", path: "/category/politics" },
  { en: "CRIME", hi: "क्राइम", path: "/category/crime" },
  { en: "WEATHER", hi: "मौसम", path: "/category/weather" },
  { en: "BUSINESS", hi: "बिज़नेस", path: "/category/business" },
  { en: "SPORTS", hi: "खेल", path: "/category/sports" },
  { en: "ENTERTAINMENT", hi: "मनोरंजन", path: "/category/entertainment" },
  { en: "TECHNOLOGY", hi: "टेक", path: "/category/technology" },
  { en: "EDUCATION", hi: "शिक्षा", path: "/category/education" },
  { en: "HEALTH", hi: "स्वास्थ्य", path: "/category/health" },
  { en: "WORLD", hi: "दुनिया", path: "/category/world" },
  { en: "VIDEO NEWS", hi: "वीडियो", path: "/category/video-news" },
  { en: "PHOTO GALLERY", hi: "फ़ोटो", path: "/category/photo-gallery" },
  { en: "TEAM", hi: "हमारी टीम", path: "/team" }
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
    <header className="bg-slate-900 dark:bg-slate-950 text-white sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <div className="border-b border-slate-700 bg-slate-950 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center text-sm text-slate-300">
          <div>{currentDate}</div>
          <div className="flex items-center gap-2 text-green-400 font-bold bg-green-900/30 px-3 py-1 rounded-full text-xs md:text-sm border border-green-800/50">
            <PhoneCall size={14} className="animate-pulse" />
            <a href="tel:+919956078419">Call: +91 99560 78419</a>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/admin" className="hover:text-red-400 font-bold text-red-500 transition-colors mr-2 flex items-center gap-1">
              {language === 'hi' ? 'एडमिन' : 'Admin'}
            </Link>
            <button 
              onClick={() => setLanguage('en')}
              className={`transition-colors ${language === 'en' ? 'text-white font-bold' : 'hover:text-white'}`}
            >
              English News
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              className={`transition-colors ${language === 'hi' ? 'text-white font-bold' : 'hover:text-white'}`}
            >
              Hindi News
            </button>
            <Link to="/shorts" className="ml-2 p-1 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-red-400" title="News Shorts">
              <Film size={16} />
            </Link>
            <Link to="/bookmarks" className="ml-2 p-1 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-red-400" title="Saved News">
              <Bookmark size={16} />
            </Link>
            <InstallPWA />
            <button 
              onClick={toggleTheme} 
              className="ml-2 p-1 rounded-full hover:bg-slate-800 transition-colors"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden text-white hover:text-red-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 z-10 py-1">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-3xl sm:text-[2.75rem] font-black tracking-tighter text-white leading-none [text-shadow:1px_2px_0_#991b1b,2px_4px_0_#7f1d1d,3px_5px_8px_rgba(0,0,0,0.9)] italic">
                  LIVE UP
                </span>
                <span className="text-4xl sm:text-[3.25rem] font-black text-red-500 leading-none [text-shadow:1px_2px_0_#ffffff,2px_3px_0_#cbd5e1,3px_5px_10px_rgba(0,0,0,0.9)] italic -ml-1">
                  18
                </span>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-red-800 px-3 sm:px-6 py-0.5 sm:py-1 rounded shadow-[0px_3px_5px_rgba(0,0,0,0.5)] mt-1 sm:mt-1.5 ml-1 border border-red-500">
                <span className="text-xs sm:text-base font-black tracking-[0.4em] sm:tracking-[0.8em] text-white leading-none block ml-1 [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">
                  NEWS
                </span>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center">
          <form onSubmit={handleSearch} className="flex relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'खोजें...' : 'Search...'}
              className="w-full lg:w-64 bg-slate-800 dark:bg-slate-900 border border-slate-700 text-white px-4 py-2 pr-10 rounded-full focus:outline-none focus:border-red-500 transition-colors text-sm"
            />
            <button type="submit" className="absolute right-1 top-1 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors focus:outline-none">
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-red-700 dark:bg-red-900 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-start py-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.en} className="whitespace-nowrap">
                <Link 
                  to={item.path}
                  className="inline-block px-3 py-2 text-sm font-bold text-white hover:bg-red-800 dark:hover:bg-red-950 transition-colors uppercase"
                >
                  {language === 'hi' ? item.hi : item.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="bg-red-800 dark:bg-red-950 lg:hidden absolute top-full left-0 right-0 shadow-xl border-t border-red-700">
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.en}>
                <Link 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-bold text-white hover:bg-red-900 transition-colors uppercase border-b border-red-700/50"
                >
                  {language === 'hi' ? item.hi : item.en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
