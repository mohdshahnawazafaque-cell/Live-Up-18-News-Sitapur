import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Download, Printer, CheckCircle, Copy, Check, AlertTriangle, Smartphone, QrCode } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { format } from 'date-fns';
import { hi, enUS } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AMOUNTS = [100, 250, 500, 1000];

function numberToWords(num: number): string {
  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
  const numStr = num.toString();
  if (numStr.length > 9) return 'overflow';
  const n = ('000000000' + numStr).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
  str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
  str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
  str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
  str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) + 'only' : 'only';
  return str;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState<'amount' | 'form' | 'payment_info' | 'processing' | 'success' | 'error'>('amount');
  const [amount, setAmount] = useState<number | ''>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Form fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const [receiptData, setReceiptData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [upiCopied, setUpiCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const upiIdString = "9956078419@ybl";

  const handleCopyUPI = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(upiIdString);
      } else {
        const ta = document.createElement('textarea');
        ta.value = upiIdString;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 3000);
    } catch (e) {
      console.error("Failed to copy UPI ID:", e);
    }
  };

  const handleDirectPay = (targetApp: 'phonepe' | 'gpay' | 'paytm' | 'upi') => {
    const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
    const payeeName = "MOHD%20SHAHNAWAZ";
    const upiQuery = `pa=${encodeURIComponent(upiIdString)}&pn=${payeeName}&am=${amount}&cu=INR&tn=LiveUP18%20News%20Donation`;

    if (targetApp === 'phonepe') {
      if (isAndroid) {
        window.location.href = `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.phonepe.app;end`;
      } else {
        window.location.href = `phonepe://pay?${upiQuery}`;
      }
    } else if (targetApp === 'gpay') {
      if (isAndroid) {
        window.location.href = `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
      } else {
        window.location.href = `gpay://upi/pay?${upiQuery}`;
      }
    } else if (targetApp === 'paytm') {
      if (isAndroid) {
        window.location.href = `intent://pay?${upiQuery}#Intent;scheme=upi;package=net.one97.paytm;end`;
      } else {
        window.location.href = `paytmmp://pay?${upiQuery}`;
      }
    } else {
      window.location.href = `upi://pay?${upiQuery}`;
    }
  };



  if (!isOpen) return null;

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val) {
      setAmount(Number(val));
    } else {
      setAmount('');
    }
  };

  const handleProceedToForm = () => {
    if (!amount || Number(amount) < 1) {
      setErrorMsg(language === 'hi' ? 'कृपया एक मान्य राशि दर्ज करें।' : 'Please enter a valid amount.');
      return;
    }
    setErrorMsg('');
    setStep('payment_info');
  };

  const generateReceiptNumber = () => {
    const prefix = 'L18-DON';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !amount || !transactionId) {
      setErrorMsg(language === 'hi' ? 'कृपया सभी अनिवार्य फ़ील्ड भरें।' : 'Please fill all required fields.');
      return;
    }
    
    // 12-digit exact validation
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(transactionId.trim())) {
      setErrorMsg(language === 'hi' ? 'कृपया सही 12-अंकों का Transaction ID (UTR) दर्ज करें। बिना सही पेमेंट के रसीद नहीं बनेगी।' : 'Please enter a valid 12-digit Transaction ID (UTR). Receipt cannot be generated without valid payment.');
      return;
    }

    setStep('processing');
    setErrorMsg('');

    try {
      // Check if this UTR has already been used in Firestore
      const donationsRef = collection(db, 'donations');
      const q = query(donationsRef, where('paymentRef', '==', transactionId.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setStep('form');
        setErrorMsg(language === 'hi' ? 'यह Transaction ID (UTR) पहले ही इस्तेमाल किया जा चुका है। एक UTR से केवल एक ही रसीद बन सकती है।' : 'This Transaction ID (UTR) has already been used. A receipt can only be generated once per UTR.');
        return;
      }
      
      // If unique, proceed to generate receipt
      confirmAndGenerateReceipt();
    } catch (error) {
      console.error("Error verifying UTR:", error);
      setStep('form');
      setErrorMsg('Error verifying payment. Please try again.');
    }
  };

  const confirmAndGenerateReceipt = async () => {
    try {
      const receiptNo = generateReceiptNumber();
      
      const docRef = await addDoc(collection(db, 'donations'), {
        receiptNumber: receiptNo,
        donorName: name,
        mobile,
        email: email || '',
        amount: Number(amount),
        message,
        status: 'successful',
        paymentRef: transactionId || 'Direct_Donation',
        createdAt: serverTimestamp(),
      });

      setReceiptData({
        receiptNumber: receiptNo,
        donorName: name,
        mobile,
        email: email || '',
        amount: Number(amount),
        date: new Date(),
        paymentRef: transactionId || 'Direct_Donation',
      });
      
      setStep('success');
      
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setStep('error');
      setErrorMsg(err.message || 'Failed to process receipt.');
    }
  };



  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`LiveUP18_Receipt_${receiptData?.receiptNumber}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF receipt.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetAndClose = () => {
    setStep('amount');
    setAmount(500);
    setCustomAmount('');
    setName('');
    setMobile('');
    setEmail('');
    setMessage('');
    setReceiptData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm print:bg-white print:p-0">
      <div className="bg-white dark:bg-slate-950 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col print:shadow-none print:w-full print:max-w-none print:max-h-none print:h-auto">
        
        {/* Header - Hidden when printing */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="text-red-600" fill="currentColor" /> 
            {language === 'hi' ? 'सहयोग करें' : 'Support Us'}
          </h2>
          <button onClick={resetAndClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto print:p-0">
          
          {errorMsg && step !== 'error' && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border-l-4 border-red-600 text-sm font-medium print:hidden">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Amount Selection */}
          {step === 'amount' && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
                  {language === 'hi' ? 'आपकी छोटी-सी मदद, जनता की बड़ी आवाज़' : 'Your Small Help, A Big Voice for the People'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {language === 'hi' 
                    ? 'Live UP 18 News की स्वतंत्र और जमीनी पत्रकारिता को आगे बढ़ाने में आपका सहयोग महत्वपूर्ण है।' 
                    : 'Your support is crucial to advance the independent and grassroots journalism of Live UP 18 News.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {AMOUNTS.map(amt => (
                  <button
                    key={amt}
                    onClick={() => handleAmountSelect(amt)}
                    className={`py-3 px-4 rounded-xl font-bold text-lg transition-all border-2 ${
                      amount === amt 
                        ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                        : 'border-slate-200 text-slate-700 hover:border-red-300 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'hi' ? 'या अपनी इच्छानुसार राशि दर्ज करें (₹)' : 'Or enter custom amount (₹)'}
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder={language === 'hi' ? 'उदा. 1500' : 'e.g. 1500'}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-lg font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-slate-900 dark:text-white"
                  min="1"
                />
              </div>

              <button
                onClick={handleProceedToForm}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {language === 'hi' ? 'आगे बढ़ें' : 'Proceed'}
              </button>
            </div>
          )}

          {/* STEP 2: Details Form */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30 flex justify-between items-center mb-6">
                <span className="font-bold text-slate-700 dark:text-slate-300">{language === 'hi' ? 'सहयोग राशि:' : 'Donation Amount:'}</span>
                <span className="font-black text-2xl text-red-700 dark:text-red-500">₹{amount}</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 text-slate-900 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{language === 'hi' ? 'संदेश (वैकल्पिक)' : 'Message (Optional)'}</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 text-slate-900 dark:text-white h-20 resize-none"
                ></textarea>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'hi' ? '12 अंकों का Transaction ID (UTR) दर्ज करें *' : '12-Digit Transaction ID (UTR) *'}
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="e.g. 312345678901"
                  maxLength={12}
                  className="w-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 text-slate-900 dark:text-white font-mono"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {language === 'hi' ? 'नोट: एक UTR से केवल एक ही रसीद जेनरेट की जा सकती है। फर्जी UTR मान्य नहीं होंगे।' : 'Note: Only one receipt can be generated per UTR. Fake UTRs will be rejected.'}
                </p>
              </div>

              

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('payment_info')}
                  className="px-6 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'hi' ? 'वापस' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={!transactionId || transactionId.length !== 12}
                  className="flex-1 bg-green-600 disabled:bg-slate-400 hover:bg-green-700 text-white font-bold text-lg py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  {language === 'hi' ? 'रसीद जेनरेट करें' : 'Generate Receipt'}
                </button>
              </div>
            </form>
          )}

          
          {/* STEP 2.5: Payment Info */}
          {step === 'payment_info' && (
            <div className="animate-[fadeIn_0.3s_ease-out] space-y-4">
              <div className="text-center">
                <div className="inline-block bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-extrabold text-sm px-3 py-1 rounded-full mb-2">
                  {language === 'hi' ? 'सहयोग राशि' : 'Donation Amount'}: ₹{amount}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'पेमेंट का तरीका चुनें' : 'Choose Payment Method'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {language === 'hi' 
                    ? 'QR कोड स्कैन करें, UPI ID कॉपी करें या ऐप लिंक पर टैप करें:' 
                    : 'Scan QR Code, copy UPI ID, or tap UPI app link:'}
                </p>
              </div>

              {/* QR Code Container (Visible on both Mobile & Desktop) */}
              <div className="bg-slate-50 dark:bg-slate-900 border-2 border-red-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md">
                  <QRCodeSVG 
                    value={`upi://pay?pa=${upiIdString}&pn=LIVE%20UP%2018%20NEWS&am=${amount}&cu=INR&tn=LiveUP18%20News%20Donation`} 
                    size={170} 
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <QrCode size={16} className="text-red-600" />
                  <span>{language === 'hi' ? `Google Pay / PhonePe / Paytm से ₹${amount} स्कैन करें` : `Scan ₹${amount} via any UPI App`}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === 'hi' 
                    ? '📱 मोबाइल पर: स्क्रीनशॉट लेकर GPay/PhonePe की गैलरी स्कैनर से स्कैन करें' 
                    : '📱 Mobile: Take screenshot & scan from GPay/PhonePe gallery'}
                </p>
              </div>

              {/* 1-Click Copy UPI ID Section */}
              <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {language === 'hi' ? 'आधिकारिक UPI ID' : 'Official UPI ID'}:
                  </span>
                  {upiCopied && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check size={13} /> {language === 'hi' ? 'कॉपी हो गया!' : 'Copied!'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-lg font-mono font-bold text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 select-all">
                    {upiIdString}
                  </div>
                  <button
                    onClick={handleCopyUPI}
                    type="button"
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      upiCopied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    }`}
                  >
                    {upiCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{upiCopied ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कॉपी करें' : 'Copy ID')}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {language === 'hi' 
                    ? '👉 इसे कॉपी करके अपने Google Pay / PhonePe में "Pay to UPI ID" में पेस्ट करें।' 
                    : '👉 Copy this and paste in Google Pay / PhonePe "Pay to UPI ID".'}
                </p>
              </div>

              {/* Direct 1-Click UPI Payment App Buttons */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
                  {language === 'hi' ? 'सीधा भुगतान के लिए ऐप चुनें (1-Click Pay)' : 'Select App for 1-Click Payment'}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* PhonePe */}
                  <button
                    type="button"
                    onClick={() => handleDirectPay('phonepe')}
                    className="flex items-center justify-center gap-2 bg-[#5f259f] hover:bg-[#4d1d82] active:scale-95 text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm shadow transition-all cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-white text-[#5f259f] font-black flex items-center justify-center text-xs">पे</span>
                    <span>PhonePe</span>
                  </button>

                  {/* Google Pay */}
                  <button
                    type="button"
                    onClick={() => handleDirectPay('gpay')}
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black active:scale-95 text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm shadow transition-all cursor-pointer border border-slate-700"
                  >
                    <span className="font-extrabold text-blue-400">G</span>
                    <span className="font-extrabold text-red-400">P</span>
                    <span className="font-extrabold text-amber-400">a</span>
                    <span className="font-extrabold text-emerald-400">y</span>
                    <span>(Google Pay)</span>
                  </button>

                  {/* Paytm */}
                  <button
                    type="button"
                    onClick={() => handleDirectPay('paytm')}
                    className="flex items-center justify-center gap-2 bg-[#002970] hover:bg-[#001d52] active:scale-95 text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm shadow transition-all cursor-pointer"
                  >
                    <span className="font-black text-[#00baf2] text-xs">paytm</span>
                    <span>Paytm</span>
                  </button>

                  {/* Other UPI Apps */}
                  <button
                    type="button"
                    onClick={() => handleDirectPay('upi')}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm shadow transition-all cursor-pointer"
                  >
                    <Smartphone size={15} />
                    <span>{language === 'hi' ? 'अन्य UPI ऐप्स' : 'Other UPI'}</span>
                  </button>
                </div>
              </div>

              {/* Helpful Security Notice explaining the exact decline reason */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <AlertTriangle size={15} />
                  <span>{language === 'hi' ? 'पेमेंट डिक्लाइन (Decline) का समाधान:' : 'Payment Decline Solution:'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                  {language === 'hi'
                    ? 'यदि Google Pay में "Declined for security reasons" आ रहा है, तो ऐसा दो वजहों से होता है: (1) अगर आप उसी मोबाइल या बैंक खाते से खुद को ट्रांसफर कर रहे हैं जिस पर UPI ID बनी है, या (2) ब्राउज़र से डायरेक्ट लिंक को बैंक सुरक्षा रोक देती है। समाधान: ऊपर दिया गया "UPI ID कॉपी करें" बटन दबाएं और Google Pay / PhonePe ऐप में जाकर सीधे "Pay UPI ID" में पेस्ट करके भेजें।'
                    : 'If Google Pay declines with "Security reasons", it happens either when paying to your own account, or bank blocking browser links. Solution: Click "Copy ID" above, open Google Pay/PhonePe and paste directly in "Pay to UPI ID".'}
                </p>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('amount')}
                  className="px-5 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  {language === 'hi' ? 'वापस' : 'Back'}
                </button>
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-sm sm:text-base py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'hi' ? 'भुगतान कर दिया? रसीद बनाएं (UTR दर्ज करें)' : 'Paid? Generate Receipt (Enter UTR)'}</span>
                </button>
              </div>
            </div>
          )}
          {/* STEP 3: Processing */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12 animate-[fadeIn_0.3s_ease-out] print:hidden">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'hi' ? 'रसीद तैयार की जा रही है...' : 'Generating Receipt...'}
              </h3>
              <p className="text-slate-500 text-center">
                {language === 'hi' ? 'कृपया इस पेज को बंद न करें।' : 'Please do not close this page.'}
              </p>
            </div>
          )}

          {/* STEP 4: Success / Receipt */}
          {step === 'success' && receiptData && (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              
              <div className="flex flex-wrap gap-3 mb-6 print:hidden">
                <button onClick={handleDownloadPDF} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors">
                  <Download size={16} /> {language === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF'}
                </button>
                <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors border border-slate-300">
                  <Printer size={16} /> {language === 'hi' ? 'रसीद प्रिंट करें' : 'Print Receipt'}
                </button>
              </div>

              {/* Bill Book Style Receipt */}
              <div ref={receiptRef} className="bg-white text-black p-0 print:p-0">
                <div className="relative bg-white border border-slate-200 overflow-hidden shadow-sm" style={{ minHeight: '500px' }}>
                  {/* Decorative Header Banner */}
                  <div className="h-4 bg-red-700 w-full"></div>
                  
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <span className="text-8xl font-black rotate-[-45deg] tracking-widest uppercase text-slate-900">LIVE UP 18</span>
                  </div>
                  
                  <div className="p-8 relative z-10">
                    <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-6">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black tracking-tighter text-slate-900 italic">LIVE UP</span>
                          <span className="text-4xl font-black text-red-600 italic -ml-0.5">18</span>
                        </div>
                        <div className="bg-slate-900 px-2 py-0.5 rounded-sm w-max mt-1">
                          <span className="text-[10px] font-black tracking-[0.4em] text-white leading-none block ml-1">NEWS</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide uppercase">Independent Journalism Support</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block border border-slate-200 px-3 py-1 rounded text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">
                          Digital Receipt
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-1">Receipt</h3>
                        <p className="text-sm font-bold text-slate-500">No: <span className="text-red-700">{receiptData.receiptNumber}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Received From</span>
                        <strong className="text-lg text-slate-900">{receiptData.donorName}</strong>
                        <span className="block text-sm text-slate-600 font-medium mt-1">{receiptData.mobile}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</span>
                        <strong className="text-sm text-slate-900">{format(receiptData.date, 'dd MMM yyyy, hh:mm a')}</strong>
                      </div>
                      
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Reference (UTR)</span>
                        <span className="block font-medium font-mono text-sm text-slate-800">{receiptData.paymentRef || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                        <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded border border-green-200">
                          Successful
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 flex justify-between items-center mb-10">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purpose of Donation</span>
                        <strong className="text-base text-slate-800">Support for Independent Journalism</strong>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</span>
                        <strong className="text-4xl font-black text-red-700">₹{receiptData.amount}</strong>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-100 pt-8 mt-4">
                      <div className="text-xs text-slate-500 max-w-[60%] leading-relaxed">
                        <p className="mb-1 font-bold text-slate-700">Note:</p>
                        * This is a computer-generated receipt.<br/>
                        * No physical signature is required.<br/>
                        * Amount received in words: <span className="italic capitalize">{numberToWords(receiptData.amount)}</span> Rupees Only.
                      </div>
                      
                      <div className="text-center">
                        <div className="w-32 h-16 mx-auto mb-2 relative flex items-center justify-center">
                          <div className="absolute inset-0 border-[3px] border-red-700/20 rounded-full rotate-[-10deg] flex items-center justify-center">
                            <span className="text-red-700/30 font-black tracking-widest text-[10px] uppercase rotate-[-5deg]">Verified</span>
                          </div>
                          <span className="font-['Brush_Script_MT',cursive] text-2xl text-slate-800 opacity-90">Live UP 18</span>
                        </div>
                        <div className="border-t-2 border-slate-800 pt-1 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          Authorized Signatory
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div className="mt-6 text-center print:hidden">
                <button onClick={resetAndClose} className="text-red-700 font-bold hover:underline">
                  {language === 'hi' ? 'बंद करें' : 'Close Window'}
                </button>
              </div>
            </div>
          )}
          {/* STEP 5: Error */}
          {step === 'error' && (
            <div className="text-center py-12 animate-[fadeIn_0.3s_ease-out] print:hidden">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'hi' ? 'पेमेंट विफल रहा' : 'Payment Failed'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                {errorMsg}
              </p>
              <button
                onClick={() => setStep('amount')}
                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                {language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
