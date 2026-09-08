const fs = require('fs');
const crypto = require('crypto');

const dataPath = './data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const newArticle = {
  id: crypto.randomUUID(),
  category: "UTTAR PRADESH",
  state: "Uttar Pradesh",
  district: "Sitapur",
  headline: "तंबौर के पूर्व चेयरमैन इश्तियाक खान की तबीयत बिगड़ी, अस्पताल में भर्ती, आवाम कर रही दुआ",
  headlineEn: "Former Tambaur Chairman Ishtiaq Khan Hospitalized, Locals Pray for Speedy Recovery",
  featuredImage: "/ishtiaq_khan.jpg",
  publicationDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),
  author: "Live Up 18 News Reporter",
  shortSummary: "सीतापुर जिले के कस्बा तंबौर के पूर्व चेयरमैन इश्तियाक खान साहब की तबीयत खराब होने के चलते उन्हें अस्पताल में भर्ती कराया गया है। उनके समर्थक और तंबौर की अवाम उनके जल्द स्वस्थ होने की दुआ कर रही है।",
  shortSummaryEn: "Former Chairman of Tambaur, Sitapur, Ishtiaq Khan has been admitted to the hospital due to ill health. Supporters and locals are praying for his speedy recovery.",
  keyPoints: [
    "तंबौर के पूर्व चेयरमैन इश्तियाक खान की तबीयत नासाज, अस्पताल में चल रहा इलाज।",
    "मौजूदा चेयरमैन साहिबा के शौहर इश्तियाक खान की अवाम में है गहरी पैठ।",
    "स्थानीय लोगों और समर्थकों ने उनके जल्द स्वस्थ होने की दुआ मांगी।"
  ],
  keyPointsEn: [
    "Former Tambaur Chairman Ishtiaq Khan admitted to hospital.",
    "Known for his social service, he is the husband of the current Chairperson.",
    "Locals and well-wishers pray for his quick recovery."
  ],
  content: "सीतापुर: जिले के कस्बा तंबौर के पूर्व चेयरमैन और कद्दावर नेता जनाब इश्तियाक खान साहब की तबीयत पिछले कुछ दिनों से नासाज चल रही है, जिसके चलते उन्हें अस्पताल में भर्ती कराया गया है। \n\nइश्तियाक खान सिर्फ एक पूर्व चेयरमैन ही नहीं, बल्कि तंबौर की आवाम के लिए एक अहम रहनुमा के तौर पर जाने जाते हैं। मौजूदा चेयरमैन साहिबा के शौहर होने के साथ-साथ उन्होंने अपने कार्यकाल और उसके बाद भी हमेशा आवाम की खिदमत में बढ़-चढ़कर हिस्सा लिया है। \n\nमैं अल्लाह रब्बुल इज्जत से दिल से दुआ करता हूँ कि अल्लाह ताला उनको जल्द से जल्द शिफा-ए-कामिला व आजिला अता फरमाए, मुकम्मल सेहत अता फरमाए और अपने हिफ्ज़-ओ-अमान में रखे।\n\nआप सभी हजरात से भी गुजारिश है कि जनाब चाचा इश्तियाक खान साहब की सेहतयाबी के लिए दुआ करें। अल्लाह उनको जल्द हमारे बीच खैरियत से वापस लाए। आमीन।",
  contentEn: "Sitapur: Former Chairman of Tambaur town in Sitapur district, Ishtiaq Khan, has been admitted to the hospital after his health deteriorated over the past few days.\n\nIshtiaq Khan is known not just as a former political figure but as a prominent leader and social worker for the people of Tambaur. As the husband of the current Chairperson, he has consistently been involved in serving the public.\n\nThe news of his illness has sparked concern among his supporters and the local public. People are taking to social media to pray for his swift recovery and return to good health.",
  sourceAttribution: "Live Up 18 News",
  sourceUrl: "",
  isBreaking: true,
  views: Math.floor(Math.random() * 500) + 100
};

// Handle array structure directly
if (Array.isArray(data)) {
  data.unshift(newArticle);
} else if (data.newsArticles) {
  data.newsArticles.unshift(newArticle);
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log("News article added successfully!");
