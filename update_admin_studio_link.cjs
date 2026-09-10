const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

if (!code.includes('MonitorPlay')) {
    code = code.replace(
        'import { Trash2, RefreshCw, Plus, Globe, Settings, Newspaper, Edit, X } from "lucide-react";',
        'import { Trash2, RefreshCw, Plus, Globe, Settings, Newspaper, Edit, X, MonitorPlay } from "lucide-react";'
    );
    code = code.replace(
        'import { Link } from "react-router-dom";',
        'import { Link, useNavigate } from "react-router-dom";'
    );
}

// Ensure useNavigate is present if not already
if (!code.includes('const navigate = useNavigate();')) {
    code = code.replace(
        'const { language } = useLanguage();',
        'const { language } = useLanguage();\n  const navigate = useNavigate();'
    );
}

if (!code.includes('Live Virtual Studio')) {
    code = code.replace(
        '<button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors bg-red-50 px-4 py-2 rounded-lg">Logout</button>',
        `<button onClick={() => navigate('/live-studio')} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2"><MonitorPlay size={16} /> Live Virtual Studio (Green Screen)</button>\n          <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors bg-red-50 px-4 py-2 rounded-lg">Logout</button>`
    );
}

fs.writeFileSync('src/pages/Admin.tsx', code);
