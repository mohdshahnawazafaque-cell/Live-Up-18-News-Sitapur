# Agent Rules for LIVE UP 18 NEWS

1. **NO SELF-GENERATED OR DUMMY NEWS**:
   - The agent must NEVER add, generate, scrape, seed, or insert any dummy, mock, external, or placeholder news articles on its own.
   - Only display, preserve, and manage authentic news created, approved, or published directly by the user (Mohd Shahnawaz / LIVE UP 18 NEWS team).
   - Under no circumstances should BBC, Reuters, or generic boilerplate articles ever be reintroduced into the app, database, or fallback datasets.

2. **DURABLE PERSISTENCE**:
   - All news must be read from Firestore (`news` collection) or the user's authentic local dataset (`data.json`).
