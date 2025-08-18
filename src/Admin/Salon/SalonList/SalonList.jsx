// import React, { useEffect, useRef, useState } from 'react'
// import style from "./SalonList.module.css"
// import { CloseIcon } from '../../../icons'
// import { useNavigate } from 'react-router-dom'
// import Skeleton from 'react-loading-skeleton'
// import { useDispatch, useSelector } from 'react-redux'
// import { adminDeleteSalonAction, adminUpdateSalonSettingsAction, getAdminSalonListAction } from '../../../Redux/Admin/Actions/SalonAction'
// import toast from 'react-hot-toast'
// import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
// import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader'
// import { ClickAwayListener, Modal } from '@mui/material'

// import { loadStripe } from '@stripe/stripe-js';
// import api from '../../../Redux/api/Api'
// import axios from 'axios'
// import { adminGetDefaultSalonAction } from '../../../Redux/Admin/Actions/AdminHeaderAction'

// const SalonList = () => {

// const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])

// const email = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)
// const currentsalonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

// const dispatch = useDispatch()
// const navigate = useNavigate()

// const createSalonClicked = () => {
//   dispatch({
//     type: "ADMIN_CREATE_SALON_SUCCESS",
//   })
//   navigate("/admin-salon/createsalon")
// }

// const SalonListControllerRef = useRef(new AbortController());

// useEffect(() => {
//   const controller = new AbortController();
//   SalonListControllerRef.current = controller;

//   dispatch(getAdminSalonListAction(email, controller.signal));

//   return () => {
//     if (SalonListControllerRef.current) {
//       SalonListControllerRef.current.abort();
//     }
//   };
// }, [email, dispatch]);

// const getAdminSalonList = useSelector(state => state.getAdminSalonList)

// const {
//   loading: getAdminSalonListLoading,
//   resolve: getAdminSalonListResolve,
//   salons: SalonList
// } = getAdminSalonList


// const editButtonClicked = (salon) => {
//   navigate(`/admin-salon/editsalon/${salon?.salonId}`, { state: salon })
// }

// const deleteSalonHandler = (salonId, id) => {
//   if (currentsalonId == salonId) {
//     toast.error("You are currently in this salon", {
//       duration: 3000,
//       style: {
//         fontSize: "var(--font-size-2)",
//         borderRadius: '0.3rem',
//         background: '#333',
//         color: '#fff',
//       },
//     });
//   } else {
//     const confirm = window.confirm("Are you sure ?")
//     if (confirm) {
//       dispatch(adminDeleteSalonAction(salonId, id))
//     }
//   }
// }



// const darkMode = useSelector(darkmodeSelector)

// const darkmodeOn = darkMode === "On"


// const [openSalonSettings, setOpenSalonSettings] = useState(false)

// const [selectedSalonId, setSelectedSalonId] = useState(null)

// const [currentSalonCurrency, setCurrentSalonCurrency] = useState("")

// const [renew, setRenew] = useState(false)
// const [trialExpiry, setTrialExpiry] = useState(false)

// const salonappointmentClicked = (salon) => {
//   setSelectedSalonId(salon?.salonId)
//   setStartTime(salon?.appointmentSettings?.appointmentStartTime)
//   setEndTime(salon?.appointmentSettings?.appointmentEndTime)
//   setIntervalTime(salon?.appointmentSettings?.intervalInMinutes)
//   setOpenSalonSettings(true)
//   setPaymentModalOpen(false)
//   setSelectedAdvanceDays(salon?.appointmentAdvanceDays)
//   setCurrentSalonCurrency(salon?.currency)
//   setSelectedSalonOffdays(salon?.salonOffDays)
//   setRenew(salon?.isRenew)
//   setTrialExpiry(salon?.trailExpiryDate)
// }

// const [timeOptions, setTimeOptions] = useState([]);

// const addLeadingZero = (num) => (num < 10 ? '0' : '') + num;

// const generateTimeOptions = () => {
//   const options = [];

//   for (let hour = 0; hour < 24; hour++) {
//     for (let minute = 0; minute < 60; minute += 30) {
//       const time = addLeadingZero(hour) + ':' + addLeadingZero(minute);
//       options.push({ value: time, label: time });
//     }
//   }

//   setTimeOptions(options);
// };

// useEffect(() => {
//   generateTimeOptions();
// }, [])



// const [startTime, setStartTime] = useState("")
// const [startTimeDrop, setStartTimeDrop] = useState(false)

// const startTimeDropHandler = () => {
//   setStartTimeDrop((prev) => !prev)
// }

// const setStartTimeHandler = (value) => {
//   setStartTime(value)
//   setStartTimeDrop(false)
// }

// const [endTime, setEndTime] = useState("")
// const [endTimeDrop, setEndTimeDrop] = useState(false)

// const endTimeDropHandler = () => {
//   setEndTimeDrop((prev) => !prev)
// }

// const setEndTimeHandler = (value) => {
//   setEndTime(value)
//   setEndTimeDrop(false)
// }


// const [intervalTimemin, setIntervalTimemin] = useState([])

// const generateTimeIntervalInMinutes = () => {
//   const options = []
//   for (let i = 1; i <= 60; i++) {
//     options.push(i);
//   }

//   setIntervalTimemin(options)
// }

// useEffect(() => {
//   generateTimeIntervalInMinutes()
// }, [])

// const [intervalTime, setIntervalTime] = useState("")
// const [intervalTimeDrop, setIntervalTimeDrop] = useState(false)

// const intervalTimeDropHandler = () => {
//   setIntervalTimeDrop((prev) => !prev)
// }

// const setIntervalTimeHandler = (value) => {
//   setIntervalTime(value)
//   setIntervalTimeDrop(false)
// }

