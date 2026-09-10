import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Trash2, RefreshCw, Plus, Globe, Settings, Newspaper, Edit, X, MonitorPlay } from "lucide-react";
import { NewsArticle } from "../types";
import { getEmbedUrl } from "../lib/youtube";
import { useLanguage, getLocalizedText } from "../context/LanguageContext";
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, addDoc, setDoc, updateDoc, where } from "firebase/firestore";
import { db, storage, auth } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";

export default function Admin() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("adminToken") !== null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [newSource, setNewSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

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

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setIsProcessing(true);
    try {
      const form = e.target as HTMLFormElement;
      const imageFile = (form.imageFile as HTMLInputElement).files?.[0];
      
      let finalImageUrl = (form.imageUrl as HTMLInputElement).value || editingArticle.featuredImage;
      let rawVideoUrl = (form.videoUrl as HTMLInputElement).value;
      let finalVideoUrl = rawVideoUrl ? getEmbedUrl(rawVideoUrl) : editingArticle.videoUrl;

      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      if (imageFile) {
        if (imageFile.size > 1048576) {
            throw new Error("Image size must be less than 1MB.");
        }
        finalImageUrl = await toBase64(imageFile);
      }

      const updatedNewsItem = {
        headline: (form.headline as HTMLInputElement).value,
        category: (form.category as HTMLSelectElement).value,
        content: (form.content as HTMLTextAreaElement).value,
        featuredImage: finalImageUrl,
        videoUrl: finalVideoUrl,
        isBreaking: (form.isBreaking as HTMLInputElement).checked,
        author: (form.reporter as HTMLInputElement).value || "मो० शाहनवाज़",
      };

      await updateDoc(doc(db, "news", editingArticle.id), updatedNewsItem);
      
      setEditingArticle(null);
      await fetchData();
      alert("News updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update news");
    } finally {
      setIsProcessing(false);
    }
  };

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

                  // Helper to convert file to base64
                  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                  });

                  if (imageFile) {
                    if (imageFile.size > 1048576) { // 1MB limit for firestore
                        throw new Error("Image size must be less than 1MB. Please compress or use an Image URL instead.");
                    }
                    finalImageUrl = await toBase64(imageFile);
                  }

                  if (videoFile) {
                     throw new Error("Video file upload is not supported in this version. Please use a YouTube Video URL instead.");
                  }

                  if (!finalImageUrl) {
                    finalImageUrl = 'https://picsum.photos/seed/' + Math.random() + '/800/450';
                  }

                  const newsItem = {
                    headline: (form.headline as HTMLInputElement).value,
                    category: (form.category as HTMLSelectElement).value,
                    content: (form.content as HTMLTextAreaElement).value,
                    featuredImage: finalImageUrl,
                    videoUrl: finalVideoUrl ? getEmbedUrl(finalVideoUrl) : null,
                    isBreaking: (form.isBreaking as HTMLInputElement).checked,
                    publicationDate: new Date().toISOString(),
                    author: (form.reporter as HTMLInputElement).value || "मो० शाहनवाज़",
                    sourceAttribution: "LIVE UP 18 NEWS"
                  };
                  await addDoc(collection(db, "news"), newsItem);
                  form.reset();
                  fetchData();
                  alert("News Added!");
                } catch(err: any) {
                  console.error(err);
                  alert("Error adding news: " + err.message);
                } finally {
                  setIsProcessing(false);
                }
              }} className="flex flex-col gap-3">
                <input name="headline" required placeholder="Headline" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="isBreaking" className="w-4 h-4 accent-red-600" /> Mark as Breaking News (Ticker)</label>
                <select name="category" required className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600">
                                    <optgroup label="Main Categories">
                    <option value="INDIA">India</option>
                    <option value="UTTAR PRADESH">Uttar Pradesh</option>
                    <option value="POLITICS">Politics</option>
                    <option value="CRIME">Crime</option>
                    <option value="WEATHER">Weather (मौसम)</option>
                    <option value="BUSINESS">Business</option>
                    <option value="SPORTS">Sports</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                  </optgroup>
                  <optgroup label="UP Districts">
                    <option value="AGRA">Agra</option>
                    <option value="ALIGARH">Aligarh</option>
                    <option value="AMBEDKAR NAGAR">Ambedkar Nagar</option>
                    <option value="AMETHI">Amethi</option>
                    <option value="AMROHA">Amroha</option>
                    <option value="AURAIYA">Auraiya</option>
                    <option value="AYODHYA">Ayodhya</option>
                    <option value="AZAMGARH">Azamgarh</option>
                    <option value="BAGHPAT">Baghpat</option>
                    <option value="BAHRAICH">Bahraich</option>
                    <option value="BALLIA">Ballia</option>
                    <option value="BALRAMPUR">Balrampur</option>
                    <option value="BANDA">Banda</option>
                    <option value="BARABANKI">Barabanki</option>
                    <option value="BAREILLY">Bareilly</option>
                    <option value="BASTI">Basti</option>
                    <option value="BHADOHI">Bhadohi</option>
                    <option value="BIJNOR">Bijnor</option>
                    <option value="BUDAUN">Budaun</option>
                    <option value="BULANDSHAHR">Bulandshahr</option>
                    <option value="CHANDAULI">Chandauli</option>
                    <option value="CHITRAKOOT">Chitrakoot</option>
                    <option value="DEORIA">Deoria</option>
                    <option value="ETAH">Etah</option>
                    <option value="ETAWAH">Etawah</option>
                    <option value="FARRUKHABAD">Farrukhabad</option>
                    <option value="FATEHPUR">Fatehpur</option>
                    <option value="FIROZABAD">Firozabad</option>
                    <option value="GAUTAM BUDDHA NAGAR">Gautam Buddha Nagar</option>
                    <option value="GHAZIABAD">Ghaziabad</option>
                    <option value="GHAZIPUR">Ghazipur</option>
                    <option value="GONDA">Gonda</option>
                    <option value="GORAKHPUR">Gorakhpur</option>
                    <option value="HAMIRPUR">Hamirpur</option>
                    <option value="HAPUR">Hapur</option>
                    <option value="HARDOI">Hardoi</option>
                    <option value="HATHRAS">Hathras</option>
                    <option value="JALAUN">Jalaun</option>
                    <option value="JAUNPUR">Jaunpur</option>
                    <option value="JHANSI">Jhansi</option>
                    <option value="KANNAUJ">Kannauj</option>
                    <option value="KANPUR DEHAT">Kanpur Dehat</option>
                    <option value="KANPUR NAGAR">Kanpur Nagar</option>
                    <option value="KASGANJ">Kasganj</option>
                    <option value="KAUSHAMBI">Kaushambi</option>
                    <option value="KHERI">Kheri</option>
                    <option value="KUSHINAGAR">Kushinagar</option>
                    <option value="LALITPUR">Lalitpur</option>
                    <option value="LUCKNOW">Lucknow</option>
                    <option value="MAHARAJGANJ">Maharajganj</option>
                    <option value="MAHOBA">Mahoba</option>
                    <option value="MAINPURI">Mainpuri</option>
                    <option value="MATHURA">Mathura</option>
                    <option value="MAU">Mau</option>
                    <option value="MEERUT">Meerut</option>
                    <option value="MIRZAPUR">Mirzapur</option>
                    <option value="MORADABAD">Moradabad</option>
                    <option value="MUZAFFARNAGAR">Muzaffarnagar</option>
                    <option value="PILIBHIT">Pilibhit</option>
                    <option value="PRATAPGARH">Pratapgarh</option>
                    <option value="PRAYAGRAJ">Prayagraj</option>
                    <option value="RAEBARELI">Raebareli</option>
                    <option value="RAMPUR">Rampur</option>
                    <option value="SAHARANPUR">Saharanpur</option>
                    <option value="SAMBHAL">Sambhal</option>
                    <option value="SANT KABIR NAGAR">Sant Kabir Nagar</option>
                    <option value="SHAHJAHANPUR">Shahjahanpur</option>
                    <option value="SHAMLI">Shamli</option>
                    <option value="SHRAVASTI">Shravasti</option>
                    <option value="SIDDHARTHNAGAR">Siddharthnagar</option>
                    <option value="SITAPUR">Sitapur</option>
                    <option value="SONBHADRA">Sonbhadra</option>
                    <option value="SULTANPUR">Sultanpur</option>
                    <option value="UNNAO">Unnao</option>
                    <option value="VARANASI">Varanasi</option>
                  </optgroup>
                </select>
                
                <input name="reporter" placeholder="रिपोर्टर का नाम (Reporter Name)" defaultValue="मो० शाहनवाज़" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                
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
        

          
          
          {/* Poll Manager */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="bg-orange-600 text-white p-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} /> Add Public Poll
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsProcessing(true);
                try {
                  const form = e.target;
                  const poll = {
                    question: form.question.value,
                    options: [
                      { id: "opt1", text: form.opt1.value, votes: 0 },
                      { id: "opt2", text: form.opt2.value, votes: 0 }
                    ],
                    active: true,
                    createdAt: new Date().toISOString()
                  };
                  
                  // Optional: Deactivate old polls
                  const q = query(collection(db, "polls"), where("active", "==", true));
                  const snap = await getDocs(q);
                  snap.forEach(async (d) => {
                    await updateDoc(doc(db, "polls", d.id), { active: false });
                  });

                  await addDoc(collection(db, "polls"), poll);
                  form.reset();
                  alert("Poll added and activated!");
                } catch(err) {
                  console.error(err);
                  alert("Error: " + err.message);
                } finally {
                  setIsProcessing(false);
                }
              }} className="flex flex-col gap-3 max-w-xl">
                <input name="question" required placeholder="Poll Question (e.g. Will it rain today?)" className="border border-slate-300 rounded px-3 py-2" />
                <input name="opt1" required placeholder="Option 1 (e.g. Yes)" className="border border-slate-300 rounded px-3 py-2" />
                <input name="opt2" required placeholder="Option 2 (e.g. No)" className="border border-slate-300 rounded px-3 py-2" />
                <button type="submit" disabled={isProcessing} className="bg-orange-600 text-white py-2 rounded font-bold hover:bg-orange-700 disabled:bg-slate-400">
                  {isProcessing ? "Adding..." : "Create Poll"}
                </button>
              </form>
            </div>
          </div>


          {/* Team Manager */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="bg-green-700 text-white p-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} /> Add Team Member
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsProcessing(true);
                try {
                  const form = e.target;
                  const photoFile = form.photoFile.files?.[0];
                  let finalPhotoUrl = form.photoUrl.value;

                  if (photoFile) {
                    if (photoFile.size > 1048576) {
                        throw new Error("Image must be less than 1MB.");
                    }
                    const reader = new FileReader();
                    finalPhotoUrl = await new Promise((resolve, reject) => {
                        reader.readAsDataURL(photoFile);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = e => reject(e);
                    });
                  }

                  const member = {
                    name: form.memberName.value,
                    role: form.role.value,
                    mobile: form.mobile.value,
                    details: form.details.value,
                    photoUrl: finalPhotoUrl || "",
                    createdAt: new Date().toISOString()
                  };
                  await addDoc(collection(db, "team"), member);
                  form.reset();
                  alert("Team member added!");
                } catch(err) {
                  console.error(err);
                  alert("Error adding team member: " + err.message);
                } finally {
                  setIsProcessing(false);
                }
              }} className="flex flex-col gap-3 max-w-xl">
                <input name="memberName" required placeholder="Full Name (e.g. Mohd Shahnawaz)" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                <input name="role" required placeholder="Role (e.g. Chief Editor, Cameraman, Reporter)" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                <input name="mobile" required placeholder="Mobile Number" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                
                <div className="flex flex-col gap-1 border border-slate-200 p-3 rounded bg-slate-50">
                  <label className="text-xs font-bold text-slate-700">Photo (File Upload)</label>
                  <input name="photoFile" type="file" accept="image/*" className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                  <div className="text-center text-xs text-slate-400">OR</div>
                  <input name="photoUrl" placeholder="Paste Photo URL" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600" />
                </div>

                <textarea name="details" placeholder="Short description, area of coverage, or bio..." rows="3" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-600"></textarea>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="bg-green-700 text-white py-2 rounded font-bold hover:bg-green-800 disabled:bg-slate-400"
                >
                  {isProcessing ? "Adding..." : "Add Member"}
                </button>
              </form>
            </div>
          </div>


          {/* Advertisement Manager */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-900 text-white p-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} /> Add Advertisement Banner
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsProcessing(true);
                try {
                  const form = e.target;
                  const imageFile = form.adImageFile.files?.[0];
                  let finalImageUrl = form.adImageUrl.value;

                  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                  });

                  if (imageFile) {
                    if (imageFile.size > 1048576) {
                        throw new Error("Image must be less than 1MB.");
                    }
                    finalImageUrl = await toBase64(imageFile);
                  }

                  if (!finalImageUrl) {
                    throw new Error("Please provide an image file or URL");
                  }

                  const adItem = {
                    imageUrl: finalImageUrl,
                    linkUrl: form.adLinkUrl.value,
                    position: form.adPosition.value,
                    active: true,
                    createdAt: new Date().toISOString(),
                  };
                  await addDoc(collection(db, "ads"), adItem);
                  form.reset();
                  alert("Advertisement Added!");
                } catch(err) {
                  console.error(err);
                  alert("Error adding ad: " + err.message);
                } finally {
                  setIsProcessing(false);
                }
              }} className="flex flex-col gap-3">
                <select name="adPosition" required className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600">
                  <option value="home_top">Home Page (Top)</option>
                  <option value="home_middle">Home Page (Middle)</option>
                  <option value="header_cover">Header Cover Image (Top)</option>
                  <option value="article_sidebar">Article Page (Sidebar)</option>
                </select>
                
                <div className="flex flex-col gap-1 border border-slate-200 p-3 rounded bg-slate-50">
                  <label className="text-xs font-bold text-slate-700">Ad Banner Image (Required)</label>
                  <input name="adImageFile" type="file" accept="image/*" className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  <div className="text-center text-xs text-slate-400">OR</div>
                  <input name="adImageUrl" placeholder="Paste Ad Image URL" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600" />
                </div>

                <input name="adLinkUrl" required placeholder="Target Link (e.g., https://example.com)" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600" />

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="bg-blue-900 text-white py-2 rounded font-bold hover:bg-blue-800 disabled:bg-slate-400"
                >
                  {isProcessing ? "Adding..." : "Add Advertisement"}
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
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                        {article.videoUrl && (
                          <button 
                            onClick={async () => {
                              if (window.confirm('Remove YouTube video from this news?')) {
                                try {
                                  const { doc, updateDoc } = await import("firebase/firestore");
                                  await updateDoc(doc(db, "news", article.id), { videoUrl: null });
                                  alert("Video removed successfully");
                                  window.location.reload();
                                } catch (e) {
                                  console.error(e);
                                  alert("Error removing video");
                                }
                              }
                            }}
                            className="text-slate-400 hover:text-orange-500 p-1 transition-colors"
                            title="Remove Video Link"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path><line x1="3" y1="3" x2="21" y2="21"></line></svg>
                          </button>
                        )}
                        <button 
                          onClick={() => setEditingArticle(article)}
                          className="text-slate-400 hover:text-blue-600 p-1 transition-colors"
                          title="Edit News"
                        >
                          <Edit size={18} />
                        </button>
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

      {editingArticle && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Edit size={24} className="text-blue-600" /> Edit News Article
              </h2>
              <button onClick={() => setEditingArticle(null)} className="text-slate-400 hover:text-red-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form onSubmit={handleUpdateNews} className="flex flex-col gap-4">
                <input name="headline" required defaultValue={editingArticle.headline} placeholder="Headline" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input type="checkbox" name="isBreaking" defaultChecked={editingArticle.isBreaking} className="w-4 h-4 accent-red-600" /> Mark as Breaking News (Ticker)
                </label>
                
                {/* We just use a standard input for category here for simplicity, or re-render the select if needed. A simple text input with datalist or just select */}
                <select name="category" required defaultValue={editingArticle.category} className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600">
                  <optgroup label="Main Categories">
                    <option value="INDIA">India</option>
                    <option value="UTTAR PRADESH">Uttar Pradesh</option>
                    <option value="POLITICS">Politics</option>
                    <option value="CRIME">Crime</option>
                    <option value="WEATHER">Weather (मौसम)</option>
                    <option value="BUSINESS">Business</option>
                    <option value="SPORTS">Sports</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                  </optgroup>
                  <optgroup label="UP Districts">
                    <option value="AGRA">Agra</option>
                    <option value="ALIGARH">Aligarh</option>
                    <option value="AMBEDKAR NAGAR">Ambedkar Nagar</option>
                    <option value="AMETHI">Amethi</option>
                    <option value="AMROHA">Amroha</option>
                    <option value="AURAIYA">Auraiya</option>
                    <option value="AYODHYA">Ayodhya</option>
                    <option value="AZAMGARH">Azamgarh</option>
                    <option value="BAGHPAT">Baghpat</option>
                    <option value="BAHRAICH">Bahraich</option>
                    <option value="BALLIA">Ballia</option>
                    <option value="BALRAMPUR">Balrampur</option>
                    <option value="BANDA">Banda</option>
                    <option value="BARABANKI">Barabanki</option>
                    <option value="BAREILLY">Bareilly</option>
                    <option value="BASTI">Basti</option>
                    <option value="BHADOHI">Bhadohi</option>
                    <option value="BIJNOR">Bijnor</option>
                    <option value="BUDAUN">Budaun</option>
                    <option value="BULANDSHAHR">Bulandshahr</option>
                    <option value="CHANDAULI">Chandauli</option>
                    <option value="CHITRAKOOT">Chitrakoot</option>
                    <option value="DEORIA">Deoria</option>
                    <option value="ETAH">Etah</option>
                    <option value="ETAWAH">Etawah</option>
                    <option value="FARRUKHABAD">Farrukhabad</option>
                    <option value="FATEHPUR">Fatehpur</option>
                    <option value="FIROZABAD">Firozabad</option>
                    <option value="GAUTAM BUDDHA NAGAR">Gautam Buddha Nagar</option>
                    <option value="GHAZIABAD">Ghaziabad</option>
                    <option value="GHAZIPUR">Ghazipur</option>
                    <option value="GONDA">Gonda</option>
                    <option value="GORAKHPUR">Gorakhpur</option>
                    <option value="HAMIRPUR">Hamirpur</option>
                    <option value="HAPUR">Hapur</option>
                    <option value="HARDOI">Hardoi</option>
                    <option value="HATHRAS">Hathras</option>
                    <option value="JALAUN">Jalaun</option>
                    <option value="JAUNPUR">Jaunpur</option>
                    <option value="JHANSI">Jhansi</option>
                    <option value="KANNAUJ">Kannauj</option>
                    <option value="KANPUR DEHAT">Kanpur Dehat</option>
                    <option value="KANPUR NAGAR">Kanpur Nagar</option>
                    <option value="KASGANJ">Kasganj</option>
                    <option value="KAUSHAMBI">Kaushambi</option>
                    <option value="KHERI">Kheri</option>
                    <option value="KUSHINAGAR">Kushinagar</option>
                    <option value="LALITPUR">Lalitpur</option>
                    <option value="LUCKNOW">Lucknow</option>
                    <option value="MAHARAJGANJ">Maharajganj</option>
                    <option value="MAHOBA">Mahoba</option>
                    <option value="MAINPURI">Mainpuri</option>
                    <option value="MATHURA">Mathura</option>
                    <option value="MAU">Mau</option>
                    <option value="MEERUT">Meerut</option>
                    <option value="MIRZAPUR">Mirzapur</option>
                    <option value="MORADABAD">Moradabad</option>
                    <option value="MUZAFFARNAGAR">Muzaffarnagar</option>
                    <option value="PILIBHIT">Pilibhit</option>
                    <option value="PRATAPGARH">Pratapgarh</option>
                    <option value="PRAYAGRAJ">Prayagraj</option>
                    <option value="RAEBARELI">Raebareli</option>
                    <option value="RAMPUR">Rampur</option>
                    <option value="SAHARANPUR">Saharanpur</option>
                    <option value="SAMBHAL">Sambhal</option>
                    <option value="SANT KABIR NAGAR">Sant Kabir Nagar</option>
                    <option value="SHAHJAHANPUR">Shahjahanpur</option>
                    <option value="SHAMLI">Shamli</option>
                    <option value="SHRAVASTI">Shravasti</option>
                    <option value="SIDDHARTHNAGAR">Siddharthnagar</option>
                    <option value="SITAPUR">Sitapur</option>
                    <option value="SONBHADRA">Sonbhadra</option>
                    <option value="SULTANPUR">Sultanpur</option>
                    <option value="UNNAO">Unnao</option>
                    <option value="VARANASI">Varanasi</option>
                  </optgroup>
                </select>
                
                <input name="reporter" placeholder="रिपोर्टर का नाम (Reporter Name)" defaultValue={editingArticle.author} className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
                
                <div className="flex flex-col gap-1 border border-slate-200 p-3 rounded bg-slate-50">
                  <label className="text-xs font-bold text-slate-700">Change Cover Image (Optional)</label>
                  <div className="flex items-center gap-2 mb-2">
                     <img src={editingArticle.featuredImage} className="h-12 w-12 object-cover rounded" />
                     <span className="text-xs text-slate-500">Current Image</span>
                  </div>
                  <input name="imageFile" type="file" accept="image/*" className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  <div className="text-center text-xs text-slate-400">OR New URL</div>
                  <input name="imageUrl" placeholder="Paste New Image URL" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600" />
                </div>

                <div className="flex flex-col gap-1 border border-slate-200 p-3 rounded bg-slate-50">
                  <label className="text-xs font-bold text-slate-700">Change Video URL (Optional)</label>
                  {editingArticle.videoUrl && <span className="text-xs text-slate-500 truncate mb-1">Current: {editingArticle.videoUrl}</span>}
                  <input name="videoUrl" placeholder="Paste New YouTube URL" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600" />
                </div>

                <textarea name="content" required defaultValue={editingArticle.content} placeholder="Full Article Content (HTML supported for bold, list, etc.)" rows={12} className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600"></textarea>
                
                <button type="submit" disabled={isProcessing} className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 mt-2">
                  {isProcessing ? 'Updating...' : 'Update News Article'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
