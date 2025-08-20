// import React, { useEffect, useRef, useState } from 'react'
// import Skeleton from 'react-loading-skeleton'
// import style from './Dashboard.module.css'
// import { useNavigate } from 'react-router-dom'
// import { Carousel } from 'react-responsive-carousel';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllAdvertisementAction, getAllQueueListAction, getDashboardAppointmentListAction } from '../../Redux/Admin/Actions/DashboardAction';
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer';
// import { getAdminBarberListAction } from '../../Redux/Admin/Actions/BarberAction';
// import api from '../../Redux/api/Api';

// const Dashboard = () => {

//   const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

//   const {
//     loading: adminGetDefaultSalonLoading,
//     resolve: adminGetDefaultSalonResolve,
//     response: adminGetDefaultSalonResponse
//   } = adminGetDefaultSalon


//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
//   const email = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)
//   const adminName = useSelector(state => state.AdminLoggedInMiddleware.adminName)

//   const advertisementcontrollerRef = useRef(new AbortController());

//   useEffect(() => {
//     const controller = new AbortController();
//     advertisementcontrollerRef.current = controller;

//     dispatch(getAllAdvertisementAction(salonId, controller.signal));

//     return () => {
//       if (advertisementcontrollerRef.current) {
//         advertisementcontrollerRef.current.abort();
//       }
//     };
//   }, [salonId, dispatch]);


//   const getAllAdvertisement = useSelector(state => state.getAllAdvertisement)

//   const {
//     loading: getAllAdvertisementLoading,
//     resolve: getAllAdvertisementResolve,
//     advertisements
//   } = getAllAdvertisement


//   const queuelistcontrollerRef = useRef(new AbortController());

//   useEffect(() => {
//     const controller = new AbortController();
//     queuelistcontrollerRef.current = controller;

//     dispatch(getAllQueueListAction(salonId, controller.signal));

//     return () => {
//       if (queuelistcontrollerRef.current) {
//         queuelistcontrollerRef.current.abort();
//       }
//     };
//   }, [salonId, dispatch]);

//   const getAllQueueList = useSelector(state => state.getAllQueueList)

//   const {
//     loading: getAllQueueListLoading,
//     resolve: getAllQueueListResolve,
//     queueList: queuelist
//   } = getAllQueueList

//   const [currentDate, setCurrentDate] = useState(new Date())

//   const appointmentlistcontrollerRef = useRef(new AbortController());

//   useEffect(() => {
//     if (currentDate) {
//       const formattedDate = currentDate?.toISOString().split("T")[0]

//       const controller = new AbortController();
//       appointmentlistcontrollerRef.current = controller;

//       dispatch(getDashboardAppointmentListAction(salonId, formattedDate, controller.signal));

//       return () => {
//         if (appointmentlistcontrollerRef.current) {
//           appointmentlistcontrollerRef.current.abort();
//         }
//       };
//     }
//   }, [salonId, dispatch, currentDate])


//   const getDashboardAppointmentList = useSelector(state => state.getDashboardAppointmentList)

//   const {
//     loading: getDashboardAppointmentListLoading,
//     resolve: getDashboardAppointmentListResolve,
//     response: appointmentList
//   } = getDashboardAppointmentList


//   const truncateText = (text, characterLimit) => {
//     if (!text) return '';

//     // console.log(text.length)

//     if (text.length <= characterLimit) {
//       return text;
//     }

//     let truncatedText = text.slice(0, characterLimit);

//     return truncatedText + '...';
//   };


//   const BarberListcontrollerRef = useRef(new AbortController());

//   useEffect(() => {
//     const controller = new AbortController();
//     BarberListcontrollerRef.current = controller;

//     dispatch(getAdminBarberListAction(salonId, controller.signal));

//     return () => {
//       if (BarberListcontrollerRef.current) {
//         BarberListcontrollerRef.current.abort();
//       }
//     };
//   }, [salonId, dispatch]);


//   const getAdminBarberList = useSelector(state => state.getAdminBarberList)

//   const {
//     loading: getAdminBarberListLoading,
//     resolve: getAdminBarberListResolve,
//     getAllBarbers: BarberList
//   } = getAdminBarberList

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

//   const darkMode = useSelector(darkmodeSelector)

//   const darkmodeOn = darkMode === "On"


//   const [reportData, setReportData] = useState([])

//   useEffect(() => {
//     const getAllReports = async () => {
//       const { data } = await api.post("/api/reports/getdashboardReports", {
//         salonId,
//         reportType: "daily"
//       })

//       setReportData(data.response)

//     }

//     getAllReports()

//   }, [])


