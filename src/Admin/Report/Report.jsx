// import React, { useEffect, useRef, useState } from 'react'
// import style from './Report.module.css'
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import { useDispatch, useSelector } from 'react-redux'
// import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
// import { ClickAwayListener } from '@mui/material'
// import Calendar from 'react-calendar'
// import api from '../../Redux/api/Api'
// import DatePicker from "react-multi-date-picker";
// import { getAdminBarberListAction } from '../../Redux/Admin/Actions/BarberAction'
// import Skeleton from 'react-loading-skeleton'
// import toast from 'react-hot-toast'

// const Report = () => {

//   const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
//   const dispatch = useDispatch()

//   const darkMode = useSelector(darkmodeSelector)

//   const darkmodeOn = darkMode === "On"

//   // State for checkboxes


//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedRangeFilter, setSelectedRangeFilter] = useState("")

//   // console.log(selectedFilter)

//   const [weekOption, setWeekOption] = useState("");
//   const [monthOption, setMonthOption] = useState("");
//   const [dayOption, setDayOption] = useState("");
//   const [queueType, setQueueType] = useState("")
//   const [appointmentType, setAppointmentType] = useState("")

//   // console.log(queueType)

//   const [dummyReport] = useState([
//     {
//       "0": "0",
//       "TotalQueue": 0
//     },
//     {
//       "1": "1",
//       "TotalQueue": 0
//     },
//     {
//       "2": "2",
//       "TotalQueue": 0
//     },
//     {
//       "3": "3",
//       "TotalQueue": 0
//     },
//     {
//       "4": "4",
//       "TotalQueue": 0
//     },
//     {
//       "5": "5",
//       "TotalQueue": 0
//     },
//     {
//       "6": "6",
//       "TotalQueue": 0
//     }
//   ])

//   const [QueueReportData, setQueueReportData] = useState(dummyReport)
//   const [AppointmentReportData, setAppointmentReportData] = useState(dummyReport)

//   console.log(QueueReportData)

//   useEffect(() => {
//     if (selectedFilter && (dayOption || weekOption || monthOption) && (queueType || appointmentType)) {
//       try {
//         const getAllReports = async () => {
//           const reportOptions = {
//             salonId,
//             reportValue: queueType || appointmentType,
//             reportType: selectedFilter,
//             ...(selectedFilter === "daily" && { days: Number(dayOption) }),
//             ...(selectedFilter === "weekly" && { week: Number(weekOption) }),
//             ...(selectedFilter === "monthly" && { month: Number(monthOption) }),
//           };

//           const { data } = await api.post("/api/reports/getSalonReports", reportOptions);

//           if (queueType) {
//             setQueueReportData(data.response);
//           } else if (appointmentType) {
//             setAppointmentReportData(data.response)
//           }

//         };

//         getAllReports();
//       } catch (error) {
//         console.log(error)
//       }
//     }

//   }, [selectedFilter, dayOption, weekOption, monthOption, queueType, appointmentType]);


//   const [selectedDates, setSelectedDates] = useState([])

//   const handleDateChange = (dates) => {
//     const formatedDates = dates.map((date) => date.format("YYYY-MM-DD"))
//     setSelectedDates(formatedDates)
//     setSelectedFilter("")
//     setWeekOption("")
//     setMonthOption("")
//     setDayOption("")
//   }


//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.matchMedia("(max-width: 600px)").matches);
//     };

//     handleResize();

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);


//   const [openbarberContainer, setOpenBarberContainer] = useState(false)

//   const [selectedbarber, setSelectedbarber] = useState("")
//   const [selectedbarberId, setSelectedbarberId] = useState("")
//   const [selectedbarberEmail, setSelectedbarberEmail] = useState("")

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
//     getAllBarbers: BarberList
//   } = getAdminBarberList

//   // console.log(BarberList)

//   console.log(selectedbarber)
//   console.log(selectedbarberId)
//   console.log(selectedbarberEmail)

//   console.log(selectedDates)
//   console.log(selectedRangeFilter)

//   useEffect(() => {

//     if (selectedDates.length === 2 && selectedRangeFilter && (queueType || appointmentType) && selectedbarberEmail) {
//       const getAllReports = async () => {
//         try {
//           const reportOptions = {
//             salonId,
//             reportValue: (queueType || appointmentType),
//             reportType: selectedRangeFilter,
//             from: selectedDates[0],
//             to: selectedDates[1],
//             barberEmail: selectedbarberEmail,
//             barberId: selectedbarberId
//           };

