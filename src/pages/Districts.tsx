import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MapPin } from 'lucide-react';

const UP_DISTRICTS = [
  "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", 
  "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", 
  "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", 
  "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", 
  "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", 
  "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", 
  "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", 
  "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", 
  "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", 
  "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", 
  "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
];

export default function Districts() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="mb-8 border-b-4 border-red-600 pb-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <MapPin className="text-red-600" size={36} />
          {language === 'hi' ? 'उत्तर प्रदेश के सभी ज़िले' : 'All Districts of Uttar Pradesh'}
        </h1>
        <p className="text-slate-500 mt-2 font-bold">
          {language === 'hi' ? 'अपने ज़िले की ताज़ा ख़बरें पढ़ने के लिए नीचे चुनें:' : 'Select your district below to read the latest news:'}
        </p>
      </header>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {(Array.isArray(UP_DISTRICTS) ? UP_DISTRICTS : []).map(district => {
          // URLs are lowercase with hyphens
          const urlSlug = district.toLowerCase().replace(/ /g, '-');
          return (
            <Link 
              key={district} 
              to={`/category/${urlSlug}`}
              className="bg-white border border-slate-200 hover:border-red-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-lg p-3 md:p-4 text-center group"
            >
              <span className="font-bold text-slate-800 group-hover:text-red-600 text-sm md:text-base">
                {language === 'hi' ? getHindiDistrict(district) : district}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Simple English to Hindi mapping for districts (essential ones)
// We will return English if mapping doesn't exist, but it's fine for now, we can add a few or just show English.
function getHindiDistrict(name: string) {
  const map: Record<string, string> = {
    "Agra": "आगरा", "Aligarh": "अलीगढ़", "Ambedkar Nagar": "अम्बेडकर नगर", "Amethi": "अमेठी",
    "Amroha": "अमरोहा", "Auraiya": "औरैया", "Ayodhya": "अयोध्या", "Azamgarh": "आजमगढ़",
    "Baghpat": "बागपत", "Bahraich": "बहराइच", "Ballia": "बलिया", "Balrampur": "बलरामपुर",
    "Banda": "बांदा", "Barabanki": "बाराबंकी", "Bareilly": "बरेली", "Basti": "बस्ती",
    "Bhadohi": "भदोही", "Bijnor": "बिजनौर", "Budaun": "बदायूं", "Bulandshahr": "बुलंदशहर",
    "Chandauli": "चंदौली", "Chitrakoot": "चित्रकूट", "Deoria": "देवरिया", "Etah": "एटा",
    "Etawah": "इटावा", "Farrukhabad": "फर्रुखाबाद", "Fatehpur": "फतेहपुर", "Firozabad": "फिरोजाबाद",
    "Gautam Buddha Nagar": "गौतम बुद्ध नगर", "Ghaziabad": "गाजियाबाद", "Ghazipur": "गाजीपुर",
    "Gonda": "गोंडा", "Gorakhpur": "गोरखपुर", "Hamirpur": "हमीरपुर", "Hapur": "हापुड़",
    "Hardoi": "हरदोई", "Hathras": "हाथरस", "Jalaun": "जालौन", "Jaunpur": "जौनपुर",
    "Jhansi": "झांसी", "Kannauj": "कन्नौज", "Kanpur Dehat": "कानपुर देहात", "Kanpur Nagar": "कानपुर नगर",
    "Kasganj": "कासगंज", "Kaushambi": "कौशाम्बी", "Kheri": "खीरी", "Kushinagar": "कुशीनगर",
    "Lalitpur": "ललितपुर", "Lucknow": "लखनऊ", "Maharajganj": "महराजगंज", "Mahoba": "महोबा",
    "Mainpuri": "मैनपुरी", "Mathura": "मथुरा", "Mau": "मऊ", "Meerut": "मेरठ", "Mirzapur": "मिर्जापुर",
    "Moradabad": "मुरादाबाद", "Muzaffarnagar": "मुजफ्फरनगर", "Pilibhit": "पीलीभीत", "Pratapgarh": "प्रतापगढ़",
    "Prayagraj": "प्रयागराज", "Raebareli": "रायबरेली", "Rampur": "रामपुर", "Saharanpur": "सहारनपुर",
    "Sambhal": "सम्भल", "Sant Kabir Nagar": "संत कबीर नगर", "Shahjahanpur": "शाहजहांपुर", "Shamli": "शामली",
    "Shravasti": "श्रावस्ती", "Siddharthnagar": "सिद्धार्थनगर", "Sitapur": "सीतापुर", "Sonbhadra": "सोनभद्र",
    "Sultanpur": "सुल्तानपुर", "Unnao": "उन्नाव", "Varanasi": "वाराणसी"
  };
  return map[name] || name;
}
