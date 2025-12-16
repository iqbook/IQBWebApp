// import React, { useEffect, useRef, useState } from 'react'
// import style from './Report.module.css'
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import { useDispatch, useSelector } from 'react-redux'
// import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// import { Box, ClickAwayListener, Modal, Typography } from '@mui/material'
// import api from '../../Redux/api/Api'
// import Calendar from "react-multi-date-picker";
// import { getAdminBarberListAction } from '../../Redux/Admin/Actions/BarberAction'
// import Skeleton from 'react-loading-skeleton'
// import toast from 'react-hot-toast'
// import { CheckIcon, CloseIcon, FilterIcon, ResetIcon, SearchIcon } from '../../newicons';

// const Report = () => {

//   const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
//   const dispatch = useDispatch()
//   const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])

//   const darkMode = useSelector(darkmodeSelector)

//   const darkmodeOn = darkMode === "On"

//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedRangeFilter, setSelectedRangeFilter] = useState("")

//   const [weekOption, setWeekOption] = useState("");
//   const [monthOption, setMonthOption] = useState("");
//   const [dayOption, setDayOption] = useState("");
//   const [queueType, setQueueType] = useState("")
//   const [appointmentType, setAppointmentType] = useState("")
//   const [selectType, setSelectType] = useState("Salon")

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

//   const [reportData, setReportData] = useState(dummyReport)
//   const [reportValueType, setReportValueType] = useState("")

//   const [selectedDates, setSelectedDates] = useState([])

//   const handleDateChange = (dates) => {
//     const formatedDates = dates.map((date) => date.format("DD/MM/YYYY"))
//     setSelectedDates(formatedDates)
//     setSelectedFilter("")
//     setWeekOption("")
//     setMonthOption("")
//     setDayOption("")
//   }

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

//   const [isMobile, setIsMobile] = useState(false);

//   const toApiFormat = (dateStr) => {
//     const [day, month, year] = dateStr.split("/");
//     return `${year}-${month}-${day}`; // yyyy-mm-dd
//   };

//   const viewReport = async () => {
//     try {
//       let reportOptions = {
//         salonId,
//         reportValue: queueType || appointmentType,
//       };

//       if (selectType === "Salon" && selectedFilter && (dayOption || weekOption || monthOption) && (queueType || appointmentType)) {
//         reportOptions = {
//           ...reportOptions,
//           reportType: selectedFilter,
//           ...(selectedFilter === "daily" && { days: Number(dayOption) }),
//           ...(selectedFilter === "weekly" && { week: Number(weekOption) }),
//           ...(selectedFilter === "monthly" && { month: Number(monthOption) }),
//         };
//       }

//       else if ((selectType === "Barber" || selectType === "Stylist") && selectedFilter && (dayOption || weekOption || monthOption) && (queueType || appointmentType)) {
//         if (!selectedbarberEmail || !selectedbarberId) {
//           toast.error(`Please select ${selectType.toLowerCase()}`, {
//             duration: 3000,
//             style: {
//               fontSize: "var(--font-size-2)",
//               borderRadius: '0.3rem',
//               background: '#333',
//               color: '#fff',
//             },
//           });
//           return;
//         }

//         reportOptions = {
//           ...reportOptions,
//           reportType: selectedFilter,
//           ...(selectedFilter === "daily" && { days: Number(dayOption) }),
//           ...(selectedFilter === "weekly" && { week: Number(weekOption) }),
//           ...(selectedFilter === "monthly" && { month: Number(monthOption) }),
//           barberEmail: selectedbarberEmail,
//           barberId: selectedbarberId,
//         };
//       }

//       else if (selectType === "Salon" && selectedDates.length > 0 && (queueType || appointmentType)) {
//         reportOptions = {
//           ...reportOptions,
//           reportType: "range",
//           from: toApiFormat(selectedDates[0]),
//           to: toApiFormat(selectedDates[1]),
//         };
//       }

//       else if ((selectType === "Barber" || selectType === "Stylist") && selectedDates.length > 0 && (queueType || appointmentType)) {
//         if (!selectedbarberEmail || !selectedbarberId) {
//           toast.error(`Please select ${selectType.toLowerCase()}`, {
//             duration: 3000,
//             style: {
//               fontSize: "var(--font-size-2)",
//               borderRadius: '0.3rem',
//               background: '#333',
//               color: '#fff',
//             },
//           });
//           return;
//         }