//           const { data } = await api.post("/api/reports/getSalonReports", reportOptions);

//           if (queueType) {
//             setQueueReportData(data.response);
//           } else if (appointmentType) {
//             setAppointmentReportData(data.response)
//           }

//         } catch (error) {
//           toast.error(error?.response?.data?.message || "Something went wrong", {
//             duration: 3000,
//             style: {
//               fontSize: "var(--font-size-2)",
//               borderRadius: '0.3rem',
//               background: '#333',
//               color: '#fff',
//             },
//           });
//         }
//       };

//       getAllReports();
//     } else if (selectedDates.length === 2 && selectedRangeFilter && (queueType || appointmentType)) {
//       const getAllReports = async () => {
//         try {
//           const reportOptions = {
//             salonId,
//             reportValue: (queueType || appointmentType),
//             reportType: selectedRangeFilter,
//             from: selectedDates[0],
//             to: selectedDates[1]
//           };

//           const { data } = await api.post("/api/reports/getSalonReports", reportOptions);

//           if (queueType) {
//             setQueueReportData(data.response);
//           } else if (appointmentType) {
//             setAppointmentReportData(data.response)
//           }

//         } catch (error) {
//           toast.error(error?.response?.data?.message || "Something went wrong", {
//             duration: 3000,
//             style: {
//               fontSize: "var(--font-size-2)",
//               borderRadius: '0.3rem',
//               background: '#333',
//               color: '#fff',
//             },
//           });
//         }
//       };

//       getAllReports();
//     }
//   }, [selectedDates, selectedRangeFilter, queueType, appointmentType, selectedbarberEmail, selectedbarberId]);

//   const resetHandler = () => {
//     setSelectedDates([])
//     setSelectedRangeFilter("")
//     setSelectedbarberEmail("")
//     setSelectedbarberId("")
//     setSelectedbarber("")
//     setQueueReportData(dummyReport)
//     setAppointmentReportData(dummyReport)

//     setSelectedFilter("")
//     setWeekOption("")
//     setMonthOption("")
//     setDayOption("")
//     setQueueType("")
//     setAppointmentType("")
//   }


//   return (
//     <div className={`${style.salon_wrapper} ${darkmodeOn && style.dark}`}>
//       <div>
//         <p>Reports</p>
//         <div className={`${style.select_container}`}>
//           <div className={`${style.barber_container} ${darkmodeOn && style.dark}`}>
//             <input
//               placeholder='Select Barber'
//               value={selectedbarber}
//               onClick={() => setOpenBarberContainer((prev) => !prev)}
//             />

//             {
//               openbarberContainer && (
//                 <ClickAwayListener onClickAway={() => setOpenBarberContainer(false)}>
//                   <div className={`${style.barber_container_dropdown} ${darkmodeOn && style.dark}`}>

//                     {
//                       getAdminBarberListLoading ? (
//                         <Skeleton count={6} height={"4.5rem"} style={{ marginBottom: "1rem" }}
//                           baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                           highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                         />
//                       ) : BarberList?.length > 0 ? (
//                         BarberList.map((b) => {
//                           return (
// <div
//   className={`${style.barber_item} ${darkmodeOn && style.dark}`}
//   key={b.barberId}
//   style={{
//     border: selectedbarber === b.name ? "0.1rem solid rgba(0,0,0,0.6)" : "0.1rem solid rgba(0,0,0,0.2)"
//   }}
//   onClick={() => {
//     setSelectedbarber(b.name)
//     setSelectedbarberId(b.barberId)
//     setSelectedbarberEmail(b.email)
//     setQueueReportData(dummyReport)
//     setWeekOption("")
//     setMonthOption("")
//     setDayOption("")
//     setSelectedFilter("")
//     setOpenBarberContainer(false)
//   }}
// >
//   <div>
//     <img src={b?.profile?.[0]?.url} alt="" />
//   </div>
//   <p>{b?.name}</p>
// </div>
//                           )
//                         })
//                       ) : (
//                         <div style={{
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           height: "100%"
//                         }}>
//                           <p style={{ fontSize: "1.4rem" }}>No barber</p>
//                         </div>
//                       )
//                     }

