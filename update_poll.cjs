const fs = require('fs');
let code = fs.readFileSync('src/components/PollWidget.tsx', 'utf8');

if (!code.includes('getCachedDocs')) {
    code = code.replace(
        "import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';",
        "import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';\nimport { getCachedDocs } from '../lib/cache';"
    );
    code = code.replace(
        `        const snap = await getDocs(q);
        if (!snap.empty) {
          setPoll({ id: snap.docs[0].id, ...snap.docs[0].data() } as Poll);
        }`,
        `        const data = await getCachedDocs(q, 'active-poll');
        if (data && data.length > 0) {
          setPoll(data[0] as Poll);
        }`
    );
    fs.writeFileSync('src/components/PollWidget.tsx', code);
}
