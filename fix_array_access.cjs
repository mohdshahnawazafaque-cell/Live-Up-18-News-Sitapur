const fs = require('fs');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    replacements.forEach(rep => {
        if (code.includes(rep.from)) {
            code = code.replace(new RegExp(escapeRegExp(rep.from), 'g'), rep.to);
            changed = true;
        }
    });
    if (changed) {
        fs.writeFileSync(filePath, code);
        console.log("Fixed", filePath);
    }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// 1. PollWidget.tsx
replaceInFile('src/components/PollWidget.tsx', [
  {
    from: `if (!snap.empty) {\n          const pollData = { id: snap.docs[0].id, ...snap.docs[0].data() } as Poll;`,
    to: `if (snap && snap.length > 0) {\n          const pollData = snap[0] as Poll;`
  }
]);

// 2. AdBanner.tsx
replaceInFile('src/components/AdBanner.tsx', [
  {
    from: `if (!snap.empty) {\n          // If multiple ads for the same position, pick a random one\n          const ads = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advertisement));`,
    to: `if (snap && snap.length > 0) {\n          // If multiple ads for the same position, pick a random one\n          const ads = snap as Advertisement[];`
  }
]);

// 3. Comments.tsx
replaceInFile('src/components/Comments.tsx', [
  {
    from: `const fetched: Comment[] = [];\n        snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() } as Comment));`,
    to: `const fetched = (snap || []) as Comment[];`
  }
]);

// 4. Category.tsx
replaceInFile('src/pages/Category.tsx', [
  {
    from: `const fetchedArticles: NewsArticle[] = [];\n        snap.forEach(doc => fetchedArticles.push({ id: doc.id, ...doc.data() } as NewsArticle));`,
    to: `const fetchedArticles = (snap || []) as NewsArticle[];`
  }
]);

// 5. Team.tsx
replaceInFile('src/pages/Team.tsx', [
  {
    from: `const members: TeamMember[] = [];\n        snap.forEach(doc => {\n          members.push({ id: doc.id, ...doc.data() } as TeamMember);\n        });`,
    to: `const members = (snap || []) as TeamMember[];`
  }
]);

// 6. EPaperPage.tsx
replaceInFile('src/pages/EPaperPage.tsx', [
  {
    from: `const papers: EPaper[] = [];\n        snap.forEach(doc => {\n          papers.push({ id: doc.id, ...doc.data() } as EPaper);\n        });`,
    to: `const papers = (snap || []) as EPaper[];`
  }
]);

// 7. Search.tsx
replaceInFile('src/pages/Search.tsx', [
  {
    from: `const fetchedArticles: NewsArticle[] = [];\n        snap.forEach(doc => fetchedArticles.push({ id: doc.id, ...doc.data() } as NewsArticle));`,
    to: `const fetchedArticles = (snap || []) as NewsArticle[];`
  }
]);

// 8. Article.tsx
replaceInFile('src/pages/Article.tsx', [
  {
    from: `const related: NewsArticle[] = [];\n          relatedSnap.forEach(d => related.push({ id: d.id, ...d.data() } as NewsArticle));`,
    to: `const related = (relatedSnap || []) as NewsArticle[];`
  }
]);


