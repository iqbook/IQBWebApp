// import React, { useEffect, useState } from 'react';
// import style from "./EditBarber.module.css";
// import { AddIcon, ClockIcon, CloseIcon, DeleteIcon, DropdownIcon } from '../../../icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { adminAllSalonServicesAction, adminUpdateBarberAction } from '../../../Redux/Admin/Actions/BarberAction';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader';
// import { PhoneInput } from 'react-international-phone';
// import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer';

// import { PhoneNumberUtil } from 'google-libphonenumber';
// import toast from 'react-hot-toast';

// import Skeleton from '@mui/material/Skeleton';
// import { Box, ClickAwayListener, Modal, Typography } from '@mui/material';
// import { getCurrentDate } from '../../../utils/Date';
// import Calendar from 'react-calendar';

// const EditBarber = () => {

//   const [AllSalonServices, setAllSalonServices] = useState([])
//   // Redux selectors
//   const adminAllSalonServices = useSelector(state => state.adminAllSalonServices);

//   const {
//     loading: adminAllSalonServicesLoading,
//     resolve: adminAllSalonServicesResolve,
//     response: allSalonServices
//   } = adminAllSalonServices;

//   useEffect(() => {
//     if (allSalonServices) {
//       setAllSalonServices(allSalonServices)
//     }
//   }, [allSalonServices])

//   // console.log("AllSalonServices ", AllSalonServices)


//   const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const currentBarber = location?.state;

//   // console.log("Current Barber ", currentBarber)

//   // State variables
//   const [name, setName] = useState(currentBarber?.name);
//   const [email, setEmail] = useState(currentBarber?.email);
//   const [nickName, setNickName] = useState(currentBarber?.nickName);
//   const [mobileNumber, setMobileNumber] = useState(`${currentBarber?.mobileCountryCode}${currentBarber?.mobileNumber?.toString()}`);
//   const [countryCode, setCountryCode] = useState(currentBarber?.mobileCountryCode)
//   const [dateOfBirth, setDateOfBirth] = useState(currentBarber?.dateOfBirth?.split('T')[0]);


//   const [currentBarberServices, setCurrentBarberServices] = useState(currentBarber?.barberServices)

//   // console.log("currentBarberServices ", currentBarberServices)

//   useEffect(() => {
//     dispatch(adminAllSalonServicesAction(salonId));
//   }, [salonId, dispatch]);


//   // Choose service handler
//   const chooseServiceHandler = (service) => {
//     const originalService = currentBarberServices.includes(service);

//     if (!originalService) {
//       setCurrentBarberServices([...currentBarberServices, { ...service, barberServiceEWT: service.serviceEWT }]);
//     }

//   };

//   // Delete service handler
//   const deleteServiceHandler = (service) => {
//     const originalService = allSalonServices.find((s) => s.serviceId === service.serviceId);

//     if (originalService) {
//       setCurrentBarberServices(currentBarberServices.filter((f) => f.serviceId !== service.serviceId));

//       setAllSalonServices(AllSalonServices.map((ser) =>
//         ser.serviceId === service.serviceId ? { ...ser, serviceEWT: originalService.serviceEWT } : ser
//       ));
//     }
//   };

//   const [nameError, setNameError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [nickNameError, setNickNameError] = useState("");
//   const [invalidNumberError, setInvalidNumberError] = useState("");
//   const [dateOfBirthError, setDateOfBirthError] = useState("");
//   const [servicesError, setServicesError] = useState("");

//   const [invalidnumber, setInvalidNumber] = useState(false)

//   const EditBarberHandler = () => {

//     if (!name) {
//       toast.error("Please enter name", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//       return setNameError("Please enter name")
//     }

//     if (name.length === 0 || name.length > 20) {
//       toast.error("Name must be between 1 to 20 characters", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//       return setNameError("Name must be between 1 to 20 characters");
//     }


//     if (!nickName) {
//       toast.error("Please enter nickname", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//       return setNickNameError("Please enter nickname")
//     }

//     if (nickName.length === 0 || nickName.length > 20) {
//       toast.error("Nickname must be between 1 to 20 characters", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//       return setNickNameError("Nickname must be between 1 to 20 characters");
//     }


//     if (invalidnumber) {
//       toast.error("Invalid Number", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });

//       return setInvalidNumberError("Invalid Number")
//     }

//     if (!dateOfBirth) {
//       toast.error("Please select date of birth", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });

//       return setDateOfBirthError("Please select date of birth")
//     }

//     if (currentBarberServices.length === 0) {
//       toast.error("Please provide a service", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });

//       return setServicesError("Please provide a service")
//     }

