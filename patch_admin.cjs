const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Replace the image upload logic
const oldUploadLogic = `                  // Upload Image if selected
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
                  }`;

const newUploadLogic = `                  // Helper to convert file to base64
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
                  }`;

code = code.replace(oldUploadLogic, newUploadLogic);

// Ensure the try block has err: any
code = code.replace('} catch(err) {', '} catch(err: any) {');

fs.writeFileSync('src/pages/Admin.tsx', code);
