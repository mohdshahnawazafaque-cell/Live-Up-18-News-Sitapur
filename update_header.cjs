const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');
if (!code.includes('PhoneCall')) {
    code = code.replace(
        'import { Search, Menu, X, Moon, Sun } from "lucide-react";',
        'import { Search, Menu, X, Moon, Sun, PhoneCall } from "lucide-react";'
    );
    
    code = code.replace(
        "<div>{currentDate}</div>",
        "<div>{currentDate}</div>\n          <div className=\"flex items-center gap-2 text-green-400 font-bold bg-green-900/30 px-3 py-1 rounded-full text-xs md:text-sm border border-green-800/50\">\n            <PhoneCall size={14} className=\"animate-pulse\" />\n            <a href=\"tel:+919956078419\">Call: +91 99560 78419</a>\n          </div>"
    );
    fs.writeFileSync('src/components/Header.tsx', code);
}
