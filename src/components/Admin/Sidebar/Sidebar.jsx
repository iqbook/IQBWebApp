// import React, { useEffect, useState } from 'react';
// import style from './Sidebar.module.css';
// // import  MenuData  from '../MenuData.jsx';
// import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { Adminqueueicon, LeftArrow, MoonIcon, RightArrow, Sunicon } from '../../../icons';
// import Header from '../Header/Header.jsx';
// import Skeleton from 'react-loading-skeleton';
// import { useDispatch, useSelector } from 'react-redux';
// import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer.js';
// import { IoMoon } from 'react-icons/io5';
// import { MdSunny } from 'react-icons/md';
// import { DARK_MODE_OFF, DARK_MODE_ON } from '../../../Redux/Admin/Constants/constants.js';
// import MenuData from '../Menudata.jsx';

// const Sidebar = () => {
//   const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon);

//   const {
//     response: adminGetDefaultSalonResponse = {} // Add default value
//   } = adminGetDefaultSalon;

//   const [showSidebar, setShowSidebar] = useState(true);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch()

//   const [loading, setLoading] = useState(false);

//   const darkMode = useSelector(darkmodeSelector);

//   const darkHandler = () => {
//     dispatch({ type: DARK_MODE_ON });
//     localStorage.setItem("dark", "On");
//   }

//   const lightHandler = () => {
//     dispatch({ type: DARK_MODE_OFF });
//     localStorage.setItem("dark", "Off");
//   }

//   const toggleHandler = () => {
//     if (darkMode == "Off") {
//       darkHandler()
//     } else {
//       lightHandler()
//     }
//   }

//   const darkmodeOn = darkMode === "On";

//   return (
//     <main className={`${style.container} ${darkmodeOn && style.dark}`}>
//       <div className={`${style.sidebar} ${showSidebar ? style.show : style.hide} ${darkmodeOn && style.dark}`}>
//         <div>
//           <div className={showSidebar ? style.titleActive : style.titleInActive}>
//             {showSidebar ? <div className={`${style.sidebar_top_salon} ${darkmodeOn && style.dark}`}>
//               <div onClick={() => navigate("/admin-dashboard")} style={{ cursor: "pointer" }}>
//                 <img
//                   src={adminGetDefaultSalonResponse?.salonLogo?.[0]?.url || "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"}
//                   alt="salonLogo"
//                 />
//               </div>
//               <p>{adminGetDefaultSalonResponse?.salonName}</p>
//             </div> : ""}
//           </div>
//         </div>

//         <div className={style.menu_items_container}>
//           {MenuData().map((m) => (
//             m.show ? (<div className={`${style.menu_item} ${location.pathname.includes(m.url) && `${style.menu_item_active} ${darkmodeOn && style.dark}`} ${darkmodeOn && style.dark}`} key={m.id} onClick={() => navigate(m?.url)}
//             >
//               <div style={{
//                 color: location.pathname.includes(m.url) && "var(--light-color-4)"
//               }}
//               >{m.icon}</div>
//               <p style={{
//                 color: location.pathname.includes(m.url) && "var(--light-color-4)"
//               }}>{m.title}</p>
//             </div>) : null
//           ))}

//           <div className={`${style.menu_theme_container} ${darkmodeOn && style.dark}`}
//             style={{
//               justifyContent: showSidebar ? "space-between" : "center"
//             }}
//           >
//             {
//               showSidebar && <p>Theme</p>
//             }

//             {
//               darkmodeOn ?
//                 <button onClick={toggleHandler}>
//                   <Sunicon />
//                 </button> :
//                 <button onClick={toggleHandler}>
//                   <MoonIcon />
//                 </button>
//             }

//           </div>
//         </div>

//         <button className={style.sidebar_toggle_btn} onClick={() => setShowSidebar((prev) => !prev)}>{showSidebar ? <LeftArrow /> : <RightArrow />}</button>
//       </div>

//       <div className={`${style.content} ${darkmodeOn && style.dark}`}
//         style={{
//           width: showSidebar ? "calc(100vw - 20vw)" : "calc(100vw - 4vw)",
//         }}
//       >
//         <Header />
//         <div><Outlet /></div>
//       </div>
//     </main>
//   );
// }

// export default Sidebar;

import React, { useEffect, useState } from "react";
import style from "./Sidebar.module.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header.jsx";
import {
  AdvertisementIcon,
  AppointmentIcon,
  BarberIcon,
  CustomerIcon,
  DashboardIcon,
  MdPaymentIcon,
  QueueHistoryIcon,
  QueueIcon,
  ReportIcon,
  SalonIcon,
  SettingsIcon,
} from "../../../newicons.js";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { version } from "../../../../package.json";

