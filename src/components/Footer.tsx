import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-8 border-red-700 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-white rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-4">
            <div className="mb-6 flex flex-col items-start justify-center">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tighter text-white leading-none italic">
                  LIVE UP
                </span>
                <span className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-red-600 leading-none italic -ml-1">
                  18
                </span>
              </div>
              <div className="bg-red-700 px-3 sm:px-6 py-0.5 sm:py-1 rounded shadow-sm mt-1 sm:mt-1.5 ml-1">
                <span className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.4em] sm:tracking-[0.8em] text-white leading-none block ml-1">
                  NEWS
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm mb-6">
              {language === 'hi' 
                ? 'लाइव यूपी 18 न्यूज़ उत्तर प्रदेश, भारत और दुनिया भर की ताज़ा ख़बरों के लिए आपका भरोसेमंद स्रोत है। तेज़, विश्वसनीय और निष्पक्ष रिपोर्टिंग।' 
                : 'Live Up 18 News is your trusted source for the latest news from Uttar Pradesh, India, and around the world. Fast, reliable, and unbiased reporting.'}
            </p>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase">{language === 'hi' ? 'न्यूज़लेटर सब्सक्राइब करें' : 'Subscribe to Newsletter'}</h4>
              <form className="flex" onSubmit={(e) => { e.preventDefault(); alert(language === 'hi' ? 'सब्सक्राइब करने के लिए धन्यवाद!' : 'Thanks for subscribing!'); }}>
                <input 
                  type="email" 
                  placeholder={language === 'hi' ? 'आपका ईमेल...' : 'Your email address...'} 
                  className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-l focus:outline-none focus:border-red-600 text-sm w-full"
                  required
                />
                <button type="submit" className="bg-red-700 hover:bg-red-600 px-4 py-2 text-white font-bold text-sm rounded-r transition-colors">
                  {language === 'hi' ? 'जुड़ें' : 'Join'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Categories */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="text-white font-black text-lg mb-6 uppercase tracking-wider font-heading">{language === 'hi' ? 'श्रेणियाँ' : 'Categories'}</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/category/india" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'भारत' : 'India'}</Link></li>
              <li><Link to="/category/uttar-pradesh" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh'}</Link></li>
              <li><Link to="/category/politics" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'राजनीति' : 'Politics'}</Link></li>
              <li><Link to="/category/crime" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'क्राइम' : 'Crime'}</Link></li>
              <li><Link to="/category/business" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'बिज़नेस' : 'Business'}</Link></li>
            </ul>
          </div>
          
          {/* More Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="text-white font-black text-lg mb-6 uppercase tracking-wider font-heading">{language === 'hi' ? 'अन्य' : 'More'}</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/category/sports" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'खेल' : 'Sports'}</Link></li>
              <li><Link to="/category/entertainment" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'मनोरंजन' : 'Entertainment'}</Link></li>
              <li><Link to="/category/technology" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'टेक' : 'Technology'}</Link></li>
              <li><Link to="/category/health" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'स्वास्थ्य' : 'Health'}</Link></li>
              <li><Link to="/category/world" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="text-red-600 text-[10px]">▶</span> {language === 'hi' ? 'दुनिया' : 'World'}</Link></li>
            </ul>
          </div>
          
          {/* Contact & Legal */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="text-white font-black text-lg mb-6 uppercase tracking-wider font-heading">{language === 'hi' ? 'संपर्क करें' : 'Contact Us'}</h3>
            <ul className="space-y-4 text-sm bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <li className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{language === 'hi' ? 'प्रधान संपादक' : 'Editor-in-Chief'}</span>
                <span className="text-white font-medium">मो० शाहनवाज़ (Mohd Shahnawaz)</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{language === 'hi' ? 'कॉलिंग नंबर' : 'Calling Number'}</span>
                <a href="tel:+919956078419" className="text-white hover:text-red-500 transition-colors font-medium">+91 99560 78419</a>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}</span>
                <a href="https://wa.me/919838416560" className="text-green-500 hover:text-green-400 transition-colors font-bold">+91 98384 16560</a>
              </li>
              <li className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{language === 'hi' ? 'ईमेल' : 'Email'}</span>
                <span className="text-white">liveup18news@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} LIVE UP 18 NEWS. {language === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link to="#" className="text-slate-400 hover:text-white transition-colors">{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</Link>
            <Link to="#" className="text-slate-400 hover:text-white transition-colors">{language === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}</Link>
            <Link to="#" className="text-slate-400 hover:text-white transition-colors">{language === 'hi' ? 'हमारे बारे में' : 'About Us'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );

}
