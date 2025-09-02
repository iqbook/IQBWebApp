// import React from 'react'
// import style from './MobileSidebar.module.css'
// import { Outlet, useLocation } from 'react-router-dom'
// import Header from '../Header/Header.jsx'
// import { useSelector } from 'react-redux'
// import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer.js'

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
//           <Header />
//           <div><Outlet /></div>
//         </div>
//       </div>
//     </main>
//   )
// }

// export default MobileSidebar


import React, { useEffect, useRef, useState } from 'react'
import style from './MobileSidebar.module.css'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../Header/Header.jsx'
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer.js'
import { ClickAwayListener, Modal } from '@mui/material'
import { AdvertisementIcon, AppointmentIcon, BarberIcon, ChangeSalonIcon, CustomerIcon, DashboardIcon, MdPaymentIcon, QueueHistoryIcon, QueueIcon, ReportIcon, SalonIcon } from '../../../newicons.js';
import Switch from "react-switch";
import { useDispatch } from 'react-redux'
import { AdminLogoutAction } from '../../../Redux/Admin/Actions/AuthAction.js'
import { getAdminSalonListAction } from '../../../Redux/Admin/Actions/SalonAction.js'
import { adminApplySalonAction, adminGetDefaultSalonAction } from '../../../Redux/Admin/Actions/AdminHeaderAction.js'
import { DARK_MODE_OFF, DARK_MODE_ON } from '../../../Redux/Admin/Constants/constants.js'
import { adminSalonStatusAction } from '../../../Redux/Admin/Actions/DashboardAction.js'
import { MobileCrossIcon } from '../../../icons.js'