// const salonOffDaysData = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday"
// ];

// const [salonoffdayOpen, setSalonoffdayOpen] = useState(false)

// const [selectedSalonOffdays, setSelectedSalonOffdays] = useState([])


// const selectSalonOffdayHandler = (offday) => {
//   if (selectedSalonOffdays.includes(offday)) {
//     setSelectedSalonOffdays(prevState => prevState.filter(day => day !== offday));
//   } else {
//     setSelectedSalonOffdays(prevState => [...prevState, offday]);
//   }
// };

// const updateSalonAppointment = () => {
//   const appointmentdata = {
//     salonId: selectedSalonId,
//     appointmentSettings: {
//       startTime,
//       endTime,
//       intervalInMinutes: intervalTime
//     },
//     appointmentAdvanceDays: selectedAdvanceDays,
//     salonOffDays: selectedSalonOffdays
//   }

//   // console.log(appointmentdata)

//   dispatch(adminUpdateSalonSettingsAction(appointmentdata, setOpenSalonSettings, email))
// }

// const handleKeyPress = (e) => {
//   if (e.key === "Enter") {
//     updateSalonAppointment();
//   }
// };

// const adminUpdateSalonSettings = useSelector(state => state.adminUpdateSalonSettings)

// const {
//   loading: adminUpdateSalonSettingsLoading,
// } = adminUpdateSalonSettings

// const [paymentType, setPaymentType] = useState("Free")

// //Payment Code

// const makePayment = async (product) => {

//   try {
//     const stripe = await loadStripe('pk_test_51QiEoiBFW0Etpz0PujBksQP2p8rCRaq1gXfFfbM48EohSKBOKorS1tyPrV0QU4TNEoJONsLK2rOkXITDUltlysdQ00LZX8pnZm');

//     const response = await axios.post("https://iqb-final.onrender.com/api/create-checkout-session", product)

//     if (response.data && response.data.session && response.data.session.id) {
//       await stripe.redirectToCheckout({
//         sessionId: response.data.session.id,
//       });

//     } else {
//       console.error("Invalid session data: ", response.data);
//     }

//   } catch (error) {
//     console.log(error)
//   }
// }


// const [paymentModalOpen, setPaymentModalOpen] = useState(false)

// const buyHandler = () => {
//   setOpenSalonSettings(false)
//   setPaymentModalOpen(true)
// }

// const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

// const {
//   loading: adminGetDefaultSalonLoading,
//   resolve: adminGetDefaultSalonResolve,
//   response: adminGetDefaultSalonResponse
// } = adminGetDefaultSalon

// useEffect(() => {
//   if (adminGetDefaultSalonResponse) {
//     setServicesData((prev) => {
//       const updatedArray = prev.map((s) => {
//         return { ...s, currency: adminGetDefaultSalonResponse?.isoCurrencyCode }
//       })
//       return updatedArray
//     })
//   }
// }, [adminGetDefaultSalonResponse])

// // const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])

// // useEffect(() => {
// //   if (adminProfile) {
// //     setAppointmentCheck(adminProfile?.isAppointments)
// //     setQueueingCheck(adminProfile?.isQueueing)
// //   }
// // }, [adminProfile])

// const [appointmentCheck, setAppointmentCheck] = useState(false)
// const [queueingCheck, setQueueingCheck] = useState(false)

// const [servicesData, setServicesData] = useState([
//   {
//     id: 1,
//     name: "Appointment",
//     value: false,
//     price: 300,
//     quantity: 1
//   },
//   {
//     id: 2,
//     name: "Queueing",
//     value: false,
//     price: 200,
//     quantity: 1
//   }
// ])

// const [planValidityDate, setPlanValidityDate] = useState(30)

// const totalPrice = servicesData.reduce(
//   (total, item) => (item.value ? total + item.price : total),
//   0
// );

// const [cartData, setCartData] = useState([])

// const paymentHandler = () => {

//   if (cartData.length > 0) {
//     const paymentData = {
//       productInfo: {
//         salonId: selectedSalonId,
//         adminEmail: email,
//         paymentType: "Paid",
//         paymentExpiryDate: planValidityDate,
//         isQueuing: queueingCheck,
//         isAppointments: appointmentCheck,
//         products: cartData.map(service => {
//           const { value, id, ...rest } = service;
//           return rest;
//         })
//       }
//     }

//     // console.log("old ", paymentData)

//     makePayment(paymentData)
//   } else {
//     toast.error("Please select a product !", {
//       duration: 3000,
//       style: {
//         fontSize: "var(--font-size-2)",
//         borderRadius: '0.3rem',
//         background: '#333',
//         color: '#fff',
//       },
//     });
//   }

// }

// const freePaymentHandler = async () => {
//   const paymentData = {
//     salonId: selectedSalonId,
//     isTrailEnabled: true,
//     trailStartDate: new Date().toISOString().split("T")[0]
//   }

//   const { data } = await api.post("/api/salon/salonTrailPeriod", paymentData)

//   window.location.reload()
// }

// const [advanceAppointmentdaysOpen, setAdvanceAppointmentdaysOpen] = useState(false)

// const maximumAppointmentdaysdata = [
//   7, 14, 21, 28, 35, 42
// ]

// const [selectedAdvanceDays, setSelectedAdvanceDays] = useState(0)

//   return (
//     <div className={`${style.salon_wrapper} ${darkmodeOn && style.dark}`}>
//       <div>
//         <p>Salon List</p>
//         <button onClick={createSalonClicked}>
//           <p>Create</p>
//           <div>+</div>
//         </button>
//       </div>

//       <div className={`${style.salon_content_wrapper} ${darkmodeOn && style.dark}`}>

//         {
//           getAdminSalonListLoading ? (
//             <div className={`${style.salon_content_body} ${darkmodeOn && style.dark}`}>
// <Skeleton
//   count={6}
//   height={"6rem"}
//   baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//   highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//   style={{ marginBottom: "1rem" }} />
//             </div>
//           ) : getAdminSalonListResolve && SalonList?.length > 0 ? (
//             <div className={`${style.salon_content_body} ${darkmodeOn && style.dark}`}>
//               <div>
//                 <p>Salon Name</p>
//                 <p>Address</p>
//                 <p>City</p>
//                 <p>Salon Type</p>
//                 <p>Edit</p>
//                 {/* <p>Delete</p> */}
//                 <p>Setting</p>
//               </div>

//               {SalonList.map((s, index) => (
//                 <div key={s?._id}
//                   style={{
//                     borderBottom: SalonList.length - 1 === index && "none"
//                   }}
//                 >
//                   <p>{s?.salonName.length > 18 ? s?.salonName.slice(0, 18) + "..." : s?.salonName}</p>
//                   <p>{s?.address.length > 18 ? s?.address.slice(0, 18) + "..." : s?.address}</p>
//                   <p>{s?.city.length > 18 ? s?.city.slice(0, 18) + "..." : s?.city}</p>
//                   <p>{s?.salonType}</p>
//                   <div>
//                     <button onClick={() => editButtonClicked(s)}>Edit</button>
//                   </div>
//                   {/* <div>
//                     <button onClick={() => deleteSalonHandler(s.salonId, s._id)}>Delete</button>
//                   </div> */}
//                   <div>
//                     <button onClick={() => salonappointmentClicked(s)}>Setting</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className={`${style.salon_content_body_error} ${darkmodeOn && style.dark}`}>
//               <p>No salon available</p>
//             </div>
//           )
//         }


// <Modal
//   open={openSalonSettings}
//   onClose={() => {
//     setEndTimeHandler(false)
//     setStartTimeHandler(false)
//     setIntervalTimeHandler(false)
//     setOpenSalonSettings(false)
//   }}
//   aria-labelledby="modal-modal-title"
//   aria-describedby="modal-modal-description"
// >
//   <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
//     <div>
//       <p>Salon Settings</p>
//       <button onClick={() => setOpenSalonSettings(false)}><CloseIcon /></button>
//     </div>

//     <div className={style.modal_content_container}>
//       <div className={style.time_container}>
//         <p>Start Time</p>
//         <input
//           type="text"
//           value={`${startTime ? `${startTime} hr` : ''}`}
//           onClick={() => startTimeDropHandler()}
//           onKeyDown={handleKeyPress}
//           readOnly
//         />

//         {startTimeDrop && (
//           <ClickAwayListener onClickAway={() => setStartTimeDrop(false)}>
//             <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
//               {timeOptions.map((option) => (
//                 <p key={option.value} onClick={() => setStartTimeHandler(option.value)}>
//                   {option.value} hr
//                 </p>
//               ))}
//             </div>
//           </ClickAwayListener>
//         )}
//       </div>


//       <div className={style.time_container}>
//         <p>End Time</p>
//         <input
//           type="text"
//           value={`${endTime ? `${endTime} hr` : ''}`}
//           onClick={() => endTimeDropHandler()}
//           onKeyDown={handleKeyPress}
//           readOnly
//         />

//         {endTimeDrop && (
//           <ClickAwayListener onClickAway={() => setEndTimeHandler(false)}>
//             <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
//               {timeOptions.map((option) => (
//                 <p key={option.value} onClick={() => setEndTimeHandler(option.value)}>
//                   {option.value} hr
//                 </p>
//               ))}
//             </div>
//           </ClickAwayListener>
//         )}
//       </div>


//       <div className={style.time_container}>
//         <p>Interval Time</p>
//         <input
//           type="text"
//           value={`${intervalTime ? `${intervalTime} mins` : ''}`}
//           onClick={() => intervalTimeDropHandler()}
//           onKeyDown={handleKeyPress}
//           readOnly
//         />

//         {intervalTimeDrop &&
//           <ClickAwayListener onClickAway={() => setIntervalTimeHandler(false)}>
//             <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
//               {intervalTimemin.map((option) => (
//                 <p key={option} value={option} onClick={() => setIntervalTimeHandler(option)}>
//                   {option} mins
//                 </p>
//               ))}
//             </div>
//           </ClickAwayListener>}
//       </div>

//       <div className={style.time_container}>
//         <p>Salon Off Days</p>
//         <input
//           type="text"
//           value={selectedSalonOffdays.map((s) => s)}
//           onClick={() => setSalonoffdayOpen((prev) => !prev)}
//           onKeyDown={handleKeyPress}
//           readOnly
//         />

//         {salonoffdayOpen &&
//           <ClickAwayListener onClickAway={() => setSalonoffdayOpen(false)}>
//             <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
//               {salonOffDaysData.map((offday) => (
//                 <p key={offday}
//                   className={style.dayoff_div}
//                 >
//                   {offday}
//                   {
//                     selectedSalonOffdays.find((c) => c === offday) ? (<button onClick={() => selectSalonOffdayHandler(offday)} className={style.delete_btn}>Delete</button>) : (<button onClick={() => selectSalonOffdayHandler(offday)} className={style.add_btn}>Add</button>)
//                   }
//                 </p>
//               ))}
//             </div>
//           </ClickAwayListener>}
//       </div>

//       <div className={style.time_container}>
//         <p>Maximum Appointment Days</p>
//         <input
//           type="text"
//           value={`${selectedAdvanceDays ? `${selectedAdvanceDays} days` : ''}`}
//           onClick={() => setAdvanceAppointmentdaysOpen(true)}
//           onKeyDown={handleKeyPress}
//           readOnly
//         />

