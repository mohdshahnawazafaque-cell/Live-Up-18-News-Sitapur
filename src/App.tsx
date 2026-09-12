import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Districts from "./pages/Districts";
import LiveStudio from "./pages/LiveStudio";
import Article from "./pages/Article";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import Team from "./pages/Team";
import { LanguageProvider } from "./context/LanguageContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import { HelmetProvider } from "react-helmet-async";
import Bookmarks from "./pages/Bookmarks";
import Shorts from "./pages/Shorts";
import InstallPage from "./pages/InstallPage";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {

  useEffect(() => {
    // Suppress console errors about quota or share cancel
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const msg = typeof args[0] === 'string' ? args[0] : (args[0]?.message || '');
      if (
        msg.includes('Quota limit exceeded') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('Error fetching live TV config') ||
        msg.includes('Share canceled')
      ) {
        return; // Ignore expected quota or share cancellation notices
      }
      originalConsoleError.apply(console, args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const [quotaError, setQuotaError] = useState(false);
  
  // Intercept unhandled promise rejections to check for quota errors globally
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Quota limit exceeded')) {
        event.preventDefault();
        setQuotaError(true);
      }
    };
    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, []);

  return (
    <ThemeProvider>
      <HelmetProvider>
    <BookmarkProvider>
      <LanguageProvider>
        <BrowserRouter>
        <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="category/:id" element={<Category />} />
              <Route path="article/:id" element={<Article />} />
              <Route path="search" element={<Search />} />
              <Route path="admin" element={<Admin />} />
              <Route path="districts" element={<Districts />} />
              <Route path="live-studio" element={<LiveStudio />} />
              <Route path="team" element={<Team />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="shorts" element={<Shorts />} />
              <Route path="install" element={<InstallPage />} />
              <Route path="download" element={<InstallPage />} />
              <Route path="app" element={<InstallPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
      </BookmarkProvider>
    </HelmetProvider>
    </ThemeProvider>
  );
}
