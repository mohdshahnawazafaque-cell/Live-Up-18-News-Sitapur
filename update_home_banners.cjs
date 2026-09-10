const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes("import AdBanner")) {
    code = code.replace(
        "import { Link } from 'react-router-dom';",
        "import { Link } from 'react-router-dom';\nimport AdBanner from '../components/AdBanner';"
    );
}

// Replace top banner
const topBannerTarget = `<section className="w-full">
        <a href="#" className="block w-full overflow-hidden rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
          <img loading="lazy" src="/banner1.png" alt="Live Up 18 News Promo" className="w-full h-auto object-cover max-h-[300px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </a>
      </section>`;

code = code.replace(topBannerTarget, '<AdBanner position="home_top" />');

// Remove Live TV iframe
const liveTvStart = `{/* Live TV Section (Placeholder / Configurable) */}`;
const liveTvRegex = /\{\/\* Live TV Section \(Placeholder \/ Configurable\) \*\/\}[\s\S]*?<\/section>/;
code = code.replace(liveTvRegex, '');

// Replace middle banner
const middleBannerTarget = `<section className="w-full my-8">
        <a href="#" className="block w-full overflow-hidden rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
          <img loading="lazy" src="/banner2.png" alt="Live Up 18 News Promo" className="w-full h-auto object-cover max-h-[300px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </a>
      </section>`;
      
code = code.replace(middleBannerTarget, '<AdBanner position="home_middle" className="my-8" />');

fs.writeFileSync('src/pages/Home.tsx', code);
console.log("Updated Home.tsx with real banners and removed Live TV");
