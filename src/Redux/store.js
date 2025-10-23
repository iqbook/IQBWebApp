import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { AdminLoggedInMiddlewareReducer, AdminGoogleLoginReducer, AdminLogoutReducer, AdminGoogleSignupReducer, AdminSignupReducer, AdminSignupEditReducer, AdminSigninReducer } from "./Admin/Reducers/AuthReducer"
import { BarberGoogleLoginReducer, BarberGoogleSignupReducer, BarberLoggedInMiddlewareReducer, BarberLogoutReducer, BarberSigninReducer, BarberSignupEditReducer, BarberSignupReducer } from "./Barber/Reducers/AuthReducer"
import { adminDragAdvertisementReducer, adminSalonStatusReducer, adminUpdateSalonInfoReducer, getAllAdvertisementReducer, getAllQueueListReducer, getDashboardAppointmentListReducer } from "./Admin/Reducers/DashboardReducer"
import { adminCreateSalonReducer, adminDeleteSalonReducer, adminEditSalonReducer, adminUpdateSalonSettingsReducer, getAdminAllCitiesReducer, getAdminAllCountriesReducer, getAdminAllSalonIconReducer, getAdminAllTimezoneReducer, getAdminSalonImagesReducer, getAdminSalonListReducer, getAdminSalonLogoReducer, getAllSalonCategoriesReducer } from "./Admin/Reducers/SalonReducer";
import { getAdminBarberListReducer, changeAdminBarberOnlineStatusReducer, adminApproveBarberReducer, adminAllSalonServicesReducer, adminCreateBarberReducer, adminUpdateBarberReducer, adminDeleteBarberReducer, changeAdminBarberClockStatusReducer, adminSendBarberEmailReducer, adminSendBarberMessageReducer, getBarberDashboardReducer, adminSendNotificationReducer } from "./Admin/Reducers/BarberReducer"
import { adminUpdateProfileReducer, adminSendVerifyEmailReducer, adminVerifiedEmailStatusReducer, adminUploadProfilePicReducer, adminSkipProfileReducer, adminUpdatePasswordReducer, adminVerifiedMobileStatusReducer, adminSendVerifyMobileReducer } from "./Admin/Reducers/AdminProfileReducer"
import { adminGetAllCustomerListReducer } from "./Admin/Reducers/CustomerReducer";
import { adminCancelQueueReducer, adminServeQueueReducer, getAdminQueueListHistoryReducer } from "./Admin/Reducers/QueueReducer";
import { adminGetDefaultSalonReducer, adminApplySalonReducer, colorReducer, adminSetSalonReducer } from "./Admin/Reducers/AdminHeaderReducer"
import { adminForgetPasswordReducer, adminResetPasswordReducer } from "./Admin/Reducers/AdminPasswordReducer";
import { barberConnectSalonReducer, barberDashboardSalonInfoReducer, barberGetSalonLogoReducer, barberSalonStatusReducer, connectSalonListReducer } from "./Barber/Reducers/DashboardReducer";
import { barberForgetPasswordReducer, barberResetPasswordReducer } from "./Barber/Reducers/BarberPasswordReducer";
import { getBarberQueueListHistoryReducer, getBarberQueueListReducer } from "./Barber/Reducers/BarberQueueReducer";
import { barberSendVerifyEmailReducer, barberSendVerifyMobileReducer, barberSkipProfileReducer, barberUpdatePasswordReducer, barberUpdateProfileReducer, barberVerifiedEmailStatusReducer, barberVerifiedMobileStatusReducer, getAllSalonServicesBarberReducer } from "./Barber/Reducers/BarberProfileReducer";
import { barberGetAllCustomerListReducer, barberSendCustomerEmailReducer, barberSendCustomerMessageReducer } from "./Barber/Reducers/BarberCustomerReducer";
import { AppointmentListBarberReducer, AppointmentReducer, CancelAppointmentReducer, getBarberAppointmentHistoryReducer, ServeAppointmentReducer } from "./Barber/Reducers/AppointmentReducer"
import { ThemeSelectorReducer } from "./Theme";
import { getAdminAppointmentHistoryReducer, getAdminAppointmentListSalonIdReducer } from "./Admin/Reducers/AppointmentReducer";

