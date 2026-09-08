const fs = require('fs');
const crypto = require('crypto');

const dataPath = './data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter out old ones just in case
if (data.articles) {
  data.articles = data.articles.filter(a => !(a.headline && a.headline.includes("इश्तियाक खान")));
} else {
  data.articles = [];
}

const newArticle = {
  id: crypto.randomUUID(),
  category: "UTTAR PRADESH",
  state: "Uttar Pradesh",
  district: "Sitapur",
  headline: "तम्बौर के पूर्व चेयरमैन इश्तियाक खान की तबीयत बिगड़ी, अस्पताल में भर्ती; क्षेत्रवासियों में चिंता की लहर",
  headlineEn: "Former Tambaur Chairman Ishtiaq Khan Hospitalized; Wave of Concern Among Locals",
  featuredImage: "/ishtiaq_khan.jpg",
  publicationDate: new Date().toISOString(),
  updatedDate: new Date().toISOString(),
  author: "LIVE UP 18 NEWS",
  shortSummary: "सीतापुर जिले के तम्बौर कस्बे के पूर्व चेयरमैन और कद्दावर नेता जनाब इश्तियाक खान की तबीयत खराब होने के चलते उन्हें अस्पताल में भर्ती कराया गया है। उनके अस्वस्थ होने की खबर से क्षेत्र की आवाम चिंतित है और उनके जल्द स्वस्थ होने की दुआएं कर रही है।",
  shortSummaryEn: "Former Chairman of Tambaur town in Sitapur district, Ishtiaq Khan, has been admitted to the hospital due to poor health. The news has sparked concern among locals.",
  keyPoints: [
    "तम्बौर के पूर्व चेयरमैन इश्तियाक खान कई दिनों से बीमार, अस्पताल में इलाज जारी।",
    "सामाजिक और राजनीतिक क्षेत्र में मजबूत पकड़, मौजूदा चेयरमैन के पति हैं इश्तियाक खान।",
    "समर्थकों और शुभचिंतकों ने उनके जल्द स्वस्थ होने के लिए अल्लाह से की दुआएं।"
  ],
  keyPointsEn: [
    "Former Tambaur Chairman Ishtiaq Khan ill for several days, undergoing treatment in the hospital.",
    "A prominent social and political figure, he is the husband of the current Chairperson.",
    "Supporters and well-wishers pray to Allah for his quick and complete recovery."
  ],
  content: "सीतापुर/तम्बौर। कस्बा तम्बौर के पूर्व चेयरमैन एवं क्षेत्र की एक जानी-मानी सामाजिक शख्सियत जनाब इश्तियाक खान साहब की तबीयत पिछले कई दिनों से नासाज़ चल रही है। स्वास्थ्य में सुधार न होने के चलते उन्हें अस्पताल में भर्ती कराया गया है, जहां विशेषज्ञ चिकित्सकों की निगरानी में उनका सघन उपचार जारी है।\n\nजनाब इश्तियाक खान का नाम तम्बौर की सामाजिक और राजनीतिक सरगर्मियों में एक अहम मुकाम रखता है। पूर्व चेयरमैन के तौर पर उन्होंने लंबे समय तक कस्बे की अवाम से जुड़कर जमीनी स्तर पर अपनी जिम्मेदारियों को बखूबी निभाया। उनकी पहचान महज़ एक राजनेता के रूप में नहीं, बल्कि तम्बौर की आवाम के बीच हर दुख-सुख में साथ खड़े रहने वाले एक हमदर्द और प्रभावशाली रहनुमा के तौर पर रही है। मौजूदा चेयरमैन साहिबा के शौहर होने के नाते भी वे लगातार जनसेवा के कार्यों में सक्रिय रहे हैं।\n\nउनके अस्वस्थ होने और अस्पताल में भर्ती होने की खबर सामने आते ही तम्बौर कस्बे समेत आसपास के ग्रामीण अंचलों में उनके समर्थकों, शुभचिंतकों और चाहने वालों में चिंता की लहर दौड़ गई है। बड़ी तादाद में लोग उनके स्वास्थ्य की जानकारी ले रहे हैं और सोशल मीडिया से लेकर मस्जिदों व घरों में उनके जल्द सेहतयाब होने की दुआएं मांग रहे हैं।\n\nLIVE UP 18 NEWS परिवार भी जनाब इश्तियाक खान साहब के शीघ्र और पूर्ण रूप से स्वस्थ होने की दिल से कामना करता है। हम अल्लाह रब्बुल इज्जत से दुआ करते हैं कि वह उन्हें शिफा-ए-कामिला व आजिला अता फरमाए, ताकि वे जल्द ही पूरी तरह सेहतयाब होकर एक बार फिर आवाम के बीच लौट सकें। आमीन।\n\nरिपोर्ट: LIVE UP 18 NEWS",
  contentEn: "Sitapur/Tambaur: Former Chairman of Tambaur town and prominent social figure, Ishtiaq Khan, has been experiencing poor health for the past few days. Due to a lack of improvement in his condition, he has been admitted to the hospital, where he is currently undergoing intensive treatment under medical supervision.\n\nIshtiaq Khan holds a significant position in the social and political circles of Tambaur. During his tenure as Chairman, he fulfilled his responsibilities with deep grassroots connection to the local populace. He is recognized not just as a former politician, but as a compassionate leader who stood by the people of Tambaur through thick and thin. Being the husband of the current Chairperson, he has continued his active involvement in public service.\n\nThe news of his illness and subsequent hospitalization has sent a wave of concern among his supporters, well-wishers, and followers in Tambaur and surrounding rural areas. A large number of people are inquiring about his health and praying for his speedy recovery across social media platforms, mosques, and homes.\n\nThe LIVE UP 18 NEWS family also extends heartfelt wishes for Ishtiaq Khan's swift and complete recovery. We pray to the Almighty to grant him complete and lasting health (Shifa-e-Kamila wa Aajila) so that he may soon return to serve the public. Ameen.\n\nReport: LIVE UP 18 NEWS",
  sourceAttribution: "LIVE UP 18 NEWS",
  sourceUrl: "",
  isBreaking: true,
  views: Math.floor(Math.random() * 500) + 150
};

data.articles.unshift(newArticle);

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log("Article properly inserted!");
