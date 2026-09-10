const fs = require('fs');
const oldNumber = '9838416560';
const newNumber = '9956078419';

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldNumber)) {
        content = content.replace(new RegExp(oldNumber, 'g'), newNumber);
        fs.writeFileSync(filePath, content);
        console.log(`Reverted ${filePath}`);
    }
}

updateFile('src/components/WhatsAppButton.tsx');
updateFile('src/components/BreakingNews.tsx');