const rootReducer = combineReducers({

  //Admin Reducers
  AdminLoggedInMiddleware: AdminLoggedInMiddlewareReducer,
  AdminGoogleLogin: AdminGoogleLoginReducer,
  AdminLogout: AdminLogoutReducer,
  getAllAdvertisement: getAllAdvertisementReducer,
  getAllQueueList: getAllQueueListReducer,
  getDashboardAppointmentList: getDashboardAppointmentListReducer,
  getAdminSalonList: getAdminSalonListReducer,
  getAdminBarberList: getAdminBarberListReducer,
  changeAdminBarberOnlineStatus: changeAdminBarberOnlineStatusReducer,
  changeAdminBarberClockStatus: changeAdminBarberClockStatusReducer,
  adminApproveBarber: adminApproveBarberReducer,
  adminAllSalonServices: adminAllSalonServicesReducer,
  adminCreateBarber: adminCreateBarberReducer,
  adminUpdateBarber: adminUpdateBarberReducer,
  adminDeleteBarber: adminDeleteBarberReducer,
  getAdminAllSalonIcon: getAdminAllSalonIconReducer,
  getAdminAllCountries: getAdminAllCountriesReducer,
  getAdminAllCities: getAdminAllCitiesReducer,
  getAdminAllTimezone: getAdminAllTimezoneReducer,
  adminDeleteSalon: adminDeleteSalonReducer,
  adminCreateSalon: adminCreateSalonReducer,
  adminUpdateProfile: adminUpdateProfileReducer,
  adminSkipProfile: adminSkipProfileReducer,
  adminGetAllCustomerList: adminGetAllCustomerListReducer,
  adminServeQueue: adminServeQueueReducer,
  adminCancelQueue: adminCancelQueueReducer,
  adminEditSalon: adminEditSalonReducer,
  AdminGoogleSignup: AdminGoogleSignupReducer,
  AdminSignup: AdminSignupReducer,
  AdminSignupEdit: AdminSignupEditReducer,
  adminSendVerifyEmail: adminSendVerifyEmailReducer,
  adminVerifiedEmailStatus: adminVerifiedEmailStatusReducer,
  adminGetDefaultSalon: adminGetDefaultSalonReducer,
  adminApplySalon: adminApplySalonReducer,
  adminSalonStatus: adminSalonStatusReducer,
  adminUpdateSalonSettings: adminUpdateSalonSettingsReducer,
  adminForgetPassword: adminForgetPasswordReducer,
  adminResetPassword: adminResetPasswordReducer,
  adminUploadProfilePic: adminUploadProfilePicReducer,
  AdminSignin: AdminSigninReducer,
  color: colorReducer,
  adminSetSalon: adminSetSalonReducer,
  adminUpdateSalonInfo: adminUpdateSalonInfoReducer,
  getAdminSalonImages: getAdminSalonImagesReducer,
  getAdminSalonLogo: getAdminSalonLogoReducer,
  adminSendBarberEmail: adminSendBarberEmailReducer,
  adminUpdatePassword: adminUpdatePasswordReducer,
  adminVerifiedMobileStatus: adminVerifiedMobileStatusReducer,
  adminSendVerifyMobile: adminSendVerifyMobileReducer,
  adminSendBarberMessage: adminSendBarberMessageReducer,
  getAdminQueueListHistory: getAdminQueueListHistoryReducer,
  getAdminAppointmentHistory: getAdminAppointmentHistoryReducer,
  getAllSalonCategories: getAllSalonCategoriesReducer,
  getAdminAppointmentListSalonId: getAdminAppointmentListSalonIdReducer,
  getBarberDashboard: getBarberDashboardReducer,
  adminSendNotification: adminSendNotificationReducer,

  //Barber Reducers
  BarberLoggedInMiddleware: BarberLoggedInMiddlewareReducer,
  BarberGoogleLogin: BarberGoogleLoginReducer,
  BarberGoogleSignup: BarberGoogleSignupReducer,
  BarberSignin: BarberSigninReducer,
  BarberSignup: BarberSignupReducer,
  barberForgetPassword: barberForgetPasswordReducer,
  barberResetPassword: barberResetPasswordReducer,
  BarberSignupEdit: BarberSignupEditReducer,
  BarberLogout: BarberLogoutReducer,
  connectSalonList: connectSalonListReducer,
  barberConnectSalon: barberConnectSalonReducer,
  getBarberQueueList: getBarberQueueListReducer,
  barberUpdateProfile: barberUpdateProfileReducer,
  barberSkipProfile: barberSkipProfileReducer,
  barberSendVerifyEmail: barberSendVerifyEmailReducer,
  barberVerifiedEmailStatus: barberVerifiedEmailStatusReducer,
  barberSalonStatus: barberSalonStatusReducer,
  barberGetSalonLogo: barberGetSalonLogoReducer,
  adminDragAdvertisement: adminDragAdvertisementReducer,
  barberDashboardSalonInfo: barberDashboardSalonInfoReducer,
  barberGetAllCustomerList: barberGetAllCustomerListReducer,
  barberUpdatePassword: barberUpdatePasswordReducer,
  barberSendVerifyMobile: barberSendVerifyMobileReducer,
  barberVerifiedMobileStatus: barberVerifiedMobileStatusReducer,
  barberSendCustomerEmail: barberSendCustomerEmailReducer,
  barberSendCustomerMessage: barberSendCustomerMessageReducer,
  getBarberQueueListHistory: getBarberQueueListHistoryReducer,
  getAllSalonServicesBarber: getAllSalonServicesBarberReducer,
  AppointmentBarber: AppointmentReducer,
  CancelAppointment: CancelAppointmentReducer,
  ServeAppointment: ServeAppointmentReducer,
  getBarberAppointmentHistory: getBarberAppointmentHistoryReducer,
  AppointmentListBarber: AppointmentListBarberReducer,
  ThemeSelector: ThemeSelectorReducer
})

const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,

});

export default store;