const fs = require('fs');
let code = fs.readFileSync('src/components/DonationModal.tsx', 'utf8');

// 1. Remove UTR validation logic from handleFormSubmit
const oldFormSubmit = `  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !amount || !transactionId) {
      setErrorMsg(language === 'hi' ? 'कृपया सभी अनिवार्य फ़ील्ड भरें।' : 'Please fill all required fields.');
      return;
    }
    
    const utrRegex = /^\\d{12}$/;
    if (!utrRegex.test(transactionId.trim())) {
      setErrorMsg(language === 'hi' ? 'कृपया सही 12-अंकों का Transaction ID (UTR) दर्ज करें। बिना सही पेमेंट के रसीद नहीं बनेगी।' : 'Please enter a valid 12-digit Transaction ID (UTR). Receipt cannot be generated without valid payment.');
      return;
    }

    confirmAndGenerateReceipt();
  };`;

const newFormSubmit = `  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !amount) {
      setErrorMsg(language === 'hi' ? 'कृपया सभी अनिवार्य फ़ील्ड भरें।' : 'Please fill all required fields.');
      return;
    }
    confirmAndGenerateReceipt();
  };`;

code = code.replace(oldFormSubmit, newFormSubmit);

// 2. Remove the Transaction ID input field entirely
const transactionIdInputRegex = /<div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">[\s\S]*?<\/div>/;
code = code.replace(transactionIdInputRegex, "");

// 3. Remove the disabled check on the submit button
const submitBtnRegex = /<button\s+type="submit"\s+disabled=\{!transactionId \|\| transactionId.length < 6\}\s+className="flex-1 bg-green-600 disabled:bg-slate-400 hover:bg-green-700 text-white font-bold text-lg py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"\s+>/;
const newSubmitBtn = `<button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >`;
code = code.replace(submitBtnRegex, newSubmitBtn);

fs.writeFileSync('src/components/DonationModal.tsx', code);
console.log("Removed UTR requirement and input.");
