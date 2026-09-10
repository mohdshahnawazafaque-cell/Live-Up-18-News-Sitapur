const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes('const [error, setError] = useState')) {
    code = code.replace(
        'const [videos, setVideos] = useState<any[]>([]);',
        'const [videos, setVideos] = useState<any[]>([]);\n  const [error, setError] = useState<string | null>(null);'
    );
    
    code = code.replace(
        'console.error("Error fetching news:", error);',
        'console.error("Error fetching news:", error);\n        setError(error.message || "Failed to load news.");'
    );
    
    code = code.replace(
        '{/* Featured Section */}',
        '{error && <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-8" role="alert"><p className="font-bold">Error loading news</p><p>{error}</p></div>}\n      {/* Featured Section */}'
    );

    fs.writeFileSync('src/pages/Home.tsx', code);
    console.log("Added error state to Home.tsx");
}
