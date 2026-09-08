import React from "react";
import { useEffect, useState } from "react";
import { Trash2, RefreshCw, Plus, Globe, Settings, Newspaper } from "lucide-react";
import { NewsArticle } from "../types";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";

export default function Admin() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("adminToken") !== null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [newSource, setNewSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">LIVE UP 18</h1>
            <p className="text-slate-500 font-medium">Admin Portal Login</p>
          </div>
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Admin Email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors shadow-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      const [newsRes, sourcesRes] = await Promise.all([
        fetch("/api/news?limit=100"),
        fetch("/api/admin/sources")
      ]);
      const newsData = await newsRes.json();
      const sourcesData = await sourcesRes.json();
      
      setNews(newsData.articles || []);
      setSources(sourcesData.sources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async () => {
    if (!newSource) return;
    try {
      await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newSource })
      });
      setNewSource("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSource = async (url: string) => {
    try {
      await fetch("/api/admin/sources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerAIFetch = async () => {
    setIsProcessing(true);
    try {
      for (const source of sources) {
        await fetch("/api/admin/ingest-rss", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: source })
        });
      }
      await fetchData();
      alert("AI Partner has finished processing feeds!");
    } catch (err) {
      console.error(err);
      alert("Error occurred while AI was fetching news.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Admin Panel...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase flex items-center gap-2">
            <Settings className="text-red-600" size={32} />
            Admin & AI Partner Dashboard
          </h1>
          <p className="text-slate-600 mt-2 font-medium">
            आपका AI पार्टनर हर घंटे स्वचालित रूप से (automatically) यहाँ दिए गए RSS Feeds से न्यूज़ लाकर प्रोसेस करेगा। आप भी जब चाहें मैन्युअली ट्रिगर कर सकते हैं।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-slate-200 text-slate-800 px-4 py-2 rounded font-bold hover:bg-slate-300 transition-colors text-sm"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Globe size={20} /> AI News Sources (RSS)
              </h2>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="https://example.com/rss"
                  className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                />
                <button 
                  onClick={handleAddSource}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {sources.map((src, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded text-sm">
                    <span className="truncate mr-2 flex-1 text-slate-700" title={src}>{src}</span>
                    <button onClick={() => handleDeleteSource(src)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="bg-slate-900 text-white p-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <RefreshCw size={20} /> Manual AI Fetch
              </h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600 mb-4">
                AI पार्टनर बैकग्राउंड में अपने आप काम कर रहा है, लेकिन आप अभी तुरंत ताज़ा ख़बरें लाने के लिए इसे कमांड दे सकते हैं।
              </p>
              <button 
                onClick={handleTriggerAIFetch}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
              >
                {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                {isProcessing ? "AI is Working..." : "Ask AI to Fetch Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - News Manager */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Newspaper size={20} /> Published News ({news.length})
              </h2>
            </div>
            <div className="p-0 overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Headline</th>
                    <th className="px-4 py-3 w-24">Category</th>
                    <th className="px-4 py-3 w-24">Date</th>
                    <th className="px-4 py-3 w-16 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map(article => (
                    <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="line-clamp-1" title={getLocalizedText(article, 'headline', language)}>
                          {getLocalizedText(article, 'headline', language)}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">{article.sourceAttribution}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold">{article.category}</span>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        {new Date(article.publicationDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDeleteNews(article.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete News"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {news.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No news articles published yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
