// import React from 'react'
// import style from './MobileSidebar.module.css'
// import { Outlet, useLocation } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer.js'
// import DashboardHeader from '../DashboardHeader/DashboardHeader.jsx'

// const MobileSidebar = () => {

//   const location = useLocation()

//   const darkMode = useSelector(darkmodeSelector)

//   const darkmodeOn = darkMode === "On"

//   return (
//     <main className={style.container}>
//       <div className={`${style.mobile_content} ${darkmodeOn && style.dark}`}
//         style={{
//           width: "100%"
//         }}
//       >
//         <div>
//           {/* {location?.pathname === "/admin-dashboard" ? <DashboardHeader /> : <Header />} */}
//           {/* <div>BarberHeader or header</div> */}
//           <DashboardHeader />
//           <div><Outlet /></div>
//         </div>
//       </div>
//     </main>
//   )
// }

// export default MobileSidebar


import React, { useState } from 'react'
import style from './MobileSidebar.module.css'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../DashboardHeader/DashboardHeader.jsx'
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer.js'
import { ClickAwayListener, Modal } from '@mui/material'
import { AppointmentIcon, DashboardIcon, QueueHistoryIcon, QueueIcon } from '../../../newicons.js';
import { Admincustomericon } from '../../../icons.js'
import Switch from "react-switch";

const MobileSidebar = () => {

  const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata?.user[0])

  const location = useLocation()

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  const [mobileSidebar, setMobileSidebar] = useState(false)

  const sideMenuData = [
    {
      heading: "Dashboards",
      menuItems: [
        {
          id: 1,
          name: "Dashboard",
          icon: <DashboardIcon />,
          url: "/barber-dashboard",
          subdomain: "admin",
          exacturl: true
        },
      ]
    },
    {
      heading: "Apps",
      menuItems: [
        {
          id: 2,
          name: "Queue List",
          icon: <QueueIcon />,
          url: "/barber-queue"
        },
        {
          id: 3,
          name: "Queue History",
          icon: <QueueHistoryIcon />,
          url: "/barber-quehistory"
        },
        {
          id: 4,
          name: "Barber Off Days",
          icon: <AppointmentIcon />,
          url: "/barber-appointment"
        },
        {
          id: 5,
          name: "Appointment List",
          icon: <Admincustomericon />,
          url: "/barber-appointlist"
        },
        {
          id: 6,
          name: "Appointment History",
          icon: <QueueHistoryIcon />,
          url: "/barber-apphistory"
        },
      ]
    },
  ]

  const navigate = useNavigate()

  const [online, setOnline] = useState(false)

  return (
    <section className={`${style.mobile_container}`}>
      <Header mobileSidebar={mobileSidebar} setMobileSidebar={setMobileSidebar} />
      <Outlet />

      <aside
        style={{
          transform: mobileSidebar ? "translateX(0)" : "translateX(-100vw)",
          transition: mobileSidebar ? "transform 0.3s ease" : "transform 0s",
        }}
      >
        {mobileSidebar ? (
          <ClickAwayListener onClickAway={() => setMobileSidebar(false)}>
            <div className={`${style.aside_container}`}>
              <header>
                <Link
                  to={"/barber-dashboard"}
                  onClick={() => {
                    setMobileSidebar(false);
                  }}
                >
                  <div>
                    <img
                      src={barberProfile?.salonlogo?.[0]?.url}
                      alt=""
                    />
                  </div>
                </Link>
                {mobileSidebar ? <p>{barberProfile?.salonName}</p> : null}
              </header>

              <nav>
                <ul>
                  {sideMenuData.map((section) => (
                    <li key={section.heading}>
                      {mobileSidebar ? <p>{section.heading}</p> : null}
                      <ul>
                        {section.menuItems.map((item) => (
                          <li
                            key={item.id}
                            className={`${location.pathname.includes(item?.url)
                              ? style.activeMenu
                              : ""
                              }`}
                          >
                            <Link
                              to={item?.url}
                              onClick={() => {
                                setMobileSidebar(false);
                              }}
                            >
                              <span
                                style={{
                                  marginInline: mobileSidebar ? "0rem" : "auto",
                                }}
                              >
                                {item.icon}
                              </span>
                              {mobileSidebar ? item.name : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>

                <div className={`${style.online_container}`}>
                  <p>{barberProfile?.isOnline ? "Online" : "Offline"}</p>
                  <Switch
                    width={40}
                    height={18}
                    handleDiameter={14}
                    offColor="#F44336"
                    onColor="#00A36C"
                    readOnly
                    checked={barberProfile?.isOnline}
                    onChange={() => { }}
                  />
                </div>

                <div className={`${style.online_container}`}>
                  <p>{barberProfile?.isClockedIn ? "Clock In" : "Clock Out"}</p>
                  <Switch
                    width={40}
                    height={18}
                    handleDiameter={14}
                    offColor="#F44336"
                    onColor="#00A36C"
                    readOnly
                    checked={barberProfile?.isClockedIn}
                    onChange={() => { }}
                  />
                </div>
              </nav>
            </div>
          </ClickAwayListener>
        ) : null}

      </aside>

    </section>
  )
}

export default MobileSidebar