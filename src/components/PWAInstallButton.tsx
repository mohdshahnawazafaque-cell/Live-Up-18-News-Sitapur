import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function PWAInstallButton() {
  const { language } = useLanguage();
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const navigate = useNavigate();

  if (isInstalled) return null;

  const handleClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (!res) {
        navigate('/install');
      }
    } else {
      navigate('/install');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all shadow-sm cursor-pointer"
      title={language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}
    >
      <Download size={14} className="animate-pulse" />
      {language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}
    </button>
  );
}
