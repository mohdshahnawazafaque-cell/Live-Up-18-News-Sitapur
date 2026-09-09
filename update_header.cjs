const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

const oldLogoSection = `<Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img src="/logo.png" alt="LIVE UP 18 NEWS" className="h-12 w-auto bg-white rounded-md p-1" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden flex-col">
              <span className="text-3xl font-black tracking-tight text-white leading-none [text-shadow:2px_2px_0_#475569,3px_3px_0_#1e293b,4px_4px_5px_rgba(0,0,0,0.8)]">LIVE UP 18</span>
              <span className="text-xl font-black tracking-widest text-red-500 leading-none mt-1 [text-shadow:1px_1px_0_#7f1d1d,2px_2px_0_#450a0a,3px_3px_4px_rgba(0,0,0,0.8)]">NEWS</span>
            </div>
          </Link>`;

const newLogoSection = `<Link to="/" className="flex-shrink-0 flex items-center gap-2 z-10 py-1">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-3xl sm:text-[2.75rem] font-black tracking-tighter text-white leading-none [text-shadow:1px_2px_0_#991b1b,2px_4px_0_#7f1d1d,3px_5px_8px_rgba(0,0,0,0.9)] italic">
                  LIVE UP
                </span>
                <span className="text-4xl sm:text-[3.25rem] font-black text-red-500 leading-none [text-shadow:1px_2px_0_#ffffff,2px_3px_0_#cbd5e1,3px_5px_10px_rgba(0,0,0,0.9)] italic -ml-1">
                  18
                </span>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-red-800 px-3 sm:px-6 py-0.5 sm:py-1 rounded shadow-[0px_3px_5px_rgba(0,0,0,0.5)] mt-1 sm:mt-1.5 ml-1 border border-red-500">
                <span className="text-xs sm:text-base font-black tracking-[0.4em] sm:tracking-[0.8em] text-white leading-none block ml-1 [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">
                  NEWS
                </span>
              </div>
            </div>
          </Link>`;

header = header.replace(oldLogoSection, newLogoSection);
fs.writeFileSync('src/components/Header.tsx', header);