const Sidebar = () => {
  const adminProfile = useSelector(
    (state) => state.AdminLoggedInMiddleware.entiredata.user[0]
  );
  const [sidebar, setSidebar] = useState(true);

  const sideMenuData = [
    {
      heading: "Dashboards",
      menuItems: [
        {
          id: 1,
          name: "Dashboard",
          icon: <DashboardIcon />,
          url: "/admin-dashboard",
          show: true,
        },
        {
          id: 2,
          name: "Salons",
          icon: <SalonIcon />,
          url: "/admin-salon",
          show: true,
        },
        {
          id: 3,
          name: "Barbers",
          icon: <BarberIcon />,
          url: "/admin-barber",
          show: true,
        },
        {
          id: 4,
          name: "Customers",
          icon: <CustomerIcon />,
          url: "/admin-customer",
          show: true,
        },
        {
          id: 5,
          name: "Advertisements",
          icon: <AdvertisementIcon />,
          url: "/admin-advertise",
          show: true,
        },
      ],
    },
    {
      heading: "Apps",
      menuItems: [
        {
          id: 1,
          name: "Queue List",
          icon: <QueueIcon />,
          url: "/admin-queue",
          show: adminProfile?.isQueueing,
        },
        {
          id: 2,
          name: "Queue History",
          icon: <QueueHistoryIcon />,
          url: "/admin-quehistory",
          show: adminProfile?.isQueueing,
        },
        {
          id: 3,
          name: "Appointments",
          icon: <AppointmentIcon />,
          url: "/admin-appointments",
          show: adminProfile?.isAppointments,
        },

        {
          id: 4,
          name: "Appointments History",
          icon: <QueueHistoryIcon />,
          url: "/admin-appointmenthistory",
          show: adminProfile?.isAppointments,
        },

        {
          id: 5,
          name: "Reports",
          icon: <ReportIcon />,
          url: "/admin-reports",
          show: true,
        },
      ],
    },
    {
      heading: "Other Options",
      menuItems: [
        {
          id: 1,
          name: "Subscriptions",
          icon: <QueueIcon />,
          url: "/admin-subscription",
          show: true,
        },
        {
          id: 2,
          name: "Payment history",
          icon: <MdPaymentIcon />,
          url: "/admin-paymentstatus",
          show: true,
        },
        {
          id: 3,
          name: "Payment settings",
          icon: <SettingsIcon />,
          url: "/admin-paymentsettings",
          show: true,
        },
      ],
    },
  ];

  const location = useLocation();

  const adminGetDefaultSalon = useSelector(
    (state) => state.adminGetDefaultSalon
  );

  const {
    loading: adminGetDefaultSalonLoading,
    resolve: adminGetDefaultSalonResolve,
    response: adminGetDefaultSalonResponse,
  } = adminGetDefaultSalon;

  useEffect(() => {
    if (adminGetDefaultSalonResponse) {
      localStorage.setItem(
        "CurrentSalonType",
        adminGetDefaultSalonResponse.salonType
      );
    }
  }, [adminGetDefaultSalonResponse]);

  return (
    <main className={`${style.main_container}`}>
      <aside
        style={{
          width: sidebar ? "24rem" : "5rem",
        }}
      >
        <header>
          {adminGetDefaultSalonLoading ? (
            <div>
              <Skeleton
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                }}
              />
            </div>
          ) : (
            <Link to={"/admin-dashboard"}>
              <div>
                <img
                  src={adminGetDefaultSalonResponse?.salonLogo?.[0]?.url}
                  alt=""
                />
              </div>
            </Link>
          )}

          {sidebar ? <p>{adminGetDefaultSalonResponse?.salonName}</p> : null}
        </header>

        <nav>
          <ul>
            {sideMenuData.map((section, pIndex) => (
              <li key={section.heading}>
                {sidebar ? <p>{section.heading}</p> : null}
                <ul>
                  {section.menuItems.map((item, cIndex) =>
                    item.show ? (
                      <li
                        key={item.id}
                        className={`${
                          location.pathname.includes(item?.url)
                            ? style.activeMenu
                            : ""
                        }`}
                      >
                        <Link to={item?.url}>
                          <span
                            style={{
                              marginInline: sidebar ? "0rem" : "auto",
                            }}
                          >
                            {item.icon}
                          </span>
                          {sidebar ? item.name : null}
                        </Link>
                      </li>
                    ) : null
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        {sidebar ? (
          <p
            style={{
              padding: "2rem",
              color: "var(--text-secondary)",
              fontSize: "1.4rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {version}
          </p>
        ) : null}
      </aside>

      <section>
        <Header sidebar={sidebar} setSidebar={setSidebar} />
        <Outlet />
      </section>
    </main>
  );
};

export default Sidebar;