//   return (
//     salonId === 0 ? (<>
//       <main className={style.dashboard}>
//         <div className={`${style.dashboard_body_intial} ${darkmodeOn && style.dark}`}>
//           <div className={`${style.dashboard_intial_container}`}>
//             <p>Hey &#128075;, {adminName || email?.split('@')[0]}</p>
//             <div>
//               <p>You don't have any salon right now.</p>
//               <button onClick={() => navigate("/admin-salon/createsalon")}>Create</button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>) : (<>
//       <main className={style.dashboard}>
//         <main className={style.dashboard_body}>
//           <div className={style.inner_container}>
//             <div className={style.dashboard_container_one}>
//               <div className={`${style.saloninfo_container} ${darkmodeOn && style.dark}`}>
//                 <div>
//                   <h2>Welcome, {adminName}</h2>
//                 </div>

//                 <div>
//                   {
//                     adminGetDefaultSalonLoading ?
//                       <div
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           paddingTop: "2rem",
//                           paddingInline: "1rem"
//                         }}>
//                         <Skeleton count={1} height={"4rem"} style={{ borderRadius: "0.3rem" }}
//                           baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                           highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                         />
//                       </div> :
//                       adminGetDefaultSalonResolve && adminGetDefaultSalonResponse?.salonDesc?.length > 0 ?
//                         <i>
//                           {truncateText(adminGetDefaultSalonResponse?.salonDesc, 35)}
//                         </i> :
//                         <i>
//                           You currently have no salon information
//                         </i>
//                   }

//                 </div>
//               </div>

//               {
//                 getAllAdvertisementLoading ?
//                   <div className={style.salonadv_container_loader}>
//                     <Skeleton count={1} className={style.dashboard_advertise_loader} style={{ borderRadius: "0.6vw" }}
//                       baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                       highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                     />
//                   </div> :
//                   getAllAdvertisementResolve && advertisements?.length > 0 ?
//                     <div className={`${style.salonadv_container} ${darkmodeOn && style.dark}`}>
//                       <Carousel
//                         showThumbs={false}
//                         infiniteLoop={true}
//                         autoPlay={true}
//                         interval={5000}
//                         showStatus={false}
//                         showArrows={false}
//                         stopOnHover={false}
//                         swipeable={false}
//                       >
//                         {
//                           advertisements?.slice(0, 5)?.map((item) => {
//                             return (
//                               <div className={style.carousel_item_container} key={item._id}>
//                                 <img src={item.url} alt="image_item" />
//                               </div>
//                             )
//                           })
//                         }
//                       </Carousel>
//                     </div> :
//                     <div className={style.salonadv_container_error}>
//                       <img src="./no-image.jpg" alt="no_image" />
//                     </div>
//               }


//               <div className={style.barber_report_container}>
//                 <div className={`${style.barberlist_container} ${darkmodeOn && style.dark}`}>

//                   <div className={`${style.barberitem_header} ${darkmodeOn && style.dark}`}>
//                     <div>
//                       <div>

//                       </div>
//                       <p>Barber</p>
//                     </div>
//                     <div><p>Queue</p></div>
//                     <div><p>EWT</p></div>
//                   </div>
//                   {
//                     getAdminBarberListLoading ?
//                       <div className={style.barberlist_container_body_loading}>
//                         <Skeleton count={2} height={"6rem"} style={{ marginBottom: "1rem" }}
//                           baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                           highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                         />
//                       </div> :
//                       getAdminBarberListResolve && BarberList?.length > 0 ?
//                         <div className={style.barberlist_container_body}>


//                           {
//                             BarberList?.map((barber, index) => {
//                               return (
//                                 <div
//                                   className={`${style.barberitem} ${darkmodeOn && style.dark}`}
//                                   key={barber._id}
//                                   style={{
//                                     borderBottom: BarberList.length - 1 === index && "none"
//                                   }}
//                                 >
//                                   <div>
//                                     <div>
//                                       <img src={barber?.profile?.[0]?.url} alt="barber" />
//                                       <div
//                                         style={{
//                                           background: barber?.isOnline ? "limegreen" : "red"
//                                         }}
//                                       ></div>
//                                     </div>
//                                     <p>{barber.name.length > 6 ? `${barber.name.slice(0, 6).concat("...")}` : barber.name}</p>
//                                   </div>
//                                   <div><p>{barber.queueCount}</p></div>
//                                   <div><p>{barber.barberEWT} mins</p></div>
//                                 </div>
//                               )
//                             })
//                           }
//                         </div> :
//                         <div className={style.barberlist_container_body_error}>
//                           <p>No barber available</p>
//                         </div>
//                   }