//     const barberdata = {
//       name,
//       email,
//       nickName,
//       mobileNumber: Number(mobileNumber),
//       countryCode: Number(countryCode),
//       dateOfBirth,
//       salonId,
//       barberServices: currentBarberServices
//     };

//     dispatch(adminUpdateBarberAction(barberdata, navigate));

//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       EditBarberHandler();
//     }
//   };

//   const adminUpdateBarber = useSelector(state => state.adminUpdateBarber)

//   const {
//     loading: adminUpdateBarberLoading,
//   } = adminUpdateBarber

//   const darkMode = useSelector(darkmodeSelector)

//   const darkmodeOn = darkMode === "On"


//   const handleonChange = (e, service) => {
//     const newValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only digits

//     const numericValue = newValue === '' ? '' : Number(newValue);

//     if (currentBarberServices.find((c) => c.serviceId === service.serviceId)) {
//       setCurrentBarberServices(currentBarberServices.map((ser) =>
//         ser.serviceId === service.serviceId ? { ...ser, barberServiceEWT: numericValue } : ser
//       ));
//     } else {
//       setAllSalonServices(allSalonServices.map((ser) =>
//         ser.serviceId === service.serviceId ? { ...ser, serviceEWT: numericValue } : ser
//       ));
//     }
//   };


//   const phoneUtil = PhoneNumberUtil.getInstance();

//   const isPhoneValid = (phone) => {
//     try {
//       return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
//     } catch (error) {
//       return false;
//     }
//   };

//   const [countryflag, setCountryFlag] = useState("gb")

//   const handlePhoneChange = (phone, meta) => {
//     setInvalidNumberError("")
//     const { country, inputValue } = meta;

//     const isValid = isPhoneValid(phone);

//     if (isValid) {
//       setMobileNumber(phone)
//       setCountryCode(country?.dialCode)
//       setCountryFlag(country?.iso2)
//       setInvalidNumber(false)
//     } else {
//       setInvalidNumber(true)
//     }
//   };


//   const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

//   const {
//     response: adminGetDefaultSalonResponse
//   } = adminGetDefaultSalon

//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);


//   useEffect(() => {
//     const phoneInput = document.querySelector(
//       '.react-international-phone-input-container .react-international-phone-input'
//     );

//     if (phoneInput) {
//       // phoneInput.style.color = darkmodeOn ? 'var(--light-color-4)' : 'var(--light-color-2)';
//       phoneInput.style.color = 'var(--text-primary)';
//     }
//   }, [darkmodeOn]);


//   // Calender Logic

//   const [openCalender, setOpenCalender] = useState(false)

//   const handleClickAway = () => {
//     setOpenCalender(false);
//   };

//   const [value, onChange] = useState(new Date());

//   const convertDateToYYYYMMDD = (dateInput) => {
//     const date = new Date(dateInput);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const onChangeHandler = (dateInput) => {
//     const formattedDate = convertDateToYYYYMMDD(dateInput);
//     onChange(formattedDate)
//     setDateOfBirthError("")
//     setDateOfBirth(formattedDate)
//     setOpenCalender(false)
//   }

//   const [mobileValue, setMobileValue] = useState(false);

//   useEffect(() => {

//     const handleResize = () => {
//       if (window.innerWidth <= 576) {
//         setMobileValue(true);
//       } else {
//         setMobileValue(false);
//       }
//     };
//     handleResize();

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);


//   return (
//     <>
//       <div className={`${style.admin_edit_barber_wrapper} ${darkmodeOn && style.dark}`}>

//         <div className={`${style.admin_edit_barber_wrapper_right}`}>
//           <div>
//             <h2>Add Your Services</h2>
//           </div>

//           {
//             adminAllSalonServicesLoading ?
//               (<div className={`${style.admin_edit_barber_content_wrapper_right_loading} ${!darkmodeOn && style.dark}`}>
//                 <Skeleton variant="rectangular" width={"100%"} height={"16rem"} style={{ borderRadius: "6px" }} />
//                 <Skeleton variant="rectangular" width={"100%"} height={"16rem"} style={{ borderRadius: "6px" }} />
//               </div>) :
//               adminAllSalonServicesResolve && allSalonServices?.length > 0 ?
//                 (
//                   <div className={`${style.admin_edit_barber_content_wrapper_right} ${darkmodeOn && style.dark}`}>

