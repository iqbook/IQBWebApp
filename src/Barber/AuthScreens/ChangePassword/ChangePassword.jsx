import React, { useState } from 'react'
import style from "./ChangePassword.module.css"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { barberResetPasswordAction } from '../../../Redux/Barber/Actions/BarberPasswordAction'
import toast from 'react-hot-toast'
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader'
import { Eyevisible, Notvisibleeye } from '../../../icons'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'

const ChangePassword = () => {

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [notMatchError, setNotMatchError] = useState("")

  const ChangePasswordHandler = () => {

    if (!password) {
      toast.error("Please enter password", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setPasswordError("Please enter password")
    }

    if (password.length < 8) {
      toast.error("Password length must be 8 charecters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setPasswordError("Password length must be 8 charecters")
    }

    if (!confirmPassword) {
      toast.error("Please enter confirm password", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setConfirmPasswordError("Please enter confirm password")
    }

    if (confirmPassword.length < 8) {
      toast.error("Confirm password length must be 8 charecters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setConfirmPasswordError("Confirm password length must be 8 charecters")
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setNotMatchError("Password and confirm password do not match");
    }


    dispatch(barberResetPasswordAction(password, params?.token, navigate))
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      ChangePasswordHandler();
    }
  };


  const barberResetPassword = useSelector(state => state.barberResetPassword)

  const {
    loading: barberResetPasswordLoading,
  } = barberResetPassword


  const [visibleeye, setVisibleeye] = useState(false)
  const [visibleeye2, setVisibleeye2] = useState(false)

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  return (
    <div className={`${style.section} ${darkmodeOn && style.dark}`}>
      {/* <img src="https://dashboard.shadcnuikit.com/images/cover.png" alt="admin_Signin" /> */}
      <div></div>

      <div className={`${style.change_password_container_right} ${darkmodeOn && style.dark}`}>
        <div>
          <h2>Change Password</h2>
          <p>Use at least 8 characters with a mix of letters, numbers, and symbols.</p>
          <p>Keep it unique and avoid reusing passwords.</p>

          <div className={`${style.password_container} ${darkmodeOn && style.dark}`} style={{ border: passwordError ? "0.1rem solid red" : undefined }}>
            <input
              type={visibleeye ? "text" : "password"}
              placeholder='Password'
              value={password}
              onChange={(e) => {
                setNotMatchError("")
                setPasswordError("")
                setPassword(e.target.value)
              }}
              onKeyDown={handleKeyPress}
            />
            <div onClick={() => setVisibleeye((prev) => !prev)}>{visibleeye ? <Eyevisible /> : <Notvisibleeye />}</div>
            <p className={style.error_message}>{passwordError}</p>
          </div>

          <div className={`${style.password_container} ${darkmodeOn && style.dark}`} style={{ border: (confirmPasswordError || notMatchError) ? "0.1rem solid red" : undefined }}>
            <input
              type={visibleeye2 ? "text" : "password"}
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => {
                setNotMatchError("")
                setConfirmPasswordError("")
                setConfirmPassword(e.target.value)
              }}
              onKeyDown={handleKeyPress}
            />
            <div onClick={() => setVisibleeye2((prev) => !prev)}>{visibleeye2 ? <Eyevisible /> : <Notvisibleeye />}</div>
            <p className={style.error_message}>{confirmPasswordError || notMatchError}</p>
          </div>

          {
            barberResetPasswordLoading ?
              <button style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className={style.change_btn}><ButtonLoader /></button> :
              <button onClick={ChangePasswordHandler} className={style.change_btn}>Change Password</button>
          }

          <Link to="/barbersignin" style={{ color: "var(--text-primary)", textDecoration: "none" }}>Back</Link>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword