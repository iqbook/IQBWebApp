// import React, { useEffect, useRef, useState } from 'react'
// import Skeleton from 'react-loading-skeleton'
// import style from './Dashboard.module.css'
// import { Carousel } from 'react-responsive-carousel';
// import { AddIcon, ChartIcon1, ChartIcon2, ChartIcon3, CheckIcon, ClockIcon, DeleteIcon } from '../../icons';
// import { ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts'

// import ButtonLoader from '../../components/ButtonLoader/ButtonLoader';
// import { useDispatch, useSelector } from 'react-redux';
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer';
// import { barberConnectSalonAction, barberDashboardSalonInfoAction, barberSalonStatusAction, connectSalonListAction } from '../../Redux/Barber/Actions/DashboardAction';
// import { getBarberQueueListAction } from '../../Redux/Barber/Actions/BarberQueueAction';
// import { getAdminSalonImagesAction } from '../../Redux/Admin/Actions/SalonAction';
// import toast from 'react-hot-toast';

// const Dashboard = () => {

//   const dispatch = useDispatch()

//   const salonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
//   const email = useSelector(state => state.BarberLoggedInMiddleware?.barberEmail)
//   const barberName = useSelector(state => state.BarberLoggedInMiddleware?.barberName)
//   const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

//   const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata)

//   useEffect(() => {
//     if (barberProfile?.user[0]?.isApproved == false) {
//       dispatch(connectSalonListAction())
//     }
//   }, [barberProfile])



//   const truncateText = (text, charecterLimit) => {
//     if (text?.length <= charecterLimit) {
//       return text;
//     }

//     let truncatedText = text?.slice(0, charecterLimit);

//     return truncatedText + '...'
//   }

//   const darkMode = useSelector(darkmodeSelector)

//   const darkmodeOn = darkMode === "On"

//   const connectSalonList = useSelector(state => state.connectSalonList)

//   const {
//     loading: connectSalonListLoading,
//     resolve: connectSalonListResolve,
//     response: connectSalonListResponse
//   } = connectSalonList

//   const [selectedSalonId, setSelectedSalonId] = useState("")

//   const [currentSelectedSalon, setCurrentSelectedSalon] = useState({})

//   useEffect(() => {
//     if (selectedSalonId) {
//       const currentSalon = connectSalonListResponse?.find((s) => s.salonId === selectedSalonId)
//       setCurrentSelectedSalon(currentSalon)
//     }

//   }, [selectedSalonId])


//   const [selectedServiceList, setSelectedServiceList] = useState([])
//   const [oldSalonServicelist, setOldSalonServiceList] = useState([])

//   useEffect(() => {
//     if (selectedSalonId) {
//       const selectedSalonServices = connectSalonListResponse.find((s) => s.salonId === selectedSalonId)?.services

//       setSelectedServiceList(selectedSalonServices)
//       setOldSalonServiceList(selectedSalonServices)
//       setBarberSelectedServices([])
//     }

//   }, [selectedSalonId])

//   const [barberSelectedServices, setBarberSelectedServices] = useState([])

//   const selectServiceHandler = (ser) => {
//     setBarberSelectedServices([...barberSelectedServices, { ...ser, barberServiceEWT: Number(ser.serviceEWT), serviceEWT: Number(ser.serviceEWT) }])
//   }

//   // const deleteServiceHandler = (ser) => {

//   //   setSelectedServiceList((prev) => {
//   //     const updatedArray = oldSalonServicelist.map((service) => {
//   //       return service.serviceId === ser.serviceId ? { ...service, serviceEWT: service.serviceEWT } : service
//   //     })
//   //     return updatedArray
//   //   })
//   //   setBarberSelectedServices((services) => services.filter((s) => s._id !== ser._id))
//   // }

//   const deleteServiceHandler = (ser) => {
//     setSelectedServiceList((prev) => {
//       const updatedArray = prev.map((service) => {
//         // Only reset the serviceEWT of the service being deleted
//         if (service.serviceId === ser.serviceId) {
//           const originalService = oldSalonServicelist.find(
//             (oldService) => oldService.serviceId === service.serviceId
//           );
//           return { ...service, serviceEWT: originalService?.serviceEWT || service.serviceEWT };
//         }
//         return service;
//       });
//       return updatedArray;
//     });

//     setBarberSelectedServices((services) =>
//       services.filter((s) => s._id !== ser._id)
//     );
//   };


//   const handleBarberEwt = (serId, value) => {
//     const newValue = value.replace(/[^0-9]/g, '');

//     setSelectedServiceList((prev) => {
//       const updatedArray = prev.map((service) => {
//         return service.serviceId === serId ? { ...service, serviceEWT: Number(newValue) } : service
//       })
//       return updatedArray
//     })

//     setBarberSelectedServices((prev) => {
//       const updatedArray = prev.map((service) => {
//         return service.serviceId === serId ? { ...service, barberServiceEWT: Number(newValue), serviceEWT: Number(newValue) } : service
//       })
//       return updatedArray
//     })
//   }

//   const connectSalonClicked = () => {
//     if (barberSelectedServices.length === 0) {
//       return toast.error("Please provide a service", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//     }

//     const connectSalondata = {
//       barberServices: barberSelectedServices,
//       email,
//       salonId: selectedSalonId
//     }

