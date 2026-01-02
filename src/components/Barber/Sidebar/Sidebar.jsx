import React, { useState } from "react";
import style from "./Sidebar.module.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../DashboardHeader/DashboardHeader.jsx";
import { Admincustomericon } from "../../../icons.js";
import {
  AppointmentIcon,
  DashboardIcon,
  QueueHistoryIcon,
  QueueIcon,
  ReportIcon,
} from "../../../newicons.js";
import { useSelector } from "react-redux";
import { useBarberGlobal } from "../../../context/Barber/GlobalContext.jsx";
import { version } from "../../../../package.json";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);
  const { editServiceModal, setEditServiceModal } = useBarberGlobal();

  const sideMenuData = [
    {
      heading: "Dashboards",
      menuItems: [
        {
          id: 1,
          name: "Dashboard",
          icon: <DashboardIcon />,
          url: "/barber-dashboard",
          exact: true,
        },
      ],
    },
    {
      heading: "Apps",
      menuItems: [
        {
          id: 2,
          name: "Queue List",
          icon: <QueueIcon />,
          url: "/barber-queue",
        },
        {
          id: 3,
          name: "Queue History",
          icon: <QueueHistoryIcon />,
          url: "/barber-quehistory",
        },
        {
          id: 4,
          name: "Barber Off Days",
          icon: <AppointmentIcon />,
          url: "/barber-appointment",
        },
        {
          id: 5,
          name: "Appointment List",
          icon: <Admincustomericon />,
          url: "/barber-appointlist",
        },
        {
          id: 6,
          name: "Appointment History",
          icon: <QueueHistoryIcon />,
          url: "/barber-apphistory",
        },
        {
          id: 7,
          name: "Reports",
          icon: <ReportIcon />,
          url: "/barber-reports",
        },
      ],
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const barberProfile = useSelector(
    (state) => state.BarberLoggedInMiddleware?.entiredata?.user[0]
  );

  return (
    <main className={`${style.main_container}`}>
      <aside
        style={{
          width: sidebar ? "24rem" : "5rem",
        }}
      >
        <header>
          <Link to="/barber-dashboard">
            <div>
              <img src={barberProfile?.salonlogo?.[0]?.url} alt="" />
            </div>
          </Link>
          {sidebar ? <p>{barberProfile?.salonName}</p> : null}
        </header>

        <nav>
          <ul>
            {sideMenuData.map((section, pIndex) => (
              <li key={section.heading}>
                {sidebar ? <p>{section.heading}</p> : null}
                <ul>
                  {section.menuItems.map((item, cIndex) => (
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
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div
            style={{
              paddingInline: "1rem",
              marginBlock: "2rem",
            }}
          >
            <button
              style={{
                width: "100%",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "0.5rem",
                transition: "0.3s ease-in",
                color: "var(--btn-text-color)",
                height: "3rem",
                fontSize: "1.4rem",
                border: "none",
                outline: "none",
              }}
              onClick={() => {
                navigate("/barber-dashboard/editprofile");
                setEditServiceModal(true);
              }}
            >
              Edit Services
            </button>
          </div>
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
