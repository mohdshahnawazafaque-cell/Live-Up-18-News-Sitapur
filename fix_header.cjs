const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Fix Desktop Header
const desktopLangs = /<div className="flex gap-3">[\s\S]*?<button onClick=\{\(\) => setLanguage\('hi'\)\}[\s\S]*?<\/div>/;
const newDesktopLangs = `<div className="flex gap-3">
              <button onClick={() => setLanguage('en')} className={\`transition-colors \${language === 'en' ? 'text-red-700 dark:text-red-500 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}\`}>English</button>
              <button onClick={() => setLanguage('hi')} className={\`transition-colors \${language === 'hi' ? 'text-red-700 dark:text-red-500 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}\`}>हिंदी</button>
              <button onClick={() => setLanguage('ur')} className={\`transition-colors \${language === 'ur' ? 'text-red-700 dark:text-red-500 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}\`}>اردو</button>
            </div>`;
code = code.replace(desktopLangs, newDesktopLangs);

// Fix Mobile Header
const mobileLangs = /<div className="flex bg-white dark:bg-black rounded-lg p-1 justify-between col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">[\s\S]*?<\/div>/;
const newMobileLangs = `<div className="flex bg-white dark:bg-black rounded-lg p-1 justify-between col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
              <button onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={\`flex-1 text-center py-2 text-xs font-bold rounded \${language === 'en' ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-600 dark:text-slate-400'}\`}>English</button>
              <button onClick={() => { setLanguage('hi'); setIsMobileMenuOpen(false); }} className={\`flex-1 text-center py-2 text-xs font-bold rounded \${language === 'hi' ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-600 dark:text-slate-400'}\`}>हिंदी</button>
              <button onClick={() => { setLanguage('ur'); setIsMobileMenuOpen(false); }} className={\`flex-1 text-center py-2 text-xs font-bold rounded \${language === 'ur' ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-600 dark:text-slate-400'}\`}>اردو</button>
            </div>`;
code = code.replace(mobileLangs, newMobileLangs);

fs.writeFileSync('src/components/Header.tsx', code);
