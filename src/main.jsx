// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import 'normalize.css';
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import { Provider } from 'react-redux'
// import store from './Redux/store.js'
// import '../src/i18n.js'

// // The env should always in the root of my project else it will show undefined
// const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// const registerServiceWorker = async () => {
//   if ('serviceWorker' in navigator) {
//     try {
//       const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//       console.log('Service Worker registered:', reg.scope);
//       reg.update(); // check for updates
//     } catch (err) {
//       console.error('Service Worker registration failed:', err);
//     }
//   }
// };

// registerServiceWorker();

// ReactDOM.createRoot(document.getElementById('root')).render(

//   // <React.StrictMode>
//   <GoogleOAuthProvider clientId={CLIENTID}>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </GoogleOAuthProvider>
//   // </React.StrictMode>,
// )


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'normalize.css';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
import '../src/i18n.js'

const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Register main app Service Worker (handles caching + updates)
const registerMainServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log("Main SW Registered:", reg.scope);

      // force-check new version
      reg.update();
    } catch (err) {
      console.error("Main SW failed:", err);
    }
  }
};

// Register Firebase Messaging SW separately
const registerFirebaseSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('FCM Service Worker registered:', reg.scope);
    } catch (err) {
      console.error('FCM registration failed:', err);
    }
  }
};

registerMainServiceWorker();
registerFirebaseSW();

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={CLIENTID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
)
