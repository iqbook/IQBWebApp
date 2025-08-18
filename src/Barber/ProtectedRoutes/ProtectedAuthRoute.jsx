import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedAuthRoute = () => {

    const AdminLoggedin = localStorage.getItem("userAdminLoggedIn")
    const BarberLoggedin = localStorage.getItem("userBarberLoggedIn")

    const navigate = useNavigate()
    
    useEffect(() => {
        if(AdminLoggedin && !BarberLoggedin){
            navigate("/admin-dashboard")
        }else if(!AdminLoggedin && BarberLoggedin){
            navigate("/barber-dashboard")
        }else{
          
        }
    },[AdminLoggedin,BarberLoggedin,navigate])

  return (
    <div><Outlet/></div>
  )
}

export default ProtectedAuthRoute