import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'normalize.css';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
import '../src/i18n.js'

// The env should always in the root of my project else it will show undefined
const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw-v2.js');
      console.log('Service Worker registered:', reg.scope);
      reg.update(); // check for updates
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }
};

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(

  // <React.StrictMode>
  <GoogleOAuthProvider clientId={CLIENTID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
  // </React.StrictMode>,
)
