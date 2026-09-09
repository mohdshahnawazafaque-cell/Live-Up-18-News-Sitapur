const fs = require('fs');
let yt = fs.readFileSync('src/components/YouTubeGallery.tsx', 'utf8');

// Replace the playlist logic with a dynamic player
yt = yt.replace(
  'const [loading, setLoading] = useState(true);',
  'const [loading, setLoading] = useState(true);\n  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);\n  const topRef = useRef<HTMLDivElement>(null);'
);

yt = yt.replace(
  'import { useEffect, useState } from \'react\';',
  'import { useEffect, useState, useRef } from \'react\';'
);

// Update iframe src logic
yt = yt.replace(
  'src={`https://www.youtube.com/embed/videoseries?list=UURTXiJsiEqYUdWzzA6RQAEQ`}',
  'src={currentVideoId ? `https://www.youtube.com/embed/${currentVideoId}?autoplay=1` : `https://www.youtube.com/embed/videoseries?list=UURTXiJsiEqYUdWzzA6RQAEQ`}'
);

// Add topRef to the player container
yt = yt.replace(
  '<div className="mb-8 bg-black rounded-xl overflow-hidden border border-slate-700 w-full">',
  '<div className="mb-8 bg-black rounded-xl overflow-hidden border border-slate-700 w-full" ref={topRef}>'
);

// Update the grid items to play inline
yt = yt.replace(
  /<a href={vid\.link} target="_blank" rel="noopener noreferrer" className="relative aspect-video block overflow-hidden">/g,
  '<button onClick={() => { setCurrentVideoId(videoId); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="relative aspect-video block w-full overflow-hidden text-left focus:outline-none">'
);
yt = yt.replace(
  /<\/a>\s*<div className="p-4 flex flex-col flex-1">/g,
  '</button>\n              <div className="p-4 flex flex-col flex-1">'
);

// Also update the title link to play inline
yt = yt.replace(
  /<a href={vid\.link} target="_blank" rel="noopener noreferrer" className="font-bold text-sm leading-snug line-clamp-3 hover:text-red-400 mb-2">/g,
  '<button onClick={() => { setCurrentVideoId(videoId); topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="font-bold text-sm leading-snug line-clamp-3 hover:text-red-400 mb-2 text-left">'
);
yt = yt.replace(
  /\{vid\.title\}\s*<\/a>/g,
  '{vid.title}\n                </button>'
);

fs.writeFileSync('src/components/YouTubeGallery.tsx', yt);