//                     {/* {
//                       AllSalonServices?.map((s) => {
//                         return (
//                           <div className={`${style.service_item} ${darkmodeOn && style.dark}`} key={s._id}>
//                             <div className={`${style.service_item_top}`}>
//                               <div><img src={s?.serviceIcon?.url} alt="service icon" /></div>
//                               <div>
//                                 <p>{s?.serviceName}</p>
//                                 <p>{s?.vipService ? "VIP" : "Regular"}</p>
//                                 <p>{s?.serviceDesc}</p>
//                               </div>
//                             </div>
//                             <div className={`${style.service_item_bottom}`}>
//                               <div>
//                                 <div>
//                                   <p>Service Price</p>
//                                   <p>{adminGetDefaultSalonResponse?.currency}{s?.servicePrice}</p>
//                                 </div>
//                               </div>

//                               <div>
//                                 <div>
//                                   <p>Est Wait Time</p>
//                                   <div>
//                                     <div><ClockIcon /></div>
//                                     <input
//                                       type="text"
//                                       value={currentBarberServices?.find((c) => c.serviceId === s.serviceId) ? currentBarberServices?.find((c) => c.serviceId === s.serviceId).barberServiceEWT : s.serviceEWT}
//                                       onChange={(e) => handleonChange(e, s)}
//                                     />
//                                     <p>mins</p>
//                                   </div>
//                                 </div>
//                               </div>

//                             </div>

//                             {
//                               currentBarberServices.find((c) => c.serviceId === s.serviceId) ?
//                                 (<button className={`${style.service_delete_icon}`} onClick={() => deleteServiceHandler(s)}>Delete</button>) :
//                                 (<button className={`${style.service_add_icon}`} onClick={() => chooseServiceHandler(s)}>Add</button>)
//                             }

//                           </div>
//                         )
//                       })
//                     } */}

//                     {AllSalonServices?.map((s) => (
//                       <div key={s._id} className={style.service_item}>
//                         <div>
//                           <div>
//                             <div><img src={s?.serviceIcon?.url} alt={s.serviceName} /></div>
//                             <div>
//                               <p>{s?.serviceName}</p>
//                               <p>{s?.vipService ? "VIP" : "Regular"}</p>
//                               <p>{s?.serviceDesc}</p>
//                             </div>
//                           </div>
//                           {currentBarberServices?.find((c) => c.serviceId === s.serviceId) ? (
//                             <button
//                               style={{
//                                 background: "#450a0a",
//                               }}
//                               onClick={() => deleteServiceHandler(s)}
//                             ><DeleteIcon /></button>
//                           ) : (
//                             <button
//                               style={{
//                                 background: "#052e16",
//                               }}
//                               onClick={() => chooseServiceHandler(s)}
//                             ><AddIcon /></button>
//                           )}

//                         </div>
//                         <div>
//                           <div>
//                             <p>Price</p>
//                             <p>{adminGetDefaultSalonResponse?.currency}{s?.servicePrice}</p>
//                           </div>
//                           <div>
//                             <p>Estimated Time</p>
//                             <div>


//                               <input
//                                 type="text"
//                                 value={currentBarberServices?.find((c) => c.serviceId === s.serviceId) ? currentBarberServices?.find((c) => c.serviceId === s.serviceId).barberServiceEWT : s.serviceEWT}
//                                 onChange={(e) => handleonChange(e, s)}
//                                 maxLength={3}
//                               />
//                               <p>mins</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                   </div>
//                 ) :
//                 (<div className={`${style.admin_edit_barber_content_wrapper_right_error} ${darkmodeOn && style.dark}`}>
//                   <p>No services available</p>
//                 </div>)
//           }


//         </div>

//         <div className={`${style.admin_edit_barber_wrapper_left}`}>
//           <div>
//             <h2>Edit Barber</h2>

//             <button
//               onClick={handleOpen}
//               className={style.add_services_btn}
//             >Add Services</button>
//           </div>

//           <div className={`${style.admin_edit_barber_content_wrapper_left} ${darkmodeOn && style.dark}`}>

//             <div>
//               <p>Name</p>
//               <input
//                 type='text'
//                 value={name}
//                 onChange={(e) => {
//                   setNameError("")
//                   setName(e.target.value)
//                 }}
//                 placeholder='Enter Name'
//                 onKeyDown={handleKeyPress}
//                 style={{ border: nameError && "0.1rem solid red" }}
//               />
//               {nameError && <p className={style.error_message}>{nameError}</p>}
//             </div>

//             <div>
//               <p>Email</p>
//               <input
//                 type='text'
//                 value={email}
//                 placeholder='Enter Email'
//                 readOnly
//               />
//             </div>

//             <div>
//               <p>Nick Name</p>
//               <input
//                 type='text'
//                 value={nickName}
//                 onChange={(e) => {
//                   setNickNameError("")
//                   setNickName(e.target.value)
//                 }}
//                 placeholder='Enter Nick Name'
//                 onKeyDown={handleKeyPress}
//                 style={{ border: nickNameError && "0.1rem solid red" }}
//               />
//               {nickNameError && <p className={style.error_message}>{nickNameError}</p>}
//             </div>

