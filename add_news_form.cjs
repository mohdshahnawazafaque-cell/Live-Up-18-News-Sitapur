const fs = require('fs');

let adminContent = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Replace the two sidebar widgets with a single "Add News Manually" form widget

const sidebarRegex = /<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">[\s\S]*?<\/div>\n          <\/div>\n        <\/div>/;

const newSidebar = `<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                  const form = e.target;
                  const newsItem = {
                    headline: form.headline.value,
                    category: form.category.value,
                    content: form.content.value,
                    featuredImage: form.image.value || 'https://picsum.photos/seed/' + Math.random() + '/800/450',
                    publicationDate: new Date().toISOString(),
                    author: "मो० शाहनवाज़",
                    sourceAttribution: "LIVE UP 18 NEWS"
                  };
                  await fetch("/api/admin/add-news", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newsItem)
                  });
                  form.reset();
                  fetchData();
                  alert("News Added!");
                } catch(err) {
                  alert("Error adding news");
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
                <input name="image" placeholder="Image URL (optional)" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" />
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
        </div>`;

adminContent = adminContent.replace(sidebarRegex, newSidebar);
fs.writeFileSync('src/pages/Admin.tsx', adminContent);

console.log("Added news form");
