
import React, { useState } from 'react'
import style from "./ForgotPassword.module.css"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { adminForgetPasswordAction } from '../../../Redux/Admin/Actions/AdminPasswordAction'
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader'
import { HomeIcon } from '../../../icons'
import toast from 'react-hot-toast'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [emailError, setEmailError] = useState("")
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const mailHandler = () => {

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

    dispatch(adminForgetPasswordAction(email))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      mailHandler();
    }
  };

  const adminForgetPassword = useSelector(state => state.adminForgetPassword)

  const {
    loading: adminForgetPasswordLoading,
  } = adminForgetPassword

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  return (
    <div className={`${style.section} ${darkmodeOn && style.dark}`}>
      {/* <img src="https://dashboard.shadcnuikit.com/images/cover.png" alt="forgot_image" /> */}
      <div></div>

      <div className={`${style.forgot_container_right} ${darkmodeOn && style.dark}`}>
        <div>
          <h2>Forgot Password</h2>

          <div>
            <input
              type="email"
              placeholder='Enter Your Email ID'
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

          {
            adminForgetPasswordLoading ? <button style={{
              display: "grid",
              placeItems: "center"
            }} className={style.forgot_btn}><ButtonLoader /></button> : <button onClick={mailHandler} className={style.forgot_btn}>Send Email</button>
          }

          <Link to="/adminsignin" style={{ color: "var(--text-primary)", fontWeight: "bolder", textDecoration: "none" }}>Back</Link>
        </div>
        <div className={style.homeicon} onClick={() => navigate("/")}><HomeIcon /></div>
      </div>
    </div>
  )
}

export default ForgotPassword