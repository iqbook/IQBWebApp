import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from "react-error-boundary";
import "./App.css"

const Public = React.lazy(() => import("./Public/Public"))
const AdminSignin = React.lazy(() => import("./Admin/AuthScreens/Signin/Signin"))
const AdminSignup = React.lazy(() => import("./Admin/AuthScreens/Signup/Signup"))
const BarberSignin = React.lazy(() => import("./Barber/AuthScreens/Signin/Signin"))
const BarberSignup = React.lazy(() => import("./Barber/AuthScreens/Signup/Signup"))
const AdminDashboard = React.lazy(() => import("./Admin/Dashboard/Dashboard"))
const AdminSalonList = React.lazy(() => import("./Admin/Salon/SalonList/SalonList"))
const AdminSidebar = React.lazy(() => import("./components/Admin/Sidebar/Sidebar"))
const AdminBarberList = React.lazy(() => import("./Admin/Barber/BarberList/BarberList"))
const AdminSalonAdv = React.lazy(() => import("./Admin/SalonAdv/SalonAdv"))
const AdminQueue = React.lazy(() => import("./Admin/Queue/Queue"))
const AdminForgotPassword = React.lazy(() => import("./Admin/AuthScreens/ForgotPassword/ForgotPassword"))
const AdminCheckEmail = React.lazy(() => import("./Admin/AuthScreens/CheckEmail/CheckEmail"))
const AdminChangePassword = React.lazy(() => import("./Admin/AuthScreens/ChangePassword/ChangePassword"))
const AdminPasswordReset = React.lazy(() => import("./Admin/AuthScreens/PasswordReset/PasswordReset"))
const BarberForgotPassword = React.lazy(() => import("./Barber/AuthScreens/ForgotPassword/ForgotPassword"))
const BarberCheckEmail = React.lazy(() => import("./Barber/AuthScreens/CheckEmail/CheckEmail"))
const BarberChangePassword = React.lazy(() => import("./Barber/AuthScreens/ChangePassword/ChangePassword"))
const BarberPasswordReset = React.lazy(() => import("./Barber/AuthScreens/PasswordReset/PasswordReset"))
const AdminCreateSalon = React.lazy(() => import("./Admin/Salon/CreateSalon/CreateSalon"))
const AdminCustomerList = React.lazy(() => import("./Admin/Customer/CustomerList"))
const AdminCreateBarber = React.lazy(() => import("./Admin/Barber/CreateBarber/CreateBarber"))
const AdminEditSalon = React.lazy(() => import("./Admin/Salon/EditSalon/EditSalon"))
const AdminEditBarber = React.lazy(() => import("./Admin/Barber/EditBarber/EditBarber"))
const AdminEditProfile = React.lazy(() => import("./Admin/EditProfile/EditProfile"))
const BarberDashboard = React.lazy(() => import("./Barber/Dashboard/Dashboard"))
const AdminSignupEditProfile = React.lazy(() => import("./Admin/AuthScreens/SignupEditProfile/SignupEditProfile"))
const AdminSalonAppointmentSettings = React.lazy(() => import("./Admin/Salon/SalonAppointmentSettings/SalonAppointmentSettings"))
const AdminMobileSidebar = React.lazy(() => import("./components/Admin/MobileSidebar/MobileSidebar"))
const BarberSidebar = React.lazy(() => import("./components/Barber/Sidebar/Sidebar"))
const BarberMobileSidebar = React.lazy(() => import("./components/Barber/MobileSidebar/MobileSidebar"))
const BarberEditProfile = React.lazy(() => import("./Barber/EditProfile/EditProfile"))
const BarberSignupEditProfile = React.lazy(() => import("./Barber/AuthScreens/SignupEditProfile/SignupEditProfile"))
const BarberCustomer = React.lazy(() => import("./Barber/Customers/Customers"))
const BarberQueueList = React.lazy(() => import("./Barber/Queue/Queue"))
const BarberQueHistory = React.lazy(() => import("./Barber/QueHistory/QueHistory"))
const AdminQueHistory = React.lazy(() => import("./Admin/QueHistory/QueHistory"))
const AdminAppointmentHistory = React.lazy(() => import("./Admin/Appointment/AppointmentHistory/AppointmentHistory"))
const AppointmentCalender = React.lazy(() => import("./Admin/Appointment/AppointCalender/AppointmentCalender"))
const AppointmentList = React.lazy(() => import("./Admin/Appointment/AppointmentList/AppointmentList"))
const AdminBookAppointments = React.lazy(() => import("./Admin/BookAppointment/CreateAppointment/CreateAppointment"))
const AdminBookEditAppointments = React.lazy(() => import("./Admin/BookAppointment/EditAppointment/EditAppointment"))
const AdminSubscription = React.lazy(() => import("./Admin/Subscription/Subscription"))
const BarberAppointmentHistory = React.lazy(() => import("./Barber/AppointmentHistory/AppointmentHistory"))

const BarberAppointment = React.lazy(() => import("./Barber/Appointment/Appointment"))
const PaymentStatus = React.lazy(() => import("./Admin/Payment/PaymentStatus/PaymentStatus"))
const BarberAppointmentList = React.lazy(() => import("./Barber/AppointmentList/AppointmentList"))
const AdminReports = React.lazy(() => import("./Admin/Report/Report"))

import ProtectedAdminRoute from "./Admin/ProtectedRoutes/ProtectedRoute"
import ProtectedAdminAuthRoute from "./Admin/ProtectedRoutes/ProtectedAuthRoute"
import ProtectedBarberRoute from "./Barber/ProtectedRoutes/ProtectedRoute"
import ProtectedBarberAuthRoute from "./Barber/ProtectedRoutes/ProtectedAuthRoute"
import Loader from './components/Loader/Loader';
import { useSelector } from 'react-redux';
import { darkmodeSelector } from './Redux/Admin/Reducers/AdminHeaderReducer';
import ErrorPage from './ErrorPage/ErrorPage';
import { ExclamationIcon, WifiIcon } from './icons';
import Dummy from './Admin/Dummy';
import { SocketProvider } from './context/SocketContext';
// import Appointment from './Admin/Appointment/Appointment';

const MobileCus = React.lazy(() => import("../src/mobileCus/MobileCust"))
const MobileCusSuccess = React.lazy(() => import("../src/mobileCus/MobileCusSuccess"))

