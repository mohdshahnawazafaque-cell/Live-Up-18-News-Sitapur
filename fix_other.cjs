const fs = require('fs');

let article = fs.readFileSync('src/pages/Article.tsx', 'utf8');
article = article.replace(
  `          relatedSnap.forEach(rDoc => {
            related.push({ id: rDoc.id, ...rDoc.data() } as NewsArticle);
          });`,
  `          const related = (relatedSnap || []) as NewsArticle[];`
);
fs.writeFileSync('src/pages/Article.tsx', article);

let search = fs.readFileSync('src/pages/Search.tsx', 'utf8');
search = search.replace(
  `        const fetchedArticles: NewsArticle[] = [];
        snap.forEach((doc: any) => {
          fetchedArticles.push({ id: doc.id, ...doc.data() } as NewsArticle);
        });`,
  `        const fetchedArticles = (snap || []) as NewsArticle[];`
);
fs.writeFileSync('src/pages/Search.tsx', search);

if (fs.existsSync('src/pages/EPaperPage.tsx')) {
    let epaper = fs.readFileSync('src/pages/EPaperPage.tsx', 'utf8');
    epaper = epaper.replace(
      `        const papers: EPaper[] = [];
        snap.forEach(doc => {
          papers.push({ id: doc.id, ...doc.data() } as EPaper);
        });`,
      `        const papers = (snap || []) as EPaper[];`
    );
    fs.writeFileSync('src/pages/EPaperPage.tsx', epaper);
}