//                   </div>
//                 </ClickAwayListener>
//               )
//             }
//           </div>

//           <div>
// <DatePicker
//   numberOfMonths={isMobile ? 1 : 2}
//   value={selectedDates}
//   range
//   placeholder='yyyy-mm-dd - yyyy-mm-dd'
//   onChange={handleDateChange}
//   dateSeparator={" - "}
//   calendarPosition={"bottom-right"}
//   className={darkmodeOn ? "dark-theme" : "light-theme"}
//   style={{
//     background: darkmodeOn ? "#222" : "#fff"
//   }}
// />
//           </div>

//           <select name="" id=""
//             className={`${darkmodeOn && style.dark}`}
//             onChange={(e) => setSelectedRangeFilter(e.target.value)} value={selectedRangeFilter}
//           >
//             <option value="" disabled>Select a range</option>
//             <option value="daily">daily</option>
//             <option value="weekly">Weekly</option>
//             <option value="monthly">Monthly</option>
//           </select>

//           <button onClick={resetHandler} className={`${style.reset_btn} ${darkmodeOn && style.dark}`}>Reset</button>


//         </div>


//       </div>

//       <div className={`${style.filter_container} ${darkmodeOn && style.dark}`}>
//         <div
//           className={selectedFilter === "daily" ? style.checked : style.unchecked}
//           onClick={() => {
//             setSelectedFilter("daily")
//             setSelectedRangeFilter("")
//             setSelectedDates([])
//             setWeekOption("")
//             setMonthOption("")
//             setQueueReportData(dummyReport)
//             setAppointmentReportData(dummyReport)
//             setSelectedbarberEmail("")
//             setSelectedbarber("")
//             setSelectedbarberId("")
//           }}
//         >
//           <p>Daily</p>
//           {selectedFilter === "daily" && (
//             <select onChange={(e) => setDayOption(e.target.value)} value={dayOption} className={`${darkmodeOn && style.dark}`}>
//               <option value="" disabled>Select a range</option>
//               <option value="7">Last 7 Days</option>
//               <option value="12">Last 12 Days</option>
//               <option value="14">Last 14 Days</option>
//             </select>
//           )}
//         </div>

//         <div
//           className={selectedFilter === "weekly" ? style.checked : style.unchecked}
//           onClick={() => {
//             setSelectedFilter("weekly")
//             setSelectedRangeFilter("")
//             setSelectedDates([])
//             setMonthOption("")
//             setDayOption("")
//             setQueueReportData(dummyReport)
//             setAppointmentReportData(dummyReport)
//             setSelectedbarberEmail("")
//             setSelectedbarber("")
//             setSelectedbarberId("")
//           }}
//         >
//           <p>Weekly</p>
//           {selectedFilter === "weekly" && (
//             <select onChange={(e) => setWeekOption(e.target.value)} value={weekOption} className={`${darkmodeOn && style.dark}`}>
//               <option value="" disabled>Select a range</option>
//               <option value="0">This Week</option>
//               <option value="2">Last 2 Week</option>
//               <option value="4">Last 4 Weeks</option>
//             </select>
//           )}
//         </div>

//         <div
//           className={selectedFilter === "monthly" ? style.checked : style.unchecked}
//           onClick={() => {
//             setSelectedFilter("monthly")
//             setSelectedRangeFilter("")
//             setSelectedDates([])
//             setWeekOption("")
//             setDayOption("")
//             setQueueReportData(dummyReport)
//             setAppointmentReportData(dummyReport)
//             setSelectedbarberEmail("")
//             setSelectedbarber("")
//             setSelectedbarberId("")
//           }}
//         >
//           <p>Monthly</p>
//           {selectedFilter === "monthly" && (
//             <select onChange={(e) => setMonthOption(e.target.value)} value={monthOption} className={`${darkmodeOn && style.dark}`}>
//               <option value="" disabled>Select a range</option>
//               <option value="0">This year</option>
//               <option value="3">Last 3 Months</option>
//               <option value="6">Last 6 Months</option>
//               <option value="12">Last 12 Months</option>
//             </select>
//           )}
//         </div>

//         <div>