const App = () => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 1140px)").matches);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"



  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const ErrorFallbackRoute = ({ error }) => {
    return (
      <main className={`error_boundary_route_container ${darkmodeOn && "dark"}`}>
        <div>
          <div><ExclamationIcon /></div>
          <p>Oops ! Something went wrong</p>
        </div>
      </main>
    );
  };


  const ErrorFallback = ({ error }) => {
    return (
      <main className={`error_boundary_container ${darkmodeOn && "dark"}`}>
        <div>
          <div><ExclamationIcon /></div>
          <p>Oops ! Something went wrong</p>
        </div>
      </main>
    );
  };


  useEffect(() => {
    // This sets globally 
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      p, h1, h2, h3, h4, h5, i, input, textarea, input::placeholder, textarea::placeholder, select, label {
        color: ${darkmodeOn ? "var(--dark-color-4)" : "var(--text-primary)"};
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [darkmodeOn]);


  const currentTheme = useSelector(state => state.ThemeSelector)

  useEffect(() => {
    const body = document.querySelector("body")

    if (currentTheme === "Dark") {
      body.setAttribute("data-theme", "dark")
    } else {
      body.setAttribute("data-theme", "light")
    }
  }, [currentTheme])


  // useEffect(() => {
  //   document.documentElement.style.setProperty(
  //     "--bg-secondary",
  //     modecolors.color1
  //   );
  // }, [modecolors]);

  return (
    <>
      {!isOnline ? (
        <div className="offline_container">
          <div >
            <div><WifiIcon /></div>
            <p>You are <span>offline</span></p>
            <p>Please check your internet connection</p>
          </div>
        </div >
      ) : (
        <>
          <Toaster />
          <BrowserRouter>
            <React.Suspense fallback={<div
              style={{
                width: "100vw",
                height: "100svh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // background: darkmodeOn ? "var(--dark-color-2)" : "var(--light-color-4)"
                background: "var(--bg-primary)"
              }}>
              <Loader />
            </div>}>
              <Routes>

                {/* Admin Auth Screens */}
                <Route element={<ErrorBoundary FallbackComponent={ErrorFallbackRoute}><ProtectedAdminAuthRoute /></ErrorBoundary>}>
                  <Route path="/" element={<Public />} />
                  <Route path="/adminsignin" element={<AdminSignin />} />
                  <Route path="/adminsignup" element={<AdminSignup />} />
                  <Route path="/adminforgotpassword" element={<AdminForgotPassword />} />
                  <Route path="/admincheckemail" element={<AdminCheckEmail />} />
                  <Route path="/adminchangepassword/:token" element={<AdminChangePassword />} />
                  <Route path="/adminpasswordreset" element={<AdminPasswordReset />} />
                  <Route path="/admin-signupeditprofile" element={<AdminSignupEditProfile />} />
                </Route>

                {/* Admin Main Pages  */}

                <Route element={<ProtectedAdminRoute />}>
                  <Route element={isMobile ? <SocketProvider><AdminMobileSidebar /></SocketProvider> : <SocketProvider><AdminSidebar /></SocketProvider>}>
                    <Route
                      path="/admin-dashboard"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <SocketProvider><AdminDashboard /></SocketProvider>
                        </ErrorBoundary>
                      }
                    />

                    <Route path="/dummy" element={<Dummy />} />
                    <Route
                      path="/admin-dashboard/editprofile"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminEditProfile />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/admin-salon"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminSalonList />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/admin-salon/createsalon"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminCreateSalon />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/admin-salon/editsalon/:salonid"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminEditSalon />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/admin-salon/appointment/:salonid"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminSalonAppointmentSettings />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/admin-barber"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminBarberList />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/admin-barber/createbarber"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminCreateBarber />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/admin-barber/editbarber/:salonid"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminEditBarber />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-customer"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminCustomerList />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-advertise"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminSalonAdv />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/admin-queue"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <SocketProvider><AdminQueue /></SocketProvider>
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-quehistory"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminQueHistory />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-appointments"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AppointmentCalender />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-appointmenthistory"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminAppointmentHistory />
                        </ErrorBoundary>
                      }
                    />


                    <Route
                      path="/admin-appointments-list"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AppointmentList />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-book-appointments"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminBookAppointments />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-book-editappointments"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminBookEditAppointments />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-subscription"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminSubscription />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-reports"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <AdminReports />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/admin-paymentstatus"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <PaymentStatus />
                        </ErrorBoundary>
                      }
                    />
                  </Route>
                </Route>

                {/* Barber Auth Screens */}
                <Route element={<ErrorBoundary FallbackComponent={ErrorFallbackRoute}><ProtectedBarberAuthRoute /></ErrorBoundary>}>
                  <Route path="/" element={<Public />} />
                  <Route path="/barbersignin" element={<BarberSignin />} />
                  <Route path="/barbersignup" element={<BarberSignup />} />
                  <Route path="/barberforgotpassword" element={<BarberForgotPassword />} />
                  <Route path="/barbercheckemail" element={<BarberCheckEmail />} />
                  <Route path="/barberchangepassword/:token" element={<BarberChangePassword />} />
                  <Route path="/barberpasswordreset" element={<BarberPasswordReset />} />
                  <Route path="/barber-signupeditprofile" element={<BarberSignupEditProfile />} />
                </Route>

                {/* Barber Main Pages  */}
                <Route element={<ProtectedBarberRoute />}>
                  <Route element={isMobile ? <BarberMobileSidebar /> : <BarberSidebar />}>
                    <Route
                      path="/barber-dashboard"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <SocketProvider><BarberDashboard /></SocketProvider>
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/barber-dashboard/editprofile"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <BarberEditProfile />
                        </ErrorBoundary>
                      }
                    />
                    {/* <Route
                      path="/barber-customer"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <BarberCustomer />
                        </ErrorBoundary>
                      }
                    /> */}
                    <Route
                      path="/barber-quehistory"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <BarberQueHistory />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/barber-queue"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <SocketProvider><BarberQueueList /></SocketProvider>
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/barber-appointment"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <BarberAppointment />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path='/barber-appointlist'
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <BarberAppointmentList />
                        </ErrorBoundary>
                      }
                    />

                    <Route
                      path="/barber-apphistory"
                      element={
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                          <BarberAppointmentHistory />
                        </ErrorBoundary>
                      }
                    />


                  </Route>
                </Route>

                <Route path="*" element={<ErrorPage />} />
                <Route path="/mobilecus" element={<MobileCus />} />
                <Route path='/mobilesuccess' element={<MobileCusSuccess />} />
              </Routes>
            </React.Suspense>
          </BrowserRouter>
        </>
      )}
    </>
  )
}

// /api/vendor-create-checkout-session
// body = products
// body = email

export default App


















// import React, { useEffect, useState } from 'react'
// import style from './Appointment.module.css'
// import { useSelector } from 'react-redux'
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import api from '../../Redux/api/Api'
// import toast from 'react-hot-toast'
// import Calendar from 'react-calendar'
// import moment from "moment";
// import { LeftArrow, RightArrow } from '../../icons'

// const Appointment = () => {

//     const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata?.user[0])

//     const salonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
//     const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

//     const [getSalonoffDays, setGetSalonoffDays] = useState([])

//     useEffect(() => {
//         if (salonId !== 0) {
//             const fetchSalonOffDaysHandler = async () => {
//                 try {
//                     const { data } = await api.post("/api/salonSettings/getSalonoffDays", { salonId })
//                     setGetSalonoffDays(data?.response)
//                 } catch (error) {
//                     toast.error(error?.response?.data?.message, {
//                         duration: 3000,
//                         style: {
//                             fontSize: "var(--font-size-2)",
//                             borderRadius: '0.3rem',
//                             background: '#333',
//                             color: '#fff',
//                         },
//                     });
//                 }
//             }

//             fetchSalonOffDaysHandler()
//         }
//     }, [salonId])

//     const darkMode = useSelector(darkmodeSelector)

//     const darkmodeOn = darkMode === "On"

