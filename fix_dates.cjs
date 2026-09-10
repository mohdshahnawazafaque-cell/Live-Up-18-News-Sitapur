const fs = require('fs');

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (code.includes('format(new Date(article.updatedDate)')) {
        code = code.replace(
            /\{format\(new Date\(article\.updatedDate\), "MMM d, yyyy, h:mm a"\)\}/g,
            '{article.updatedDate ? format(new Date(article.updatedDate), "MMM d, yyyy, h:mm a") : format(new Date(article.publicationDate || Date.now()), "MMM d, yyyy, h:mm a")}'
        );
        changed = true;
    }

    if (code.includes('format(new Date(c.date)')) {
        code = code.replace(
            /\{format\(new Date\(c\.date\), "MMM d, yyyy"\)\}/g,
            '{c.date ? format(new Date(c.date), "MMM d, yyyy") : "Unknown date"}'
        );
        changed = true;
    }

    if (code.includes('formatDistanceToNow(new Date(news.publicationDate)')) {
        code = code.replace(
            /formatDistanceToNow\(new Date\(news\.publicationDate\), \{ addSuffix: true \}\)/g,
            'news.publicationDate ? formatDistanceToNow(new Date(news.publicationDate), { addSuffix: true }) : ""'
        );
        changed = true;
    }

    if (code.includes('new Date(article.publicationDate).toLocaleDateString()')) {
        code = code.replace(
            /new Date\(article\.publicationDate\)\.toLocaleDateString\(\)/g,
            'article.publicationDate ? new Date(article.publicationDate).toLocaleDateString() : "No Date"'
        );
        changed = true;
    }
    
    // Admin.tsx table fix for dates
    if (code.includes('{new Date(article.publicationDate).toLocaleDateString()}')) {
         code = code.replace(
            '{new Date(article.publicationDate).toLocaleDateString()}',
            '{article.publicationDate ? new Date(article.publicationDate).toLocaleDateString() : "No Date"}'
        );
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, code);
        console.log("Fixed dates in " + filePath);
    }
}

fixFile('src/pages/Article.tsx');
fixFile('src/pages/Home.tsx');
fixFile('src/pages/Category.tsx');
fixFile('src/pages/Admin.tsx');