const MobileSidebar = () => {

  const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])
  const adminEmail = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)
  const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

  const [salonlistdrop, setSalonlistdrop] = useState(false)

  const [loading, setLoading] = useState(false)

  const salonlistRef = useRef()

  useEffect(() => {
    let salondropHandler = (e) => {
      if (salonlistRef.current && !salonlistRef.current.contains(e.target)) {
        console.log(salonlistRef.current.contains(e.target))
        setSalonlistdrop(false)
      }
    }

    document.addEventListener('mousedown', salondropHandler)

    return () => {
      document.removeEventListener('mousedown', salondropHandler)
    }
  }, [])


  const [mobiledrop, setMobileDrop] = useState(false)
  const [sidebarToggle, setSidebarToggle] = useState(false)

  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const MobileIconDropRef = useRef()

  useEffect(() => {
    const handleClickMobileIconOutside = (event) => {
      if (
        MobileIconDropRef.current &&
        !MobileIconDropRef.current.contains(event.target)
      ) {
        setSidebarToggle(false)
      }
    };

    document.addEventListener('mousedown', handleClickMobileIconOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickMobileIconOutside);
    };
  }, []);

  const [adminEditDrop, setAdminEditDrop] = useState(false)

  const adminEditIconRef = useRef()
  const adminEditDropRef = useRef()

  useEffect(() => {
    const handleClickProfileOutside = (event) => {
      if (
        adminEditIconRef.current &&
        adminEditDropRef.current &&
        !adminEditIconRef.current.contains(event.target) &&
        !adminEditDropRef.current.contains(event.target)
      ) {
        setAdminEditDrop(false);
      }
    };

    document.addEventListener('mousedown', handleClickProfileOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickProfileOutside);
    };
  }, []);

  const logoutHandler = async () => {
    dispatch(AdminLogoutAction(navigate))
  }


  const SalonListControllerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    SalonListControllerRef.current = controller;

    dispatch(getAdminSalonListAction(adminEmail, controller.signal));

    return () => {
      if (SalonListControllerRef.current) {
        SalonListControllerRef.current.abort();
      }
    };
  }, [adminEmail, dispatch]);

  const getAdminSalonList = useSelector(state => state.getAdminSalonList)

  const {
    loading: getAdminSalonListLoading,
    resolve: getAdminSalonListResolve,
    salons: SalonList
  } = getAdminSalonList


  const selectedActiveSalon = (salon) => {
    dispatch({
      type: "ADMIN_SET_SALON",
      payload: {
        currentActiveSalon: salon.salonName,
        chooseSalonId: salon.salonId

      }
    })
    setSalonlistdrop(false)
  }

  const adminSetSalon = useSelector(state => state.adminSetSalon)


  const applySelectedSalonHandler = () => {

    const applySalonData = {
      salonId: adminSetSalon?.chooseSalonId,
      adminEmail
    }

    dispatch(adminApplySalonAction(applySalonData))
  }

  const getDefaultSalonControllerRef = useRef(new AbortController())

  useEffect(() => {
    if (adminProfile) {
      const controller = new AbortController();
      getDefaultSalonControllerRef.current = controller;

      dispatch(adminGetDefaultSalonAction(adminEmail, controller.signal, adminSetSalon));

      return () => {
        if (getDefaultSalonControllerRef.current) {
          getDefaultSalonControllerRef.current.abort();
        }
      };
    }

  }, [adminProfile, dispatch]);

  // const [src, setSrc] = useState("");

  // useEffect(() => {
  //     if (adminProfile && adminProfile?.profile[0]?.url) {
  //         setSrc(adminProfile?.profile[0]?.url)
  //     } else {
  //         setSrc("https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg")
  //     }
  // }, [adminProfile])

  const adminApplySalon = useSelector(state => state.adminApplySalon)

  const {
    loading: adminApplySalonLoading,
  } = adminApplySalon


  const darkMode = useSelector(darkmodeSelector)

  const darkHandler = () => {
    dispatch({ type: DARK_MODE_ON });
    localStorage.setItem("dark", "On");
  }

  const lightHandler = () => {
    dispatch({ type: DARK_MODE_OFF });
    localStorage.setItem("dark", "Off");
  }

  const toggleHandler = () => {
    if (darkMode == "Off") {
      darkHandler()
    } else {
      lightHandler()
    }
  }

  const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

  const {
    loading: adminGetDefaultSalonLoading,
    resolve: adminGetDefaultSalonResolve,
    response: adminGetDefaultSalonResponse
  } = adminGetDefaultSalon

  useEffect(() => {
    if (adminGetDefaultSalonResponse) {
      setTogglecheck(adminGetDefaultSalonResponse?.isOnline)
    }

  }, [adminGetDefaultSalonResponse])


  const [togglecheck, setTogglecheck] = useState(false);

  const salonStatusHandler = () => {
    const newCheckValue = !togglecheck;
    setTogglecheck(newCheckValue);

    const salonStatusOnlineData = {
      salonId,
      isOnline: newCheckValue,
    };

    dispatch(adminSalonStatusAction(salonStatusOnlineData, setTogglecheck, newCheckValue));
  }


  const darkmodeOn = darkMode === "On"

  // =========================================

  const [mobileSidebar, setMobileSidebar] = useState(false)

  const sideMenuData = [
    {
      heading: "Dashboards",
      menuItems: [
        {
          id: 1,
          name: "Dashboard",
          icon: <DashboardIcon />,
          url: "/admin-dashboard",
          show: true
        },
        {
          id: 2,
          name: "Salons",
          icon: <SalonIcon />,
          url: "/admin-salon",
          show: true
        },
        {
          id: 3,
          name: "Barbers",
          icon: <BarberIcon />,
          url: "/admin-barber",
          show: true
        },
        {
          id: 4,
          name: "Customers",
          icon: <CustomerIcon />,
          url: "/admin-customer",
          show: true
        }, ,
        {
          id: 5,
          name: "Advertisements",
          icon: <AdvertisementIcon />,
          url: "/admin-advertise",
          show: true
        },
      ]
    },
    {
      heading: "Apps",
      menuItems: [
        {
          id: 1,
          name: "Queue List",
          icon: <QueueIcon />,
          url: "/admin-queue",
          show: adminProfile?.isQueueing
        },
        {
          id: 2,
          name: "Queue History",
          icon: <QueueHistoryIcon />,
          url: "/admin-quehistory",
          show: adminProfile?.isQueueing
        },
        {
          id: 3,
          name: "Appointments",
          icon: <AppointmentIcon />,
          url: "/admin-appointments",
          show: adminProfile?.isAppointments
        },
        {
          id: 4,
          name: "Appointments History",
          icon: <QueueHistoryIcon />,
          url: "/admin-appointmenthistory",
          show: adminProfile?.isAppointments
        },
        {
          id: 5,
          name: "Reports",
          icon: <ReportIcon />,
          url: "/admin-reports",
          show: true
        },
      ]
    },
    {
      heading: "Other Options",
      menuItems: [
        {
          id: 1,
          name: "Subscriptions",
          icon: <QueueIcon />,
          url: "/admin-subscription",
          show: true
        },
        {
          id: 2,
          name: "Payment history",
          icon: <MdPaymentIcon />,
          url: "/admin-paymentstatus",
          show: true
        },
      ]
    },
    {
      heading: "Settings",
      menuItems: [
        {
          id: 1,
          name: "Change Salon", // Click korle select modal open hbe
          icon: <ChangeSalonIcon />,
          show: true
        },
      ]
    },
  ]

  // useEffect(() => {
  //   if (mobileSidebar) {
  //     document.body.style.overflow = 'hidden'; // Disable scroll
  //   } else {
  //     document.body.style.overflow = ''; // Re-enable scroll
  //   }

  //   return () => {
  //     document.body.style.overflow = ''; // Clean up on unmount
  //   };
  // }, [mobileSidebar]);


  // const [online, setOnline] = useState(false)

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
                  to={"/admin-dashboard"}
                  onClick={() => {
                    setMobileSidebar(false);
                  }}
                >
                  <div>
                    <img src={adminGetDefaultSalonResponse?.salonLogo?.[0]?.url} alt="" />
                  </div>
                </Link>
                {mobileSidebar ? <p>{adminGetDefaultSalonResponse?.salonName}</p> : null}

              </header>

              <nav>
                <ul>
                  {sideMenuData.map((section) => (
                    <li key={section.heading}>
                      {mobileSidebar ? <p>{section.heading}</p> : null}
                      <ul>
                        {section.menuItems.map((item) => (
                          item.show ? (
                            <li
                              key={item.id}
                              className={`${location.pathname.includes(item?.url)
                                ? style.activeMenu
                                : ""
                                }`}
                              onClick={section.heading === "Settings" ? () => setMobileDrop((prev) => !prev) : undefined}
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
                          ) : null
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>

                {
                  adminProfile?.salonId == 0 ? (null) : (<div className={`${style.online_container}`}>
                    <p>{togglecheck ? "Online" : "Offline"}</p>
                    <Switch
                      width={45}
                      height={18}
                      handleDiameter={14}
                      offColor="#F44336"
                      onColor="#00A36C"
                      uncheckedIcon={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontSize: "1rem",
                            color: "#F4F4F5",
                            paddingRight: "1px",
                          }}
                        >
                          OFF
                        </div>
                      }
                      checkedIcon={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontSize: "1rem",
                            color: "#F4F4F5",
                          }}
                        >
                          ON
                        </div>
                      }
                      onChange={salonStatusHandler}
                      checked={togglecheck}
                    />
                  </div>)
                }

                <p className={style.version_text}> v 1.0.5</p>
              </nav>
            </div>
          </ClickAwayListener>
        ) : null}
      </aside>


      <Modal
        open={mobiledrop}
        onClose={() => setMobileDrop(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <section className={style.chooseSalon_modal}>
          <div className={`${style.chooseSalon_model_content} ${darkmodeOn && style.dark}`}>
            <button onClick={() => setMobileDrop(false)}><MobileCrossIcon /></button>
            <p>Choose Salon</p>
            <input type="text" placeholder='Select Salon' value={adminSetSalon?.currentActiveSalon} readOnly />
            <div
              className={`${style.mobile_dashboard_salon_list_dropdown} ${darkmodeOn && style.dark}`}
              style={{
                opacity: 1,
                zIndex: 2,
                transition: "300ms ease",
                height: SalonList?.length > 0 && SalonList?.length <= 4 ? "auto" : "20rem"
              }}
            >
              {
                getAdminSalonListLoading && !getAdminSalonListResolve ?
                  <p>No Salon Present</p> :
                  !getAdminSalonListLoading && getAdminSalonListResolve && SalonList?.length > 0 ?
                    SalonList.map((s) => (
                      <p
                        key={s._id}
                        onClick={() => selectedActiveSalon(s)}
                        className={`${s.salonId === adminProfile?.salonId && style.salonName_active} ${darkmodeOn && style.dark}`}
                      >{s.salonName}</p>
                    )) :
                    !getAdminSalonListLoading && getAdminSalonListResolve && SalonList?.length == 0 ?
                      <p>No Salon Present</p> :
                      !getAdminSalonListLoading && !getAdminSalonListResolve &&
                      <p>No Salon Present</p>
              }
            </div>
            {
              adminProfile?.salonId !== 0 && (!getAdminSalonListLoading && getAdminSalonListResolve && <button onClick={applySelectedSalonHandler} disabled={adminProfile?.salonId == adminSetSalon?.chooseSalonId || adminApplySalonLoading ? true : false}>Apply</button>)
            }

          </div>
        </section>
      </Modal>


    </section>
  )
}

export default MobileSidebar