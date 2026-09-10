const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Replace any remaining uploadBytes calls entirely with base64 logic.
const remainingMatch = code.match(/if \(photoFile\) \{\s*try \{\s*const \{ signInAnonymously.*?catch.*?\}\s*\}/s);
if (remainingMatch) {
  code = code.replace(remainingMatch[0], `if (photoFile) {
                    if (photoFile.size > 1048576) {
                        throw new Error("Image must be less than 1MB.");
                    }
                    const reader = new FileReader();
                    finalPhotoUrl = await new Promise((resolve, reject) => {
                        reader.readAsDataURL(photoFile);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = e => reject(e);
                    });
                  }`);
}
fs.writeFileSync('src/pages/Admin.tsx', code);
