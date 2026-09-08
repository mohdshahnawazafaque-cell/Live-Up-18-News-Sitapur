import React from "react";
import { useEffect, useState } from "react";
import { Trash2, RefreshCw, Plus, Globe, Settings, Newspaper } from "lucide-react";
import { NewsArticle } from "../types";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, addDoc, setDoc } from "firebase/firestore";
import { db, storage, auth } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";

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
    if (email === "liveup18news@gmail.com" && password === "Sh@sahiba9653") {
      try {
        await signInAnonymously(auth);
        localStorage.setItem("adminToken", "admin-auth-token-123");
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Firebase auth error:", err);
        // Fallback if anonymous auth is disabled
        localStorage.setItem("adminToken", "admin-auth-token-123");
        setIsLoggedIn(true);
      }
    } else {
      setLoginError("Invalid credentials");
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
      const q = query(collection(db, "news"), orderBy("publicationDate", "desc"), limit(100));
      const snap = await getDocs(q);
      const articles: NewsArticle[] = [];
      snap.forEach(doc => articles.push({ id: doc.id, ...doc.data() } as NewsArticle));
      setNews(articles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if(!confirm("Are you sure you want to delete this news?")) return;
    try {
      await deleteDoc(doc(db, "news", id));
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
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
      alert("Finished processing feeds!");
    } catch (err) {
      console.error(err);
      alert("Error occurred while fetching news.");
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
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-2 font-medium">
            यह न्यूज़ पोर्टल का एडमिन डैशबोर्ड है।
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
                <Plus size={20} /> Add News Manually
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsProcessing(true);
                try {
                  const form = e.target as HTMLFormElement;
                  const imageFile = (form.imageFile as HTMLInputElement).files?.[0];
                  const videoFile = (form.videoFile as HTMLInputElement).files?.[0];
                  
                  let finalImageUrl = (form.imageUrl as HTMLInputElement).value;
                  let finalVideoUrl = (form.videoUrl as HTMLInputElement).value;

                  // Upload Image if selected
                  if (imageFile) {
                    const imgRef = ref(storage, `news-images/${Date.now()}-${imageFile.name}`);
                    await uploadBytes(imgRef, imageFile);
                    finalImageUrl = await getDownloadURL(imgRef);
                  }

                  // Upload Video if selected
                  if (videoFile) {
                    const vidRef = ref(storage, `news-videos/${Date.now()}-${videoFile.name}`);
                    await uploadBytes(vidRef, videoFile);
                    finalVideoUrl = await getDownloadURL(vidRef);
                  }

                  if (!finalImageUrl) {
                    finalImageUrl = 'https://picsum.photos/seed/' + Math.random() + '/800/450';
                  }

                  const newsItem = {
                    headline: (form.headline as HTMLInputElement).value,
                    category: (form.category as HTMLSelectElement).value,
                    content: (form.content as HTMLTextAreaElement).value,
                    featuredImage: finalImageUrl,
                    videoUrl: finalVideoUrl || null,
                    publicationDate: new Date().toISOString(),
                    author: "मो० शाहनवाज़",
                    sourceAttribution: "LIVE UP 18 NEWS"
                  };
                  await addDoc(collection(db, "news"), newsItem);
                  form.reset();
                  fetchData();
                  alert("News Added!");
                } catch(err) {
                  console.error(err);
                  alert("Error adding news: " + err.message);
                } finally {
                  setIsProcessing(false);
                }
              }} className="flex flex-col gap-3">
                <input name="headline" required placeholder="Headline" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                <select name="category" required className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600">
                  <option value="UTTAR PRADESH">Uttar Pradesh</option>
                  <option value="INDIA">India</option>
                  <option value="POLITICS">Politics</option>
                  <option value="CRIME">Crime</option>
                  <option value="BUSINESS">Business</option>
                  <option value="SPORTS">Sports</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                </select>
                
                <div className="flex flex-col gap-1 border border-slate-200 p-3 rounded bg-slate-50">
                  <label className="text-xs font-bold text-slate-700">Cover Image (Optional)</label>
                  <input name="imageFile" type="file" accept="image/*" className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                  <div className="text-center text-xs text-slate-400">OR</div>
                  <input name="imageUrl" placeholder="Paste Image URL" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                </div>

                <div className="flex flex-col gap-1 border border-slate-200 p-3 rounded bg-slate-50">
                  <label className="text-xs font-bold text-slate-700">Video (Optional)</label>
                  <input name="videoFile" type="file" accept="video/*" className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                  <div className="text-center text-xs text-slate-400">OR</div>
                  <input name="videoUrl" placeholder="Paste Video URL (e.g., YouTube embed)" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                </div>

                <textarea name="content" required placeholder="News Content..." rows="5" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600"></textarea>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="bg-slate-900 text-white py-2 rounded font-bold hover:bg-slate-800 disabled:bg-slate-400"
                >
                  {isProcessing ? "Adding..." : "Publish News"}
                </button>
              </form>
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
