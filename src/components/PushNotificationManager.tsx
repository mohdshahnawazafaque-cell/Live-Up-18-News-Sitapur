import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { messaging } from '../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { useLanguage } from '../context/LanguageContext';

export default function PushNotificationManager({ className }: { className?: string }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      if (!('Notification' in window)) {
        setIsSupported(false);
        return;
      }

      const msg = await messaging();
      if (!msg) {
        setIsSupported(false);
        return;
      }

      if (Notification.permission === 'granted') {
        // We already have permission, setup listener
        setupMessageListener(msg);
        setIsSubscribed(true);
      }
    } catch (e) {
      console.error('Error checking notification support:', e);
    }
  };

  const setupMessageListener = (msg: any) => {
    onMessage(msg, (payload) => {
      console.log('Message received in foreground: ', payload);
      // Optional: show a toast or custom UI alert here
      if (payload.notification) {
         // Fallback to browser notification if tab is open but not focused
         new Notification(payload.notification.title || 'Live UP 18 News', {
            body: payload.notification.body,
            icon: '/icon-192x192.png'
         });
      }
    });
  };

  const requestPermission = async () => {
    try {
      const msg = await messaging();
      if (!msg) {
         alert(language === 'hi' ? 'आपका ब्राउज़र नोटिफिकेशन सपोर्ट नहीं करता है।' : 'Notifications are not supported on your browser.');
         return;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // You would normally need a VAPID key here generated from Firebase Console
        // getToken(msg, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' })
        const token = await getToken(msg);
        console.log('FCM Token:', token);
        // Normally send this token to your backend or save in Firestore
        setIsSubscribed(true);
        setupMessageListener(msg);
        alert(language === 'hi' ? 'ब्रेकिंग न्यूज़ अलर्ट्स चालू हो गए हैं!' : 'Breaking News Alerts enabled!');
      } else {
        alert(language === 'hi' ? 'आपने नोटिफिकेशन को ब्लॉक कर दिया है।' : 'You denied the notification permission.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      alert(language === 'hi' ? 'अलर्ट्स चालू करने में समस्या आई। VAPID Key सेट करें।' : 'Failed to enable alerts. VAPID Key required for web push.');
    }
  };

  if (!isSupported) return null;

  return (
    <button 
      onClick={isSubscribed ? () => alert(language === 'hi' ? 'आप पहले से ही अलर्ट्स के लिए सब्सक्राइब हैं!' : 'Already subscribed to alerts!') : requestPermission} 
      className={className || `flex items-center gap-1 font-bold py-1 px-3 rounded-full text-xs md:text-sm transition-colors shadow-lg border mx-2 ${isSubscribed ? 'bg-green-600 hover:bg-green-700 text-white border-green-500' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 animate-pulse'}`}
    >
      {isSubscribed ? <BellOff size={14} /> : <Bell size={14} />} 
      {isSubscribed 
        ? (language === 'hi' ? 'अलर्ट्स ON' : 'Alerts ON') 
        : (language === 'hi' ? 'अलर्ट्स चालू करें' : 'Get Alerts')}
    </button>
  );
}
