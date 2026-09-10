import React, { useEffect, useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Settings, Radio, MonitorPlay } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LiveStudio() {
  const { language } = useLanguage();
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tmpCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  // State
  const [isStreaming, setIsStreaming] = useState(false);
  const [chromaColor, setChromaColor] = useState('#00ff00'); // Default Green
  const [tolerance, setTolerance] = useState(100);
  const [softness, setSoftness] = useState(30);
  const [bgImageSrc, setBgImageSrc] = useState<string>('https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=1920&auto=format&fit=crop'); // Default News Studio bg
  
  // Overlay State
  const [headline, setHeadline] = useState('LIVE STUDIO BROADCAST');
  const [ticker, setTicker] = useState('Latest updates from the virtual studio...');
  const [location, setLocation] = useState('VIRTUAL STUDIO');

  // Start/Stop Camera
  const toggleCamera = async () => {
    if (isStreaming) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsStreaming(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access denied or unavailable.");
      }
    }
  };

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 255, b: 0 };
  };

  // Processing Loop
  const processFrame = () => {
    if (!videoRef.current || !canvasRef.current || !tmpCanvasRef.current || !isStreaming) return;
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    const tmpCtx = tmpCanvasRef.current.getContext('2d', { willReadFrequently: true });

    if (!ctx || !tmpCtx) return;

    // 1. Draw webcam to temp canvas
    tmpCtx.drawImage(videoRef.current, 0, 0, width, height);
    const frame = tmpCtx.getImageData(0, 0, width, height);
    const data = frame.data;
    
    // 2. Chroma Key Processing
    const { r: cr, g: cg, b: cb } = hexToRgb(chromaColor);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate distance in RGB space
      const dist = Math.sqrt(Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2));
      
      if (dist < tolerance) {
        data[i + 3] = 0; // Fully transparent
      } else if (dist < tolerance + softness) {
        // Soft edge blending
        const alpha = ((dist - tolerance) / softness) * 255;
        data[i + 3] = Math.min(255, Math.max(0, alpha));
      }
    }

    // 3. Put processed transparent video back to temp canvas
    tmpCtx.putImageData(frame, 0, 0);

    // 4. Draw Background on Main Canvas
    if (bgImageRef.current) {
        // Fill to cover
        const imgRatio = bgImageRef.current.width / bgImageRef.current.height;
        const canvasRatio = width / height;
        let drawW, drawH, drawX, drawY;
        
        if (imgRatio > canvasRatio) {
            drawH = height;
            drawW = bgImageRef.current.width * (height / bgImageRef.current.height);
            drawX = (width - drawW) / 2;
            drawY = 0;
        } else {
            drawW = width;
            drawH = bgImageRef.current.height * (width / bgImageRef.current.width);
            drawX = 0;
            drawY = (height - drawH) / 2;
        }
        ctx.drawImage(bgImageRef.current, drawX, drawY, drawW, drawH);
    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
    }

    // 5. Draw Processed Video over Background
    ctx.drawImage(tmpCanvasRef.current, 0, 0, width, height);

    // Loop
    requestRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    if (isStreaming) {
       requestRef.current = requestAnimationFrame(processFrame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isStreaming, chromaColor, tolerance, softness, bgImageSrc]);

  // Handle Image Upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgImageSrc(url);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <header className="mb-8 border-b-4 border-red-600 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
             <MonitorPlay className="text-red-600" /> Live Virtual Studio
          </h1>
          <p className="text-slate-500 font-bold mt-1">Chroma Key / Green Screen Broadcasting</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Canvas Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group font-sans border border-slate-800">
            
            {/* Hidden Source Video */}
            <video ref={videoRef} className="hidden" muted playsInline />
            <canvas ref={tmpCanvasRef} width={1280} height={720} className="hidden" />
            <img ref={bgImageRef} src={bgImageSrc} className="hidden" crossOrigin="anonymous" />
            
            {/* Visible Composited Canvas */}
            <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full object-contain z-0" />

            {/* TV News Graphic Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
              
              {/* Top Section */}
              <div className="flex justify-between items-start p-4 md:p-6">
                {isStreaming ? (
                    <div className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 font-bold text-xs md:text-sm animate-pulse shadow-lg tracking-wider">
                    <Radio size={16} /> LIVE
                    </div>
                ) : (
                    <div className="bg-slate-600 text-white px-3 py-1 rounded flex items-center gap-1 font-bold text-xs md:text-sm shadow-lg tracking-wider">
                    OFF AIR
                    </div>
                )}
                
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg flex flex-col items-center justify-center border-b-2 border-red-600">
                  <span className="text-slate-900 font-black text-sm md:text-lg leading-none tracking-tight">LIVE UP 18</span>
                  <span className="text-red-600 font-bold text-[10px] md:text-xs leading-none tracking-widest mt-0.5">NEWS</span>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col">
                <div className="flex px-4 md:px-8 mb-[-1px] z-20">
                  <div className="bg-blue-700 text-white px-4 py-1 font-bold text-xs md:text-sm uppercase shadow-lg border-l-4 border-red-600 rounded-tr-lg">
                    {location}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white px-4 py-2 md:py-4 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-10 border-t-2 border-white/20">
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-black uppercase tracking-wide leading-tight drop-shadow-md line-clamp-1">
                    {headline}
                  </h2>
                </div>
                
                <div className="bg-white text-black flex items-center h-8 md:h-10 relative overflow-hidden z-20 shadow-lg">
                  <div className="bg-black text-yellow-400 font-bold px-3 md:px-6 h-full flex items-center whitespace-nowrap z-30 uppercase text-xs md:text-sm tracking-wider">
                    LATEST
                  </div>
                  <div className="flex-1 overflow-hidden h-full relative">
                    <div className="animate-marquee whitespace-nowrap h-full flex items-center font-bold text-sm md:text-base px-4 text-red-700">
                      • {ticker} •
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-center">
             <button 
                onClick={toggleCamera}
                className={`flex items-center gap-2 px-8 py-4 rounded-full font-black uppercase tracking-wider text-lg transition-all shadow-lg ${isStreaming ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105'}`}
             >
                <Camera size={24} /> {isStreaming ? 'Stop Camera' : 'Start Camera'}
             </button>
          </div>
        </div>

        {/* Controls Area (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
          
          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-200">
             <Settings className="text-slate-700" />
             <h2 className="text-xl font-bold text-slate-800 uppercase">Controls</h2>
          </div>

          {/* Chroma Key Controls */}
          <div className="space-y-4">
             <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wider">1. Chroma Key (Green Screen)</h3>
             
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Color to Remove</label>
                <div className="flex items-center gap-3">
                   <input 
                      type="color" 
                      value={chromaColor} 
                      onChange={(e) => setChromaColor(e.target.value)}
                      className="h-10 w-20 cursor-pointer rounded"
                   />
                   <span className="text-sm font-mono bg-slate-200 px-2 py-1 rounded">{chromaColor}</span>
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">
                   Tolerance <span>{tolerance}</span>
                </label>
                <input 
                   type="range" min="1" max="255" 
                   value={tolerance} 
                   onChange={(e) => setTolerance(Number(e.target.value))}
                   className="w-full accent-red-600"
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">
                   Edge Softness <span>{softness}</span>
                </label>
                <input 
                   type="range" min="1" max="100" 
                   value={softness} 
                   onChange={(e) => setSoftness(Number(e.target.value))}
                   className="w-full accent-blue-600"
                />
             </div>
          </div>

          <hr className="border-slate-200" />

          {/* Background Controls */}
          <div className="space-y-4">
             <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wider">2. Virtual Background</h3>
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Upload Image</label>
                <input 
                   type="file" 
                   accept="image/*"
                   onChange={handleBgUpload}
                   className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
             </div>
          </div>

          <hr className="border-slate-200" />

          {/* Graphics Controls */}
          <div className="space-y-4">
             <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wider">3. Live Graphics</h3>
             
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Headline Text</label>
                <input 
                   type="text" 
                   value={headline}
                   onChange={(e) => setHeadline(e.target.value)}
                   className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Location / Tag</label>
                <input 
                   type="text" 
                   value={location}
                   onChange={(e) => setLocation(e.target.value)}
                   className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Ticker Text (Bottom Scroll)</label>
                <input 
                   type="text" 
                   value={ticker}
                   onChange={(e) => setTicker(e.target.value)}
                   className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