//         {advanceAppointmentdaysOpen &&
//           <ClickAwayListener onClickAway={() => setAdvanceAppointmentdaysOpen(false)}>
//             <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
//               {maximumAppointmentdaysdata.map((option) => (
//                 <p key={option} value={option} onClick={() => {
//                   setSelectedAdvanceDays(option)
//                   setAdvanceAppointmentdaysOpen(false)
//                 }}>
//                   {option} days
//                 </p>
//               ))}
//             </div>
//           </ClickAwayListener>}
//       </div>

//       <div style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between"
//       }}>
//         {/* <button className={style.salon_settings_btn}
//           // onClick={adminProfile?.vendorAccountDetails?.vendorTransferStatus === "active" ? buyHandler : () => {
//           //   toast.error("You don't have any Stripe Account. Go to profile and create a stripe account", {
//           //     duration: 3000,
//           //     style: {
//           //       fontSize: "var(--font-size-2)",
//           //       borderRadius: '0.3rem',
//           //       background: '#333',
//           //       color: '#fff',
//           //     },
//           //   });
//           // }}

//           onClick={buyHandler}
//         >
//           {renew ? "Renewal" : "Buy"}
//         </button> */}

//         {
//           adminUpdateSalonSettingsLoading ? <button className={style.salon_settings_btn}><ButtonLoader /></button> : <button className={style.salon_settings_btn} onClick={updateSalonAppointment}>Update</button>
//         }

//       </div>

//     </div>
//   </div>
// </Modal>


//         <Modal
//           open={paymentModalOpen}
//           onClose={() => {
//             setPaymentModalOpen(false)
//             setServicesData([
//               {
//                 id: 1,
//                 name: "Appointment",
//                 value: false,
//                 price: 300,
//                 currency: "usd",
//                 quantity: 1
//               },
//               {
//                 id: 2,
//                 name: "Queueing",
//                 value: false,
//                 price: 200,
//                 currency: "usd",
//                 quantity: 1
//               }
//             ])
//             setAppointmentCheck(false)
//             setQueueingCheck(false)
//           }}

//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <div className={`${style.modal_payment_container} ${darkmodeOn && style.dark}`}>
//             <div>
//               <p>Buy Services</p>
//               <button onClick={() => setPaymentModalOpen(false)}><CloseIcon /></button>
//             </div>

//             <div className={`${style.modal_payment_content_container} ${darkmodeOn && style.dark}`}>
//               <div>
//                 <p>Total</p>
//                 <p>{paymentType === "Free" ? `${currentSalonCurrency}0` : `${currentSalonCurrency}${totalPrice}`}</p>
//               </div>

//               <div>
//                 {
//                   servicesData.map((s) => {
//                     return (
//                       <div key={s.id}>
//                         <div>
//                           <input
//                             type="checkbox"
//                             checked={s.value}
//                             onChange={() => {
//                               setServicesData((prev) => {
//                                 const updatedArray = prev.map((b) => {
//                                   if (b.id === s.id) {
//                                     const newValue = !b.value;

//                                     if (b.name === "Appointment") {
//                                       setAppointmentCheck(newValue);
//                                     } else if (b.name === "Queueing") {
//                                       setQueueingCheck(newValue);
//                                     }

//                                     return { ...b, value: newValue };
//                                   }
//                                   return b;
//                                 });
//                                 return updatedArray
//                               })

//                               setCartData((prev) => {
//                                 const isItemInCart = cartData.some((item) => item.id === s.id);

//                                 if (!s.value && !isItemInCart) {
//                                   // Add to cart when checked
//                                   return [...prev, s];
//                                 } else if (s.value && isItemInCart) {
//                                   // Remove from cart when unchecked
//                                   return prev.filter((item) => item.id !== s.id);
//                                 }

//                                 return prev;
//                               });
//                             }}
//                           />
//                           <p>{s.name}</p>
//                         </div>

//                         <p>{paymentType === "Free" ? `${currentSalonCurrency}0` : `${currentSalonCurrency}${s.price}`}</p>
//                       </div>
//                     )
//                   })
//                 }

//               </div>

//               <div>
//                 <p>Plan Validity</p>
//                 <p>{paymentType === "Free" ? 14 : planValidityDate}days</p>
//               </div>

//               <div
//                 value={paymentType}
//                 onChange={(e) => setPaymentType(e.target.value)}
//               >
//                 <p>Type</p>
//                 <select name="" id="">
//                   <option value="Free">Free</option>
//                   <option value="Paid">Paid</option>
//                 </select>

//               </div>

//               <div>
//                 <p>Use this dummy card information for payment testing.</p>
//                 <p>Dummy card: 4242 4242 4242 4242</p>
//                 <p>MM/YY: 03/34</p>
//                 <p>CVC: 456</p>
//               </div>

//               {
//                 paymentType === "Free" ?
//                   (<button className={style.salon_payment_btn} onClick={freePaymentHandler}>Free</button>) :
//                   (<button className={style.salon_payment_btn} onClick={paymentHandler}>Pay {adminGetDefaultSalonResponse?.currency}{totalPrice}</button>)
//               }
//             </div>
//           </div>

//         </Modal>

//       </div>

//     </div>
//   )
// }

// export default SalonList


