import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="LIVE UP 18 NEWS" className="h-12 w-auto bg-white rounded-md p-1 mb-2" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }} />
              <div className="hidden flex-col">
                <span className="text-2xl font-black tracking-tight text-white leading-none">LIVE UP 18</span>
                <span className="text-sm font-bold tracking-widest text-red-600 leading-none">NEWS</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {language === 'hi' 
                ? 'लाइव अप 18 न्यूज़ उत्तर प्रदेश, भारत और दुनिया भर की ताज़ा ख़बरों के लिए आपका भरोसेमंद स्रोत है। तेज़, विश्वसनीय और निष्पक्ष रिपोर्टिंग।' 
                : 'Live Up 18 News is your trusted source for the latest news from Uttar Pradesh, India, and around the world. Fast, reliable, and unbiased reporting.'}
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase">{language === 'hi' ? 'श्रेणियाँ' : 'Categories'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/india" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'भारत' : 'India'}</Link></li>
              <li><Link to="/category/uttar-pradesh" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh'}</Link></li>
              <li><Link to="/category/politics" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'राजनीति' : 'Politics'}</Link></li>
              <li><Link to="/category/crime" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'क्राइम' : 'Crime'}</Link></li>
              <li><Link to="/category/business" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'बिज़नेस' : 'Business'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase">{language === 'hi' ? 'अन्य' : 'More'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/sports" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'खेल' : 'Sports'}</Link></li>
              <li><Link to="/category/entertainment" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'मनोरंजन' : 'Entertainment'}</Link></li>
              <li><Link to="/category/technology" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'टेक' : 'Technology'}</Link></li>
              <li><Link to="/category/health" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'स्वास्थ्य' : 'Health'}</Link></li>
              <li><Link to="/category/world" className="hover:text-red-500 transition-colors">{language === 'hi' ? 'दुनिया' : 'World'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 uppercase">{language === 'hi' ? 'संपर्क करें' : 'Contact Us'}</h3>
            <ul className="space-y-2 text-sm">
              <li>{language === 'hi' ? 'संपादक/रिपोर्टर' : 'Editor/Reporter'}: मो० शाहनवाज़</li>
              <li>{language === 'hi' ? 'ईमेल' : 'Email'}: liveup18news@gmail.com</li>
              <li>{language === 'hi' ? 'वेबसाइट' : 'Website'}: <a href="https://liveup18news.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">liveup18news.netlify.app/</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} LIVE UP 18 NEWS. {language === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</Link>
            <Link to="#" className="hover:text-white transition-colors">{language === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}</Link>
            <Link to="#" className="hover:text-white transition-colors">{language === 'hi' ? 'हमारे बारे में' : 'About Us'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
