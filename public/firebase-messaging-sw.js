importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCVoTaOhIJ2mLJJNl5j6J1Jj-0oSHMh1qQ",
  authDomain: "gen-lang-client-0319583234.firebaseapp.com",
  projectId: "gen-lang-client-0319583234",
  storageBucket: "gen-lang-client-0319583234.firebasestorage.app",
  messagingSenderId: "226541571030",
  appId: "1:226541571030:web:b4d1ce820734a65adf3277"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload?.notification?.title || 'Breaking News';
  const notificationOptions = {
    body: payload?.notification?.body || 'New article available',
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
