const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('import AdBanner')) {
  content = content.replace(
    'import { useLanguage, getLocalizedText } from "../context/LanguageContext";',
    'import { useLanguage, getLocalizedText } from "../context/LanguageContext";\nimport AdBanner from "../components/AdBanner";'
  );
}

// Find a good place to put it. Let's put one after the featured news, before the list.
const featuredRegex = /<\/div>\s*<\/Link>\s*<\/div>\s*<\/section>/;
const featuredReplacement = `</div>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <AdBanner position="home_top" className="h-[120px] md:h-[200px]" />
        </section>`;

if (!content.includes('<AdBanner position="home_top"')) {
  content = content.replace(featuredRegex, featuredReplacement);
}

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Updated Home.tsx with AdBanner");
