import React from 'react'
import style from "./PasswordReset.module.css"
import { useNavigate } from 'react-router-dom'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
import { useSelector } from 'react-redux'

const PasswordReset = () => {
 
  const navigate = useNavigate()

  const passwordresetHandler = () => {
    navigate("/barbersignin")
  }

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  return (
    <div className={`${style.section} ${darkmodeOn && style.dark}`}>
      {/* <img src="https://dashboard.shadcnuikit.com/images/cover.png" alt="forgot_image" /> */}
      <div></div>
        <div>
            <h2>Password Reset</h2>
            <p>Your Password has been successfully reset.</p>
            <button onClick={passwordresetHandler}>Signin</button>
        </div>
    </div>
  )
}

export default PasswordReset