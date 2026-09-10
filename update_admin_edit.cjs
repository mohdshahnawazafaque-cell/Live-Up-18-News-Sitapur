const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Add Edit icon to imports
code = code.replace(
  'import { Trash2, RefreshCw, Plus, Globe, Settings, Newspaper } from "lucide-react";',
  'import { Trash2, RefreshCw, Plus, Globe, Settings, Newspaper, Edit, X } from "lucide-react";'
);

// 2. Add editingArticle state
if (!code.includes('const [editingArticle, setEditingArticle]')) {
  code = code.replace(
    'const [isProcessing, setIsProcessing] = useState(false);',
    'const [isProcessing, setIsProcessing] = useState(false);\n  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);'
  );
}

// 3. Add handleUpdate function right after handleLogin or fetchData
if (!code.includes('const handleUpdateNews = async')) {
  code = code.replace(
    'const fetchData = async () => {',
    `const handleUpdateNews = async (e: React.FormEvent) => {
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

  const fetchData = async () => {`
  );
}

// 4. Add Edit button to table row
code = code.replace(
  '<button \n                          onClick={() => handleDeleteNews(article.id)}',
  `<button 
                          onClick={() => setEditingArticle(article)}
                          className="text-slate-400 hover:text-blue-600 p-1 transition-colors"
                          title="Edit News"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteNews(article.id)}`
);

// 5. Add Edit Modal
const modalJSX = `
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
`;

if (!code.includes('Edit News Article')) {
  // inject before final </div> of Admin
  code = code.replace(
    '    </div>\n  );\n}\n',
    modalJSX + '\n    </div>\n  );\n}\n'
  );
}

fs.writeFileSync('src/pages/Admin.tsx', code);
