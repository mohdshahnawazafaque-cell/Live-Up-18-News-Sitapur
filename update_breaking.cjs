const fs = require('fs');
let content = fs.readFileSync('src/components/BreakingNews.tsx', 'utf8');

// Change the breaking news marquee content to standard static contact details
const replacement = `
  return (
    <div className="bg-white border-b border-slate-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 mr-4 whitespace-nowrap flex-shrink-0 relative overflow-hidden">
          {language === 'hi' ? 'सूचना' : 'NOTICE'}
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1 relative flex items-center">
          <div className="animate-[marquee_40s_linear_infinite] hover:pause inline-block">
            <span className="mx-8 text-slate-800 font-bold">
              विज्ञापन एवं समाचार के लिए संपर्क करें | अपने प्रतिष्ठान, व्यवसाय या सेवा का प्रचार करवाने अथवा अपने क्षेत्र की महत्वपूर्ण खबर हम तक पहुँचाने के लिए संपर्क करें। Live UP 18 News | संपर्क सूत्र: 9956078419
            </span>
          </div>
        </div>
      </div>
    </div>
  );
`;

const regex = /return \(\s*<div className="bg-white border-b border-slate-200 py-2">[\s\S]*?\);\s*\}$/m;
content = content.replace(regex, replacement + "\n}");

// Optimize fetching: remove the db fetch since we no longer display dynamic breaking news here
content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/, '');

fs.writeFileSync('src/components/BreakingNews.tsx', content);