//     dispatch(barberConnectSalonAction(connectSalondata))
//   }

//   const barberConnectSalon = useSelector(state => state.barberConnectSalon)

//   const {
//     loading: barberConnectSalonLoading,
//     resolve: barberConnectSalonResolve,
//     message: barberConnectSalonMessage
//   } = barberConnectSalon


//   const queuelistcontrollerRef = useRef(new AbortController());

//   useEffect(() => {
//     if (barberProfile?.user[0]?.isApproved) {
//       const controller = new AbortController();
//       queuelistcontrollerRef.current = controller;

//       dispatch(getBarberQueueListAction(salonId, barberId, controller.signal));

//       return () => {
//         if (queuelistcontrollerRef.current) {
//           queuelistcontrollerRef.current.abort();
//         }
//       };
//     }
//   }, [salonId, dispatch]);

//   const getBarberQueueList = useSelector(state => state.getBarberQueueList)

//   const {
//     loading: getBarberQueueListLoading,
//     resolve: getBarberQueueListResolve,
//     queueList: BarberQueueList
//   } = getBarberQueueList


//   const [currentDate, setCurrentDate] = useState(new Date())


//   const barberDashboardSalonInfoRef = useRef(new AbortController())

//   useEffect(() => {
//     if (barberProfile?.user[0]?.isApproved && salonId != 0) {
//       const controller = new AbortController();
//       barberDashboardSalonInfoRef.current = controller;

//       dispatch(barberDashboardSalonInfoAction(salonId, controller.signal));

//       return () => {
//         if (barberDashboardSalonInfoRef.current) {
//           barberDashboardSalonInfoRef.current.abort();
//         }
//       };
//     }

//   }, [salonId, dispatch, barberProfile]);

//   const barberDashboardSalonInfo = useSelector(state => state.barberDashboardSalonInfo)

//   const {
//     loading: barberDashboardSalonInfoLoading,
//     resolve: barberDashboardSalonInfoResolve,
//     response: barberDashboardSalonInfoResponse
//   } = barberDashboardSalonInfo


//   //Salon Images

//   useEffect(() => {
//     if (barberProfile?.user[0]?.isApproved && salonId != 0) {
//       dispatch(getAdminSalonImagesAction(salonId))
//     }
//   }, [salonId, barberProfile])

//   const getAdminSalonImages = useSelector(state => state.getAdminSalonImages)

//   const {
//     loading: getAdminSalonImagesLoading,
//     resolve: getAdminSalonImagesResolve,
//     response: AdminSalonImages
//   } = getAdminSalonImages

//   const [openModal, setOpenModal] = useState(false)

//   // console.log(barberConnectSalonMessage)



//   const data2 = [
//     {
//       name: 'Page A',
//       uv: 4000,
//       pv: 2400,
//       amt: 2400,
//     },
//     {
//       name: 'Page B',
//       uv: 3000,
//       pv: 1398,
//       amt: 2210,
//     },
//     {
//       name: 'Page C',
//       uv: 2000,
//       pv: 9800,
//       amt: 2290,
//     },
//     {
//       name: 'Page D',
//       uv: 2780,
//       pv: 3908,
//       amt: 2000,
//     },
//     {
//       name: 'Page E',
//       uv: 1890,
//       pv: 4800,
//       amt: 2181,
//     },
//     {
//       name: 'Page F',
//       uv: 2390,
//       pv: 3800,
//       amt: 2500,
//     },
//     {
//       name: 'Page G',
//       uv: 3490,
//       pv: 4300,
//       amt: 2100,
//     },
//   ];

//   const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

//   const {
//     loading: adminGetDefaultSalonLoading,
//     resolve: adminGetDefaultSalonResolve,
//     response: adminGetDefaultSalonResponse
//   } = adminGetDefaultSalon

//   return (
//     barberProfile?.user[0]?.isApproved ?
//       <>
//         <main className={style.dashboard}>
//           <main className={style.dashboard_body}>
//             <div className={style.inner_container}>
//               <div className={style.dashboard_container_one}>
//                 <div className={`${style.saloninfo_container} ${darkmodeOn && style.dark}`}>
//                   <div>
//                     <h2>Welcome Back, {truncateText(barberName, 11)}</h2>
//                   </div>

//                   <div>
//                     {
//                       barberDashboardSalonInfoLoading ?
//                         <div style={{
//                           width: "100%",
//                           height: "100%",
//                           paddingTop: "2rem",
//                           paddingInline: "1rem"
//                         }}>
//                           <Skeleton count={1} height={"4rem"} style={{ borderRadius: "0.3rem" }}
//                             baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                             highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
//                         </div> :
//                         barberDashboardSalonInfoResolve && barberDashboardSalonInfoResponse ?
//                           <i>
//                             {truncateText(barberDashboardSalonInfoResponse, 200)}
//                           </i> :
//                           <i>
//                             You currently have no salon information
//                           </i>
//                     }

//                   </div>
//                 </div>

