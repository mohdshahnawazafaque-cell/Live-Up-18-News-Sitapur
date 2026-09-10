const fs = require('fs');

// Fix WhatsApp Button
let waBtn = fs.readFileSync('src/components/WhatsAppButton.tsx', 'utf8');
waBtn = waBtn.replace("const phoneNumber = '919956078419';", "const phoneNumber = '919838416560';");
fs.writeFileSync('src/components/WhatsAppButton.tsx', waBtn);

// Fix Breaking News ticker numbers
let breaking = fs.readFileSync('src/components/BreakingNews.tsx', 'utf8');
breaking = breaking.replace(/9956078419/g, "9838416560");
fs.writeFileSync('src/components/BreakingNews.tsx', breaking);

// Add calling number to footer or header if not there
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
if (!footer.includes('9956078419')) {
    footer = footer.replace(
        "<li>{language === 'hi' ? 'ईमेल' : 'Email'}: liveup18news@gmail.com</li>",
        "<li>{language === 'hi' ? 'फ़ोन (Call)' : 'Phone (Call)'}: <a href=\"tel:+919956078419\" className=\"hover:text-red-500 transition-colors\">+91 99560 78419</a></li>\n              <li>{language === 'hi' ? 'ईमेल' : 'Email'}: liveup18news@gmail.com</li>"
    );
    fs.writeFileSync('src/components/Footer.tsx', footer);
}

