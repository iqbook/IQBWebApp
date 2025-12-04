import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "normalize.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import "../src/i18n.js";
import CacheBuster from "react-cache-buster";
import VersionCheck from "./components/VersionCheck/VersionCheck.jsx";

// The env should always in the root of my project else it will show undefined
const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker registered:", reg.scope);
      reg.update(); // check for updates
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  }
};

registerServiceWorker();

const current_mode = "production";
const isProduction = current_mode === "production";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <CacheBuster
    currentVersion={version}
    isEnabled={isProduction} //If false, the library is disabled.
    isVerboseMode={false} //If true, the library writes verbose logs to console.
    loadingComponent={<h1>Version checking from app.....</h1>} //If not pass, nothing appears at the time of new version check.
    metaFileDirectory={"."} //If public assets are hosted somewhere other than root on your server.
  >
    <GoogleOAuthProvider clientId={CLIENTID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </CacheBuster>
  // </React.StrictMode>,
);