//                 {
//                   getAdminSalonImagesLoading ?
//                     <div className={style.salonadv_container_loader}>
//                       <Skeleton count={1} className={style.dashboard_advertise_loader} style={{ borderRadius: "0.6vw" }} 
//                       baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                       highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
//                     </div> :
//                     getAdminSalonImagesResolve && AdminSalonImages?.length > 0 ?
//                       <div className={`${style.salonadv_container} ${darkmodeOn && style.dark}`}>
//                         <Carousel
//                           showThumbs={false}
//                           infiniteLoop={true}
//                           autoPlay={true}
//                           interval={5000}
//                           showStatus={false}
//                           showArrows={false}
//                           stopOnHover={false}
//                           swipeable={false}
//                         >
//                           {
//                             AdminSalonImages?.slice(0, 5)?.map((item) => {
//                               return (
//                                 <div className={style.carousel_item_container} key={item._id}>
//                                   <img src={item.url} alt="image_item" />
//                                 </div>
//                               )
//                             })
//                           }
//                         </Carousel>
//                       </div> :
//                       <div className={style.salonadv_container_error}>
//                         <img src="./no-image.jpg" alt="no_image" />
//                       </div>
//                 }


//                 <div className={style.barber_report_container}>

//                   <div className={`${style.report_container} ${darkmodeOn && style.dark}`}>

//                     <Carousel
//                       showThumbs={false}
//                       infiniteLoop={true}
//                       autoPlay={true}
//                       interval={5000}
//                       showStatus={false}
//                       showArrows={false}
//                       stopOnHover={true}
//                       swipeable={true}
//                       renderIndicator={false}
//                     >

//                       <div className={style.r_chart}>
//                         <p>Report-Type One</p>
//                         <div>
//                           <ResponsiveContainer width="100%" height="90%" style={{}}>
//                             <BarChart width={150} height={40} data={data2}>
//                               <Bar dataKey="uv" fill="rgba(255, 0, 0, 0.393)" stroke="#000000" strokeWidth={1} />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </div>

//                         <div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Monthly Report</p>
//                           </div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Weekly Report</p>
//                           </div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Daily Report</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className={style.r_chart}>
//                         <p>Report-Type Two</p>
//                         <div>
//                           <ResponsiveContainer width="100%" height="90%" style={{}}>
//                             <BarChart width={150} height={40} data={data2}>
//                               <Bar dataKey="uv" fill="rgba(255, 149, 0, 0.419)" stroke="#000000" strokeWidth={1} />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </div>

//                         <div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Monthly Report</p>
//                           </div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Weekly Report</p>
//                           </div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Daily Report</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className={style.r_chart}>
//                         <p>Report-Type Three</p>
//                         <div>
//                           <ResponsiveContainer width="100%" height="90%" style={{}}>
//                             <BarChart width={150} height={40} data={data2}>
//                               <Bar dataKey="uv" fill="rgba(0, 0, 255, 0.438)" stroke="#000000" strokeWidth={1} />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </div>

//                         <div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Monthly Report</p>
//                           </div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Weekly Report</p>
//                           </div>
//                           <div>
//                             <div onClick={() => alert("Monthly Report")}></div>
//                             <p>Daily Report</p>
//                           </div>
//                         </div>
//                       </div>


//                     </Carousel>
//                   </div>
//                 </div>
//               </div>


//               <div className={style.dashboard_container_two}>
//                 <div className={`${style.queuelists_container} ${darkmodeOn && style.dark}`}>
//                   <div className={`${style.queue_header} ${darkmodeOn && style.dark}`}>
//                     <div><p>#</p></div>
//                     <div><p>Name</p></div>
//                     <div><p>Barber</p></div>
//                     <div><p>EWT</p></div>
//                   </div>

//                   {
//                     getBarberQueueListLoading ?
//                       <div className={style.queue_body_loading}>
//                         <Skeleton count={7} height={"6rem"} style={{ marginBottom: "1rem" }} 
//                         baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                         highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
//                       </div> :
//                       getBarberQueueListResolve && BarberQueueList?.length > 0 ?
//                         <div className={style.queue_body}>
//                           {
//                             BarberQueueList.map((queue, index) => {
//                               return (
//                                 <div
//                                   key={queue._id}
//                                   className={style.queue_item}
//                                   style={{
//                                     borderBottom: index === BarberQueueList.length - 1 ? "none" : "0.1rem solid rgba(0, 0, 0, 0.2)"
//                                   }}
//                                 >
//                                   <div><p>{index === 0 ? "Next" : queue.qPosition}</p></div>
//                                   <div><p>{queue.name.length > 6 ? `${queue.name.slice(0, 6).concat("...")}` : queue.name}</p></div>
//                                   <div><p>{queue.barberName.length > 6 ? `${queue.barberName.slice(0, 6).concat("...")}` : queue.barberName}</p></div>
//                                   <div><p>{queue.customerEWT === 0 ? "-" : queue.customerEWT + "mins"}</p></div>
//                                 </div>
//                               )
//                             })
//                           }
//                         </div> :
//                         <div className={style.queue_body_error}>
//                           <p>No queuelist available</p>
//                         </div>
//                   }

//                 </div>
//               </div>
//             </div>
//           </main>
//         </main >