//                 </div>
//                 <div className={`${style.report_container} ${darkmodeOn && style.dark}`}>

//                   <Carousel
// showThumbs={false}
// infiniteLoop={true}
// autoPlay={false}
// interval={5000}
// showStatus={false}
// showArrows={false}
// stopOnHover={true}
// swipeable={true}
// renderIndicator={false}
//                   >

//                     <div className={style.r_chart}>
//                       <p>Report-Type One</p>
//                       <div>
//                         <ResponsiveContainer width="100%" height="100%" style={{ marginTop: 20}}>
//                           <BarChart width={150} height={50} data={reportData}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" />
//                             {/* <YAxis /> */}
//                             <Tooltip />
//                             <Bar dataKey="totalQueue" fill="rgba(255, 0, 0, 0.393)" stroke="#000000" strokeWidth={1} />
//                           </BarChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>

//                   </Carousel>
//                 </div>
//               </div>
//             </div>


//             <div className={style.dashboard_container_two}>
//               <div className={`${style.queuelists_container} ${darkmodeOn && style.dark}`}>
//                 <div className={`${style.queue_header} ${darkmodeOn && style.dark}`}>
//                   <div><p>#</p></div>
//                   <div><p>Name</p></div>
//                   <div><p>Barber</p></div>
//                   <div><p>EWT</p></div>
//                 </div>

//                 {
//                   getAllQueueListLoading ?
//                     <div className={style.queue_body_loading}>
//                       <Skeleton count={7} height={"6rem"} style={{ marginBottom: "1rem" }}
//                         baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                         highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
//                     </div> :
//                     getAllQueueListResolve && queuelist?.length > 0 ?
//                       <div className={style.queue_body}>
//                         {
//                           queuelist.map((queue, index) => {
//                             return (
//                               <div
//                                 key={queue._id}
//                                 className={`${style.queue_item} ${darkmodeOn && style.dark}`}
//                                 style={{
//                                   borderBottom: index === queuelist.length - 1 && "none"
//                                 }}
//                               >
//                                 <div><p>{queue.qPosition === 1 ? "Next" : queue.qPosition}</p></div>
//                                 <div><p>{queue.name.length > 6 ? `${queue.name.slice(0, 6).concat("...")}` : queue.name}</p></div>
//                                 <div><p>{queue.barberName.length > 6 ? `${queue.barberName.slice(0, 6).concat("...")}` : queue.barberName}</p></div>
//                                 <div><p>{queue.customerEWT === 0 ? "-" : queue.customerEWT + "mins"}</p></div>
//                               </div>
//                             )
//                           })
//                         }
//                       </div> :
//                       <div className={style.queue_body_error}>
//                         <p>No queuelist available</p>
//                       </div>
//                 }

//               </div>
//             </div>
//           </div>
//         </main>
//       </main >
//     </>)


//   )
// }

// export default Dashboard


