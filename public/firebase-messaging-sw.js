// firebase-messaging-sw.js

// Give the service worker access to the Firebase libraries
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app with your config
const firebaseConfig = {
    apiKey: "AIzaSyBYCyrNZll9oeGKfILz_S5avzOQJ0xlCkw",
    authDomain: "iqbook-web.firebaseapp.com",
    projectId: "iqbook-web",
    storageBucket: "iqbook-web.firebasestorage.app",
    messagingSenderId: "889322044641",
    appId: "1:889322044641:web:d902ace026f28a67064ba0",
    measurementId: "G-2NZVFQJTYS"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// ✅ 1. This runs when tab is open but not focused or app is closed

// messaging.onBackgroundMessage((payload) => {
//     const data = payload?.data || {};
//     const hasCustomData = data.title || data.body;

//     if (hasCustomData) {
//         console.log("From backend node js", data);

//         const notificationTitle = data.title;
//         const notificationOptions = {
//             body: data.body,
//             icon: '/iqbook.png',
//         };

//         return self.registration.showNotification(notificationTitle, notificationOptions);
//     } else {
//         console.log('[firebase-messaging-sw.js] Received background message from Firebase Console', payload);
//     }
// });

// This code  uses all the methods
// 1. App is closed
// 2. Tab is fully closed
// 3. Foreground
// 4. Background
// 5. Unfocused
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const payload = event.data.json();
    const data = payload?.data || {};

    const title = data.title || 'Notification';
    const body = data.body || 'You have a new message';
    const icon = data.icon || '/iqbook.png';

    event.waitUntil(
        self.registration.showNotification(title, { body, icon })
    );
});

// ✅ 3. Handle click on the notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://app.iqbook.io') // change to your app URL
    );
});