//             <div>
//               <p>Mob. Number</p>
//               <div className={`${style.mobile_container} ${darkmodeOn && style.dark}`}>
//                 <div
//                   onKeyDown={handleKeyPress}
//                   style={{ border: invalidNumberError && "0.1rem solid red" }}
//                 >
//                   <PhoneInput
//                     forceDialCode={true}
//                     defaultCountry={countryflag}
//                     value={mobileNumber}
//                     onChange={(phone, meta) => handlePhoneChange(phone, meta)}
//                   />
//                 </div>
//               </div>
//               {invalidNumberError && <p className={style.error_message}>{invalidNumberError}</p>}
//             </div>

//             {
//               mobileValue ? (
//                 <div>
//                   <p>Date of Birth</p>
//                   <input
//                     type='date'
//                     placeholder='dd/mm/yy'
//                     value={dateOfBirth}
//                     onChange={(e) => {
//                       setDateOfBirthError("")
//                       setDateOfBirth(e.target.value)
//                     }}
//                     style={{
//                       colorScheme: darkmodeOn ? "dark" : "light",
//                       border: dateOfBirthError && "0.1rem solid red"
//                     }}
//                     onKeyDown={handleKeyPress}
//                     max={getCurrentDate()}
//                   />
//                   {dateOfBirthError && <p className={style.error_message}>{dateOfBirthError}</p>}
//                 </div>) : (<div className={style.calender_container}>
//                   <p>Date of Birth</p>

//                   <input
//                     type='text'
//                     placeholder='Select Date'
//                     value={dateOfBirth}
//                     onClick={() => setOpenCalender(true)}
//                     readOnly
//                     style={{
//                       border: dateOfBirthError && "0.1rem solid red"
//                     }}
//                   />
//                   <span onClick={() => setOpenCalender((prev) => !prev)} className={`${style.dropicon} ${darkmodeOn && style.dark}`}><DropdownIcon /></span>
//                   {dateOfBirthError && <p className={style.error_message}>{dateOfBirthError}</p>}

//                   {
//                     openCalender && <ClickAwayListener onClickAway={handleClickAway}>
//                       <div className={style.calender_drop_container}>
//                         <Calendar
//                           onChange={onChangeHandler}
//                           value={value}
//                           maxDate={new Date(2009, 11, 31)}
//                         />
//                       </div>
//                     </ClickAwayListener>
//                   }
//                 </div>)
//             }

//             <div>
//               <p>Selected Services</p>
//               <input
//                 type='text'
//                 value={currentBarberServices?.map((s) => " " + s.serviceName)}
//                 placeholder='Your Services'
//                 readOnly
//                 style={{ border: servicesError && "0.1rem solid red" }}
//               />
//               {servicesError && <p className={style.error_message}>{servicesError}</p>}
//             </div>

//             {
//               adminUpdateBarberLoading ? <button
//                 className={`${style.edit_barber_btn}`}
//                 style={{
//                   display: "grid",
//                   placeItems: "center"
//                 }}><ButtonLoader /></button> : <button className={`${style.edit_barber_btn}`} onClick={EditBarberHandler}>
//                 Update
//               </button>
//             }


//             <Modal
//               open={open}
//               onClose={handleClose}
//               aria-labelledby="modal-modal-title"
//               aria-describedby="modal-modal-description"
//               className={style.mobile_modal}
//             >
//               <div className={`${style.mobile_service_container} ${darkmodeOn && style.dark}`}>
//                 <button onClick={handleClose}><CloseIcon /></button>

//                 {
//                   adminAllSalonServicesLoading ? (
//                     <div>
//                       <Skeleton variant="rectangular" width={"100%"} height={"16rem"} style={{ borderRadius: "var(--list-wrapper-border-radius)", marginBottom: "1rem" }} />
//                       <Skeleton variant="rectangular" width={"100%"} height={"16rem"} style={{ borderRadius: "var(--list-wrapper-border-radius)" }} />
//                     </div>
//                   ) :
//                     adminAllSalonServicesResolve && allSalonServices?.length > 0 ? (
//                       <div>
//                         {/* {
//                           AllSalonServices?.map((s) => {
//                             return (
//                               <div className={`${style.service_item} ${darkmodeOn && style.dark}`} key={s._id}>
//                                 <div className={`${style.service_item_top}`}>
//                                   <div><img src={s?.serviceIcon?.url} alt="service icon" /></div>
//                                   <div>
//                                     <p>{s?.serviceName}</p>
//                                     <p>{s?.vipService ? "VIP" : "Regular"}</p>
//                                     <p>{s?.serviceDesc}</p>
//                                   </div>
//                                 </div>
//                                 <div className={`${style.service_item_bottom}`}>
//                                   <div>
//                                     <div>
//                                       <p>Service Price</p>
//                                       <p>{adminGetDefaultSalonResponse?.currency}{s?.servicePrice}</p>
//                                     </div>
//                                   </div>