//       </> :
//       <>
//         <div className={`${style.barber_connect_salon_container} ${darkmodeOn && style.dark}`}>
//           <p>Connect To Your Salon</p>
//           {
//             barberProfile?.user[0]?.approvePendingMessage ?
//               <div className={style.barber_approve_container}>
//                 <div>
//                   <p>{barberProfile?.user[0]?.approvePendingMessage}</p>
//                   <button onClick={() => window.location.reload()}>Reload</button>
//                 </div>
//               </div> :
//               <div className={`${style.barber_connect_salon_list_container} ${darkmodeOn && style.dark}`}>
//                 <div className={`${style.barber_connect_salon_list} ${darkmodeOn && style.dark}`}>
//                   <p>Choose Your Salon</p>
//                   <div>

//                     <div className={`${style.barber_connect_salon_list_header} ${darkmodeOn && style.dark}`}>
//                       <p>Salon Logo</p>
//                       <p>Salon Name</p>
//                       <p>Select</p>
//                     </div>

//                     {
//                       connectSalonListLoading ?
//                         <>
//                           <Skeleton count={4} height={"5rem"} style={{ marginBottom: "1rem" }}
//                             baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                             highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
//                         </> :
//                         connectSalonListResolve && connectSalonListResponse?.length > 0 ?
//                           connectSalonListResponse?.map((s) => (
//                             <div key={s.salonId} className={`${style.barber_connect_salon_list_body} ${darkmodeOn && style.dark}`}>
//                               <div><img src={s?.salonLogo?.[0]?.url} alt="salon_logo" /></div>
//                               <p>{s.salonName}</p>
//                               <div>{
//                                 selectedSalonId == s.salonId ? <button className={style.check_connect_btn}><CheckIcon /></button> : <button className={style.add_connect_btn} onClick={() => setSelectedSalonId(s.salonId)} >+</button>
//                               }</div>

//                             </div>
//                           ))
//                           :
//                           <div className={style.barber_connect_salon_list_error}>
//                             <p>No Salons Available</p>
//                           </div>
//                     }


//                   </div>
//                 </div>

//                 <div className={`${style.barber_list_services_list} ${darkmodeOn && style.dark}`}>
//                   <p>List of Services</p>
//                   <div>

//                     {
//                       selectedServiceList?.map((s) => {
//                         return (
//                           <div className={`${style.service_item} ${darkmodeOn && style.dark}`} key={s.serviceId}>
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
//                                   <p>{currentSelectedSalon?.currency}{s?.servicePrice}</p>
//                                 </div>
//                               </div>

//                               <div>
//                                 <div>
//                                   <p>Est Wait Time</p>
//                                   <div>
//                                     <div><ClockIcon /></div>
//                                     {/* <p>{s?.serviceEWT}</p> */}
//                                     <input
//                                       type="text"
//                                       value={s?.serviceEWT}
//                                       onChange={(e) => handleBarberEwt(s?.serviceId, e.target.value)}
//                                     />
//                                     <p>mins</p>
//                                   </div>
//                                 </div>
//                               </div>

//                             </div>

//                             {
//                               barberSelectedServices.some((b) => b._id === s?._id) ?
//                                 (<button className={`${style.service_delete_icon}`} onClick={() => deleteServiceHandler(s)}><DeleteIcon /></button>) :
//                                 (<button className={`${style.service_add_icon}`} onClick={() => selectServiceHandler(s)}><AddIcon /></button>)
//                             }


//                           </div>
//                         )
//                       })
//                     }

//                   </div>
//                 </div>

//                 <div>
//                   {
//                     barberConnectSalonLoading ? <button style={{
//                       display: "grid",
//                       placeItems: "center",
//                     }} className={style.connect_btn}><ButtonLoader /></button> : <button onClick={connectSalonClicked} className={style.connect_btn}>Connect Salon</button>
//                   }

//                 </div>
//               </div>
//           }

//         </div>
//       </>
//   )
// }

// export default Dashboard



import React, { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import style from './Dashboard.module.css'
import { Carousel } from 'react-responsive-carousel';
import { AddIcon, ChartIcon1, ChartIcon2, ChartIcon3, CheckIcon, ClockIcon, CrownIcon, DeleteIcon } from '../../icons';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts'

import ButtonLoader from '../../components/ButtonLoader/ButtonLoader';
import { useDispatch, useSelector } from 'react-redux';
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer';
import { barberConnectSalonAction, barberDashboardSalonInfoAction, barberSalonStatusAction, connectSalonListAction } from '../../Redux/Barber/Actions/DashboardAction';
import { getBarberQueueListAction } from '../../Redux/Barber/Actions/BarberQueueAction';
import { getAdminSalonImagesAction } from '../../Redux/Admin/Actions/SalonAction';
import toast from 'react-hot-toast';
import { AppointmentIcon } from '../../newicons';
import api from '../../Redux/api/Api';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

// created in arghyas account

const firebaseConfig = {
  apiKey: "AIzaSyBYCyrNZll9oeGKfILz_S5avzOQJ0xlCkw",
  authDomain: "iqbook-web.firebaseapp.com",
  projectId: "iqbook-web",
  storageBucket: "iqbook-web.firebasestorage.app",
  messagingSenderId: "889322044641",
  appId: "1:889322044641:web:d902ace026f28a67064ba0",
  measurementId: "G-2NZVFQJTYS"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    // Check if the browser supports notifications
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted.');

        const fcmToken = await getToken(messaging, {
          vapidKey: "BMb-Y9gWXHSvgsOqipUxEpzriS32OyvkeP3I4N8aVkF0A8XPuI-o7LKA8SvM9Bx1GQGpOIH6C8C5PzBJXxPp1zc" // <-- REQUIRED: Your VAPID Key from Firebase
        });

        if (fcmToken) {
          // 💡 Action: Send this token to your backend for sending notifications.
          // Example: await yourApiCall.sendTokenToBackend(fcmToken);
          return fcmToken;
        } else {
          console.warn('No registration token available. Check if your Firebase setup or VAPID key is correct.');
        }
      } else {
        console.warn('Notification permission denied by the user.');
      }
    } else {
      console.error('Notifications are not supported by this browser.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      // You can implement custom UI logic here (e.g., show a toast/in-app notification)
      console.log('Message received while foregrounded:', payload);
      resolve(payload);
    });
  });

