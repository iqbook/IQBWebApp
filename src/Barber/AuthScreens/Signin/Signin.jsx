import React, { useEffect, useState } from 'react'
import style from './Signin.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eyevisible, HomeIcon, Notvisibleeye } from '../../../icons'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import { useDispatch, useSelector } from 'react-redux'
import { BarberGoogleloginAction, BarberSigninAction } from "../../../Redux/Barber/Actions/AuthAction"
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader'
import toast from 'react-hot-toast'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
import axios from 'axios'

const Signin = () => {

  const location = useLocation("")
  const queryParams = new URLSearchParams(location.search);
  const urlemail = queryParams.get('email');


  useEffect(() => {
    if (urlemail) {
      setEmail(urlemail)
    }
  }, [])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()


  const [visibleeye, setVisibleeye] = useState(false)

  const forgotClicked = () => {
    navigate("/barberforgotpassword")
  }

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const signinClicked = () => {

    if (!email) {
      toast.error("Please enter email", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setEmailError("Please enter email")
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setEmailError("Invalid email format");
    }

    if (!password) {
      toast.error("Please enter password", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setPasswordError("Please enter password");
    }

    if (password.length < 8) {
      toast.error("Password length must be 8 charecters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return setPasswordError("Password length must be 8 charecters");
    }

    const barbersignindata = { email, password }
    dispatch(BarberSigninAction(barbersignindata, navigate))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      signinClicked();
    }
  };

  const BarberSignin = useSelector(state => state.BarberSignin)

  const {
    loading: BarberSigninLoading,
  } = BarberSignin

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"


  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token } = tokenResponse;

        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });


        dispatch(BarberGoogleloginAction(userInfo.data.email, navigate))

      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
  });

  return (
    <main className={`${style.section} ${darkmodeOn && style.dark}`}>
      {/* <img src="https://dashboard.shadcnuikit.com/images/cover.png" alt="admin_Signin" /> */}
      <div></div>

      <div className={`${style.barber_signin_right} ${darkmodeOn && style.dark}`}>
        <div>
          <h2>Welcome, Barber</h2>
          <p>Please signin to your account</p>

          <div>
            <input
              type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => {
                setEmailError("")
                setEmail(e.target.value)
              }}
              onKeyDown={handleKeyPress}
              style={{ border: emailError ? "0.1rem solid red" : undefined }}
            />
            <p className={style.error_message}>{emailError}</p>
          </div>

          <div>
            <div
              className={`${style.password_container} ${darkmodeOn && style.dark}`}
              style={{ border: passwordError ? "0.1rem solid red" : undefined }}
            >
              <input
                type={visibleeye ? "text" : "password"}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => {
                  setPasswordError("")
                  setPassword(e.target.value)
                }}
                onKeyDown={handleKeyPress}
              />
              <div onClick={() => setVisibleeye((prev) => !prev)}>{visibleeye ? <Eyevisible /> : <Notvisibleeye />}</div>
            </div>
            <p className={style.error_message}>{passwordError}</p>
          </div>

          <div>
            <p onClick={forgotClicked}>Forgot Password ?</p>
          </div>

          {
            BarberSigninLoading ? <button style={{
              display: "grid",
              placeItems: "center"
            }} className={style.signin_btn}><ButtonLoader /></button> : <button onClick={signinClicked} className={style.signin_btn}>Signin</button>
          }

          <p>Don't you have an account ? <Link to="/barbersignup" style={{ color: "var(--text-primary)", fontWeight: "bolder", textDecoration: "none" }}>Sign up</Link></p>

          <div>
            <div />
            <p>or</p>
            <div />
          </div>


          <button onClick={() => login()} className={`${style.google_btn} ${darkmodeOn && style.dark}`}>
            <div>
              <div><img src="/google_logo.png" alt="logo" /></div>
              <p>Sign in with Google</p>
            </div>
          </button>


        </div>
        <div className={style.homeicon} onClick={() => navigate("/")}><HomeIcon /></div>
      </div>
    </main>
  )
}

export default Signin