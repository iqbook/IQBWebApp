// import React, { useEffect, useState } from 'react'
// import style from './Signin.module.css'
// import { Link, useNavigate } from 'react-router-dom'
// import { Eyevisible, Notvisibleeye, HomeIcon } from '../../../icons'
// import { GoogleLogin } from '@react-oauth/google'
// import { Toaster, toast } from 'react-hot-toast';
// import { AdminGoogleloginAction, AdminSigninAction } from '../../../Redux/Admin/Actions/AuthAction'
// import { useDispatch, useSelector } from 'react-redux'
// import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader'
// import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'


// import { useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios'
// import api from '../../../Redux/api/Api'

// const Signin = () => {

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const dispatch = useDispatch()
//   const navigate = useNavigate()


//   const [visibleeye, setVisibleeye] = useState(false)

//   const [emailError, setEmailError] = useState("")
//   const [passwordError, setPasswordError] = useState("")

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const signinClicked = () => {

//     if (!email) {
//       toast.error("Please enter email", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//       return setEmailError("Please enter email")
//     }

//     if (!emailRegex.test(email)) {
//       toast.error("Invalid email format", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: "0.3rem",
//           background: "#333",
//           color: "#fff",
//         },
//       });
//       return setEmailError("Invalid email format");
//     }

//     if (!password) {
//       toast.error("Please enter password", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: "0.3rem",
//           background: "#333",
//           color: "#fff",
//         },
//       });
//       return setPasswordError("Please enter password");
//     }

//     if (password.length < 8) {
//       toast.error("Password length must be 8 charecters", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: "0.3rem",
//           background: "#333",
//           color: "#fff",
//         },
//       });
//       return setPasswordError("Password length must be 8 charecters");
//     }

//     const adminsignindata = { email, password }
//     dispatch(AdminSigninAction(adminsignindata, navigate))
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       signinClicked();
//     }
//   };

//   const forgotClicked = () => {
//     navigate("/adminforgotpassword")
//   }

//   const AdminSignin = useSelector(state => state.AdminSignin)

//   const {
//     loading: AdminSigninLoading,
//   } = AdminSignin

//   const darkMode = useSelector(darkmodeSelector)

//   const darkmodeOn = darkMode === "On"

//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         const { access_token } = tokenResponse;

//         const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         });

//         // console.log('User Info:', userInfo.data);

//         dispatch(AdminGoogleloginAction(userInfo.data.email, navigate))

//       } catch (error) {
//         console.error('Error fetching user info:', error);
//       }
//     },
//   });

//   return (
//     <main className={`${style.section} ${darkmodeOn && style.dark}`}>
//       {/* <img src="https://dashboard.shadcnuikit.com/images/cover.png" alt="admin_Signin" /> */}
//       <div></div>

//       <div className={`${style.admin_signin_right} ${darkmodeOn && style.dark}`}>
//         <div>
//           <h2>Welcome, Admin</h2>
//           <p>Please signin to your account</p>

//           <div>
//             <input
//               type="email"
//               placeholder='Enter your email'
//               value={email}
//               onChange={(e) => {
//                 setEmailError("")
//                 setEmail(e.target.value)
//               }}
//               onKeyDown={handleKeyPress}
//               style={{ border: emailError ? "0.1rem solid red" : undefined }}
//             />
//             <p className={style.error_message}>{emailError}</p>
//           </div>

//           <div>
//             <div
//               className={`${style.password_container} ${darkmodeOn && style.dark}`}
//               style={{ border: passwordError ? "0.1rem solid red" : undefined }}>
//               <input
//                 type={visibleeye ? "text" : "password"}
//                 placeholder='Enter your password'
//                 value={password}
//                 onChange={(e) => {
//                   setPasswordError("")
//                   setPassword(e.target.value)
//                 }}
//                 onKeyDown={handleKeyPress}
//               />
//               <div onClick={() => setVisibleeye((prev) => !prev)}>{visibleeye ? <Eyevisible /> : <Notvisibleeye />}</div>
//             </div>
//             <p className={style.error_message}>{passwordError}</p>
//           </div>

//           <div>
//             <p onClick={forgotClicked}>Forgot Password ?</p>
//           </div>

//           {
//             AdminSigninLoading ? <button style={{
//               display: "grid",
//               placeItems: "center"
//             }}
//               className={style.signin_btn}
//             ><ButtonLoader /></button> : <button onClick={signinClicked} className={style.signin_btn}>Signin</button>
//           }

//           <p>Don't you have an account ? <Link to="/adminsignup" style={{ color: "var(--text-primary)", fontWeight: "bolder", textDecoration: "none" }}>Sign up</Link></p>

//           <div>
//             <div />
//             <p>or</p>
//             <div />
//           </div>

//           <button onClick={() => login()} className={`${style.google_btn} ${darkmodeOn && style.dark}`}>
//             <div>
//               <div><img src="/google_logo.png" alt="logo" /></div>
//               <p>Sign in with Google </p>
//             </div>
//           </button>



//         </div>
//         <button className={style.homeicon} onClick={() => navigate("/")}><HomeIcon /></button>
//       </div>
//     </main>
//   )
// }

// export default Signin


import React, { useEffect } from 'react'; // 1. Import useEffect
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// 2. Define the Firebase Config outside the component for clarity
//    ⚠️ REPLACE THESE PLACEHOLDERS with your actual Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyBYCyrNZll9oeGKfILz_S5avzOQJ0xlCkw",
  authDomain: "iqbook-web.firebaseapp.com",
  projectId: "iqbook-web",
  storageBucket: "iqbook-web.firebasestorage.app",
  messagingSenderId: "889322044641",
  appId: "1:889322044641:web:d902ace026f28a67064ba0",
  measurementId: "G-2NZVFQJTYS"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// --- FCM Utility Functions ---

/**
 * Requests permission for notifications and retrieves the FCM registration token.
 * ⚠️ REPLACE "YOUR_VAPID_KEY" with your actual VAPID key from Firebase project settings.
 */
export const requestForToken = async () => {
  try {
    // Check if the browser supports notifications
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted.');

        const fcmToken = await getToken(messaging, {
          vapidKey: "BMb-Y9gWXHSvgsOqipUxEpzriS32OyvkeP3I4N8aVkF0A8XPuI-o7LKA8SvM9Bx1GQGpOIH6C8C5PzBJXxPp1zc" // <-- REQUIRED: Your VAPID Key from Firebase
        });

        if (fcmToken) {
          console.log('FCM Registration Token:', fcmToken);
          // 💡 Action: Send this token to your backend for sending notifications.
          // Example: await yourApiCall.sendTokenToBackend(fcmToken);
          return fcmToken;
        } else {
          console.warn('No registration token available. Check if your Firebase setup or VAPID key is correct.');
        }
      } else {
        console.warn('Notification permission denied by the user.');
      }
    } else {
      console.error('Notifications are not supported by this browser.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
  }
};

/**
 * Listens for new messages while the app is in the foreground.
 * @returns {Promise<object>} A promise that resolves with the message payload.
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      // You can implement custom UI logic here (e.g., show a toast/in-app notification)
      console.log('Message received while foregrounded:', payload);
      resolve(payload);
    });
  });

// --- React Component ---

const Signin = () => {

  // 3. Use useEffect to run the FCM logic when the component mounts
  useEffect(() => {
    // 3a. Request the token when the component loads
    requestForToken();

    // 3b. Set up the foreground message listener
    const unsubscribe = onMessageListener().then(payload => {
      // Handle the incoming message payload
      // e.g., display a notification, update state
      console.log("Foreground message processed:", payload);
    }).catch(err => console.error('Foreground message listener error:', err));

    // In a full implementation, you'd typically manage the listener cleanup, 
    // but onMessage often registers a persistent listener tied to the app.
    // However, using the Promise structure as in the original code makes
    // clean-up more complex. For simplicity, we stick to the provided pattern.

  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div>
      <h2>Sign-in Component</h2>
      <p>Firebase Messaging is initialized and attempting to get a token...</p>
      {/* Add a button here to manually request permission/token if needed */}
    </div>
  );
}

export default Signin;