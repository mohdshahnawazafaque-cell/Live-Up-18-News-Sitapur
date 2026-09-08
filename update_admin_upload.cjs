const fs = require('fs');

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Add new imports
content = content.replace(
  'import { db } from "../lib/firebase";',
  'import { db, storage, auth } from "../lib/firebase";\nimport { ref, uploadBytes, getDownloadURL } from "firebase/storage";\nimport { signInAnonymously } from "firebase/auth";'
);

// 2. Update handleLogin to sign in anonymously
const oldLogin = /const handleLogin = async \(e: React\.FormEvent\) => \{[\s\S]*?  \};/;
const newLogin = `const handleLogin = async (e: React.FormEvent) => {
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
  };`;
content = content.replace(oldLogin, newLogin);

// 3. Update the form logic to handle uploads
const oldFormStart = /<form onSubmit=\{async \(e\) => \{[\s\S]*?setIsProcessing\(true\);/
const newFormStart = `<form onSubmit={async (e) => {
                e.preventDefault();
                setIsProcessing(true);
                try {
                  const form = e.target as HTMLFormElement;
                  const imageFile = (form.imageFile as HTMLInputElement).files?.[0];
                  const videoFile = (form.videoFile as HTMLInputElement).files?.[0];
                  
                  let finalImageUrl = form.imageUrl.value;
                  let finalVideoUrl = form.videoUrl.value;

                  // Upload Image if selected
                  if (imageFile) {
                    const imgRef = ref(storage, \`news-images/\${Date.now()}-\${imageFile.name}\`);
                    await uploadBytes(imgRef, imageFile);
                    finalImageUrl = await getDownloadURL(imgRef);
                  }

                  // Upload Video if selected
                  if (videoFile) {
                    const vidRef = ref(storage, \`news-videos/\${Date.now()}-\${videoFile.name}\`);
                    await uploadBytes(vidRef, videoFile);
                    finalVideoUrl = await getDownloadURL(vidRef);
                  }

                  if (!finalImageUrl) {
                    finalImageUrl = 'https://picsum.photos/seed/' + Math.random() + '/800/450';
                  }`;

content = content.replace(oldFormStart, newFormStart);

const oldNewsItem = /const newsItem = \{[\s\S]*?sourceAttribution: "LIVE UP 18 NEWS"\n                  \};/
const newNewsItem = `const newsItem = {
                    headline: form.headline.value,
                    category: form.category.value,
                    content: form.content.value,
                    featuredImage: finalImageUrl,
                    videoUrl: finalVideoUrl || null,
                    publicationDate: new Date().toISOString(),
                    author: "मो० शाहनवाज़",
                    sourceAttribution: "LIVE UP 18 NEWS"
                  };`
content = content.replace(oldNewsItem, newNewsItem);

// 4. Update the form UI
const oldInputs = /<input name="image" placeholder="Image URL \(optional\)" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600" \/>/
const newInputs = `
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
`
content = content.replace(oldInputs, newInputs);

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log("Updated Admin with file uploads");
