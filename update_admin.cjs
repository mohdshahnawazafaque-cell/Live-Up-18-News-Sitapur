const fs = require('fs');

let admin = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

if (!admin.includes('Add Poll')) {
  const newFeatures = `
          {/* E-Paper Manager */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="bg-purple-700 text-white p-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} /> Add E-Paper
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsProcessing(true);
                try {
                  const form = e.target;
                  const paper = {
                    title: form.paperTitle.value,
                    date: form.paperDate.value,
                    pdfUrl: form.pdfUrl.value,
                    thumbnailUrl: form.thumbUrl.value,
                    createdAt: new Date().toISOString()
                  };
                  await addDoc(collection(db, "epapers"), paper);
                  form.reset();
                  alert("E-Paper added!");
                } catch(err) {
                  console.error(err);
                  alert("Error: " + err.message);
                } finally {
                  setIsProcessing(false);
                }
              }} className="flex flex-col gap-3 max-w-xl">
                <input name="paperTitle" required placeholder="E-Paper Title (e.g. 9 September 2026 Edition)" className="border border-slate-300 rounded px-3 py-2" />
                <input name="paperDate" type="date" required className="border border-slate-300 rounded px-3 py-2" />
                <input name="pdfUrl" required placeholder="PDF File URL (e.g. Google Drive Link)" className="border border-slate-300 rounded px-3 py-2" />
                <input name="thumbUrl" placeholder="Thumbnail Image URL (Optional)" className="border border-slate-300 rounded px-3 py-2" />
                <button type="submit" disabled={isProcessing} className="bg-purple-700 text-white py-2 rounded font-bold hover:bg-purple-800 disabled:bg-slate-400">
                  {isProcessing ? "Adding..." : "Add E-Paper"}
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
`;

  admin = admin.replace(
    '{/* Team Manager */}',
    newFeatures + '\n\n          {/* Team Manager */}'
  );
  
  // Need to import updateDoc and where
  if (!admin.includes('where, updateDoc')) {
    admin = admin.replace(
      'getDocs, deleteDoc, doc, addDoc, setDoc',
      'getDocs, deleteDoc, doc, addDoc, setDoc, updateDoc, where'
    );
  }

  fs.writeFileSync('src/pages/Admin.tsx', admin);
}