//     const days = [
//         {
//             id: 1,
//             day: "Monday"
//         },
//         {
//             id: 2,
//             day: "Tuesday"
//         },
//         {
//             id: 3,
//             day: "Wednesday"
//         },
//         {
//             id: 4,
//             day: "Thursday"
//         },
//         {
//             id: 5,
//             day: "Friday"
//         },
//         {
//             id: 6,
//             day: "Saturday"
//         },
//         {
//             id: 7,
//             day: "Sunday"
//         }
//     ]

//     const [appointmentdates, setAppointmentDates] = useState(true)
//     const [barberOffdates, setBarberOffdates] = useState(false)

//     const [selectedDays, setSelectedDays] = useState([])

//     const checkdayHandler = (day) => {

//         setSelectedDays((prev) => {
//             if (prev.includes(day.day)) {
//                 return prev.filter((d) => d !== day.day);
//             } else {
//                 return [...prev, day.day];
//             }
//         });
//     }

//     const submitHandler = async () => {
//         try {
//             const appdata = {
//                 salonId,
//                 barberId,
//                 appointmentDays: selectedDays
//             }

//             const { data } = await api.post("/api/barberAppointmentDays/addBarberAppointmentDays", appdata)

//             toast.success(data?.message, {
//                 duration: 3000,
//                 style: {
//                     fontSize: "var(--font-size-2)",
//                     borderRadius: '0.3rem',
//                     background: '#333',
//                     color: '#fff',
//                 },
//             });
//         } catch (error) {
//             toast.error(error?.response?.data?.message, {
//                 duration: 3000,
//                 style: {
//                     fontSize: "var(--font-size-2)",
//                     borderRadius: '0.3rem',
//                     background: '#333',
//                     color: '#fff',
//                 },
//             });
//         }
//     }

//     const [getAppdates, setGetAppdates] = useState([])

//     useEffect(() => {
//         const getAppointdays = async () => {
//             const { data } = await api.post("/api/barberAppointmentDays/getBarberAppointmentDays", {
//                 salonId,
//                 barberId
//             })

//             setGetAppdates(data.response.appointmentDays)
//             setSelectedDays(data.response.appointmentDays);
//         }
//         getAppointdays()
//     }, [])

//     const [selectedDates, setSelectedDates] = useState([]);

//     const onClickDay = (date) => {

//         const formattedDate = date.toLocaleDateString("en-CA");

//         setSelectedDates((prevDates) =>
//             prevDates.includes(formattedDate)
//                 ? prevDates.filter((d) => d !== formattedDate)
//                 : [...prevDates, formattedDate]
//         );
//     };

//     const isSelected = (date) => {
//         const formattedDate = date.toLocaleDateString("en-CA");
//         return selectedDates?.includes(formattedDate);
//     };

//     const offDayHandler = async (selectedDates) => {
//         const { data } = await api.post("/api/barberDayOff/addBarberDayOffs", {
//             salonId,
//             barberId,
//             barberDayOffs: selectedDates
//         })

//         toast.success(data?.message, {
//             duration: 3000,
//             style: {
//                 fontSize: "var(--font-size-2)",
//                 borderRadius: '0.3rem',
//                 background: '#333',
//                 color: '#fff',
//             },
//         });

//         setSelectedDates([])
//         getBarberLeaveDaysFunc()
//     }

//     const [barberLeaveDaysdata, setBarberLeaveDaysdata] = useState([])

//     const getBarberLeaveDaysFunc = async () => {
//         const { data } = await api.post("/api/barberDayOff/getBarberDayOffs", {
//             salonId,
//             barberId
//         })

//         setBarberLeaveDaysdata(data.response)
//     }

//     useEffect(() => {
//         getBarberLeaveDaysFunc()
//     }, [])


//     const isDisabled = (date) => {
//         const formattedDate = date.toLocaleDateString("en-CA").split('T')[0];
//         return barberLeaveDaysdata?.includes(formattedDate);
//     };


//     // Barber Day off new calendar logic

//     const [currentMonth, setCurrentMonth] = useState(moment());
//     const [offDays, setOffDays] = useState([]); // add if not defined

//     const today = moment().startOf("day");
//     const tomorrow = today.clone().add(1, "day");

//     const startOfMonth = currentMonth.clone().startOf("month");
//     const endOfMonth = currentMonth.clone().endOf("month");
//     const daysInMonth = currentMonth.daysInMonth();

//     // Generate all days for the current month
//     const allDays = Array.from({ length: daysInMonth }, (_, i) =>
//         startOfMonth.clone().add(i, "days")
//     );

//     // Filter only future dates (tomorrow onward)
//     const visibleDays = allDays.filter((day) => day.isSameOrAfter(tomorrow, "day"));

//     // Prevent navigating to past months
//     const handlePrevMonth = () => {
//         const prevMonth = currentMonth.clone().subtract(1, "month");
//         if (prevMonth.isBefore(today, "month")) return;
//         setCurrentMonth(prevMonth);
//     };

