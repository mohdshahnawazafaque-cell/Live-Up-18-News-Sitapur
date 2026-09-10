const fs = require('fs');
let code = fs.readFileSync('src/components/Comments.tsx', 'utf8');

code = code.replace(
    'fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());',
    'fetched.sort((a, b) => (new Date(b.createdAt || 0)).getTime() - (new Date(a.createdAt || 0)).getTime());'
);
code = code.replace(
    'formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })',
    'c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : ""'
);

fs.writeFileSync('src/components/Comments.tsx', code);
