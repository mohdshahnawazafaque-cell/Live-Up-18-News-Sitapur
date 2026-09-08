const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /<\/div>\s*<\/div>\s*<div className="lg:col-span-2">/;
const newAdBlock = `
            </div>
          </div>

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

                  if (imageFile) {
                    const imgRef = ref(storage, \`ads/\${Date.now()}-\${imageFile.name}\`);
                    await uploadBytes(imgRef, imageFile);
                    finalImageUrl = await getDownloadURL(imgRef);
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
                  <option value="article_sidebar">Article Page (Sidebar)</option>
                  <option value="article_bottom">Article Page (Bottom)</option>
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

        <div className="lg:col-span-2">`;

content = content.replace(regex, newAdBlock);
fs.writeFileSync('src/pages/Admin.tsx', content);
console.log("Added Advertisement block to Admin");
