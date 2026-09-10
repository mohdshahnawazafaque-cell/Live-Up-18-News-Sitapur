const fs = require('fs');
let adminCode = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const replacements = [
    {
        find: 'await addDoc(collection(db, "news"), newsItem);',
        replace: 'await addDoc(collection(db, "news"), newsItem);\n      sessionStorage.clear(); // Clear cache so new news appears immediately'
    },
    {
        find: 'await updateDoc(doc(db, "news", editingArticle.id), updatedNewsItem);',
        replace: 'await updateDoc(doc(db, "news", editingArticle.id), updatedNewsItem);\n      sessionStorage.clear(); // Clear cache so updated news appears immediately'
    },
    {
        find: 'await deleteDoc(doc(db, "news", id));',
        replace: 'await deleteDoc(doc(db, "news", id));\n        sessionStorage.clear();'
    },
    {
        find: 'await updateDoc(doc(db, "news", article.id), { videoUrl: null });',
        replace: 'await updateDoc(doc(db, "news", article.id), { videoUrl: null });\n                                  sessionStorage.clear();'
    }
];

let changed = false;
for (const r of replacements) {
    if (adminCode.includes(r.find)) {
        adminCode = adminCode.replace(r.find, r.replace);
        changed = true;
    }
}

if (changed) {
    fs.writeFileSync('src/pages/Admin.tsx', adminCode);
    console.log("Updated Admin.tsx");
} else {
    console.log("No changes made to Admin.tsx");
}