//         reportOptions = {
//           ...reportOptions,
//           reportType: "range",
//           from: toApiFormat(selectedDates[0]),
//           to: toApiFormat(selectedDates[1]),
//           barberEmail: selectedbarberEmail,
//           barberId: selectedbarberId,
//         };
//       }

//       const { data } = await api.post("/api/reports/getSalonReports", reportOptions);
//       setReportValueType(data?.valueType)
//       setReportData(data.response);

//     } catch (error) {

//       console.error("API Error:", error);

//       toast.error(error?.response?.data?.message || "Something went wrong", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: '0.3rem',
//           background: '#333',
//           color: '#fff',
//         },
//       });
//     }
//   };

//   const resetHandler = () => {
//     setSelectedDates([])
//     setSelectedRangeFilter("")
//     setSelectedbarberEmail("")
//     setSelectedbarberId("")
//     setSelectedbarber("")
//     // setQueueReportData(dummyReport)
//     // setAppointmentReportData(dummyReport)
//     setReportData(dummyReport)
//     setSelectType("Salon")

//     setSelectedFilter("")
//     setWeekOption("")
//     setMonthOption("")
//     setDayOption("")
//     setQueueType("")
//     setAppointmentType("")
//   }

//   const currentSalonType = localStorage.getItem("CurrentSalonType")

//   // ============================================

//   const reportType = [
//     {
//       type: "Daily",
//       value: "daily",
//     },
//     {
//       type: "Weekly",
//       value: "weekly"
//     },
//     {
//       type: "Monthly",
//       value: "monthly"
//     }
//   ]

//   const QueueType = [
//     {
//       type: "Queue Served",
//       value: "queueserved"
//     },
//     {
//       type: "Queue Cancelled",
//       value: "queuecancelled"
//     },
//   ]

//   const AppointmentType = [
//     {
//       type: "Appointment Served",
//       value: "appointmentserved",
//     },
//     {
//       type: "Appointment Cancelled",
//       value: "appointmentcancelled"
//     },
//   ]

//   const SelectType = [
//     {
//       type: "Salon Report",
//       value: "Salon"
//     },
//     {
//       type: `${currentSalonType === "Barber Shop" ? "Barber" : currentSalonType === "Hair Dresser" ? "Stylist" : "Barber"} Report`,
//       value: `${currentSalonType === "Barber Shop" ? "Barber" : currentSalonType === "Hair Dresser" ? "Stylist" : "Barber"}`
//     },
//   ]

//   const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

//   console.log("reportValueType ", reportValueType)

//   return (
//     <div className={style.section}>
//       <div>
//         <h2>Reports</h2>
//         <div>

// <Calendar
//   // numberOfMonths={isMobile ? 1 : 2}
//   numberOfMonths={false ? 1 : 2}
//   value={selectedDates}
//   onChange={handleDateChange}
//   range
//   placeholder='dd/mm/yyyy - dd/mm/yyyy'
//   // onChange={handleDateChange}
//   dateSeparator={" - "}
//   calendarPosition={"bottom-right"}
//   format="DD/MM/YYYY"
//   className={true ? "dark-theme" : "light-theme"}
//   style={{
//     // background: true ? "#222" : "#fff"
//   }}
// />

//           <button onClick={resetHandler}><ResetIcon /></button>
//           <button onClick={viewReport}
//             disabled={adminProfile?.salonId == 0}
//             style={{
//               cursor: adminProfile?.salonId == 0 ? "not-allowed" : "pointer"
//             }}
//           >View Report</button>
//         </div>
//       </div>

//       <div>
//         <div>
//           <ResponsiveContainer width="100%" height="90%">
//             <BarChart
//               data={reportData}
//               margin={{
//                 left: -20,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey={
//                   (selectedRangeFilter || selectedFilter) === "daily"
//                     ? "date"
//                     : (selectedRangeFilter || selectedFilter) === "weekly"
//                       ? "week"
//                       : (selectedRangeFilter || selectedFilter) === "monthly"
//                         ? "month"
//                         : "range"
//                 } />
//               <YAxis dataKey={reportValueType} />
//               <Tooltip
//                 cursor={{ fill: "var(--input-bg-color)" }}
//                 contentStyle={{
//                   backgroundColor: "var(--bg-primary)",
//                   border: "0.1rem solid var(--border-secondary)",
//                 }}
//                 wrapperStyle={{
//                   outline: "none"
//                 }}
//               />

