const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const contactHtml = `              <li>{language === 'hi' ? 'संपादक/रिपोर्टर' : 'Editor/Reporter'}: मो० शाहनवाज़</li>
              <li>{language === 'hi' ? 'कॉलिंग नंबर (Call)' : 'Calling Number'}: <a href="tel:+919956078419" className="hover:text-red-500 transition-colors font-bold">+91 99560 78419</a></li>
              <li>{language === 'hi' ? 'व्हाट्सएप (WhatsApp)' : 'WhatsApp'}: <a href="https://wa.me/919838416560" className="hover:text-green-500 transition-colors font-bold text-green-500">+91 98384 16560</a></li>
              <li>{language === 'hi' ? 'ईमेल' : 'Email'}: liveup18news@gmail.com</li>`;

// Replace existing contact list
footer = footer.replace(/<li>\{language === 'hi' \? 'संपादक\/रिपोर्टर' : 'Editor\/Reporter'\}: मो० शाहनवाज़<\/li>[\s\S]*?<li>\{language === 'hi' \? 'ईमेल' : 'Email'\}: liveup18news@gmail\.com<\/li>/g, contactHtml);

fs.writeFileSync('src/components/Footer.tsx', footer);
