importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAafXkJwyZ5F7Xuax0VktZ9cpqWD4oCvxU",
  authDomain: "tournament-97743.firebaseapp.com",
  projectId: "tournament-97743",
  storageBucket: "tournament-97743.firebasestorage.app",
  messagingSenderId: "584797187828",
  appId: "1:584797187828:web:4c643f83dfd9b700adb8a1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ব্যাকগ্রাউন্ড মেসেজ হ্যান্ডলার
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message ', payload);

  // ✅ স্মার্ট পপআপ লজিক: নোটিফিকেশন রিসিভ করার প্রমাণ (Receipt) রাখা
  if (payload.data && payload.data.msgId) {
      const msgId = payload.data.msgId;
      
      // ১. অ্যাপ খোলা থাকলে সাথে সাথে জানানো
      const bc = new BroadcastChannel('smart_popup_receipts');
      bc.postMessage({ type: 'RECEIPT', msgId: msgId });

      // ২. অ্যাপ বন্ধ থাকলে ক্যাশে সেভ করা (যাতে অ্যাপ খোলার পর পপআপ দেখা যায়)
      caches.open('popup-receipts').then(cache => {
          cache.put('/receipt_' + msgId, new Response('received'));
      });
  }

  // নোটিফিকেশন কন্টেন্ট তৈরি
  const title = payload.notification?.title || payload.data?.title || "G-ZONE ESPORTS";
  const body = payload.notification?.body || payload.data?.body || "New Update!";

  const notificationOptions = {
    body: body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png', 
    badge: '/mono.png', 
    tag: 'gzone-update', 
    vibrate: [100, 50, 100],
    data: {
      url: payload.data?.url || '/app.html' 
    }
  };

  return self.registration.showNotification(title, notificationOptions);
});