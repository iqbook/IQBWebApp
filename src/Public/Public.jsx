import React from 'react'
import style from './Public.module.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../Redux/Admin/Reducers/AdminHeaderReducer'

const Public = () => {

  const Theme = localStorage.getItem('Theme') || 'Dark'

  return (
    <section className={`${style.section}`}>
      {/* <img src='https://dashboard.shadcnuikit.com/images/cover.png' alt='images' /> */}
      <div></div>
      <div>
        <div>
          <img
            src="./iqbook.png"
            alt=""
            height={100}
            width={100}
            style={{
              filter: Theme === "Light" ? 'none' : 'invert(1)',
            }}
          />
          <h2>welcome to iqbook</h2>

          <div>
            <Link to="/adminsignin">Admin Signin</Link>
            <Link to="/barbersignin">Barber Signin</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Public