//               <Bar dataKey={reportValueType} fill="var(--bg-secondary)" radius={[2, 2, 2, 2]} />
//             </BarChart>
//           </ResponsiveContainer>
//           <div className={`${style.report_footer}`}>
//             <p>Report Type -
//               {queueType === "queueserved"
//                 ? `Queue Served (${((selectedFilter || "")) || (selectedDates.length > 0 && "Range" || "")})` :
//                 queueType === "queuecancelled" ?
//                   `Queue Cancelled (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` :
//                   appointmentType === "appointmentserved" ?
//                     `Appointment Served (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` :
//                     appointmentType === "appointmentcancelled" ?
//                       `Appointment Cancelled (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` : ""}
//             </p>
//             <p>Select - {selectType}</p>
//           </div>
//         </div>
//         <div>

//           <div>
//             <div>
//               <p>Report Type</p>
//               {
//                 reportType.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <button
//                         style={{
//                           background: selectedFilter === item.value ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
//                         }}
//                         onClick={() => {
//                           setSelectedDates([])
//                           setSelectedFilter(item.value)
//                           if (item.value === "daily") {
//                             setDayOption(10)
//                           } else if (item.value === "weekly") {
//                             setWeekOption(4)
//                           } else {
//                             setMonthOption(6)
//                           }
//                         }}
//                       >{selectedFilter === item.value ? <CheckIcon /> : ""}</button>
//                       <p>{item.type}</p>
//                     </div>
//                   )
//                 })
//               }
//             </div>

//             <div>
//               <p>Queue Type</p>
//               {
//                 QueueType.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <button
//                         style={{
//                           background: item.value === queueType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
//                         }}
//                         onClick={() => {
//                           setAppointmentType("")
//                           setQueueType(item.value)
//                         }}
//                       >{item.value === queueType ? <CheckIcon /> : ""}</button>
//                       <p>{item.type}</p>
//                     </div>
//                   )
//                 })
//               }
//             </div>

//             <div>
//               <p>Appointment Type</p>
//               {
//                 AppointmentType.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <button
//                         style={{
//                           background: item.value === appointmentType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
//                         }}
//                         onClick={() => {
//                           setQueueType("")
//                           setAppointmentType(item.value)
//                         }}
//                       >{item.value === appointmentType ? <CheckIcon /> : ""}</button>
//                       <p>{item.type}</p>
//                     </div>
//                   )
//                 })
//               }
//             </div>

//             <div style={{ marginBottom: "2rem" }}>
//               <p>Select </p>
//               {
//                 SelectType.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <button
//                         style={{
//                           background: item.value === selectType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
//                         }}
//                         onClick={() => {
//                           setSelectType(item.value)
//                         }}
//                       >{item.value === selectType ? <CheckIcon /> : ""}</button>
//                       <p>{item.type}</p>
//                     </div>
//                   )
//                 })
//               }
//             </div>

//             {
//               (selectType === "Barber" || selectType === "Stylist") && BarberList?.length > 0 ? BarberList?.map((item) => {
//                 return (<div
//                   className={`${style.barber_item}`}
//                   key={item.barberId}
//                   onClick={() => {
//                     setSelectedbarber(item.name)
//                     setSelectedbarberId(item.barberId)
//                     setSelectedbarberEmail(item.email)
//                   }}
//                   style={{
//                     border: selectedbarber === item.name ? "0.1rem solid var(--text-primary)" : ""
//                   }}
//                 >
//                   <img src={item.profile?.[0].url} alt="" />

//                   <p>{item.name}</p>
//                 </div>)
//               }) : null
//             }

//           </div>
//         </div>
//       </div>

//       <div className={`${style.mobile_report_header}`}>
//         <div>
//           <h2>Reports</h2>
//           <button onClick={() => setMobileFilterOpen(true)}><FilterIcon /></button>
//         </div>
//       </div>

