const fs = require('fs');

// 1. Update Types
let types = fs.readFileSync('src/types.ts', 'utf8');
if (!types.includes('EPaper')) {
  types += `
export interface Comment {
  id: string;
  articleId: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface EPaper {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  active: boolean;
  createdAt: string;
}

export interface SiteConfig {
  id: string;
  liveTvUrl: string;
}
`;
  fs.writeFileSync('src/types.ts', types);
}

// 2. Update Firestore Rules
let rules = fs.readFileSync('firestore.rules', 'utf8');
if (!rules.includes('epapers')) {
  rules = rules.replace(
    'match /team/{memberId} {',
    `match /comments/{commentId} {
      allow read, write: if true;
    }
    match /epapers/{epaperId} {
      allow read, write: if true;
    }
    match /polls/{pollId} {
      allow read, write: if true;
    }
    match /settings/{settingId} {
      allow read, write: if true;
    }
    match /team/{memberId} {`
  );
  fs.writeFileSync('firestore.rules', rules);
}
