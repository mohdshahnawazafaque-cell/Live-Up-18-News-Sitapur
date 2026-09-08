const fs = require('fs');

let adminContent = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
adminContent = adminContent.replace(/AI Partner has finished processing feeds!/g, "Finished processing feeds!");
adminContent = adminContent.replace(/Error occurred while AI was fetching news\./g, "Error occurred while fetching news.");
adminContent = adminContent.replace(/Admin & AI Partner Dashboard/g, "Admin Dashboard");
adminContent = adminContent.replace(/आपका AI पार्टनर हर घंटे स्वचालित रूप से \(automatically\) यहाँ दिए गए RSS Feeds से न्यूज़ लाकर प्रोसेस करेगा। आप भी जब चाहें मैन्युअली ट्रिगर कर सकते हैं।/g, "यह न्यूज़ पोर्टल का एडमिन डैशबोर्ड है।");
adminContent = adminContent.replace(/AI News Sources \(RSS\)/g, "News Sources (RSS)");
adminContent = adminContent.replace(/Manual AI Fetch/g, "Manual Fetch");
adminContent = adminContent.replace(/AI पार्टनर बैकग्राउंड में अपने आप काम कर रहा है, लेकिन आप अभी तुरंत ताज़ा ख़बरें लाने के लिए इसे कमांड दे सकते हैं।/g, "तुरंत ताज़ा ख़बरें लाने के लिए इसे ट्रिगर कर सकते हैं।");
adminContent = adminContent.replace(/Ask AI to Fetch Now/g, "Fetch Now");
adminContent = adminContent.replace(/AI is Working\.\.\./g, "Fetching...");
adminContent = adminContent.replace(/Admin & News Dashboard/g, "Admin Dashboard"); // Just in case
fs.writeFileSync('src/pages/Admin.tsx', adminContent);

let homeContent = fs.readFileSync('src/pages/Home.tsx', 'utf8');
homeContent = homeContent.replace(/AI वीडियो न्यूज़ गैलरी/g, "वीडियो न्यूज़ गैलरी");
homeContent = homeContent.replace(/AI Video News Gallery/g, "Video News Gallery");
homeContent = homeContent.replace(/AI द्वारा जनरेट किए गए ताज़ा वीडियो लोड हो रहे हैं.../g, "ताज़ा वीडियो लोड हो रहे हैं...");
homeContent = homeContent.replace(/Loading latest AI generated videos.../g, "Loading latest videos...");
homeContent = homeContent.replace(/AI Video News Section/g, "Video News Section");
fs.writeFileSync('src/pages/Home.tsx', homeContent);

let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace(/LIVE UP 18 - Daily News Bulletin \(AI Generated\)/g, "LIVE UP 18 - Daily News Bulletin");
fs.writeFileSync('server.ts', serverContent);

console.log("Removed AI text");