//       <div className={`${style.mobile_report_body}`}>
//         <div className={`${style.report_body_content}`}>
//           <ResponsiveContainer width="100%" height="80%">
//             <BarChart
//               data={reportData}
//               margin={{
//                 left: -35,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey={
//                   (selectedRangeFilter || selectedFilter) === "daily"
//                     ? "date"
//                     : (selectedRangeFilter || selectedFilter) === "weekly"
//                       ? "week"
//                       : (selectedRangeFilter || selectedFilter) === "monthly"
//                         ? "month"
//                         : "range"
//                 } />
//               <YAxis dataKey={reportValueType} />
//               <Tooltip
//                 cursor={{ fill: "var(--input-bg-color)" }}
//                 contentStyle={{
//                   backgroundColor: "var(--bg-primary)",
//                   border: "0.1rem solid var(--border-secondary)",
//                 }}
//                 wrapperStyle={{
//                   outline: "none"
//                 }}
//               />

//               <Bar dataKey={reportValueType} fill="var(--bg-secondary)" radius={[2, 2, 2, 2]} />
//             </BarChart>
//           </ResponsiveContainer>

//           <div className={`${style.report_footer}`}>
//             <p>Report Type -
//               {queueType === "queueserved"
//                 ? `Queue Served (${((selectedFilter || "")) || (selectedDates.length > 0 && "Range" || "")})` :
//                 queueType === "queuecancelled" ?
//                   `Queue Cancelled (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` :
//                   appointmentType === "appointmentserved" ?
//                     `Appointment Served (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` :
//                     appointmentType === "appointmentcancelled" ?
//                       `Appointment Cancelled (${(selectedFilter || "") || (selectedDates.length > 0 && "Range" || "")})` : ""}
//             </p>
//             <p>Select - {selectType}</p>
//           </div>

//         </div>
//       </div>

//       <Modal
//         open={mobileFilterOpen}
//         onClose={() => setMobileFilterOpen(false)}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box
//           className={style.modalbox}>
//           <div>
//             <p>Apply Filter</p>
//             <button onClick={() => setMobileFilterOpen(false)}><CloseIcon /></button>
//           </div>

//           <div>
//             <p>Report Type</p>
//             <div>
//               {
//                 reportType.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <button
//                         style={{
//                           background: selectedFilter === item.value ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
//                           color: "var(--btn-text-color)"
//                         }}
//                         onClick={() => {
//                           setSelectedDates([])
//                           setSelectedFilter(item.value)
//                           if (item.value === "daily") {
//                             setDayOption(10)
//                           } else if (item.value === "weekly") {
//                             setWeekOption(4)
//                           } else {
//                             setMonthOption(6)
//                           }
//                         }}
//                       >{selectedFilter === item.value ? <CheckIcon /> : ""}</button>
//                       <p>{item.type}</p>
//                     </div>
//                   )
//                 })
//               }
//             </div>

//             <p>Queue Type</p>
//             <div>
//               {
//                 QueueType.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <button
//                         style={{
//                           background: item.value === queueType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
//                           color: "var(--btn-text-color)"
//                         }}
//                         onClick={() => {
//                           setAppointmentType("")
//                           setQueueType(item.value)
//                         }}
//                       >{item.value === queueType ? <CheckIcon /> : ""}</button>
//                       <p>{item.type}</p>
//                     </div>
//                   )
//                 })
//               }
//             </div>

//             <p>Appointment Type</p>
//             <div>
//               {
//                 AppointmentType.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <button
//                         style={{
//                           background: item.value === appointmentType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
//                           color: "var(--btn-text-color)"
//                         }}
//                         onClick={() => {
//                           setQueueType("")
//                           setAppointmentType(item.value)
//                         }}
//                       >{item.value === appointmentType ? <CheckIcon /> : ""}</button>
//                       <p>{item.type}</p>
//                     </div>
//                   )
//                 })
//               }
//             </div>

//             <p>Select </p>
//             <div>
//               {
//                 SelectType.map((item, index) => {
//                   return (
//                     <div key={index}>
//                       <button
//                         style={{
//                           background: item.value === selectType ? "var(--bg-secondary)" : "var(--btn-primary-hover)",
//                           color: "var(--btn-text-color)"
//                         }}
//                         onClick={() => {
//                           setSelectType(item.value)
//                         }}
//                       >{item.value === selectType ? <CheckIcon /> : ""}</button>
//                       <p>{item.type}</p>
//                     </div>
//                   )
//                 })
//               }
//             </div>

