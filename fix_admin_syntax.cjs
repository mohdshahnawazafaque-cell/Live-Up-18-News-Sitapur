const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /<form onSubmit=\{async \(e\) => \{[\s\S]*?\}\} className="flex flex-col gap-3">/;
const newForm = `<form onSubmit={async (e) => {
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
              }} className="flex flex-col gap-3">`;

content = content.replace(regex, newForm);
fs.writeFileSync('src/pages/Admin.tsx', content);
console.log("Fixed Admin.tsx syntax");
