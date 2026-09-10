const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const filterCode = `
  useEffect(() => {
    // Suppress console errors about quota
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Quota limit exceeded')) {
        return; // Ignore quota errors
      }
      if (args[0] && args[0].message && args[0].message.includes('Quota limit exceeded')) {
        return; // Ignore quota errors
      }
      originalConsoleError.apply(console, args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
`;

if (!code.includes('originalConsoleError')) {
  code = code.replace(
    'export default function App() {',
    'export default function App() {\n' + filterCode
  );
  fs.writeFileSync('src/App.tsx', code);
}