//           <select onChange={(e) => {
//             setAppointmentType("")
//             setAppointmentReportData(dummyReport)
//             setQueueType(e.target.value)
//           }} value={queueType} className={`${darkmodeOn && style.dark}`}>
//             <option value="" disabled>Select queue type</option>
//             <option value="queueserved">Queue Serve</option>
//             <option value="queuecancelled">Queue Cancel</option>
//           </select>
//         </div>

//         <div>
//           <select onChange={(e) => {
//             setQueueType("")
//             setQueueReportData(dummyReport)
//             setAppointmentType(e.target.value)
//           }} value={appointmentType} className={`${darkmodeOn && style.dark}`}>
//             <option value="" disabled>Select appointment type</option>
//             <option value="appointmentserved">Appointment Serve</option>
//             <option value="appointmentcancelled">Appointment Cancel</option>
//           </select>
//         </div>

//       </div>

//       <div className={`${style.report_container}`}>
//       <p style={{
//             marginBottom: 20
//           }}>Queue Report</p>

//           <ResponsiveContainer width={isMobile ? "200%" : "100%"} height="50%">
//             {QueueReportData.length > 0 ? (
//               <BarChart
//                 width={150}
//                 height={50}
//                 data={QueueReportData}
//                 margin={{ bottom: 30 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey={
//                     (selectedRangeFilter || selectedFilter) === "daily"
//                       ? "date"
//                       : (selectedRangeFilter || selectedFilter) === "weekly"
//                         ? "week"
//                         : (selectedRangeFilter || selectedFilter) === "monthly"
//                           ? "month"
//                           : ""
//                   }
//                   tick={{ fontSize: 12 }}
//                   angle={(selectedRangeFilter || selectedFilter) === "daily" ? -45 : 0}
//                   textAnchor="end"
//                   dy={10}
//                   interval={0}
//                 />
//                 <Tooltip />
//                 <Bar dataKey="TotalQueue" fill="rgba(255, 0, 0, 0.393)" stroke="rgba(255, 0, 0, 0.393)" strokeWidth={1} />
//               </BarChart>
//             ) : (
//               <div style={{ height: "20rem", marginInline: "0.5rem", border: darkmodeOn ? "0.1rem solid rgba(255,255,255,0.2)" : "0.1rem solid rgba(0,0,0,0.2)", textAlign: "center", alignContent: "center", boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px", borderRadius: "4px" }}>
//                 No Queue Report Available
//               </div>
//             )}
//           </ResponsiveContainer>

//           <div style={{ marginBlock: "1rem" }}></div>

//           <p style={{
//             marginBottom: 20
//           }}>Appointment Report</p>

//           <ResponsiveContainer width={isMobile ? "200%" : "100%"} height="50%">
//             {AppointmentReportData.length > 0 ? (
//               <BarChart
//                 width={150}
//                 height={50}
//                 data={AppointmentReportData}
//                 margin={{ bottom: 30 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey={
//                     (selectedRangeFilter || selectedFilter) === "daily"
//                       ? "date"
//                       : (selectedRangeFilter || selectedFilter) === "weekly"
//                         ? "week"
//                         : (selectedRangeFilter || selectedFilter) === "monthly"
//                           ? "month"
//                           : ""
//                   }
//                   tick={{ fontSize: 12 }}
//                   angle={(selectedRangeFilter || selectedFilter) === "daily" ? -45 : 0}
//                   textAnchor="end"
//                   dy={10}
//                   interval={0}
//                 />
//                 <Tooltip />
//                 <Bar dataKey="TotalQueue" fill="rgba(255, 0, 0, 0.393)" stroke="rgba(255, 0, 0, 0.393)" strokeWidth={1} />
//               </BarChart>
//             ) : (
//               <div style={{ height: "20rem", marginInline: "0.5rem", border: darkmodeOn ? "0.1rem solid rgba(255,255,255,0.2)" : "0.1rem solid rgba(0,0,0,0.2)", textAlign: "center", alignContent: "center", boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px", borderRadius: "4px" }}>
//                 No Appointment Report Available
//               </div>
//             )}
//           </ResponsiveContainer>
//       </div>

//     </div>
//   )
// }

// export default Report