const Dashboard = () => {


  const salonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
  const email = useSelector(state => state.BarberLoggedInMiddleware?.barberEmail)
  const barberName = useSelector(state => state.BarberLoggedInMiddleware?.barberName)

  // console.log(salonId, email, barberName)

  useEffect(() => {

    if (email && salonId) {
      const getToken = async () => {
        const token = await requestForToken();
        if (token) {
          console.log("Device Token:", token);
          
          const { data } = await axios.post("https://iqb-final.onrender.com/api/webNotifications/save-device-token",
            {
              salonId: salonId,
              name: barberName,
              email: email,
              deviceToken: token,
              type: "barber"
            })

        }
      };

      getToken();
    }

  }, []);

  const dispatch = useDispatch()


  const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

  const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata)

  useEffect(() => {
    if (barberProfile?.user[0]?.isApproved == false) {
      dispatch(connectSalonListAction())
    }
  }, [barberProfile])



  const truncateText = (text, charecterLimit) => {
    if (text?.length <= charecterLimit) {
      return text;
    }

    let truncatedText = text?.slice(0, charecterLimit);

    return truncatedText + '...'
  }

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  const connectSalonList = useSelector(state => state.connectSalonList)

  const {
    loading: connectSalonListLoading,
    resolve: connectSalonListResolve,
    response: connectSalonListResponse
  } = connectSalonList

  const [selectedSalonId, setSelectedSalonId] = useState("")

  const [currentSelectedSalon, setCurrentSelectedSalon] = useState({})

  useEffect(() => {
    if (selectedSalonId) {
      const currentSalon = connectSalonListResponse?.find((s) => s.salonId === selectedSalonId)
      setCurrentSelectedSalon(currentSalon)
    }

  }, [selectedSalonId])


  const [selectedServiceList, setSelectedServiceList] = useState([])
  const [oldSalonServicelist, setOldSalonServiceList] = useState([])

  useEffect(() => {
    if (selectedSalonId) {
      const selectedSalonServices = connectSalonListResponse.find((s) => s.salonId === selectedSalonId)?.services

      setSelectedServiceList(selectedSalonServices)
      setOldSalonServiceList(selectedSalonServices)
      setBarberSelectedServices([])
    }

  }, [selectedSalonId])

  const [barberSelectedServices, setBarberSelectedServices] = useState([])

  const selectServiceHandler = (ser) => {
    setBarberSelectedServices([...barberSelectedServices, { ...ser, barberServiceEWT: Number(ser.serviceEWT), serviceEWT: Number(ser.serviceEWT) }])
  }

  // const deleteServiceHandler = (ser) => {

  //   setSelectedServiceList((prev) => {
  //     const updatedArray = oldSalonServicelist.map((service) => {
  //       return service.serviceId === ser.serviceId ? { ...service, serviceEWT: service.serviceEWT } : service
  //     })
  //     return updatedArray
  //   })
  //   setBarberSelectedServices((services) => services.filter((s) => s._id !== ser._id))
  // }

  const deleteServiceHandler = (ser) => {
    setSelectedServiceList((prev) => {
      const updatedArray = prev.map((service) => {
        // Only reset the serviceEWT of the service being deleted
        if (service.serviceId === ser.serviceId) {
          const originalService = oldSalonServicelist.find(
            (oldService) => oldService.serviceId === service.serviceId
          );
          return { ...service, serviceEWT: originalService?.serviceEWT || service.serviceEWT };
        }
        return service;
      });
      return updatedArray;
    });

    setBarberSelectedServices((services) =>
      services.filter((s) => s._id !== ser._id)
    );
  };


  const handleBarberEwt = (serId, value) => {
    const newValue = value.replace(/[^0-9]/g, '');

    setSelectedServiceList((prev) => {
      const updatedArray = prev.map((service) => {
        return service.serviceId === serId ? { ...service, serviceEWT: Number(newValue) } : service
      })
      return updatedArray
    })

    setBarberSelectedServices((prev) => {
      const updatedArray = prev.map((service) => {
        return service.serviceId === serId ? { ...service, barberServiceEWT: Number(newValue), serviceEWT: Number(newValue) } : service
      })
      return updatedArray
    })
  }

  const connectSalonClicked = () => {
    if (barberSelectedServices.length === 0) {
      return toast.error("Please provide a service", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    }

    const connectSalondata = {
      barberServices: barberSelectedServices,
      email,
      salonId: selectedSalonId
    }

    dispatch(barberConnectSalonAction(connectSalondata))
  }

  const barberConnectSalon = useSelector(state => state.barberConnectSalon)

  const {
    loading: barberConnectSalonLoading,
    resolve: barberConnectSalonResolve,
    message: barberConnectSalonMessage
  } = barberConnectSalon


  const queuelistcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    if (barberProfile?.user[0]?.isApproved) {
      const controller = new AbortController();
      queuelistcontrollerRef.current = controller;

      dispatch(getBarberQueueListAction(salonId, barberId, controller.signal));

      return () => {
        if (queuelistcontrollerRef.current) {
          queuelistcontrollerRef.current.abort();
        }
      };
    }
  }, [salonId, dispatch]);

  const getBarberQueueList = useSelector(state => state.getBarberQueueList)

  const {
    loading: getBarberQueueListLoading,
    resolve: getBarberQueueListResolve,
    queueList: BarberQueueList
  } = getBarberQueueList


  const [currentDate, setCurrentDate] = useState(new Date())


  const barberDashboardSalonInfoRef = useRef(new AbortController())

  useEffect(() => {
    if (barberProfile?.user[0]?.isApproved && salonId != 0) {
      const controller = new AbortController();
      barberDashboardSalonInfoRef.current = controller;

      dispatch(barberDashboardSalonInfoAction(salonId, controller.signal));

      return () => {
        if (barberDashboardSalonInfoRef.current) {
          barberDashboardSalonInfoRef.current.abort();
        }
      };
    }

  }, [salonId, dispatch, barberProfile]);

  const barberDashboardSalonInfo = useSelector(state => state.barberDashboardSalonInfo)

  const {
    loading: barberDashboardSalonInfoLoading,
    resolve: barberDashboardSalonInfoResolve,
    response: barberDashboardSalonInfoResponse
  } = barberDashboardSalonInfo


  //Salon Images

  useEffect(() => {
    if (barberProfile?.user[0]?.isApproved && salonId != 0) {
      dispatch(getAdminSalonImagesAction(salonId))
    }
  }, [salonId, barberProfile])

  const getAdminSalonImages = useSelector(state => state.getAdminSalonImages)

  const {
    loading: getAdminSalonImagesLoading,
    resolve: getAdminSalonImagesResolve,
    response: AdminSalonImages
  } = getAdminSalonImages

  const [openModal, setOpenModal] = useState(false)

  // console.log(barberConnectSalonMessage)

  const [reportData, setReportData] = useState([])
  const [todaysAppLoading, setTodaysAppLoading] = useState(false)
  const [todaysApp, setTodaysApp] = useState([])

  useEffect(() => {
    if (!salonId || !barberId) return; // Ensure salonId and barberId exist before fetching data

    const getAllReports = async () => {
      try {
        const { data } = await api.post("/api/reports/getnewbarberdashboardReports", {
          salonId,
          barberId
        });
        setReportData(data.response);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    const getTodaysAppointment = async () => {
      try {
        setTodaysAppLoading(true)
        const { data } = await api.post("/api/appointments/getAllAppointmentsByBarberForToday", {
          salonId,
          barberId
        });
        setTodaysAppLoading(false)
        setTodaysApp(data.response);
      } catch (error) {
        setTodaysAppLoading(false)
        console.error("Error fetching today's appointments:", error);
      }
    };

    getAllReports();
    getTodaysAppointment();
  }, [salonId, barberId]);



  const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

  const {
    loading: adminGetDefaultSalonLoading,
    resolve: adminGetDefaultSalonResolve,
    response: adminGetDefaultSalonResponse
  } = adminGetDefaultSalon

  const appointmentReportList = [
    {
      heading: "Total Appointments",
      value: reportData?.appointment?.totalAppointmentHistoryCount,
      percent: reportData?.appointment?.totalAppointmentHistoryPercentage
    },
    {
      heading: "Served Appointments",
      value: reportData?.appointment?.servedAppointmenthistoryCount,
      percent: reportData?.appointment?.servedAppointmentHistoryPercentage
    },
    {
      heading: "Canceled Appointments",
      value: reportData?.appointment?.cancelledAppointmentHistoryCount,
      percent: reportData?.appointment?.cancelledAppointmentHistoryPercentage
    },
  ]

  return (
    barberProfile?.user[0]?.isApproved ?
      <>
        <section className={`${style.dashboard_container}`}>
          {/* <div>
            <h2>Welcome, {barberName ? barberName : "User"}</h2>
          </div> */}
          {/* <div style={{ display: "none" }}></div> */}

          <div>
            <div>

              <div>
                <div>
                  <p>Today's Appointments</p>
                  <p>Total {todaysApp?.totalCount} appointments are available</p>
                </div>

                {
                  todaysAppLoading ? (
                    <div className={`${style.barber_loading}`}>
                      <Skeleton
                        count={3}
                        width={"100%"}
                        height={"4rem"}
                        baseColor={"var(--loader-bg-color)"}
                        highlightColor={"var(--loader-highlight-color)"}
                        style={{ marginBottom: "1rem" }} />

                    </div>
                  ) : todaysApp?.appointments?.length > 0 ? (
                    <div>
                      {
                        todaysApp?.appointments?.map((item, index) => {
                          return (
                            <div className={`${style.barber_list_item}`} key={item._id}>
                              <div>
                                <img src={item?.customerProfile?.[0]?.url} alt="" />
                                <div>
                                  <p>{item?.customerName ?? ""}</p>
                                  <p>{item?.barberName ?? ""}</p>
                                </div>
                              </div>
                              <div>
                                <h4>{item.appointmentDate}</h4>
                                <p>{item.timeSlots}</p>
                              </div>
                            </div>
                          )
                        })
                      }

                    </div>
                  ) : (
                    <div className={`${style.barber_error}`}>
                      <p>No appointments available</p>
                    </div>
                  )
                }


              </div>

              <div>
                <div>
                  <p>Queue Reports</p>
                  <p>Queue count of last 7 days</p>
                  <h2>{reportData?.queue?.last7daysTotalQueueCount}</h2>
                </div>

                <div className={`${style.queue_report_container}`}>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart
                      width={500}
                      height={300}
                      data={reportData?.queue?.last7daysCount}
                    >
                      <Line type="monotone" dataKey="TotalQueue" stroke="var(--bg-secondary)" strokeWidth={2} dot={{ fill: "#fff", stroke: "var(--bg-secondary)", strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div>
                  <p>Queue History</p>
                  <p><span
                    style={{
                      color: reportData?.queue?.queueTrend === "Rise" ? "#00A36C" :
                        reportData?.queue?.queueTrend === "Fall" ? "rgb(244, 67, 54)" : ""
                    }}
                  >{reportData?.queue?.queueTrend === "Rise" ? "+" : reportData?.queue?.queueTrend === "Fall" ? "-" : ""}{reportData?.queue?.percentageChangelast30Days}%</span> from last 30 days</p>
                  <h2>{reportData?.queue?.totalQueueHistoryCount}</h2>
                </div>

                <div className={`${style.queue_history_container}`}>
                  <div>
                    <div>
                      <span style={{ background: "#00A36C" }}>{reportData?.queue?.servedHistoryPercentage && `${reportData?.queue?.servedHistoryPercentage}%`}</span>
                      <p>Served</p>
                    </div>

                    <div>
                      <span style={{ background: "rgb(244, 67, 54)" }}>{reportData?.queue?.cancelledHistoryPercentage && `${reportData?.queue?.cancelledHistoryPercentage}%`}</span>
                      <p>Canceled</p>
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        width: `${reportData?.queue?.servedHistoryPercentage}%`,
                        borderRadius: reportData?.queue?.servedHistoryPercentage === 100 && "2rem"
                      }}
                    ></div>
                    <div
                      style={{
                        width: `${reportData?.queue?.cancelledHistoryPercentage}%`,
                        borderRadius: reportData?.queue?.cancelledHistoryPercentage === 100 && "2rem"
                      }}
                    ></div>
                  </div>

                </div>

              </div>
            </div>
            <div>
              <div>
                <div>
                  <div>
                    <div>
                      <p>Appointments Weekly Reports</p>
                      <p>Last 7 days overview</p>
                    </div>

                    <div>
                      <h1>{reportData?.appointment?.dateFormat}</h1>
                      <p><span
                        style={{
                          color: reportData?.appointment?.appointmentTrend === "Fall" ? "#f44336" :
                            reportData?.appointment?.appointmentTrend === "Rise" ? "#00A36C" : ""
                        }}
                      >{reportData?.appointment?.appointmentTrend === "Fall" ? "-" : reportData?.appointment?.appointmentTrend === "Rise" ? "+" : ""}{reportData?.appointment?.percentageChangeLastWeek}%</span> from last 7 days</p>
                    </div>
                  </div>

                  <div>
                    {
                      !reportData?.appointment?.last7daysCount.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                          <BarChart width={150} height={40} data={reportData?.appointment?.last7daysCount}>
                            <Bar dataKey="TotalAppoinment" fill="var(--bg-secondary)" radius={[3, 3, 3, 3]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p
                          style={{
                            color: "var(--text-primary)",
                            fontSize: "1.6rem",
                            fontFamily: 'AirbnbCereal_Medium'
                          }}
                        >No report data available</p>
                      )
                    }

                  </div>
                </div>

                <div>
                  {
                    appointmentReportList.map((item) => {
                      return (
                        <div
                          key={item.heading}
                          className={`${style.appoint_report_item}`}>
                          <div>
                            <div><AppointmentIcon /></div>
                            <p>{item.heading}</p>
                          </div>

                          <h2>{item.value}</h2>

                          <div><div style={{ width: `${item.percent}%` }}></div></div>
                        </div>
                      )
                    })
                  }


                </div>
              </div>

              <div>
                <div>
                  <p>Queue List</p>
                  <p>The current total queue count is {BarberQueueList?.length}</p>
                </div>

                {
                  getBarberQueueListLoading ? (
                    <div className={`${style.queuelist_loading}`}>
                      <Skeleton
                        count={6}
                        width={"100%"}
                        height={"6rem"}
                        baseColor={"var(--loader-bg-color)"}
                        highlightColor={"var(--loader-highlight-color)"}
                        style={{ marginBottom: "1rem" }} />
                    </div>
                  ) : getBarberQueueListResolve && BarberQueueList?.length > 0 ? (
                    <div>
                      {
                        BarberQueueList?.map((item, index) => {
                          return (
                            <div className={`${style.queue_list_item}`} key={item._id}>
                              <div>
                                <div><img src={item.customerProfile?.[0]?.url} alt="" /></div>
                                <div>
                                  <p>{item.customerName}</p>
                                  <p>{item.barberName}</p>
                                </div>
                              </div>

                              <div>
                                <h2>{item?.qPosition === 1 ? "Next" : item?.qPosition}</h2>
                                <p>Est. Time - {item.customerEWT === 0 ? "" : item.customerEWT} mins</p>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  ) : (
                    <div className={`${style.queuelist_error}`}>
                      <p>No queue available</p>
                    </div>
                  )
                }

              </div>
            </div>
          </div>
        </section>

      </> :
      <>
        <div className={`${style.section}`}>
          <div>
            <h2>Connect to your salon</h2>
          </div>

          {
            barberProfile?.user[0]?.approvePendingMessage ?
              <div className={`${style.approve_container}`}>
                <div>
                  <p>{barberProfile?.user[0]?.approvePendingMessage}</p>
                  <button onClick={() => window.location.reload()}>Reload</button>
                </div>
              </div> :
              <div className={`${style.connect_container}`}>
                <div>

                  {
                    connectSalonListLoading ? (
                      <div>
                        <Skeleton count={4} height={"7rem"} style={{ marginBottom: "1rem" }}
                          baseColor={"var(--loader-bg-color)"}
                          highlightColor={"var(--loader-highlight-color)"} />
                      </div>)
                      : connectSalonListResolve && connectSalonListResponse?.length > 0 ? (
                        <div>
                          {connectSalonListResponse.map((item) => (
                            <div className={`${style.salon_item}`} key={item.salonId}>
                              <img src={item?.salonLogo?.[0]?.url} alt={""} />
                              <div>
                                <p>{item.salonName}</p>
                                <p>{item.city}</p>
                              </div>

                              {selectedSalonId == item.salonId ? <button style={{ background: "green" }}><CheckIcon /></button> : <button onClick={() => setSelectedSalonId(item.salonId)} >+</button>}
                            </div>
                          ))}

                        </div>
                      ) : (<div className={`${style.salon_content_body_error} ${darkmodeOn && style.dark}`}>
                        <p>No salons available</p>
                      </div>
                      )
                  }

                  <div
                    style={{
                      display: selectedServiceList?.length === 0 ? "none" : "block",
                      padding: selectedServiceList?.length === 0 ? "0rem" : "1rem"
                    }}
                  >
                    {selectedServiceList.map((service) => (
                      <div key={service.serviceId} className={style.service_item}>
                        <div>
                          <div>
                            <div><img src={service?.serviceIcon?.url} alt={""} /></div>
                            <div>
                              <p>{service.serviceName}</p>
                              <p>{service.vipService ? "VIP" : "Regular"}</p>
                              <p>{service.serviceDesc}</p>
                            </div>
                          </div>
                          {barberSelectedServices.some((b) => b._id === service?._id) ? (
                            <button
                              style={{
                                background: "#450a0a",
                              }}
                              onClick={() => deleteServiceHandler(service)}
                            >Delete</button>
                          ) : (
                            <button
                              style={{
                                background: "#052e16",
                              }}
                              onClick={() => selectServiceHandler(service)}
                            >Add</button>
                          )}

                        </div>
                        <div>
                          <div>
                            <p>Price</p>
                            <p>{currentSelectedSalon?.currency}{service?.servicePrice}</p>
                          </div>
                          <div>
                            <p>Estimated Time</p>
                            <div>
                              <input
                                type="text"
                                value={service?.serviceEWT}
                                onChange={(e) => handleBarberEwt(service?.serviceId, e.target.value)}
                                maxLength={3}
                              />
                              <p>mins</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {
                      selectedServiceList?.map((service, index) => {
                        return (
                          <div className={style.mobile_service_item} key={service.serviceId}>
                            <div>
                              <div>
                                <div>
                                  <img src={service?.serviceIcon?.url} alt="" />

                                  {service.vipService ? <span><CrownIcon /></span> : null}
                                </div>

                                <p>{service.serviceName}</p>
                                <p>{service.serviceDesc}</p>

                              </div>

                              {barberSelectedServices.some((b) => b._id === service?._id) ? (
                                <button
                                  style={{
                                    background: "#450a0a",
                                  }}
                                  onClick={() => deleteServiceHandler(service)}
                                >Delete</button>
                              ) : (
                                <button
                                  style={{
                                    background: "#052e16",
                                  }}
                                  onClick={() => selectServiceHandler(service)}
                                >Add</button>
                              )}
                            </div>
                            <div>
                              <div>
                                <p>Price</p>
                                <p>{currentSelectedSalon?.currency}{service?.servicePrice}</p>
                              </div>

                              <div>
                                <p>Estimated Time</p>
                                <div>
                                  <input
                                    type="text"
                                    value={service?.serviceEWT}
                                    onChange={(e) => handleBarberEwt(service?.serviceId, e.target.value)}
                                    maxLength={3}
                                  />
                                  <p>mins</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }

                  </div>
                </div>

                {
                  barberConnectSalonLoading ? <button style={{
                    display: "grid",
                    placeItems: "center",
                  }}><ButtonLoader /></button> : <button onClick={connectSalonClicked}>Connect Salon</button>
                }
              </div>
          }

        </div>
      </>
  )
}

export default Dashboard