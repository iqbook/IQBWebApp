import React from 'react'
import "./AuthLoader.css"
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'

const AuthLoader = () => {

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = !(darkMode === "On")
  
  return (
    <div className={`authloader ${darkmodeOn && "dark"}`}>
      <div className="justify-content-center jimu-primary-loading"></div>
    </div>
  )
}

export default AuthLoader