import React, { useEffect, useRef, useState } from 'react'
import style from './Report.module.css'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import { useDispatch, useSelector } from 'react-redux'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Box, ClickAwayListener, Modal, Typography } from '@mui/material'
import api from '../../Redux/api/Api'
import Calendar from "react-multi-date-picker";
import { getAdminBarberListAction } from '../../Redux/Admin/Actions/BarberAction'
import Skeleton from 'react-loading-skeleton'
import toast from 'react-hot-toast'
import { CheckIcon, CloseIcon, FilterIcon, ResetIcon, SearchIcon } from '../../newicons';

const Report = () => {

  const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
  const dispatch = useDispatch()
  const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"


  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedRangeFilter, setSelectedRangeFilter] = useState("")

  const [weekOption, setWeekOption] = useState("");
  const [monthOption, setMonthOption] = useState("");
  const [dayOption, setDayOption] = useState("");
  const [queueType, setQueueType] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [selectType, setSelectType] = useState("Salon")

  const [dummyReport] = useState([
    {
      "0": "0",
      "TotalQueue": 0
    },
    {
      "1": "1",
      "TotalQueue": 0
    },
    {
      "2": "2",
      "TotalQueue": 0
    },
    {
      "3": "3",
      "TotalQueue": 0
    },
    {
      "4": "4",
      "TotalQueue": 0
    },
    {
      "5": "5",
      "TotalQueue": 0
    },
    {
      "6": "6",
      "TotalQueue": 0
    }
  ])


  const [reportData, setReportData] = useState(dummyReport)


  const [selectedDates, setSelectedDates] = useState([])

  const handleDateChange = (dates) => {
    const formatedDates = dates.map((date) => date.format("DD/MM/YYYY"))
    setSelectedDates(formatedDates)
    setSelectedFilter("")
    setWeekOption("")
    setMonthOption("")
    setDayOption("")
  }


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 600px)").matches);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  const [selectedbarber, setSelectedbarber] = useState("")
  const [selectedbarberId, setSelectedbarberId] = useState("")
  const [selectedbarberEmail, setSelectedbarberEmail] = useState("")

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
    getAllBarbers: BarberList
  } = getAdminBarberList

  const [isMobile, setIsMobile] = useState(false);

  const toApiFormat = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`; // yyyy-mm-dd
  };

  const viewReport = async () => {
    try {
      let reportOptions = {
        salonId,
        reportValue: queueType || appointmentType,
      };

      if (selectType === "Salon" && selectedFilter && (dayOption || weekOption || monthOption) && (queueType || appointmentType)) {
        reportOptions = {
          ...reportOptions,
          reportType: selectedFilter,
          ...(selectedFilter === "daily" && { days: Number(dayOption) }),
          ...(selectedFilter === "weekly" && { week: Number(weekOption) }),
          ...(selectedFilter === "monthly" && { month: Number(monthOption) }),
        };
      }

      else if ((selectType === "Barber" || selectType === "Stylist") && selectedFilter && (dayOption || weekOption || monthOption) && (queueType || appointmentType)) {
        if (!selectedbarberEmail || !selectedbarberId) {
          toast.error(`Please select ${selectType.toLowerCase()}`, {
            duration: 3000,
            style: {
              fontSize: "var(--font-size-2)",
              borderRadius: '0.3rem',
              background: '#333',
              color: '#fff',
            },
          });
          return;
        }

        reportOptions = {
          ...reportOptions,
          reportType: selectedFilter,
          ...(selectedFilter === "daily" && { days: Number(dayOption) }),
          ...(selectedFilter === "weekly" && { week: Number(weekOption) }),
          ...(selectedFilter === "monthly" && { month: Number(monthOption) }),
          barberEmail: selectedbarberEmail,
          barberId: selectedbarberId,
        };
      }

      else if (selectType === "Salon" && selectedDates.length > 0 && (queueType || appointmentType)) {
        reportOptions = {
          ...reportOptions,
          reportType: "range",
          from: toApiFormat(selectedDates[0]),
          to: toApiFormat(selectedDates[1]),
        };
      }

      else if ((selectType === "Barber" || selectType === "Stylist") && selectedDates.length > 0 && (queueType || appointmentType)) {
        if (!selectedbarberEmail || !selectedbarberId) {
          toast.error(`Please select ${selectType.toLowerCase()}`, {
            duration: 3000,
            style: {
              fontSize: "var(--font-size-2)",
              borderRadius: '0.3rem',
              background: '#333',
              color: '#fff',
            },
          });
          return;
        }



        reportOptions = {
          ...reportOptions,
          reportType: "range",
          from: toApiFormat(selectedDates[0]),
          to: toApiFormat(selectedDates[1]),
          barberEmail: selectedbarberEmail,
          barberId: selectedbarberId,
        };
      }

      const { data } = await api.post("/api/reports/getSalonReports", reportOptions);
      setReportData(data.response);

    } catch (error) {

      console.error("API Error:", error);

      toast.error(error?.response?.data?.message || "Something went wrong", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };


  const resetHandler = () => {
    setSelectedDates([])
    setSelectedRangeFilter("")
    setSelectedbarberEmail("")
    setSelectedbarberId("")
    setSelectedbarber("")
    // setQueueReportData(dummyReport)
    // setAppointmentReportData(dummyReport)
    setReportData(dummyReport)
    setSelectType("Salon")

    setSelectedFilter("")
    setWeekOption("")
    setMonthOption("")
    setDayOption("")
    setQueueType("")
    setAppointmentType("")
  }

  const currentSalonType = localStorage.getItem("CurrentSalonType")

  // ============================================

  const reportType = [
    {
      type: "Daily",
      value: "daily",
    },
    {
      type: "Weekly",
      value: "weekly"
    },
    {
      type: "Monthly",
      value: "monthly"
    }
  ]

  const QueueType = [
    {
      type: "Queue Served",
      value: "queueserved"
    },
    {
      type: "Queue Cancelled",
      value: "queuecancelled"
    },
  ]

  const AppointmentType = [
    {
      type: "Appointment Served",
      value: "appointmentserved",
    },
    {
      type: "Appointment Cancelled",
      value: "appointmentcancelled"
    },
  ]


  const SelectType = [
    {
      type: "Salon Report",
      value: "Salon"
    },
    {
      type: `${currentSalonType === "Barber Shop" ? "Barber" : currentSalonType === "Hair Dresser" ? "Stylist" : "Barber"} Report`,
      value: `${currentSalonType === "Barber Shop" ? "Barber" : currentSalonType === "Hair Dresser" ? "Stylist" : "Barber"}`
    },
  ]


  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  return (
    <div className={style.section}>
      <div>
        <h2>Reports</h2>
        <div>

          <Calendar
            // numberOfMonths={isMobile ? 1 : 2}
            numberOfMonths={false ? 1 : 2}
            value={selectedDates}
            onChange={handleDateChange}
            range
            placeholder='dd/mm/yyyy - dd/mm/yyyy'
            // onChange={handleDateChange}
            dateSeparator={" - "}
            calendarPosition={"bottom-right"}
            format="DD/MM/YYYY"
            className={true ? "dark-theme" : "light-theme"}
            style={{
              // background: true ? "#222" : "#fff"
            }}
          />

          <button onClick={resetHandler}><ResetIcon /></button>
          <button onClick={viewReport}
            disabled={adminProfile?.salonId == 0}
            style={{
              cursor: adminProfile?.salonId == 0 ? "not-allowed" : "pointer"
            }}
          >View Report</button>
        </div>
      </div>

      <div>
        <div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={reportData}
              margin={{
                left: -20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={
                  (selectedRangeFilter || selectedFilter) === "daily"
                    ? "date"
                    : (selectedRangeFilter || selectedFilter) === "weekly"
                      ? "week"
                      : (selectedRangeFilter || selectedFilter) === "monthly"
                        ? "month"
                        : "range"
                } />
              <YAxis dataKey={"TotalQueue"} />
              <Tooltip
                cursor={{ fill: "var(--input-bg-color)" }}
                contentStyle={{
                  backgroundColor: "var(--bg-primary)",
                  border: "0.1rem solid var(--border-secondary)",
                }}
                wrapperStyle={{
                  outline: "none"
                }}
              />

              <Bar dataKey="TotalQueue" fill="var(--bg-secondary)" radius={[2, 2, 2, 2]} />
            </BarChart>
          </ResponsiveContainer>
          <div className={`${style.report_footer}`}>
            <p>Report Type -
              {queueType === "queueserved"
                ? `Queue Served (${((selectedFilter || "")) || (selectedDates.length > 0 && "Range" || "")})` :
                queueType === "queuecancelled" ?
                  `Queue Cancelled (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` :
                  appointmentType === "appointmentserved" ?
                    `Appointment Served (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` :
                    appointmentType === "appointmentcancelled" ?
                      `Appointment Cancelled (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` : ""}
            </p>
            <p>Select - {selectType}</p>
          </div>
        </div>
        <div>

          <div>
            <div>
              <p>Report Type</p>
              {
                reportType.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        style={{
                          background: selectedFilter === item.value ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
                        }}
                        onClick={() => {
                          setSelectedDates([])
                          setSelectedFilter(item.value)
                          if (item.value === "daily") {
                            setDayOption(10)
                          } else if (item.value === "weekly") {
                            setWeekOption(4)
                          } else {
                            setMonthOption(6)
                          }
                        }}
                      >{selectedFilter === item.value ? <CheckIcon /> : ""}</button>
                      <p>{item.type}</p>
                    </div>
                  )
                })
              }
            </div>

            <div>
              <p>Queue Type</p>
              {
                QueueType.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        style={{
                          background: item.value === queueType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
                        }}
                        onClick={() => {
                          setAppointmentType("")
                          setQueueType(item.value)
                        }}
                      >{item.value === queueType ? <CheckIcon /> : ""}</button>
                      <p>{item.type}</p>
                    </div>
                  )
                })
              }
            </div>

            <div>
              <p>Appointment Type</p>
              {
                AppointmentType.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        style={{
                          background: item.value === appointmentType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
                        }}
                        onClick={() => {
                          setQueueType("")
                          setAppointmentType(item.value)
                        }}
                      >{item.value === appointmentType ? <CheckIcon /> : ""}</button>
                      <p>{item.type}</p>
                    </div>
                  )
                })
              }
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <p>Select </p>
              {
                SelectType.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        style={{
                          background: item.value === selectType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
                        }}
                        onClick={() => {
                          setSelectType(item.value)
                        }}
                      >{item.value === selectType ? <CheckIcon /> : ""}</button>
                      <p>{item.type}</p>
                    </div>
                  )
                })
              }
            </div>


            {
              (selectType === "Barber" || selectType === "Stylist") && BarberList?.length > 0 ? BarberList?.map((item) => {
                return (<div
                  className={`${style.barber_item}`}
                  key={item.barberId}
                  onClick={() => {
                    setSelectedbarber(item.name)
                    setSelectedbarberId(item.barberId)
                    setSelectedbarberEmail(item.email)
                  }}
                  style={{
                    border: selectedbarber === item.name ? "0.1rem solid var(--text-primary)" : ""
                  }}
                >
                  <img src={item.profile?.[0].url} alt="" />

                  <p>{item.name}</p>
                </div>)
              }) : null
            }

          </div>
        </div>
      </div>

      <div className={`${style.mobile_report_header}`}>
        <div>
          <h2>Reports</h2>
          <button onClick={() => setMobileFilterOpen(true)}><FilterIcon /></button>
        </div>
      </div>


      <div className={`${style.mobile_report_body}`}>
        <div className={`${style.report_body_content}`}>
          <ResponsiveContainer width="200%" height="85%">
            <BarChart
              data={reportData}
              margin={{
                left: -10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={
                  (selectedRangeFilter || selectedFilter) === "daily"
                    ? "date"
                    : (selectedRangeFilter || selectedFilter) === "weekly"
                      ? "week"
                      : (selectedRangeFilter || selectedFilter) === "monthly"
                        ? "month"
                        : "range"
                } />
              <YAxis dataKey={"TotalQueue"} />
              <Tooltip
                cursor={{ fill: "var(--input-bg-color)" }}
                contentStyle={{
                  backgroundColor: "var(--bg-primary)",
                  border: "0.1rem solid var(--border-secondary)",
                }}
                wrapperStyle={{
                  outline: "none"
                }}
              />

              <Bar dataKey="TotalQueue" fill="var(--bg-secondary)" radius={[2, 2, 2, 2]} />
            </BarChart>
          </ResponsiveContainer>

          <div className={`${style.report_footer}`}>
            <p>Report Type -
              {queueType === "queueserved"
                ? `Queue Served (${((selectedFilter || "")) || (selectedDates.length > 0 && "Range" || "")})` :
                queueType === "queuecancelled" ?
                  `Queue Cancelled (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` :
                  appointmentType === "appointmentserved" ?
                    `Appointment Served (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` :
                    appointmentType === "appointmentcancelled" ?
                      `Appointment Cancelled (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` : ""}
            </p>
            <p>Select - {selectType}</p>
          </div>

        </div>
      </div>


      <Modal
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className={style.modalbox}>
          <div>
            <p>Apply Filter</p>
            <button onClick={() => setMobileFilterOpen(false)}><CloseIcon /></button>
          </div>

          <div>
            <p>Report Type</p>
            <div>
              {
                reportType.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        style={{
                          background: selectedFilter === item.value ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
                          color: "var(--btn-text-color)"
                        }}
                        onClick={() => {
                          setSelectedDates([])
                          setSelectedFilter(item.value)
                          if (item.value === "daily") {
                            setDayOption(10)
                          } else if (item.value === "weekly") {
                            setWeekOption(4)
                          } else {
                            setMonthOption(6)
                          }
                        }}
                      >{selectedFilter === item.value ? <CheckIcon /> : ""}</button>
                      <p>{item.type}</p>
                    </div>
                  )
                })
              }
            </div>

            <p>Queue Type</p>
            <div>
              {
                QueueType.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        style={{
                          background: item.value === queueType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
                          color: "var(--btn-text-color)"
                        }}
                        onClick={() => {
                          setAppointmentType("")
                          setQueueType(item.value)
                        }}
                      >{item.value === queueType ? <CheckIcon /> : ""}</button>
                      <p>{item.type}</p>
                    </div>
                  )
                })
              }
            </div>

            <p>Appointment Type</p>
            <div>
              {
                AppointmentType.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        style={{
                          background: item.value === appointmentType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
                          color: "var(--btn-text-color)"
                        }}
                        onClick={() => {
                          setQueueType("")
                          setAppointmentType(item.value)
                        }}
                      >{item.value === appointmentType ? <CheckIcon /> : ""}</button>
                      <p>{item.type}</p>
                    </div>
                  )
                })
              }
            </div>

            <p>Select </p>
            <div>
              {
                SelectType.map((item, index) => {
                  return (
                    <div key={index}>
                      <button
                        style={{
                          background: item.value === selectType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
                          color: "var(--btn-text-color)"
                        }}
                        onClick={() => {
                          setSelectType(item.value)
                        }}
                      >{item.value === selectType ? <CheckIcon /> : ""}</button>
                      <p>{item.type}</p>
                    </div>
                  )
                })
              }
            </div>

            {
              selectType === "Barber" && BarberList?.length > 0 ? (<div className={`${style.barberlist_container}`}>
                {
                  BarberList?.map((item) => {
                    return (<div
                      className={`${style.barber_item}`}
                      key={item.barberId}
                      onClick={() => {
                        setSelectedbarber(item.name)
                        setSelectedbarberId(item.barberId)
                        setSelectedbarberEmail(item.email)
                      }}
                      style={{
                        border: selectedbarber === item.name ? "0.1rem solid var(--text-primary)" : ""
                      }}
                    >
                      <img src={item.profile?.[0].url} alt="" />

                      <p>{item.name}</p>
                    </div>)
                  })
                }
              </div>) : (null)
            }

            <div>
              <Calendar
                // numberOfMonths={isMobile ? 1 : 2}
                numberOfMonths={1}
                value={selectedDates}
                onChange={handleDateChange}
                range
                placeholder='dd/mm/yyyy - dd/mm/yyyy'
                // onChange={handleDateChange}
                format="DD/MM/YYYY"
                dateSeparator={" - "}
                calendarPosition={"bottom-right"}
                className={true ? "dark-theme" : "light-theme"}
                style={{
                  // background: true ? "#222" : "#fff"
                }}
              />

              <button onClick={resetHandler}><ResetIcon /></button>

            </div>

            <button onClick={() => {
              setMobileFilterOpen(false)
              viewReport()
            }}
              disabled={adminProfile?.salonId == 0}
              style={{
                cursor: adminProfile?.salonId == 0 ? "not-allowed" : "pointer"
              }}
            >View Reports</button>
          </div>

        </Box>

      </Modal>

    </div>
  )
}

export default Report

