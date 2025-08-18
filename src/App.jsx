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
