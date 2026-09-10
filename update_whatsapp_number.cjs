const fs = require('fs');

const oldNumber = '919956078419';
const newNumber = '919838416560';

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldNumber)) {
        content = content.replace(new RegExp(oldNumber, 'g'), newNumber);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

updateFile('src/components/WhatsAppButton.tsx');
updateFile('src/components/BreakingNews.tsx');