//                                   <div>
//                                     <div>
//                                       <p>Est Wait Time</p>
//                                       <div>
//                                         <div><ClockIcon /></div>
//                                         <input
//                                           type="text"
//                                           value={currentBarberServices?.find((c) => c.serviceId === s.serviceId) ? currentBarberServices?.find((c) => c.serviceId === s.serviceId).barberServiceEWT : s.serviceEWT}
//                                           onChange={(e) => handleonChange(e, s)}
//                                         />
//                                         <p>mins</p>
//                                       </div>
//                                     </div>
//                                   </div>

//                                 </div>

//                                 {
//                                   currentBarberServices.find((c) => c.serviceId === s.serviceId) ?
//                                     (<button className={`${style.service_delete_icon}`} onClick={() => deleteServiceHandler(s)}>Delete</button>) :
//                                     (<button className={`${style.service_add_icon}`} onClick={() => chooseServiceHandler(s)}>Add</button>)
//                                 }

//                               </div>
//                             )
//                           })
//                         } */}
//                       </div>
//                     ) : (
//                       <div className={`${style.admin_mobile_edit_barber_content_wrapper_right_error}`}>
//                         <p>No services available</p>
//                       </div>
//                     )
//                 }

//               </div>
//             </Modal>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditBarber;





import React, { useEffect, useState } from 'react';
import style from "./EditBarber.module.css";
import { ClockIcon, CloseIcon, CrownIcon } from '../../../icons';
import { useDispatch, useSelector } from 'react-redux';
import { adminAllSalonServicesAction, adminUpdateBarberAction } from '../../../Redux/Admin/Actions/BarberAction';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader';
import { PhoneInput } from 'react-international-phone';
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer';
import { PhoneNumberUtil } from 'google-libphonenumber';
import toast from 'react-hot-toast';
import { AddIcon, DeleteIcon, DropdownIcon, FacebookIcon, InstagramIcon, TiktokIcon, WebsiteIcon, XIcon } from '../../../newicons';
import { ClickAwayListener, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import { getCurrentDate } from '../../../utils/Date';
import Calendar from 'react-calendar';
import Skeleton from 'react-loading-skeleton';
import { ddmmformatDate } from '../../../../utils/ddmmformatDate';

const EditBarber = () => {

  const [AllSalonServices, setAllSalonServices] = useState([])
  // Redux selectors
  const adminAllSalonServices = useSelector(state => state.adminAllSalonServices);

  const {
    loading: adminAllSalonServicesLoading,
    resolve: adminAllSalonServicesResolve,
    response: allSalonServices
  } = adminAllSalonServices;

  useEffect(() => {
    if (allSalonServices) {
      setAllSalonServices(allSalonServices)
    }
  }, [allSalonServices])

  // console.log("AllSalonServices ", AllSalonServices)


  const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentBarber = location?.state;

  // console.log("Current Barber ", currentBarber)

  // State variables
  const [name, setName] = useState(currentBarber?.name);
  const [email, setEmail] = useState(currentBarber?.email);
  const [nickName, setNickName] = useState(currentBarber?.nickName);
  const [mobileNumber, setMobileNumber] = useState(`${currentBarber?.mobileCountryCode}${currentBarber?.mobileNumber?.toString()}`);
  const [countryCode, setCountryCode] = useState(currentBarber?.mobileCountryCode)
  const [dateOfBirth, setDateOfBirth] = useState(currentBarber?.dateOfBirth?.split('T')[0]);


  const [currentBarberServices, setCurrentBarberServices] = useState(currentBarber?.barberServices)

  // console.log("currentBarberServices ", currentBarberServices)

  useEffect(() => {
    dispatch(adminAllSalonServicesAction(salonId));
  }, [salonId, dispatch]);


  // Choose service handler
  const chooseServiceHandler = (service) => {
    const originalService = currentBarberServices.includes(service);

    if (!originalService) {
      setCurrentBarberServices([...currentBarberServices, { ...service, barberServiceEWT: service.serviceEWT }]);
    }

  };

  // Delete service handler
  const deleteServiceHandler = (service) => {
    const originalService = allSalonServices.find((s) => s.serviceId === service.serviceId);

    if (originalService) {
      setCurrentBarberServices(currentBarberServices.filter((f) => f.serviceId !== service.serviceId));

      setAllSalonServices(AllSalonServices.map((ser) =>
        ser.serviceId === service.serviceId ? { ...ser, serviceEWT: originalService.serviceEWT } : ser
      ));
    }
  };

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [invalidNumberError, setInvalidNumberError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [servicesError, setServicesError] = useState("");

  const [invalidnumber, setInvalidNumber] = useState(false)

  const EditBarberHandler = () => {

    if (!name) {
      toast.error("Please enter name", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setNameError("Please enter name")
    }

    if (name.length === 0 || name.length > 20) {
      toast.error("Name must be between 1 to 20 characters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setNameError("Name must be between 1 to 20 characters");
    }


    if (!nickName) {
      toast.error("Please enter nickname", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setNickNameError("Please enter nickname")
    }

    if (nickName.length === 0 || nickName.length > 20) {
      toast.error("Nickname must be between 1 to 20 characters", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return setNickNameError("Nickname must be between 1 to 20 characters");
    }


    if (invalidnumber) {
      toast.error("Invalid Number", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });

      return setInvalidNumberError("Invalid Number")
    }

    // if (!dateOfBirth) {
    //   toast.error("Please select date of birth", {
    //     duration: 3000,
    //     style: {
    //       fontSize: "var(--font-size-2)",
    //       borderRadius: '0.3rem',
    //       background: '#333',
    //       color: '#fff',
    //     },
    //   });

    //   return setDateOfBirthError("Please select date of birth")
    // }

    if (currentBarberServices.length === 0) {
      toast.error("Please provide a service", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });

      return setServicesError("Please provide a service")
    }

    const barberdata = {
      name,
      email,
      nickName,
      mobileNumber: Number(mobileNumber),
      countryCode: Number(countryCode),
      dateOfBirth,
      salonId,
      barberServices: currentBarberServices
    };

    dispatch(adminUpdateBarberAction(barberdata, navigate));

  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      EditBarberHandler();
    }
  };

  const adminUpdateBarber = useSelector(state => state.adminUpdateBarber)

  const {
    loading: adminUpdateBarberLoading,
  } = adminUpdateBarber

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"


  const handleonChange = (e, service) => {
    const newValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only digits

    const numericValue = newValue === '' ? '' : Number(newValue);

    if (currentBarberServices.find((c) => c.serviceId === service.serviceId)) {
      setCurrentBarberServices(currentBarberServices.map((ser) =>
        ser.serviceId === service.serviceId ? { ...ser, barberServiceEWT: numericValue } : ser
      ));
    } else {
      setAllSalonServices(allSalonServices.map((ser) =>
        ser.serviceId === service.serviceId ? { ...ser, serviceEWT: numericValue } : ser
      ));
    }
  };


  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };

  const [countryflag, setCountryFlag] = useState("gb")

  const handlePhoneChange = (phone, meta) => {
    setInvalidNumberError("")
    const { country, inputValue } = meta;

    const isValid = isPhoneValid(phone);

    if (isValid) {
      setMobileNumber(phone)
      setCountryCode(country?.dialCode)
      setCountryFlag(country?.iso2)
      setInvalidNumber(false)
    } else {
      setInvalidNumber(true)
    }
  };


  const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

  const {
    response: adminGetDefaultSalonResponse
  } = adminGetDefaultSalon

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  // Calender Logic

  const [openCalender, setOpenCalender] = useState(false)

  const handleClickAway = () => {
    setOpenCalender(false);
  };

  const [value, onChange] = useState(new Date());

  const convertDateToYYYYMMDD = (dateInput) => {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onChangeHandler = (dateInput) => {
    const formattedDate = convertDateToYYYYMMDD(dateInput);
    onChange(formattedDate)
    setDateOfBirthError("")
    setDateOfBirth(formattedDate)
    // setOpenCalender(false)
  }

  const [mobileValue, setMobileValue] = useState(false);

  useEffect(() => {

    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setMobileValue(true);
      } else {
        setMobileValue(false);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // =========================================

  const steps = [
    {
      label: 'Barber Information',
      fields: [
        {
          name: 'name', label: 'Name', type: 'text', placeholder: 'Enter barber name', value: name, onChange: (e) => {
            setNameError("")
            setName(e.target.value)
          }, error: nameError
        },
        { name: 'email', label: 'Email', type: 'text', placeholder: 'Enter barber email', value: email, readOnly: true },
        {
          name: 'nickname', label: 'Nick Name', type: 'text', placeholder: 'Enter barber nickname', value: nickName, onChange: (e) => {
            setNickNameError("")
            setNickName(e.target.value)
          }, error: nickNameError
        },
        { name: 'mobileNumber', label: 'Mobile Number', type: 'text', placeholder: 'Enter barber mobile number' },
        { name: 'dateofbirth', label: 'Date of Birth', type: 'text', placeholder: 'Enter barber date of birth' },
      ],
    },
    {
      label: 'Barber Services',
      name: 'barberservices',
      fields: [

      ],
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    accountInfo: '',
    projectID: '',
    ownerName: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
  });





  const handleNext = () => {
    if (activeStep === 0) {
      if (!name) {
        toast.error("Please enter name", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: '0.3rem',
            background: '#333',
            color: '#fff',
          },
        });
        return setNameError("Please enter name")
      }

      if (name.length === 0 || name.length > 20) {
        toast.error("Name must be between 1 to 20 characters", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: '0.3rem',
            background: '#333',
            color: '#fff',
          },
        });
        return setNameError("Name must be between 1 to 20 characters");
      }

      if (!nickName) {
        toast.error("Please enter nickname", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: '0.3rem',
            background: '#333',
            color: '#fff',
          },
        });
        return setNickNameError("Please enter nickname")
      }

      if (nickName.length === 0 || nickName.length > 20) {
        toast.error("Nickname must be between 1 to 20 characters", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: '0.3rem',
            background: '#333',
            color: '#fff',
          },
        });
        return setNickNameError("Nickname must be between 1 to 20 characters");
      }


      if (invalidnumber) {
        toast.error("Invalid Number", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: '0.3rem',
            background: '#333',
            color: '#fff',
          },
        });

        return setInvalidNumberError("Invalid Number")
      }

      // if (!dateOfBirth) {
      //   toast.error("Please select date of birth", {
      //     duration: 3000,
      //     style: {
      //       fontSize: "var(--font-size-2)",
      //       borderRadius: '0.3rem',
      //       background: '#333',
      //       color: '#fff',
      //     },
      //   });

      //   return setDateOfBirthError("Please select date of birth")
      // }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  return (
    <section className={`${style.section}`}>
      <div>
        <h2>Edit Barber</h2>
      </div>

      <div className={`${style.form_main_container}`}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            "& .MuiStepContent-root": {
              borderLeft: "1px solid #bdbdbd",
              paddingRight: "0px"
            },

            "& .MuiStepIcon-root": {
              width: "2.5rem",
              height: "2.5rem",
              // fontSize: "2rem",
              color: "var(--bg-tertiary)",
            },
            "& .MuiStepIcon-text": {
              fontSize: "1.4rem",
              // color: "var(--text-primary)",
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "var(--bg-tertiary)",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              background: "green",
              borderRadius: "50%",
              color: "#fff",
              padding: "0.5rem"
            },
          }}

        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <span className={`${style.stepper_heading}`}>{step.label}</span>
              </StepLabel>

              {
                step.label === "Barber Information" && (<StepContent>
                  <main className={`${style.form_container}`}>
                    {step.fields.map((field) => (
                      <div key={field.name} className={`${style.form_group}`}>
                        <label>{field.label}</label>

                        {
                          field.name === "mobileNumber" ? (<>
                            <PhoneInput
                              forceDialCode={true}
                              defaultCountry={countryflag}
                              value={mobileNumber}
                              onChange={(phone, meta) => handlePhoneChange(phone, meta)}
                            />
                            {invalidNumberError ? <p style={{ color: "red", fontSize: "1.4rem" }}>{invalidNumberError}</p> : null}
                          </>) : field.name === "dateofbirth" ? (
                            <>
                              <div className={`${style.select_container}`} onClick={() => setOpenCalender((prev) => !prev)}>
                                <input
                                  type={field.type}
                                  name={field.name}
                                  value={dateOfBirth ? ddmmformatDate(dateOfBirth) : ""}
                                  placeholder={field.placeholder}
                                  readOnly
                                />
                                <div><DropdownIcon /></div>

                                {
                                  openCalender ? (
                                    <ClickAwayListener
                                      onClickAway={() => setOpenCalender(false)}>
                                      <div
                                        className={`${style.select_dropdown_container}`} onClick={(event) => event.stopPropagation()} >
                                        <Calendar
                                          onChange={onChangeHandler}
                                          value={value}
                                          maxDate={new Date(2009, 11, 31)}
                                        />
                                      </div></ClickAwayListener>) : null
                                }
                              </div>
                              {dateOfBirthError ? <p style={{ color: "red", fontSize: "1.4rem" }}>{dateOfBirthError}</p> : null}
                            </>
                          ) : (
                            <>
                              <input
                                type={field.type}
                                name={field.name}
                                value={field?.value}
                                placeholder={field.placeholder}
                                onChange={field?.onChange}
                                readOnly={field?.readOnly}
                              />
                              {field?.error ? <p style={{ color: "red", fontSize: "1.4rem" }}>{field?.error}</p> : null}
                            </>
                          )
                        }

                      </div>
                    ))}
                    <div className={`${style.button_container}`}>
                      <div></div>
                      <button onClick={handleNext}>
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </button>
                    </div>
                  </main>
                </StepContent>)
              }

              {
                step.label === "Barber Services" && (<StepContent>
                  <main className={`${style.service_container}`}>

                    <div>

                      <div>
                        {
                          adminAllSalonServicesResolve && allSalonServices?.length ? (

                            AllSalonServices?.map((s) => {
                              return (
                                <div className={style.mobile_service_item} key={s._id} >
                                  <div>
                                    <div>
                                      <div>
                                        <img src={s?.serviceIcon?.url} alt={s?.serviceName} />

                                        {s.vipService ? <span><CrownIcon /></span> : null}
                                      </div>

                                      <p>{s?.serviceName}</p>
                                      <p>{s?.serviceDesc}</p>

                                    </div>

                                    {
                                      currentBarberServices.find((c) => c.serviceId === s.serviceId) ?
                                        (<button
                                          style={{
                                            background: "#450a0a",
                                          }}
                                          onClick={() => deleteServiceHandler(s)}>Delete</button>) :
                                        (<button
                                          style={{
                                            background: "#052e16",
                                          }}
                                          onClick={() => chooseServiceHandler(s)}>Add</button>)
                                    }
                                  </div>
                                  <div>
                                    <div>
                                      <p>Price</p>
                                      <p>{adminGetDefaultSalonResponse?.currency}{s?.servicePrice}</p>
                                    </div>

                                    <div>
                                      <p>Estimated Time</p>
                                      <div>
                                        <input
                                          type="text"
                                          value={currentBarberServices?.find((c) => c.serviceId === s.serviceId) ? currentBarberServices?.find((c) => c.serviceId === s.serviceId).barberServiceEWT : s.serviceEWT}
                                          onChange={(e) => handleonChange(e, s)}
                                          maxLength={3}
                                        />
                                        <p>mins</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })

                          ) : (null)
                        }

                        {
                          adminAllSalonServicesResolve && allSalonServices?.length > 0 ? (
                            AllSalonServices.map((s) => (
                              <div key={s._id} className={style.service_item}>
                                <div>
                                  <div>
                                    <div><img src={s?.serviceIcon?.url} alt={s?.serviceName} /></div>
                                    <div>
                                      <p>{s?.serviceName}</p>
                                      <p>{s?.vipService ? "VIP" : "Regular"}</p>
                                      <p>{s?.serviceDesc}</p>
                                    </div>
                                  </div>

                                  {
                                    currentBarberServices.find((c) => c.serviceId === s.serviceId) ?
                                      (<button
                                        style={{
                                          background: "#450a0a",
                                        }}
                                        onClick={() => deleteServiceHandler(s)}>Delete</button>) :
                                      (<button
                                        style={{
                                          background: "#052e16",
                                        }}
                                        onClick={() => chooseServiceHandler(s)}>Add</button>)
                                  }

                                </div>
                                <div>
                                  <div>
                                    <p>Price</p>
                                    <p>{adminGetDefaultSalonResponse?.currency}{s?.servicePrice}</p>
                                  </div>
                                  <div>
                                    <p>Estimated Time</p>
                                    <div>
                                      <input
                                        type="text"
                                        value={currentBarberServices?.find((c) => c.serviceId === s.serviceId) ? currentBarberServices?.find((c) => c.serviceId === s.serviceId).barberServiceEWT : s.serviceEWT}
                                        onChange={(e) => handleonChange(e, s)}
                                        maxLength={3}
                                      />
                                      <p>mins</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (null)
                        }

                      </div>


                      <button
                        onClick={handleBack} disabled={index === 0}
                      >
                        Back
                      </button>

                    </div>

                    <div className={`${style.button_container}`}>
                      <div></div>
                      <button onClick={handleNext} disabled={currentBarberServices.length === 0} style={{ cursor: currentBarberServices.length === 0 ? "not-allowed" : "pointer" }}>
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </button>
                    </div>

                  </main>
                </StepContent>)
              }

            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <div className={`${style.complete}`}>
            <p>All steps have been successfully completed. Please click the <span style={{ color: "var(--bg-secondary)", fontWeight: "bold" }}>Update</span> button to save your changes.</p>
            <div>
              <button onClick={handleBack}>
                Back
              </button>
              {
                adminUpdateBarberLoading ? <button
                  style={{
                    display: "grid",
                    placeItems: "center"
                  }}><ButtonLoader /></button> : <button onClick={EditBarberHandler}>
                  Update
                </button>
              }

            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default EditBarber