//             {
//               (selectType === "Barber" || selectType === "Stylist") && BarberList?.length > 0 ? (<div className={`${style.barberlist_container}`}>
//                 {
//                   BarberList?.map((item) => {
//                     return (<div
//                       className={`${style.barber_item}`}
//                       key={item.barberId}
//                       onClick={() => {
//                         setSelectedbarber(item.name)
//                         setSelectedbarberId(item.barberId)
//                         setSelectedbarberEmail(item.email)
//                       }}
//                       style={{
//                         border: selectedbarber === item.name ? "0.1rem solid var(--text-primary)" : ""
//                       }}
//                     >
//                       <img src={item.profile?.[0].url} alt="" />

//                       <p>{item.name}</p>
//                     </div>)
//                   })
//                 }
//               </div>) : (null)
//             }

//             <div>
//               <Calendar
//                 // numberOfMonths={isMobile ? 1 : 2}
//                 numberOfMonths={1}
//                 value={selectedDates}
//                 onChange={handleDateChange}
//                 range
//                 placeholder='dd/mm/yyyy - dd/mm/yyyy'
//                 // onChange={handleDateChange}
//                 format="DD/MM/YYYY"
//                 dateSeparator={" - "}
//                 calendarPosition={"bottom-right"}
//                 className={true ? "dark-theme" : "light-theme"}
//                 style={{
//                   // background: true ? "#222" : "#fff"
//                 }}
//               />

//               <button onClick={resetHandler}><ResetIcon /></button>

//             </div>

//             <button onClick={() => {
//               setMobileFilterOpen(false)
//               viewReport()
//             }}
//               disabled={adminProfile?.salonId == 0}
//               style={{
//                 cursor: adminProfile?.salonId == 0 ? "not-allowed" : "pointer"
//               }}
//             >View Reports</button>
//           </div>

//         </Box>

//       </Modal>

//     </div>
//   )
// }

// export default Report

import React from "react";
import style from "./Report.module.css";
import { Calendar } from "react-multi-date-picker";
import { BarIcon } from "../../icons";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

const Report = () => {
  // #region Sample data
  const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const data02 = [
    { name: "A1", value: 100 },
    { name: "A2", value: 300 },
    { name: "B1", value: 100 },
    { name: "B2", value: 80 },
    { name: "B3", value: 40 },
    { name: "B4", value: 30 },
    { name: "B5", value: 50 },
    { name: "C1", value: 100 },
    { name: "C2", value: 200 },
    { name: "D1", value: 150 },
    { name: "D2", value: 50 },
  ];

  return (
    <div className={style.section}>
      <div className={style.section_header}>
        <button>back</button>
        <p>All Reports . Appointment Summary</p>
      </div>

      <main className={style.report_container}>
        <div className={style.report_container_top_container}>
          <div className={style.report_top_left}>
            <div>
              <p>Appointments summary</p>

              <div>
                <p>12-05-25 - 25-07-25</p>
              </div>
            </div>

            <div>
              <p>Report Type</p>
              <div>
                {["Daily", "Weekly", "Monthly"].map((item, index) => {
                  return (
                    <button
                      key={item}
                      style={{
                        backgroundColor:
                          index === 0 ? "var(--bg-secondary)" : "transparent",
                        color:
                          index === 0
                            ? "var(--btn-text-color)"
                            : "var(--text-primary)",
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p>Select Stylist</p>
              <div>
                {["All", "John", "Bob"].map((item, index) => {
                  return (
                    <button
                      key={item}
                      style={{
                        backgroundColor:
                          index === 0 ? "var(--bg-secondary)" : "transparent",
                        color:
                          index === 0
                            ? "var(--btn-text-color)"
                            : "var(--text-primary)",
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <button>view report</button>
          </div>
          <div className={style.report_top_right}>
            <p>Other Reports</p>
            <div>
              {[1, 2, 3, 4, 5].map((item) => {
                return (
                  <div className={style.report_item}>
                    <div>
                      <BarIcon color="var(--btn-text-color)" />
                    </div>
                    <div>
                      <p>Performance Dashboard</p>
                      <p>Dashboard of your business performance.</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={style.report_container_down_container}>
          <div className={style.report_bottom_left}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data01}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius="50%"
                  fill="#8884d8"
                />
                <Pie
                  data={data02}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  fill="#82ca9d"
                  label
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={style.report_bottom_right}></div>
        </div>
      </main>
    </div>
  );
};

export default Report;