//     // Navigate forward
//     const handleNextMonth = () => {
//         setCurrentMonth(currentMonth.clone().add(1, "month"));
//     };

//     // Toggle selection
//     const handleToggleOffDay = (date) => {
//         if (offDays.includes(date)) {
//             setOffDays(offDays.filter((d) => d !== date));
//         } else {
//             setOffDays([...offDays, date]);
//         }
//     };

//     const isPrevDisabled = currentMonth.isSameOrBefore(moment(), "month");
//     const isNextDisabled = false;

//     return (
//         <div className={`${style.section}`}>
//             <div>
//                 <h2>Appointment</h2>
//             </div>

//             <div className={style.barber_appointment_content_wrapper}>
//                 <div>
//                     <p>Choose appointment days</p>
//                     <div className={style.heading}>
//                         <p>#</p>
//                         <p>Days</p>
//                     </div>

//                     {
//                         days.map((d) => {
//                             const isDisabled = getSalonoffDays.includes(d.day);
//                             const isChecked = !isDisabled && selectedDays.includes(d.day);

//                             return (
//                                 <label
//                                     key={d.id}
//                                     className={`${style.value} ${isDisabled ? style.disabled : ''}`}
//                                     style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
//                                 >
//                                     <input
//                                         type="checkbox"
//                                         style={{ accentColor: "blue" }}
//                                         onChange={() => checkdayHandler(d)}
//                                         checked={isChecked}
//                                         disabled={isDisabled}
//                                     />
//                                     <p>{d.day}</p>
//                                 </label>
//                             );
//                         })
//                     }



//                     <button
//                         className={style.submit}
//                         onClick={submitHandler}
//                         disabled={salonId === 0}
//                         style={{
//                             cursor: salonId === 0 ? "not-allowed" : "pointer"
//                         }}
//                     >Save</button>

//                 </div>

//                 <div>
//                     <p>{`${barberProfile?.salonType === "Barber Shop" ? "Barber" : "Stylist"}`} Off Days</p>
//                     <div className={style.leave_value_body}>
//                         <div style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             marginBottom: "2rem"
//                         }}>
//                             <p>Select Off Days</p>
//                             <button
//                                 className={style.reset_days}
//                                 onClick={() => offDayHandler([])}
//                                 disabled={salonId === 0}
//                                 style={{
//                                     cursor: salonId === 0 ? "not-allowed" : "pointer"
//                                 }}
//                             >Reset Off Days</button>
//                         </div>
//                         {
//                             <div style={{ marginBottom: "2rem" }}>
//                                 <Calendar
//                                     onClickDay={onClickDay}
//                                     // tileClassName={({ date }) =>
//                                     //     isSelected(date) ? style.highlighted_date : ""
//                                     // }

//                                     minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
//                                     tileClassName={({ date }) => {
//                                         if (isSelected(date)) {
//                                             return style.highlighted_date;
//                                         } else if (isDisabled(date)) {
//                                             return style.leave_dates;
//                                         }
//                                         return null;
//                                     }}

//                                 // tileDisabled={({ date }) => isDisabled(date)}
//                                 />
//                             </div>
//                         }

//                         <button
//                             className={style.submit}
//                             onClick={() => offDayHandler(selectedDates)}
//                             disabled={salonId === 0}
//                             style={{
//                                 cursor: salonId === 0 ? "not-allowed" : "pointer"
//                             }}
//                         >Save</button>
//                     </div>
//                 </div>
//             </div>

//             <div className={`${style.barber_appointment_content_mobile_wrapper} ${darkmodeOn && style.dark}`}>
//                 <div className={style.button_group}>
//                     <button
//                         onClick={() => {
//                             setBarberOffdates(false)
//                             setAppointmentDates(true)
//                         }}>Appointment Days</button>
//                     <button
//                         onClick={() => {
//                             setBarberOffdates(true)
//                             setAppointmentDates(false)
//                         }}>Barber Off Days</button>
//                 </div>
//                 {
//                     appointmentdates && <div className={style.value_body}>
//                         <div className={style.heading}>
//                             <p>#</p>
//                             <p>Days</p>
//                         </div>
//                         {
//                             days.map((d) => {
//                                 const isDisabled = getSalonoffDays.includes(d.day);
//                                 const isChecked = !isDisabled && selectedDays.includes(d.day);