import React, { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import style from './Dashboard.module.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getAllAdvertisementAction, getAllQueueListAction, getDashboardAppointmentListAction } from '../../Redux/Admin/Actions/DashboardAction';
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer';
import { getAdminBarberListAction } from '../../Redux/Admin/Actions/BarberAction';
import { AppointmentIcon } from '../../newicons';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import api from '../../Redux/api/Api';
// import { useSocket } from '../../context/SocketContext';

const Dashboard = () => {

  // const { socket } = useSocket()

  // console.log("The socket value is ", socket)

  const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

  const {
    loading: adminGetDefaultSalonLoading,
    resolve: adminGetDefaultSalonResolve,
    response: adminGetDefaultSalonResponse
  } = adminGetDefaultSalon


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
  const email = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)
  const adminName = useSelector(state => state.AdminLoggedInMiddleware.adminName)

  const advertisementcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    advertisementcontrollerRef.current = controller;

    dispatch(getAllAdvertisementAction(salonId, controller.signal));

    return () => {
      if (advertisementcontrollerRef.current) {
        advertisementcontrollerRef.current.abort();
      }
    };
  }, [salonId, dispatch]);


  const getAllAdvertisement = useSelector(state => state.getAllAdvertisement)

  const {
    loading: getAllAdvertisementLoading,
    resolve: getAllAdvertisementResolve,
    advertisements
  } = getAllAdvertisement


  const queuelistcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    queuelistcontrollerRef.current = controller;

    dispatch(getAllQueueListAction(salonId, controller.signal));

    return () => {
      if (queuelistcontrollerRef.current) {
        queuelistcontrollerRef.current.abort();
      }
    };
  }, [salonId, dispatch]);

  const getAllQueueList = useSelector(state => state.getAllQueueList)

  const {
    loading: getAllQueueListLoading,
    resolve: getAllQueueListResolve,
    queueList: queuelist
  } = getAllQueueList

  const [currentDate, setCurrentDate] = useState(new Date())

  const appointmentlistcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    if (currentDate) {
      const formattedDate = currentDate?.toISOString().split("T")[0]

      const controller = new AbortController();
      appointmentlistcontrollerRef.current = controller;

      dispatch(getDashboardAppointmentListAction(salonId, formattedDate, controller.signal));

      return () => {
        if (appointmentlistcontrollerRef.current) {
          appointmentlistcontrollerRef.current.abort();
        }
      };
    }
  }, [salonId, dispatch, currentDate])


  const getDashboardAppointmentList = useSelector(state => state.getDashboardAppointmentList)

  const {
    loading: getDashboardAppointmentListLoading,
    resolve: getDashboardAppointmentListResolve,
    response: appointmentList
  } = getDashboardAppointmentList


  const truncateText = (text, characterLimit) => {
    if (!text) return '';

    // console.log(text.length)

    if (text.length <= characterLimit) {
      return text;
    }

    let truncatedText = text.slice(0, characterLimit);

    return truncatedText + '...';
  };


  const BarberListcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    BarberListcontrollerRef.current = controller;

    dispatch(getAdminBarberListAction(salonId, controller.signal));

    return () => {
      if (BarberListcontrollerRef.current) {
        BarberListcontrollerRef.current.abort();
      }
    };
  }, [salonId, dispatch]);


  const getAdminBarberList = useSelector(state => state.getAdminBarberList)

  const {
    loading: getAdminBarberListLoading,
    resolve: getAdminBarberListResolve,
    getAllBarbers: BarberList
  } = getAdminBarberList

  const data2 = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"


  const [reportData, setReportData] = useState([])

  useEffect(() => {
    const getAllReports = async () => {
      const { data } = await api.post("/api/reports/getnewdashboardReports", {
        salonId
      })

      setReportData(data.response)

    }

    getAllReports()

  }, [salonId])


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

  const [salonInfo, setSalonInfo] = useState("")

  return (
    salonId === 0 ? (<>
      <section className={`${style.dashboard_initial_ontainer}`}>
        <div className={`${style.dashboard_intial_content}`}>
          <p>Hey &#128075;, {adminName || email?.split('@')[0]}</p>
          <p>You don't have any salon right now.</p>
          <button onClick={() => navigate("/admin-salon/createsalon")}>Create</button>
        </div>
      </section>
    </>) : <>

      <section className={`${style.dashboard_container}`}>
        {/* <div>
          <h2>Welcome, {adminName ? adminName : "User"}</h2>
        </div> */}

        <div className={style.salonInfo_container}>
          <h3>Salon Info</h3>
          <input
            type="text"
            value={salonInfo}
            placeholder='Enter your salon info'
            onChange={(e) => setSalonInfo(e.target.value)}
          />
        </div>

        <div>
          <div>

            <div>
              <div>
                <p>Barbers On Duty</p>
                <p>Total {BarberList?.length} barbers are available
                </p>
              </div>

              {
                getAdminBarberListLoading ? (
                  <div className={`${style.barber_loading}`}>
                    <Skeleton
                      count={3}
                      width={"100%"}
                      height={"4rem"}
                      baseColor={"var(--loader-bg-color)"}
                      highlightColor={"var(--loader-highlight-color)"}
                      style={{ marginBottom: "1rem" }} />

                  </div>
                ) : getAdminBarberListResolve && BarberList?.length > 0 ? (
                  <div>
                    {
                      BarberList.map((barber, index) => {
                        return (
                          <div className={`${style.barber_list_item}`} key={barber._id}>
                            <div><img src={barber?.profile?.[0]?.url} alt="barber" /></div>
                            <p>{barber.name}</p>
                          </div>
                        )
                      })
                    }

                  </div>
                ) : (
                  <div className={`${style.barber_error}`}>
                    <p>No barbers available</p>
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
                    <p>Appointments Reports</p>
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
                <p>The current total queue count is {queuelist?.length}</p>
              </div>

              {
                getAllQueueListLoading ? (
                  <div className={`${style.queuelist_loading}`}>
                    <Skeleton
                      count={6}
                      width={"100%"}
                      height={"6rem"}
                      baseColor={"var(--loader-bg-color)"}
                      highlightColor={"var(--loader-highlight-color)"}
                      style={{ marginBottom: "1rem" }} />
                  </div>
                ) : getAllQueueListResolve && queuelist?.length > 0 ? (
                  <div>
                    {
                      queuelist.map((item, index) => {
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
      </section >
    </>

  )
}

export default Dashboard




