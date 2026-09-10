const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Replace team member upload logic
const teamOld = `                  if (photoFile) {
                    const imgRef = ref(storage, \`team/\${Date.now()}-\${photoFile.name}\`);
                    await uploadBytes(imgRef, photoFile);
                    finalPhotoUrl = await getDownloadURL(imgRef);
                  }`;

const teamNew = `                  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                  });

                  if (photoFile) {
                    if (photoFile.size > 1048576) {
                        throw new Error("Image must be less than 1MB.");
                    }
                    finalPhotoUrl = await toBase64(photoFile);
                  }`;
code = code.replace(teamOld, teamNew);

// Replace ad/epaper upload logic
const adOld = `                  if (imageFile) {
                    const imgRef = ref(storage, \`ads/\${Date.now()}-\${imageFile.name}\`);
                    await uploadBytes(imgRef, imageFile);
                    finalImageUrl = await getDownloadURL(imgRef);
                  }`;
const adNew = `                  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
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
                  }`;
code = code.replace(adOld, adNew);

fs.writeFileSync('src/pages/Admin.tsx', code);
