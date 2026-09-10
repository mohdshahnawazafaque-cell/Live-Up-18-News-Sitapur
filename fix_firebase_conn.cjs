const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// Add initializeFirestore with long polling setting if not there
if (!code.includes('initializeFirestore')) {
    code = code.replace(
        'import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";',
        'import { initializeFirestore, getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";'
    );
    
    code = code.replace(
        "export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');",
        "export const db = initializeFirestore(app, { experimentalForceLongPolling: true, databaseId: firebaseConfig.firestoreDatabaseId || '(default)' });"
    );
    fs.writeFileSync('src/lib/firebase.ts', code);
    console.log("Firebase connection setting updated (force long polling).");
}