//                                 return (
//                                     <label
//                                         key={d.id}
//                                         className={`${style.value} ${isDisabled ? style.disabled : ''}`}
//                                         style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             style={{ accentColor: "blue" }}
//                                             onChange={() => checkdayHandler(d)}
//                                             checked={isChecked}
//                                             disabled={isDisabled}
//                                         />
//                                         <p>{d.day}</p>
//                                     </label>
//                                 );
//                             })
//                         }
//                     </div>
//                 }

                // {
                //     barberOffdates && <div className={style.leave_value_body}>
                //         <div style={{
                //             display: "flex",
                //             justifyContent: "space-between",
                //             alignItems: "center"
                //         }}>
                //             <div className={style.monthSelector}>
                //                 <button
                //                     onClick={handlePrevMonth}
                //                     className={style.iconBtn}
                //                     disabled={isPrevDisabled}
                //                     style={{
                //                         opacity: isPrevDisabled ? 0.4 : 1,
                //                         cursor: isPrevDisabled ? "not-allowed" : "pointer"
                //                     }}
                //                 >
                //                     <LeftArrow size={24} />
                //                 </button>
                //                 <p className={style.monthText}>
                //                     {currentMonth.format("MMMM YYYY")}
                //                 </p>
                //                 <button
                //                     onClick={handleNextMonth}
                //                     className={style.iconBtn}
                //                     disabled={isNextDisabled}
                //                     style={{
                //                         opacity: isNextDisabled ? 0.4 : 1,
                //                         cursor: isNextDisabled ? "not-allowed" : "pointer"
                //                     }}
                //                 >
                //                     <RightArrow size={24} />
                //                 </button>
                //             </div>
                //             <button
                //                 className={style.reset_days}
                //                 onClick={() => offDayHandler([])}
                //                 disabled={salonId === 0}
                //                 style={{
                //                     cursor: salonId === 0 ? "not-allowed" : "pointer"
                //                 }}
                //             >Reset Off Days</button>
                //         </div>

                //         {/* {
                //             <div style={{ marginBottom: "2rem" }} className={style.dayList}>
                //                 {allDays.map((day) => {
                //                     const formatted = day.format("ddd DD MMM YYYY");

                //                     return (
                //                         <button
                //                             key={formatted}
                //                             onClick={() => handleToggleOffDay(formatted)}
                //                             className={`${style.dayBtn}`}
                //                         >
                //                             {formatted}
                //                         </button>
                //                     );
                //                 })}
                //             </div>
                //         } */}

                //         <div className={style.dayList}>
                //             {visibleDays.map((day) => {
                //                 const formatted = day.format("YYYY-MM-DD");
                //                 const isLeaveDay = barberLeaveDaysdata.includes(formatted);
                //                 const isSelectedDay = offDays.includes(formatted);

                //                 return (
                //                     <button
                //                         key={formatted}
                //                         onClick={() => {
                //                             if (!isLeaveDay) handleToggleOffDay(formatted);
                //                         }}
                //                         disabled={isLeaveDay}
                //                         className={`
                //     ${style.dayBtn}
                //     ${isSelectedDay ? style.highlighted_date : ""}
                //     ${isLeaveDay ? style.leave_dates : ""}
                // `}
                //                         style={{
                //                             cursor: isLeaveDay ? "not-allowed" : "pointer",
                //                         }}
                //                     >
                //                         {day.format("ddd DD MMM YYYY")}
                //                     </button>
                //                 );
                //             })}
                //         </div>


                //         {/* {
                //             <div style={{ marginBottom: "2rem" }}>
                //                 <Calendar
                //                     onClickDay={onClickDay}
                //                     minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                //                     tileClassName={({ date }) => {
                //                         if (isSelected(date)) {
                //                             return style.highlighted_date;
                //                         } else if (isDisabled(date)) {
                //                             return style.leave_dates;
                //                         }
                //                         return null;
                //                     }}

                //                 // tileDisabled={({ date }) => isDisabled(date)}
                //                 />
                //             </div>
                //         } */}


                //     </div>
                // }
//                 <button
//                     className={style.submit}
//                     onClick={appointmentdates ? submitHandler : () => offDayHandler(selectedDates)}
//                     disabled={salonId === 0}
//                     style={{
//                         cursor: salonId === 0 ? "not-allowed" : "pointer"
//                     }}
//                 >Save</button>
//             </div>
//         </div>
//     )
// }

// export default Appointment









// .section {
//     background-color: transparent;
//     height: calc(100svh - 6rem);
//     padding: 1.5rem;
//     display: flex;
//     flex-direction: column;
//     gap: 1.5rem;
//     overflow: auto;

//     &>div:nth-child(1) {
//         height: 4rem;
//         display: flex;
//         align-items: center;
//         justify-content: space-between;

//         &>h2 {
//             color: var(--text-primary);
//             line-height: inherit;
//             font-family: "AirbnbCereal_Medium";
//         }
//     }
// }

// .barber_appointment_content_wrapper {
//     display: flex;
//     gap: 3rem;
//     height: 100%;

//     &>div:nth-child(1) {
//         flex: 0.4 1 min(40vw, 15rem);
//         height: 100%;

