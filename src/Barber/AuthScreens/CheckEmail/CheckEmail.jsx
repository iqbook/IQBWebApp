import React from 'react'
import "./CheckEmail.css"
import { Link, useNavigate } from 'react-router-dom'

const CheckEmail = () => {

  const navigate = useNavigate()

  return (
    <div className='check_email_container'>
        <div><img src="./signup_un.png" alt="forgot_image" /></div>

        <div>
            <div>
                <p>Check Email</p>
                <p>We have sent a password reset link to abcd@gmail.com</p>                
                
                <button onClick={() => {}}>Resend</button>

                <Link to="/barbersignin">Back</Link>
            </div>
        </div>
    </div>
  )
}

export default CheckEmail