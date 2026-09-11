const fs = require('fs');

// Update InstallPWA text
let pwaCode = fs.readFileSync('src/components/InstallPWA.tsx', 'utf8');
pwaCode = pwaCode.replace(/language === 'hi'\s*\?\s*"[^"]+"\s*:\s*"[^"]+"/g, "language === 'ur' ? 'ایپ انسٹال کرنے کے لیے براہ کرم اسے نئے ٹیب میں کھولیں۔' : (language === 'hi' ? 'ऐप इंस्टॉल करने के लिए, कृपया इसे पहले एक नए टैब (New Tab) में खोलें। (ऊपर दाईं ओर वाले तीर के बटन पर क्लिक करें)' : 'To install the app, please open it in a New Tab first (click the arrow icon top-right).')");
pwaCode = pwaCode.replace(/language === 'hi' \? 'ऐप इंस्टॉल करें' : 'Install App'/g, "language === 'ur' ? 'ایپ انسٹال کریں' : (language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App')");
fs.writeFileSync('src/components/InstallPWA.tsx', pwaCode);

// Add urdu font and fix alignment
let indexCss = fs.readFileSync('src/index.css', 'utf8');
if (!indexCss.includes("Noto Nastaliq Urdu")) {
  indexCss += `
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&display=swap');

html[dir="rtl"] {
  font-family: 'Noto Nastaliq Urdu', serif;
}
html[dir="rtl"] input, html[dir="rtl"] button {
  font-family: 'Noto Nastaliq Urdu', serif;
}
`;
  fs.writeFileSync('src/index.css', indexCss);
}

