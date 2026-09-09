const fs = require('fs');
let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// The HTML for the news table currently doesn't show video, but the user asked to be able to remove the YouTube link.
// We will add an "Edit Video" / "Remove Video" button to the news list in Admin.tsx

const tableHeadReplacement = `<th className="px-4 py-3 font-bold">Headline (English)</th>
                      <th className="px-4 py-3 font-bold w-24">Category</th>
                      <th className="px-4 py-3 font-bold w-24">Date</th>
                      <th className="px-4 py-3 font-bold w-24 text-right">Actions</th>`;

const tableHeadTarget = `<th className="px-4 py-3 font-bold">Headline (English)</th>
                      <th className="px-4 py-3 font-bold w-24">Category</th>
                      <th className="px-4 py-3 font-bold w-24">Date</th>
                      <th className="px-4 py-3 font-bold w-24 text-right">Actions</th>`;

const actionsReplacement = `<td className="px-4 py-3 text-right flex items-center justify-end gap-2">
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
                          onClick={() => handleDeleteNews(article.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete News"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>`;
                      
const actionsTarget = `<td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDeleteNews(article.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete News"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>`;

admin = admin.replace(actionsTarget, actionsReplacement);

fs.writeFileSync('src/pages/Admin.tsx', admin);