//         &>p {
//             font-size: 1.6rem;
//             margin-bottom: 2rem;
//             font-weight: 600;
//         }

//         .heading,
//         .value {
//             display: flex;
//             align-items: center;
//             gap: 2rem;
//             margin-bottom: 1.5rem;
//             background-color: var(--bg-primary);
//             padding: 1.5rem;
//             max-width: 35rem;
//             border-radius: var(--border-radius-primary);
//             -webkit-border-radius: var(--border-radius-primary);
//             -moz-border-radius: var(--border-radius-primary);
//             -ms-border-radius: var(--border-radius-primary);
//             -o-border-radius: var(--border-radius-primary);
//         }
//     }

//     &>div:nth-child(2) {
//         height: 100%;

//         &>p {
//             font-size: 1.6rem;
//             margin-bottom: 2rem;
//             font-weight: 600;
//         }

//         .reset_days {
//             width: max-content;
//             height: 3.5rem;
//             padding-inline: 1rem;
//             border-radius: var(--border-radius-primary);
//             -webkit-border-radius: var(--border-radius-primary);
//             -moz-border-radius: var(--border-radius-primary);
//             -ms-border-radius: var(--border-radius-primary);
//             -o-border-radius: var(--border-radius-primary);
//             background-color: var(--bg-secondary);
//             color: var(--btn-text-color);
//             border: none;
//             outline: none;
//             cursor: pointer;
//             transition: var(--common-btn-transition);
//             -webkit-transition: var(--common-btn-transition);
//             -moz-transition: var(--common-btn-transition);
//             -ms-transition: var(--common-btn-transition);
//             -o-transition: var(--common-btn-transition);
//             font-size: 1.4rem;
//             /* margin-left: auto; */
//             /* margin-bottom: 2rem; */

//             &:hover {
//                 background-color: var(--bg-secondary-hover);
//             }
//         }

//         .highlighted_date {
//             background-color: #0867ff54;
//             /* border-radius: 50%;
//             -webkit-border-radius: 50%;
//             -moz-border-radius: 50%;
//             -ms-border-radius: 50%;
//             -o-border-radius: 50%; */
//         }

//         .leave_dates {
//             background-color: rgba(255, 0, 0, 0.321);
//         }
//     }

//     .submit {
//         width: min(100%, 35rem);
//         height: 3.5rem;
//         padding-inline: 1rem;
//         border-radius: var(--border-radius-primary);
//         -webkit-border-radius: var(--border-radius-primary);
//         -moz-border-radius: var(--border-radius-primary);
//         -ms-border-radius: var(--border-radius-primary);
//         -o-border-radius: var(--border-radius-primary);
//         background-color: var(--bg-secondary);
//         color: var(--btn-text-color);
//         border: none;
//         outline: none;
//         cursor: pointer;
//         transition: var(--common-btn-transition);
//         -webkit-transition: var(--common-btn-transition);
//         -moz-transition: var(--common-btn-transition);
//         -ms-transition: var(--common-btn-transition);
//         -o-transition: var(--common-btn-transition);
//         font-size: 1.4rem;

//         &:hover {
//             background-color: var(--bg-secondary-hover);
//         }
//     }
// }

// .barber_appointment_content_mobile_wrapper {
//     display: none;
// }


// .value {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     cursor: pointer;
//     padding: 5px;
//     transition: opacity 0.2s ease;
// }

// .disabled {
//     opacity: 0.5;
//     pointer-events: none;
//     cursor: not-allowed;
// }


// @media screen and (min-width:0px) and (max-width:768px) {

//     .barber_appointment_content_wrapper {
//         display: none;
//     }

//     .barber_appointment_content_mobile_wrapper {
//         display: block;
//         width: 100%;
//         height: var(--list-wrapper-common-height);
//         border-radius: var(--list-wrapper-border-radius);
//         -webkit-border-radius: var(--list-wrapper-border-radius);
//         -moz-border-radius: var(--list-wrapper-border-radius);
//         -ms-border-radius: var(--list-wrapper-border-radius);
//         -o-border-radius: var(--list-wrapper-border-radius);
//     }

//     .button_group {
//         margin-bottom: 2rem;
//         display: flex;
//         align-items: center;
//         gap: 2rem;
//         width: min(100%, 35rem);
//         padding: 0.5rem;
//         border-radius: 1rem;
//         -webkit-border-radius: 1rem;
//         -moz-border-radius: 1rem;
//         -ms-border-radius: 1rem;
//         -o-border-radius: 1rem;
//         background-color: var(--bg-primary);

//         &>button {
//             width: 100%;
//             height: 100%;
//             border: none;
//             font-weight: 500;
//             cursor: pointer;
//             background: var(--input-bg-color);
//             border-radius: 0.6rem;
//             -webkit-border-radius: 0.6rem;
//             -moz-border-radius: 0.6rem;
//             -ms-border-radius: 0.6rem;
//             -o-border-radius: 0.6rem;
//             color: var(--text-primary);
//             line-height: inherit;
//             font-family: "AirbnbCereal_Medium";
//             font-size: 1.4rem;
//             padding: 1rem 0.5rem;
//             border: 0.1rem solid var(--border-secondary);

