const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

home = home.replace(
  '<div className="aspect-video w-full bg-black flex items-center justify-center relative">',
  '<div className="w-full bg-black flex items-center justify-center relative">\n          <div className="w-full max-w-4xl mx-auto aspect-video">'
);
home = home.replace(
  '</iframe>\n        </div>\n      </section>',
  '</iframe>\n          </div>\n        </div>\n      </section>'
);

fs.writeFileSync('src/pages/Home.tsx', home);
