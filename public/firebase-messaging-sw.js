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

// // ✅ 1. This runs when tab is open but not focused
// messaging.onBackgroundMessage((payload) => {
//     // console.log('[firebase-messaging-sw.js] Received background message ', payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: '/iqbook.png' // Use a path relative to the root
//     };

//     // Show the notification using the service worker's registration
//     return self.registration.showNotification(notificationTitle, notificationOptions);
// });


// // ✅ 2. This runs when tab is fully closed (Push API)
// self.addEventListener('push', (event) => {
//     console.log('[firebase-messaging-sw.js] Push Received.');

//     if (event.data) {
//         const payload = event.data.json();
//         // console.log('Push payload:', payload);

//         const title = payload.notification?.title || payload.data?.title || 'Notification';
//         const options = {
//             body: payload.notification?.body || payload.data?.body,
//             icon: '/iqbook.png'
//         };

//         event.waitUntil(self.registration.showNotification(title, options));
//     }
// });

// ✅ 3. Handle click on the notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://app.iqbook.io') // change to your app URL
    );
});