//             &:hover {
//                 font-weight: 600;
//                 /* border-bottom: 2px solid black; */
//             }
//         }
//     }


//     .heading,
//     .value {
//         display: flex;
//         align-items: center;
//         gap: 2rem;
//         margin-bottom: 1.5rem;
//         background-color: var(--bg-primary);
//         padding: 1.5rem;
//         max-width: 35rem;
//         border-radius: var(--border-radius-primary);
//         -webkit-border-radius: var(--border-radius-primary);
//         -moz-border-radius: var(--border-radius-primary);
//         -ms-border-radius: var(--border-radius-primary);
//         -o-border-radius: var(--border-radius-primary);
//     }

//     .value_body {
//         margin-left: "auto"
//     }

//     .leave_value_body {
//         width: min(100%, 35rem);
//         display: flex;
//         flex-direction: column;
//         gap: 2rem;

//         .header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             width: 90%;
//             max-width: 400px;
//             margin-bottom: 24px;
//         }

//         .monthSelector {
//             display: flex;
//             align-items: center;
//             gap: 6px;
//             background-color: var(--bg-primary);
//             border-radius: 8px;
//             padding: 8px 12px;
//         }

//         .iconBtn {
//             background: none;
//             border: none;
//             color: var(--text-primary);
//             cursor: pointer;
//         }

//         .monthText {
//             font-size: 1.4rem;
//             font-weight: 500;
//         }
//     }

//     .dayList {
//         display: flex;
//         flex-direction: column;
//         gap: 1rem;
//     }

//     .dayBtn {
//         background-color: var(--bg-primary);
//         color: white;
//         padding: 1.2rem;
//         border: none;
//         border-radius: 0.8rem;
//         font-weight: 500;
//         text-align: center;
//         cursor: pointer;
//         transition: all 0.2s ease;
//         -webkit-border-radius: 0.8rem;
//         -moz-border-radius: 0.8rem;
//         -ms-border-radius: 0.8rem;
//         -o-border-radius: 0.8rem;
//         border: 0.1rem solid var(--border-secondary);
//     }

//     .highlighted_date {
//         background: #2563eb;
//         color: white;
//     }

//     .leave_dates {
//         background: #9ca3af;
//         color: white;
//         cursor: not-allowed;
//     }

//     .submit {
//         width: min(100%, 35rem);
//         height: 3.5rem;
//         margin-bottom: 2rem;
//         padding-inline: 1rem;
//         border-radius: var(--border-radius-primary);
//         -webkit-border-radius: var(--border-radius-primary);
//         -moz-border-radius: var(--border-radius-primary);
//         -ms-border-radius: var(--border-radius-primary);
//         -o-border-radius: var(--border-radius-primary);
//         background-color: var(--bg-secondary);
//         color: var(--btn-text-color);
//         border: none;
//         outline: none;
//         cursor: pointer;
//         transition: var(--common-btn-transition);
//         -webkit-transition: var(--common-btn-transition);
//         -moz-transition: var(--common-btn-transition);
//         -ms-transition: var(--common-btn-transition);
//         -o-transition: var(--common-btn-transition);
//         font-size: 1.4rem;

//         &:hover {
//             background-color: var(--bg-secondary-hover);
//         }
//     }

//     .reset_days {
//         width: max-content;
//         height: 3.5rem;
//         padding-inline: 1rem;
//         border-radius: var(--border-radius-primary);
//         -webkit-border-radius: var(--border-radius-primary);
//         -moz-border-radius: var(--border-radius-primary);
//         -ms-border-radius: var(--border-radius-primary);
//         -o-border-radius: var(--border-radius-primary);
//         background-color: var(--bg-secondary);
//         color: var(--btn-text-color);
//         border: none;
//         outline: none;
//         cursor: pointer;
//         transition: var(--common-btn-transition);
//         -webkit-transition: var(--common-btn-transition);
//         -moz-transition: var(--common-btn-transition);
//         -ms-transition: var(--common-btn-transition);
//         -o-transition: var(--common-btn-transition);
//         font-size: 1.4rem;

//         &:hover {
//             background-color: var(--bg-secondary-hover);
//         }
//     }

//     .highlighted_date {
//         background-color: #0867ff54;
//         /* border-radius: 50%;
//         -webkit-border-radius: 50%;
//         -moz-border-radius: 50%;
//         -ms-border-radius: 50%;
//         -o-border-radius: 50%; */
//     }

//     .leave_dates {
//         background-color: rgba(255, 0, 0, 0.321);
//     }
// }