import React, { useEffect, useRef, useState } from 'react'
import style from "./SalonList.module.css"
import { AppointmentIcon, CloseIcon, DropdownIcon, OffAppointmentIcon, OfflineIcon, OnlineIcon, QueueIcon, QueueOfflineIcon, QueueOnlineIcon, SalonThreeDotsIcon, SortDownIcon, SortUpDownArrowIcon, SortUpIcon } from '../../../newicons';
import { ClickAwayListener, FormControl, MenuItem, Modal, Pagination, Select, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import styled from "@emotion/styled";
import { useDispatch, useSelector } from 'react-redux';
import { adminGetDefaultSalonAction } from '../../../Redux/Admin/Actions/AdminHeaderAction'
import { adminDeleteSalonAction, adminUpdateSalonSettingsAction, getAdminSalonListAction } from '../../../Redux/Admin/Actions/SalonAction'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
import Skeleton from 'react-loading-skeleton';
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader';
import { Settingsicon } from '../../../icons';

const SalonList = () => {

  const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])

  const email = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)
  const currentsalonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createSalonClicked = () => {
    dispatch({
      type: "ADMIN_CREATE_SALON_SUCCESS",
    })
    navigate("/admin-salon/createsalon")
  }

  const SalonListControllerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    SalonListControllerRef.current = controller;

    dispatch(getAdminSalonListAction(email, controller.signal));

    return () => {
      if (SalonListControllerRef.current) {
        SalonListControllerRef.current.abort();
      }
    };
  }, [email, dispatch]);

  const getAdminSalonList = useSelector(state => state.getAdminSalonList)

  const {
    loading: getAdminSalonListLoading,
    resolve: getAdminSalonListResolve,
    salons: SalonList
  } = getAdminSalonList



  const editButtonClicked = (salon) => {
    navigate(`/admin-salon/editsalon/${salon?.salonId}`, { state: salon })
  }

  const deleteSalonHandler = (salonId, id) => {
    if (currentsalonId == salonId) {
      toast.error("You are currently in this salon", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      const confirm = window.confirm("Are you sure ?")
      if (confirm) {
        dispatch(adminDeleteSalonAction(salonId, id))
      }
    }
  }



  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"


  const [openSalonSettings, setOpenSalonSettings] = useState(false)

  const [selectedSalonId, setSelectedSalonId] = useState(null)

  const [currentSalonCurrency, setCurrentSalonCurrency] = useState("")

  const [renew, setRenew] = useState(false)
  const [trialExpiry, setTrialExpiry] = useState(false)

  const salonappointmentClicked = (salon) => {
    setSelectedSalonId(salon?.salonId)
    setStartTime(salon?.appointmentSettings?.appointmentStartTime)
    setEndTime(salon?.appointmentSettings?.appointmentEndTime)
    setIntervalTime(salon?.appointmentSettings?.intervalInMinutes)
    setOpenSalonSettings(true)
    setPaymentModalOpen(false)
    setSelectedAdvanceDays(salon?.appointmentAdvanceDays)
    setCurrentSalonCurrency(salon?.currency)
    setSelectedSalonOffdays(salon?.salonOffDays)
    setRenew(salon?.isRenew)
    setTrialExpiry(salon?.trailExpiryDate)
  }

  const [timeOptions, setTimeOptions] = useState([]);

  const addLeadingZero = (num) => (num < 10 ? '0' : '') + num;

  const generateTimeOptions = () => {
    const options = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = addLeadingZero(hour) + ':' + addLeadingZero(minute);
        options.push({ value: time, label: time });
      }
    }

    setTimeOptions(options);
  };

  useEffect(() => {
    generateTimeOptions();
  }, [])



  const [startTime, setStartTime] = useState("")
  const [startTimeDrop, setStartTimeDrop] = useState(false)

  const startTimeDropHandler = () => {
    setStartTimeDrop((prev) => !prev)
  }

  const setStartTimeHandler = (value) => {
    setStartTime(value)
    setStartTimeDrop(false)
  }

  const [endTime, setEndTime] = useState("")
  const [endTimeDrop, setEndTimeDrop] = useState(false)

  const endTimeDropHandler = () => {
    setEndTimeDrop((prev) => !prev)
  }

  const setEndTimeHandler = (value) => {
    setEndTime(value)
    setEndTimeDrop(false)
  }


  const [intervalTimemin, setIntervalTimemin] = useState([])

  const generateTimeIntervalInMinutes = () => {
    const options = []
    for (let i = 1; i <= 60; i++) {
      options.push(i);
    }

    setIntervalTimemin(options)
  }

  useEffect(() => {
    generateTimeIntervalInMinutes()
  }, [])

  const [intervalTime, setIntervalTime] = useState("")
  const [intervalTimeDrop, setIntervalTimeDrop] = useState(false)

  const intervalTimeDropHandler = () => {
    setIntervalTimeDrop((prev) => !prev)
  }

  const setIntervalTimeHandler = (value) => {
    setIntervalTime(value)
    setIntervalTimeDrop(false)
  }

  const salonOffDaysData = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const [salonoffdayOpen, setSalonoffdayOpen] = useState(false)

  const [selectedSalonOffdays, setSelectedSalonOffdays] = useState([])


  const selectSalonOffdayHandler = (offday) => {
    if (selectedSalonOffdays.includes(offday)) {
      setSelectedSalonOffdays(prevState => prevState.filter(day => day !== offday));
    } else {
      setSelectedSalonOffdays(prevState => [...prevState, offday]);
    }
  };

  const updateSalonAppointment = () => {
    const appointmentdata = {
      salonId: selectedSalonId,
      appointmentSettings: {
        startTime,
        endTime,
        intervalInMinutes: intervalTime
      },
      appointmentAdvanceDays: selectedAdvanceDays,
      salonOffDays: selectedSalonOffdays
    }

    dispatch(adminUpdateSalonSettingsAction(appointmentdata, setOpenSalonSettings, email))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updateSalonAppointment();
    }
  };

  const adminUpdateSalonSettings = useSelector(state => state.adminUpdateSalonSettings)

  const {
    loading: adminUpdateSalonSettingsLoading,
  } = adminUpdateSalonSettings

  const [paymentType, setPaymentType] = useState("Free")

  //Payment Code

  const makePayment = async (product) => {

    try {
      const stripe = await loadStripe('pk_test_51QiEoiBFW0Etpz0PujBksQP2p8rCRaq1gXfFfbM48EohSKBOKorS1tyPrV0QU4TNEoJONsLK2rOkXITDUltlysdQ00LZX8pnZm');

      const response = await axios.post("https://iqb-final.onrender.com/api/create-checkout-session", product)

      if (response.data && response.data.session && response.data.session.id) {
        await stripe.redirectToCheckout({
          sessionId: response.data.session.id,
        });

      } else {
        console.error("Invalid session data: ", response.data);
      }

    } catch (error) {
      console.log(error)
    }
  }


  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const buyHandler = () => {
    setOpenSalonSettings(false)
    setPaymentModalOpen(true)
  }

  const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

  const {
    loading: adminGetDefaultSalonLoading,
    resolve: adminGetDefaultSalonResolve,
    response: adminGetDefaultSalonResponse
  } = adminGetDefaultSalon

  useEffect(() => {
    if (adminGetDefaultSalonResponse) {
      setServicesData((prev) => {
        const updatedArray = prev.map((s) => {
          return { ...s, currency: adminGetDefaultSalonResponse?.isoCurrencyCode }
        })
        return updatedArray
      })
    }
  }, [adminGetDefaultSalonResponse])


  const [appointmentCheck, setAppointmentCheck] = useState(false)
  const [queueingCheck, setQueueingCheck] = useState(false)

  const [servicesData, setServicesData] = useState([
    {
      id: 1,
      name: "Appointment",
      value: false,
      price: 300,
      quantity: 1
    },
    {
      id: 2,
      name: "Queueing",
      value: false,
      price: 200,
      quantity: 1
    }
  ])

  const [planValidityDate, setPlanValidityDate] = useState(30)

  const totalPrice = servicesData.reduce(
    (total, item) => (item.value ? total + item.price : total),
    0
  );

  const [cartData, setCartData] = useState([])

  const paymentHandler = () => {

    if (cartData.length > 0) {
      const paymentData = {
        productInfo: {
          salonId: selectedSalonId,
          adminEmail: email,
          paymentType: "Paid",
          paymentExpiryDate: planValidityDate,
          isQueuing: queueingCheck,
          isAppointments: appointmentCheck,
          products: cartData.map(service => {
            const { value, id, ...rest } = service;
            return rest;
          })
        }
      }

      // console.log("old ", paymentData)

      makePayment(paymentData)
    } else {
      toast.error("Please select a product !", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    }

  }

  const freePaymentHandler = async () => {
    const paymentData = {
      salonId: selectedSalonId,
      isTrailEnabled: true,
      trailStartDate: new Date().toISOString().split("T")[0]
    }

    const { data } = await api.post("/api/salon/salonTrailPeriod", paymentData)

    window.location.reload()
  }

  const [advanceAppointmentdaysOpen, setAdvanceAppointmentdaysOpen] = useState(false)

  const maximumAppointmentdaysdata = [
    7, 14, 21, 28, 35, 42
  ]

  const [selectedAdvanceDays, setSelectedAdvanceDays] = useState(0)

  // ========================================================

  const headRows = [
    { id: 1, heading: "#", key: "" },
    { id: 2, heading: "Name", key: "salonName" },
    { id: 3, heading: "Address", key: "address" },
    { id: 4, heading: "City", key: "city" },
    { id: 5, heading: "Type", key: "salonType" },
    // { id: 6, heading: "Subscription", key: "subscription" },
    { id: 7, heading: "Status", key: "" },
    { id: 8, heading: "", key: "" },
  ];


  const [salonlistData, setSalonlistData] = useState([])

  useEffect(() => {
    if (getAdminSalonListResolve && SalonList.length > 0) {
      setSalonlistData(SalonList.map((item, index) => {
        return { ...item, currentId: (index + 1) }
      }))
    }

  }, [SalonList])

  const [settingsIndex, setSettingsIndex] = useState("")

  const [rowsPerPage, SetRowsPerPage] = useState(10)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowsPerPage)
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortColumn, setSortColumn] = useState("")

  const [salonPaginationData, setSalonPaginationData] = useState([])

  useEffect(() => {
    if (salonlistData.length > 0) {
      setSalonPaginationData(salonlistData.slice(startIndex, endIndex))
    }
  }, [salonlistData])

  useEffect(() => {
    const totalPages = Math.ceil(salonlistData.length / rowsPerPage);
    setTotalPages(totalPages);
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, salonlistData.length);
    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setSalonPaginationData(salonlistData.slice(startIndex, endIndex));
  }, [salonlistData, page, rowsPerPage]);


  const handleChange = (event, value) => {
    setPage(value);
  }

  const sortFunction = (columnKey) => {
    setSortOrder((prev) => (sortColumn === columnKey && prev === 'asc' ? 'desc' : 'asc'));
    setSortColumn(columnKey);
  };

  useEffect(() => {
    if (!sortColumn) return;

    const sortedList = [...salonlistData].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    setSalonlistData(sortedList);
    // setPage(1); 
  }, [sortColumn, sortOrder]);

  const [selectOpen, setSelectOpen] = useState(false)

  const [mobileSettingIndex, setMobileSettingIndex] = useState("")

  return (
    <section className={`${style.section}`}>
      <div>
        <h2>Salon List</h2>
        <button onClick={createSalonClicked}>Create</button>
      </div>

      <div className={`${style.list_container}`}>

        {
          getAdminSalonListLoading ? (
            <div className={`${style.list_body_container_loader}`}>
              <Skeleton
                count={6}
                height={"6.5rem"}
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
                style={{ marginBottom: "1rem" }} />
            </div>
          ) : getAdminSalonListResolve && SalonList.length > 0 ? (
            <div className={`${style.list_body_container}`}>

              <div className={`${style.headRow}`}>
                {
                  headRows.map((item, index) => {
                    return (
                      <div key={item.id}>
                        <button
                          className={`${item.key === "name" ? style.name_head_btn : ""}`}
                          onClick={() => sortFunction(item.key)}>
                          {item.key === "name" ? (
                            <>
                              <span></span>
                              {item.heading}
                            </>
                          ) : (
                            item.heading
                          )}

                          <span>{item.key && (sortColumn === item.key ? (sortOrder === 'asc' ? <SortUpIcon /> : <SortDownIcon />) : <SortUpDownArrowIcon />)}</span>
                        </button>
                      </div>
                    )
                  })
                }

              </div>
              {
                salonPaginationData.map((item, index) => {
                  return (
                    <div key={item.salonId} style={{ borderBottom: (index === endIndex - 1) || (index === salonPaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                      <div><p>{item?.currentId}</p></div>
                      <div>
                        <div>
                          <div><img src={item.salonLogo?.[0]?.url} alt="" /></div>
                          <p>{item.salonName}</p>
                        </div>
                      </div>
                      <div><p>{item.address}</p></div>
                      <div><p>{item.city}</p></div>
                      <div><p>{item.salonType}</p></div>
                      {/* <div><p>{item.subscription}</p></div> */}
                      <div><button style={{
                        backgroundColor: item.isOnline ? "#052E16" : "#450a0a",
                        cursor: "initial"
                      }}>{item.isOnline ? "Online" : "Offline"}</button></div>
                      <div>
                        <div
                          style={{
                            position: settingsIndex === index ? "relative" : "initial",
                            backgroundColor: settingsIndex === index ? "var(--btn-primary-hover)" : null,
                            borderRadius: settingsIndex === index ? "var(--border-radius-primary)" : null,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSettingsIndex(index);
                          }}>
                          <SalonThreeDotsIcon />

                          {
                            settingsIndex === index && (
                              <ClickAwayListener onClickAway={() => setSettingsIndex(null)}>
                                <div
                                  style={{
                                    position: "absolute",
                                    zIndex: settingsIndex === index ? 20 : -100,
                                  }}
                                  className={`${style.settings_container}`}>
                                  <p><Link
                                    onClick={(e) => {
                                      e.preventDefault()
                                      salonappointmentClicked(item)
                                    }}
                                  >Appointment settings</Link></p>
                                  <p><Link
                                    onClick={(e) => {
                                      e.preventDefault()
                                      editButtonClicked(item)
                                    }}
                                  >Edit Salon</Link></p>
                                </div>
                              </ClickAwayListener>)
                          }

                        </div>

                      </div>

                    </div>
                  )
                })
              }
            </div>
          ) : (
            <div className={`${style.list_body_container_error}`}>
              <p>No salons available</p>
            </div>
          )
        }


        <div className={`${style.pagination_container}`}>
          <div></div>
          <div>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "var(--text-primary)",
                  fontSize: "1.4rem",
                },
                "& .Mui-selected": { backgroundColor: "var(--bg-secondary) !important", color: "var(--btn-text-color)" },
              }}
            />
          </div>
          <div>
            <div>
              <p>Rows Per Page</p>

              <ClickAwayListener onClickAway={() => setSelectOpen(false)}>
                <div className={`${style.select_container}`}>
                  <div onClick={() => setSelectOpen((prev) => !prev)}>
                    <input type="text" value={rowsPerPage} readOnly />
                    <div><DropdownIcon /></div>
                  </div>

                  {
                    selectOpen ? (<ul>
                      {
                        [10, 20, 30, 50].map((item, index) => {
                          return (
                            <li key={item} onClick={() => {
                              setPage(1)
                              SetRowsPerPage(item)
                              setSelectOpen(false)
                            }}
                              style={{
                                background: item === rowsPerPage ? "var(--bg-secondary)" : null,
                                color: item === rowsPerPage ? "var(--btn-text-color)" : null,
                                borderBottom: index === [10, 20, 30, 50].length - 1 ? "none" : "0.1rem solid var(--border-secondary)"
                              }}
                            >{item}</li>
                          )
                        })
                      }

                    </ul>) : (null)
                  }
                </div>
              </ClickAwayListener>

            </div>
            <div>
              <p>{startIndex} - {endIndex}{" "} of {totalPages}</p>
            </div>

          </div>
        </div>
      </div>

      {
        getAdminSalonListLoading ? (
          <div className={style.list_container_mobile_loader}>
            <Skeleton
              count={6}
              height={"19.5rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }} />
          </div>
        ) : getAdminSalonListResolve && SalonList.length > 0 ? (
          <div className={style.list_container_mobile}>

            {
              SalonList?.map((item, index) => {
                return (
                  <div className={style.list_mobile_item} key={item.salonId}>
                    <div>
                      <img src={item.salonLogo?.[0]?.url} alt="" width={50} height={50} />
                      <div>
                        <p>{item.salonName}</p>
                        <p>{item.salonEmail}</p>
                        <p>{item.address}, {item.city}, {item.country}</p>
                        <p>+{item.mobileCountryCode} {item.contactTel}</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div>{item.isOnline ? <OnlineIcon color={"1ADB6A"} /> : <OfflineIcon color={"FC3232"} />}</div>
                        <p>{item.isOnline ? "Online" : "Offline"}</p>
                      </div>

                      <div>
                        <div onClick={() => navigate("/admin-subscription")}>{item.isAppointments ? <AppointmentIcon color={"1ADB6A"} /> : <OffAppointmentIcon color={"FC3232"} />}</div>
                        <p>Appointment</p>
                      </div>

                      <div>
                        <div onClick={() => navigate("/admin-subscription")}>{item.isQueuing ? <QueueOnlineIcon color={"1ADB6A"} /> : <QueueOfflineIcon color={"FC3232"} />}</div>
                        <p>Queue</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileSettingIndex(index)
                      }}><SalonThreeDotsIcon /></button>

                    {
                      mobileSettingIndex === index ? (
                        <ClickAwayListener onClickAway={() => setMobileSettingIndex("")}>
                          <ul>
                            <li
                              onClick={(e) => {
                                editButtonClicked(item)
                              }}
                            >Edit Salon</li>
                            <li
                              onClick={(e) => {
                                salonappointmentClicked(item)
                              }}
                            >Appointment Settings</li>
                          </ul>
                        </ClickAwayListener>
                      ) : null
                    }

                  </div>
                )
              })
            }

          </div>
        ) : (
          <div className={style.list_container_mobile_error}>
            <p>No salon list available</p>
          </div>
        )
      }


      <Modal
        open={openSalonSettings}
        onClose={() => {
          setEndTimeHandler(false)
          setStartTimeHandler(false)
          setIntervalTimeHandler(false)
          setOpenSalonSettings(false)
          setSalonoffdayOpen(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
          <div>
            <p>Salon Settings</p>
            <button onClick={() => setOpenSalonSettings(false)}><CloseIcon /></button>
          </div>

          <div className={style.modal_content_container}>
            <div className={style.time_container}>
              <p>Start Time</p>
              <input
                type="text"
                value={`${startTime ? `${startTime} hr` : ''}`}
                onClick={() => startTimeDropHandler()}
                onKeyDown={handleKeyPress}
                readOnly
              />

              {startTimeDrop && (
                <ClickAwayListener onClickAway={() => setStartTimeDrop(false)}>
                  <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
                    {timeOptions.map((option) => (
                      <p key={option.value} onClick={() => setStartTimeHandler(option.value)}>
                        {option.value} hr
                      </p>
                    ))}
                  </div>
                </ClickAwayListener>
              )}
            </div>


            <div className={style.time_container}>
              <p>End Time</p>
              <input
                type="text"
                value={`${endTime ? `${endTime} hr` : ''}`}
                onClick={() => endTimeDropHandler()}
                onKeyDown={handleKeyPress}
                readOnly
              />

              {endTimeDrop && (
                <ClickAwayListener 
                onClickAway={() => setEndTimeDrop(false)}
                >
                  <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
                    {timeOptions.map((option) => (
                      <p key={option.value} onClick={() => setEndTimeHandler(option.value)}>
                        {option.value} hr
                      </p>
                    ))}
                  </div>
                </ClickAwayListener>
              )}
            </div>


            <div className={style.time_container}>
              <p>Interval Time</p>
              <input
                type="text"
                value={`${intervalTime ? `${intervalTime} mins` : ''}`}
                onClick={() => intervalTimeDropHandler()}
                onKeyDown={handleKeyPress}
                readOnly
              />

              {intervalTimeDrop &&
                <ClickAwayListener onClickAway={() => setIntervalTimeDrop(false)}>
                  <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
                    {intervalTimemin.map((option) => (
                      <p key={option} value={option} onClick={() => setIntervalTimeHandler(option)}>
                        {option} mins
                      </p>
                    ))}
                  </div>
                </ClickAwayListener>}
            </div>

            <div className={style.time_container}>
              <p>Salon Off Days</p>
              <input
                type="text"
                value={selectedSalonOffdays.map((s) => s)}
                onClick={() => setSalonoffdayOpen((prev) => !prev)}
                onKeyDown={handleKeyPress}
                readOnly
              />

              {salonoffdayOpen &&
                <ClickAwayListener onClickAway={() => setSalonoffdayOpen(false)}>
                  <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
                    {salonOffDaysData.map((offday) => (
                      <p key={offday}
                        className={style.dayoff_div}
                      >
                        {offday}
                        {
                          selectedSalonOffdays.find((c) => c === offday) ? (<button onClick={() => selectSalonOffdayHandler(offday)} className={style.delete_btn}>Delete</button>) : (<button onClick={() => selectSalonOffdayHandler(offday)} className={style.add_btn}>Add</button>)
                        }
                      </p>
                    ))}
                  </div>
                </ClickAwayListener>}
            </div>

            <div className={style.time_container}>
              <p>Maximum Appointment Days</p>
              <input
                type="text"
                value={`${selectedAdvanceDays ? `${selectedAdvanceDays} days` : ''}`}
                onClick={() => setAdvanceAppointmentdaysOpen(true)}
                onKeyDown={handleKeyPress}
                readOnly
              />

              {advanceAppointmentdaysOpen &&
                <ClickAwayListener onClickAway={() => setAdvanceAppointmentdaysOpen(false)}>
                  <div className={`${style.time_drop_container} ${darkmodeOn && style.dark}`}>
                    {maximumAppointmentdaysdata.map((option) => (
                      <p key={option} value={option} onClick={() => {
                        setSelectedAdvanceDays(option)
                        setAdvanceAppointmentdaysOpen(false)
                      }}>
                        {option} days
                      </p>
                    ))}
                  </div>
                </ClickAwayListener>}
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>

              {
                adminUpdateSalonSettingsLoading ? <button className={style.salon_settings_btn}><ButtonLoader /></button> : <button className={style.salon_settings_btn} onClick={updateSalonAppointment}>Update</button>
              }

            </div>

          </div>
        </div>
      </Modal>

    </section >
  )
}

export default SalonList

