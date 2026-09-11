import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function InstallPWA({ className }: { className?: string }) {
  const { language } = useLanguage();
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const navigate = useNavigate();

  const handleInstall = async () => {
    if (isInstallable) {
      const res = await install();
      if (!res) {
        navigate('/install');
      }
    } else {
      navigate('/install');
    }
  };

  if (isInstalled) return null;

  return (
    <button 
      onClick={handleInstall} 
      className={className || "flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-1.5 px-3 rounded-full text-xs md:text-sm transition-all shadow-md mx-2 border border-red-500 cursor-pointer"}
      title={language === 'hi' ? 'ऐप इंस्टॉल करें और शेयर करें' : 'Install & Share App'}
    >
      <Download size={14} className="animate-pulse" /> 
      {language === 'ur' ? 'ایپ انسٹال کریں' : (language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App')}
    </button>
  );
}
