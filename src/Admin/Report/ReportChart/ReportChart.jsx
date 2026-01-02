// import React, { useEffect, useRef, useState } from "react";
// import style from "./Report.module.css";
// import { darkmodeSelector } from "../../Redux/Admin/Reducers/AdminHeaderReducer";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { Box, ClickAwayListener, Modal, Typography } from "@mui/material";
// import api from "../../Redux/api/Api";
// import Calendar from "react-multi-date-picker";
// import { getAdminBarberListAction } from "../../Redux/Admin/Actions/BarberAction";
// import Skeleton from "react-loading-skeleton";
// import toast from "react-hot-toast";
// import {
//   CheckIcon,
//   CloseIcon,
//   FilterIcon,
//   ResetIcon,
//   SearchIcon,
// } from "../../newicons";

// const Report = () => {
//   const salonId = useSelector(
//     (state) => state.AdminLoggedInMiddleware.adminSalonId
//   );
//   const dispatch = useDispatch();
//   const adminProfile = useSelector(
//     (state) => state.AdminLoggedInMiddleware.entiredata.user[0]
//   );

//   const darkMode = useSelector(darkmodeSelector);

//   const darkmodeOn = darkMode === "On";

//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedRangeFilter, setSelectedRangeFilter] = useState("");

//   const [weekOption, setWeekOption] = useState("");
//   const [monthOption, setMonthOption] = useState("");
//   const [dayOption, setDayOption] = useState("");
//   const [queueType, setQueueType] = useState("");
//   const [appointmentType, setAppointmentType] = useState("");
//   const [selectType, setSelectType] = useState("Salon");

//   const [dummyReport] = useState([
//     {
//       0: "0",
//       TotalQueue: 0,
//     },
//     {
//       1: "1",
//       TotalQueue: 0,
//     },
//     {
//       2: "2",
//       TotalQueue: 0,
//     },
//     {
//       3: "3",
//       TotalQueue: 0,
//     },
//     {
//       4: "4",
//       TotalQueue: 0,
//     },
//     {
//       5: "5",
//       TotalQueue: 0,
//     },
//     {
//       6: "6",
//       TotalQueue: 0,
//     },
//   ]);

//   const [reportData, setReportData] = useState(dummyReport);
//   const [reportValueType, setReportValueType] = useState("");

//   const [selectedDates, setSelectedDates] = useState([]);

//   const handleDateChange = (dates) => {
//     const formatedDates = dates.map((date) => date.format("DD/MM/YYYY"));
//     setSelectedDates(formatedDates);
//     setSelectedFilter("");
//     setWeekOption("");
//     setMonthOption("");
//     setDayOption("");
//   };

// useEffect(() => {
//   const handleResize = () => {
//     setIsMobile(window.matchMedia("(max-width: 600px)").matches);
//   };

//   handleResize();

//   window.addEventListener("resize", handleResize);

//   return () => {
//     window.removeEventListener("resize", handleResize);
//   };
// }, []);

//   const [selectedbarber, setSelectedbarber] = useState("");
//   const [selectedbarberId, setSelectedbarberId] = useState("");
//   const [selectedbarberEmail, setSelectedbarberEmail] = useState("");

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

//   const getAdminBarberList = useSelector((state) => state.getAdminBarberList);

//   const { loading: getAdminBarberListLoading, getAllBarbers: BarberList } =
//     getAdminBarberList;

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

//       if (
//         selectType === "Salon" &&
//         selectedFilter &&
//         (dayOption || weekOption || monthOption) &&
//         (queueType || appointmentType)
//       ) {
//         reportOptions = {
//           ...reportOptions,
//           reportType: selectedFilter,
//           ...(selectedFilter === "daily" && { days: Number(dayOption) }),
//           ...(selectedFilter === "weekly" && { week: Number(weekOption) }),
//           ...(selectedFilter === "monthly" && { month: Number(monthOption) }),
//         };
//       } else if (
//         (selectType === "Barber" || selectType === "Stylist") &&
//         selectedFilter &&
//         (dayOption || weekOption || monthOption) &&
//         (queueType || appointmentType)
//       ) {
//         if (!selectedbarberEmail || !selectedbarberId) {
//           toast.error(`Please select ${selectType.toLowerCase()}`, {
//             duration: 3000,
//             style: {
//               fontSize: "var(--font-size-2)",
//               borderRadius: "0.3rem",
//               background: "#333",
//               color: "#fff",
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
//       } else if (
//         selectType === "Salon" &&
//         selectedDates.length > 0 &&
//         (queueType || appointmentType)
//       ) {
//         reportOptions = {
//           ...reportOptions,
//           reportType: "range",
//           from: toApiFormat(selectedDates[0]),
//           to: toApiFormat(selectedDates[1]),
//         };
//       } else if (
//         (selectType === "Barber" || selectType === "Stylist") &&
//         selectedDates.length > 0 &&
//         (queueType || appointmentType)
//       ) {
//         if (!selectedbarberEmail || !selectedbarberId) {
//           toast.error(`Please select ${selectType.toLowerCase()}`, {
//             duration: 3000,
//             style: {
//               fontSize: "var(--font-size-2)",
//               borderRadius: "0.3rem",
//               background: "#333",
//               color: "#fff",
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

//       const { data } = await api.post(
//         "/api/reports/getSalonReports",
//         reportOptions
//       );
//       setReportValueType(data?.valueType);
//       setReportData(data.response);
//     } catch (error) {
//       console.error("API Error:", error);

//       toast.error(error?.response?.data?.message || "Something went wrong", {
//         duration: 3000,
//         style: {
//           fontSize: "var(--font-size-2)",
//           borderRadius: "0.3rem",
//           background: "#333",
//           color: "#fff",
//         },
//       });
//     }
//   };

//   const resetHandler = () => {
//     setSelectedDates([]);
//     setSelectedRangeFilter("");
//     setSelectedbarberEmail("");
//     setSelectedbarberId("");
//     setSelectedbarber("");
//     // setQueueReportData(dummyReport)
//     // setAppointmentReportData(dummyReport)
//     setReportData(dummyReport);
//     setSelectType("Salon");

//     setSelectedFilter("");
//     setWeekOption("");
//     setMonthOption("");
//     setDayOption("");
//     setQueueType("");
//     setAppointmentType("");
//   };

//   const currentSalonType = localStorage.getItem("CurrentSalonType");

//   // ============================================

//   const reportType = [
//     {
//       type: "Daily",
//       value: "daily",
//     },
//     {
//       type: "Weekly",
//       value: "weekly",
//     },
//     {
//       type: "Monthly",
//       value: "monthly",
//     },
//   ];

//   const QueueType = [
//     {
//       type: "Queue Served",
//       value: "queueserved",
//     },
//     {
//       type: "Queue Cancelled",
//       value: "queuecancelled",
//     },
//   ];

//   const AppointmentType = [
//     {
//       type: "Appointment Served",
//       value: "appointmentserved",
//     },
//     {
//       type: "Appointment Cancelled",
//       value: "appointmentcancelled",
//     },
//   ];

//   const SelectType = [
//     {
//       type: "Salon Report",
//       value: "Salon",
//     },
//     {
//       type: `${
//         currentSalonType === "Barber Shop"
//           ? "Barber"
//           : currentSalonType === "Hair Dresser"
//           ? "Stylist"
//           : "Barber"
//       } Report`,
//       value: `${
//         currentSalonType === "Barber Shop"
//           ? "Barber"
//           : currentSalonType === "Hair Dresser"
//           ? "Stylist"
//           : "Barber"
//       }`,
//     },
//   ];

//   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

//   console.log("reportValueType ", reportValueType);

//   return (
//     <div className={style.section}>
//       <div>
//         <h2>Reports</h2>
//         <div>
//           <Calendar
//             // numberOfMonths={isMobile ? 1 : 2}
//             numberOfMonths={false ? 1 : 2}
//             value={selectedDates}
//             onChange={handleDateChange}
//             range
//             placeholder="dd/mm/yyyy - dd/mm/yyyy"
//             // onChange={handleDateChange}
//             dateSeparator={" - "}
//             calendarPosition={"bottom-right"}
//             format="DD/MM/YYYY"
//             className={true ? "dark-theme" : "light-theme"}
//             style={
//               {
//                 // background: true ? "#222" : "#fff"
//               }
//             }
//           />

//           <button onClick={resetHandler}>
//             <ResetIcon />
//           </button>
//           <button
//             onClick={viewReport}
//             disabled={adminProfile?.salonId == 0}
//             style={{
//               cursor: adminProfile?.salonId == 0 ? "not-allowed" : "pointer",
//             }}
//           >
//             View Report
//           </button>
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
//                     ? "week"
//                     : (selectedRangeFilter || selectedFilter) === "monthly"
//                     ? "month"
//                     : "range"
//                 }
//               />
//               <YAxis dataKey={reportValueType} />
//               <Tooltip
//                 cursor={{ fill: "var(--input-bg-color)" }}
//                 contentStyle={{
//                   backgroundColor: "var(--bg-primary)",
//                   border: "0.1rem solid var(--border-secondary)",
//                 }}
//                 wrapperStyle={{
//                   outline: "none",
//                 }}
//               />

//               <Bar
//                 dataKey={reportValueType}
//                 fill="var(--bg-secondary)"
//                 radius={[2, 2, 2, 2]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//           <div className={`${style.report_footer}`}>
//             <p>
//               Report Type -
//               {queueType === "queueserved"
//                 ? `Queue Served (${
//                     selectedFilter ||
//                     "" ||
//                     (selectedDates.length > 0 && "Range") ||
//                     ""
//                   })`
//                 : queueType === "queuecancelled"
//                 ? `Queue Cancelled (${
//                     selectedFilter ||
//                     "" ||
//                     (selectedDates.length > 0 && "Range") ||
//                     ""
//                   })`
//                 : appointmentType === "appointmentserved"
//                 ? `Appointment Served (${
//                     selectedFilter ||
//                     "" ||
//                     (selectedDates.length > 0 && "Range") ||
//                     ""
//                   })`
//                 : appointmentType === "appointmentcancelled"
//                 ? `Appointment Cancelled (${
//                     selectedFilter ||
//                     "" ||
//                     (selectedDates.length > 0 && "Range") ||
//                     ""
//                   })`
//                 : ""}
//             </p>
//             <p>Select - {selectType}</p>
//           </div>
//         </div>
//         <div>
//           <div>
//             <div>
//               <p>Report Type</p>
//               {reportType.map((item, index) => {
//                 return (
//                   <div key={index}>
//                     <button
//                       style={{
//                         background:
//                           selectedFilter === item.value
//                             ? "var(--bg-secondary)"
//                             : "var(--btn-primary-hover)",
//                       }}
//                       onClick={() => {
//                         setSelectedDates([]);
//                         setSelectedFilter(item.value);
//                         if (item.value === "daily") {
//                           setDayOption(10);
//                         } else if (item.value === "weekly") {
//                           setWeekOption(4);
//                         } else {
//                           setMonthOption(6);
//                         }
//                       }}
//                     >
//                       {selectedFilter === item.value ? <CheckIcon /> : ""}
//                     </button>
//                     <p>{item.type}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <div>
//               <p>Queue Type</p>
//               {QueueType.map((item, index) => {
//                 return (
//                   <div key={index}>
//                     <button
//                       style={{
//                         background:
//                           item.value === queueType
//                             ? "var(--bg-secondary)"
//                             : "var(--btn-primary-hover)",
//                       }}
//                       onClick={() => {
//                         setAppointmentType("");
//                         setQueueType(item.value);
//                       }}
//                     >
//                       {item.value === queueType ? <CheckIcon /> : ""}
//                     </button>
//                     <p>{item.type}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <div>
//               <p>Appointment Type</p>
//               {AppointmentType.map((item, index) => {
//                 return (
//                   <div key={index}>
//                     <button
//                       style={{
//                         background:
//                           item.value === appointmentType
//                             ? "var(--bg-secondary)"
//                             : "var(--btn-primary-hover)",
//                       }}
//                       onClick={() => {
//                         setQueueType("");
//                         setAppointmentType(item.value);
//                       }}
//                     >
//                       {item.value === appointmentType ? <CheckIcon /> : ""}
//                     </button>
//                     <p>{item.type}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <div style={{ marginBottom: "2rem" }}>
//               <p>Select </p>
//               {SelectType.map((item, index) => {
//                 return (
//                   <div key={index}>
//                     <button
//                       style={{
//                         background:
//                           item.value === selectType
//                             ? "var(--bg-secondary)"
//                             : "var(--btn-primary-hover)",
//                       }}
//                       onClick={() => {
//                         setSelectType(item.value);
//                       }}
//                     >
//                       {item.value === selectType ? <CheckIcon /> : ""}
//                     </button>
//                     <p>{item.type}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             {(selectType === "Barber" || selectType === "Stylist") &&
//             BarberList?.length > 0
//               ? BarberList?.map((item) => {
//                   return (
//                     <div
//                       className={`${style.barber_item}`}
//                       key={item.barberId}
//                       onClick={() => {
//                         setSelectedbarber(item.name);
//                         setSelectedbarberId(item.barberId);
//                         setSelectedbarberEmail(item.email);
//                       }}
//                       style={{
//                         border:
//                           selectedbarber === item.name
//                             ? "0.1rem solid var(--text-primary)"
//                             : "",
//                       }}
//                     >
//                       <img src={item.profile?.[0].url} alt="" />

//                       <p>{item.name}</p>
//                     </div>
//                   );
//                 })
//               : null}
//           </div>
//         </div>
//       </div>

//       <div className={`${style.mobile_report_header}`}>
//         <div>
//           <h2>Reports</h2>
//           <button onClick={() => setMobileFilterOpen(true)}>
//             <FilterIcon />
//           </button>
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
//                     ? "week"
//                     : (selectedRangeFilter || selectedFilter) === "monthly"
//                     ? "month"
//                     : "range"
//                 }
//               />
//               <YAxis dataKey={reportValueType} />
//               <Tooltip
//                 cursor={{ fill: "var(--input-bg-color)" }}
//                 contentStyle={{
//                   backgroundColor: "var(--bg-primary)",
//                   border: "0.1rem solid var(--border-secondary)",
//                 }}
//                 wrapperStyle={{
//                   outline: "none",
//                 }}
//               />

//               <Bar
//                 dataKey={reportValueType}
//                 fill="var(--bg-secondary)"
//                 radius={[2, 2, 2, 2]}
//               />
//             </BarChart>
//           </ResponsiveContainer>

//           <div className={`${style.report_footer}`}>
//             <p>
//               Report Type -
//               {queueType === "queueserved"
//                 ? `Queue Served (${
//                     selectedFilter ||
//                     "" ||
//                     (selectedDates.length > 0 && "Range") ||
//                     ""
//                   })`
//                 : queueType === "queuecancelled"
//                 ? `Queue Cancelled (${
//                     selectedFilter ||
//                     "" ||
//                     (selectedDates.length > 0 && "Range") ||
//                     ""
//                   })`
//                 : appointmentType === "appointmentserved"
//                 ? `Appointment Served (${
//                     selectedFilter ||
//                     "" ||
//                     (selectedDates.length > 0 && "Range") ||
//                     ""
//                   })`
//                 : appointmentType === "appointmentcancelled"
//                 ? `Appointment Cancelled (${
//                     selectedFilter ||
//                     "" ||
//                     (selectedDates.length > 0 && "Range") ||
//                     ""
//                   })`
//                 : ""}
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
//         <Box className={style.modalbox}>
//           <div>
//             <p>Apply Filter</p>
//             <button onClick={() => setMobileFilterOpen(false)}>
//               <CloseIcon />
//             </button>
//           </div>

//           <div>
//             <p>Report Type</p>
//             <div>
//               {reportType.map((item, index) => {
//                 return (
//                   <div key={index}>
//                     <button
//                       style={{
//                         background:
//                           selectedFilter === item.value
//                             ? "var(--bg-secondary)"
//                             : "var(--btn-primary-hover)",
//                         color: "var(--btn-text-color)",
//                       }}
//                       onClick={() => {
//                         setSelectedDates([]);
//                         setSelectedFilter(item.value);
//                         if (item.value === "daily") {
//                           setDayOption(10);
//                         } else if (item.value === "weekly") {
//                           setWeekOption(4);
//                         } else {
//                           setMonthOption(6);
//                         }
//                       }}
//                     >
//                       {selectedFilter === item.value ? <CheckIcon /> : ""}
//                     </button>
//                     <p>{item.type}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <p>Queue Type</p>
//             <div>
//               {QueueType.map((item, index) => {
//                 return (
//                   <div key={index}>
//                     <button
//                       style={{
//                         background:
//                           item.value === queueType
//                             ? "var(--bg-secondary)"
//                             : "var(--btn-primary-hover)",
//                         color: "var(--btn-text-color)",
//                       }}
//                       onClick={() => {
//                         setAppointmentType("");
//                         setQueueType(item.value);
//                       }}
//                     >
//                       {item.value === queueType ? <CheckIcon /> : ""}
//                     </button>
//                     <p>{item.type}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <p>Appointment Type</p>
//             <div>
//               {AppointmentType.map((item, index) => {
//                 return (
//                   <div key={index}>
//                     <button
//                       style={{
//                         background:
//                           item.value === appointmentType
//                             ? "var(--bg-secondary)"
//                             : "var(--btn-primary-hover)",
//                         color: "var(--btn-text-color)",
//                       }}
//                       onClick={() => {
//                         setQueueType("");
//                         setAppointmentType(item.value);
//                       }}
//                     >
//                       {item.value === appointmentType ? <CheckIcon /> : ""}
//                     </button>
//                     <p>{item.type}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <p>Select </p>
//             <div>
//               {SelectType.map((item, index) => {
//                 return (
//                   <div key={index}>
//                     <button
//                       style={{
//                         background:
//                           item.value === selectType
//                             ? "var(--bg-secondary)"
//                             : "var(--btn-primary-hover)",
//                         color: "var(--btn-text-color)",
//                       }}
//                       onClick={() => {
//                         setSelectType(item.value);
//                       }}
//                     >
//                       {item.value === selectType ? <CheckIcon /> : ""}
//                     </button>
//                     <p>{item.type}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             {(selectType === "Barber" || selectType === "Stylist") &&
//             BarberList?.length > 0 ? (
//               <div className={`${style.barberlist_container}`}>
//                 {BarberList?.map((item) => {
//                   return (
//                     <div
//                       className={`${style.barber_item}`}
//                       key={item.barberId}
//                       onClick={() => {
//                         setSelectedbarber(item.name);
//                         setSelectedbarberId(item.barberId);
//                         setSelectedbarberEmail(item.email);
//                       }}
//                       style={{
//                         border:
//                           selectedbarber === item.name
//                             ? "0.1rem solid var(--text-primary)"
//                             : "",
//                       }}
//                     >
//                       <img src={item.profile?.[0].url} alt="" />

//                       <p>{item.name}</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : null}

//             <div>
//               <Calendar
//                 // numberOfMonths={isMobile ? 1 : 2}
//                 numberOfMonths={1}
//                 value={selectedDates}
//                 onChange={handleDateChange}
//                 range
//                 placeholder="dd/mm/yyyy - dd/mm/yyyy"
//                 // onChange={handleDateChange}
//                 format="DD/MM/YYYY"
//                 dateSeparator={" - "}
//                 calendarPosition={"bottom-right"}
//                 className={true ? "dark-theme" : "light-theme"}
//                 style={
//                   {
//                     // background: true ? "#222" : "#fff"
//                   }
//                 }
//               />

//               <button onClick={resetHandler}>
//                 <ResetIcon />
//               </button>
//             </div>

//             <button
//               onClick={() => {
//                 setMobileFilterOpen(false);
//                 viewReport();
//               }}
//               disabled={adminProfile?.salonId == 0}
//               style={{
//                 cursor: adminProfile?.salonId == 0 ? "not-allowed" : "pointer",
//               }}
//             >
//               View Reports
//             </button>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default Report;

//=====

// Report Second

// import React, { useEffect, useState } from "react";
// import style from "./Report.module.css";
// import Calendar from "react-multi-date-picker";
// import { BarIcon } from "../../icons";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Label,
//   LabelList,
//   Legend,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { height, width } from "@mui/system";
// import { Tooltip } from "@mui/material";
// import { LeftIcon, PieChartIcon, ReportIcon, RightIcon } from "../../newicons";

// const Report = () => {
// // #region Sample data
// const piechartData = [
//   { name: "Group A", value: 420, fill: "#0088FE" },
//   { name: "Group B", value: 310, fill: "#00C49F" },
//   { name: "Group C", value: 275, fill: "#FFBB28" },
//   { name: "Group D", value: 190, fill: "#FF8042" },
//   { name: "Group E", value: 360, fill: "#845EC2" },
//   { name: "Group F", value: 230, fill: "#4D96FF" },
//   { name: "Group G", value: 150, fill: "#FF6F91" },
// ];

// const barchartData = [
//   // Low → rise
//   { month: "Jan", a: 55, b: 40, c: 30, d: 22, e: 18, f: 14, g: 10 },

//   // Peak
//   { month: "Feb", a: 78, b: 58, c: 48, d: 38, e: 32, f: 22, g: 15 },

//   // Dip
//   { month: "Mar", a: 62, b: 46, c: 36, d: 28, e: 24, f: 18, g: 12 },

//   // Higher peak
//   { month: "Apr", a: 88, b: 66, c: 56, d: 46, e: 40, f: 30, g: 22 },

//   // Dip again (W shape)
//   { month: "May", a: 68, b: 52, c: 42, d: 34, e: 30, f: 22, g: 16 },

//   // Final rise
//   { month: "Jun", a: 82, b: 64, c: 54, d: 44, e: 38, f: 28, g: 20 },

//   // Soft drop (natural ending)
//   { month: "Jul", a: 72, b: 56, c: 46, d: 38, e: 32, f: 24, g: 18 },
//   { month: "Jul", a: 72, b: 56, c: 46, d: 38, e: 32, f: 24, g: 18 },
//   { month: "Jul", a: 72, b: 56, c: 46, d: 38, e: 32, f: 24, g: 18 },
//   { month: "Jul", a: 72, b: 56, c: 46, d: 38, e: 32, f: 24, g: 18 },

// ];

// const GRADIENTS = [
//   { key: "a", from: "#4FACFE", to: "#00F2FE" }, // Blue 200 → 300
//   { key: "b", from: "#11998E", to: "#38EF7D" }, // Emerald 200 → 300
//   { key: "c", from: "#FF8008", to: "#FFC837" }, // Amber 200 → 300
//   { key: "d", from: "#8E2DE2", to: "#4A00E0" }, // Violet 200 → 300
//   { key: "e", from: "#FF416C", to: "#FF4B2B" }, // Rose 200 → 300
//   { key: "f", from: "#56AB2F", to: "#A8E063" }, // Teal 200 → 300
//   { key: "g", from: "#36D1DC", to: "#5B86E5" }, // Orange 200 → 300
// ];

//   const reportUIArr = [
//     {
//       id: 1,
//       text: "Pie",
//       icon: PieChartIcon,
//     },
//     {
//       id: 2,
//       text: "Bar",
//       icon: BarIcon,
//     },
//   ];

//   const [selectedReportUiType, setSelectedReportUiType] = useState(
//     reportUIArr[0]
//   );

//   const [selectedDates, setSelectedDates] = useState([]);

//   const handleDateChange = (dates) => {
//     const formatedDates = dates.map((date) => date.format("DD/MM/YYYY"));
//     setSelectedDates(formatedDates);
//     setSelectedFilter("");
//     setWeekOption("");
//     setMonthOption("");
//     setDayOption("");
//   };

//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.matchMedia("(max-width: 600px)").matches);
//     };

//     handleResize();

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div className={style.section}>
//       <div className={style.section_header}>
//         <button>back</button>
//         <p>All Reports . Appointment Summary</p>
//       </div>

//       <main className={style.report_container}>
//         <div className={style.report_container_top_container}>
//           <div className={style.report_top_left}>
//             <div>
//               <p>Appointments summary</p>

//               <div>
//                 <Calendar
//                   numberOfMonths={isMobile ? 1 : 2}
//                   value={selectedDates}
//                   onChange={handleDateChange}
//                   range
//                   placeholder="dd/mm/yyyy - dd/mm/yyyy"
//                   // onChange={handleDateChange}
//                   dateSeparator={" - "}
//                   calendarPosition={"bottom-left"}
//                   format="DD/MM/YYYY"
//                   className={true ? "dark-theme" : "light-theme"}
//                   style={
//                     {
//                       // background: true ? "#222" : "#fff"
//                     }
//                   }
//                 />
//               </div>
//             </div>

//             <div>
//               <p>Report Type</p>
//               <div>
//                 {["Daily", "Weekly", "Monthly"].map((item, index) => {
//                   return (
//                     <button
//                       key={item}
//                       style={{
//                         backgroundColor:
//                           index === 0 ? "var(--bg-secondary)" : "transparent",
//                         color:
//                           index === 0
//                             ? "var(--btn-text-color)"
//                             : "var(--text-primary)",
//                       }}
//                     >
//                       {item}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div>
//               <p>Select Stylist</p>
//               <div>
//                 {["All", "John", "Bob", "Jazz", "Rohan", "Rahul", "Emilly"].map(
//                   (item, index) => {
//                     return (
//                       <button
//                         key={item}
//                         style={{
//                           backgroundColor:
//                             index === 0 ? "var(--bg-secondary)" : "transparent",
//                           color:
//                             index === 0
//                               ? "var(--btn-text-color)"
//                               : "var(--text-primary)",
//                         }}
//                       >
//                         {item}
//                       </button>
//                     );
//                   }
//                 )}
//               </div>
//             </div>

//             <button>view report</button>
//           </div>
//           <div className={style.report_top_right}>
//             <p>Other Reports</p>
//             <div>
//               {[1, 2, 3, 4, 5].map((item) => {
//                 return (
//                   <div className={style.report_item}>
//                     <div>
//                       <BarIcon color="var(--btn-text-color)" />
//                     </div>
//                     <div>
//                       <p>Performance Dashboard</p>
//                       <p>Dashboard of your business performance.</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//         <div className={style.report_container_down_container}>
//           <div className={style.report_bottom_left}>
//             <div className={style.report_bottom_left_header}>
//               <p>Appointment Served</p>
//               <div>
//                 {reportUIArr.map((item) => {
//                   return (
//                     <button
//                       key={item.id}
//                       onClick={() => setSelectedReportUiType(item)}
//                       style={{
//                         backgroundColor:
//                           selectedReportUiType.id === item.id
//                             ? "var(--bg-secondary)"
//                             : "transparent",
//                       }}
//                     >
// <item.icon
//   color={
//     selectedReportUiType.id === item.id
//       ? "var(--btn-text-color)"
//       : "var(--text-primary)"
//   }
// />
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className={style.report_bottom_left_subheader}>
//               <button>
//                 <LeftIcon />
//               </button>
//               <p>Jan 5, 2026</p>
//               <button>
//                 <RightIcon />
//               </button>
//             </div>

//             {selectedReportUiType?.text === "Pie" ? (
// <div className={style.report_pie_container}>
//   <div
//     style={{
//       height: "100%",
//     }}
//   >
//     <ResponsiveContainer
//       style={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <PieChart>
//         <Pie
//           data={piechartData}
//           innerRadius="65%"
//           outerRadius="100%"
//           cornerRadius="12%"
//           paddingAngle={1}
//           dataKey="value"
//         >
//           <Label content={renderCenterContent} />

//           <LabelList
//             dataKey="value"
//             position="inside"
//             fill="#fff"
//             fontSize={14}
//             fontWeight={600}
//           />
//         </Pie>
//       </PieChart>
//     </ResponsiveContainer>
//   </div>

//   <div className={style.report_pie_stylist_container}>
//     {["John", "Bob", "Jazz", "Echo", "DJ", "Baba Z"].map(
//       (item, index) => {
//         return (
//           <div key={index}>
//             <div />
//             <p>{item}</p>
//           </div>
//         );
//       }
//     )}
//   </div>
// </div>
//             ) : (
//               <div className={style.report_pie_container}>
//                 <div
//                   style={{
//                     height: "100%",
//                   }}
//                 >
//                   <ResponsiveContainer width="100%" height={"100%"}>
//                     <BarChart
//                       data={barchartData}
//                       // margin={{ top: 30, right: 20, left: 0, bottom: 10 }}
//                       barGap={4}
//                     >
//                       <defs>
//                         {GRADIENTS.map((g) => (
//                           <linearGradient
//                             key={g.key}
//                             id={`grad-${g.key}`}
//                             x1="0"
//                             y1="0"
//                             x2="0"
//                             y2="1"
//                           >
//                             <stop offset="0%" stopColor={g.from} />
//                             <stop offset="100%" stopColor={g.to} />
//                           </linearGradient>
//                         ))}
//                       </defs>

//                       <CartesianGrid
//                         strokeDasharray="4 6"
//                         stroke="rgba(0,0,0,0.08)"
//                         vertical={false}
//                       />

//                       <XAxis
//                         dataKey="month"
//                         tick={{ fill: "#6b7280", fontSize: 12 }}
//                         axisLine={false}
//                         tickLine={false}
//                       />
//                       {/* <YAxis
//                         tick={{ fill: "#6b7280", fontSize: 12 }}
//                         axisLine={false}
//                         tickLine={false}
//                       /> */}

//                       {/* <Tooltip
//                         cursor={{ fill: "rgba(0,0,0,0.04)" }}
//                         contentStyle={{
//                           borderRadius: 12,
//                           border: "none",
//                           boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
//                           fontSize: 13,
//                         }}
//                       /> */}

//                       {/* <Legend iconType="circle" /> */}

//                       {/* {GRADIENTS.map((g, index) => (
//                         <Bar
//                           key={g.key}
//                           dataKey={g.key}
//                           stackId="total"
//                           fill={`url(#grad-${g.key})`}
//                           radius={
//                             index === GRADIENTS.length - 1
//                               ? [10, 10, 0, 0]
//                               : [0, 0, 0, 0]
//                           }
//                         />
//                       ))} */}

//                       {GRADIENTS.map((g, index) => (
//                         <Bar
//                           key={g.key}
//                           dataKey={g.key}
//                           stackId="total"
//                           fill={`url(#grad-${g.key})`}
//                           radius={
//                             index === GRADIENTS.length - 1
//                               ? [10, 10, 0, 0]
//                               : [0, 0, 0, 0]
//                           }
//                         >
//                           <LabelList
//                             dataKey={g.key}
//                             position="center"
//                             fill="#ffffff"
//                             fontSize={11}
//                             fontWeight={600}
//                           />
//                         </Bar>
//                       ))}
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className={style.report_pie_stylist_container}>
//                   {["John", "Bob", "Jazz", "Echo", "DJ", "Baba Z"].map(
//                     (item, index) => {
//                       return (
//                         <div key={index}>
//                           <div />
//                           <p>{item}</p>
//                         </div>
//                       );
//                     }
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className={style.report_bottom_right}>
//             <p>Upcoming analytics</p>
//             <div>
//               {[1, 2, 3, 4, 5].map((item) => {
//                 return (
//                   <div className={style.report_analytic_item}>
//                     <div>
//                       <div>
//                         <BarIcon color="var(--btn-text-color)" />
//                       </div>
//                       <p>Tuesday</p>
//                     </div>

//                     <p>04/11/2025</p>
//                     <p>54</p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Report;

// const renderCenterContent = ({ viewBox }) => {
//   const { cx, cy } = viewBox;

//   return (
//     <>
//       {/* Black center circle */}
//       <circle cx={cx} cy={cy} r={60} fill="#000" />
//       <text
//         x={cx}
//         y={cy}
//         textAnchor="middle"
//         dominantBaseline="middle"
//         fill="#fff"
//         fontSize="16"
//         fontWeight="600"
//       >
//         337
//       </text>
//     </>
//   );
// };

// const renderTotalLabel = (props) => {
//   const { x, y, width, payload } = props;
//   const total = payload.a + payload.b + payload.c;

//   return (
//     <text
//       x={x + width / 2}
//       y={y - 6}
//       textAnchor="middle"
//       fill="#000"
//       fontSize={12}
//       fontWeight={600}
//     >
//       {total}
//     </text>
//   );
// };

// Report Third

import React, { useEffect, useState } from "react";
import style from "./ReportChart.module.css";
import { BarIcon, LeftArrow } from "../../../icons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  CloseIcon,
  ContactTel,
  CustomerIcon,
  EmailIcon,
  FilterIcon,
  LeftIcon,
  PieChartIcon,
  RightIcon,
} from "../../../newicons";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Calendar from "react-multi-date-picker";
import { Box, Modal } from "@mui/material";
import api from "../../../Redux/api/Api";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const Report = () => {
  const location = useLocation();

  const [selectedReportChartType, setSelectedReportChartType] = useState(
    location?.state?.reportTypeItem
  );

  const navigate = useNavigate();

  const salonId = useSelector(
    (state) => state.AdminLoggedInMiddleware.adminSalonId
  );

  const reportUIArr = [
    {
      id: 1,
      text: "Pie",
      icon: PieChartIcon,
    },
    {
      id: 2,
      text: "Bar",
      icon: BarIcon,
    },
  ];

  const [selectedReport, setSelectedReport] = useState(reportUIArr[1]);
  const [openFilterPopup, setOpenFilterPopup] = useState(false);

  const [selectedDates, setSelectedDates] = useState([]);

  const [startDate, setStartDate] = useState(
    moment().subtract(31, "day").format("DD-MM-YYYY")
  );
  const [endDate, setEndDate] = useState(
    moment().subtract(1, "day").format("DD-MM-YYYY")
  );

  const handleDateChange = (dates) => {
    const formatedDates = dates.map((date) => date.format("DD-MM-YYYY"));
    setStartDate(formatedDates[0]);
    setEndDate(formatedDates[1]);
    setSelectedDates(formatedDates);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 600px)").matches);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [selectedReportType, setSelectedReportType] = useState("Daily");
  const [selectedReportBarber, setSelectedReportBarber] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const [copyFilterBarberList, setCopyFilterBarberList] = useState([]);

  const [stylistBarberList, setStylistBarberList] = useState([]);
  const [selected_attendence_stylist, setSelected_attendence_stylist] =
    useState(null);

  useEffect(() => {
    if (selectedReportChartType?.reportType === "stylistattendence") {
      fetch_stylist_barberlist();
    } else {
      if (startDate && endDate) {
        view_report();
      }
    }
  }, [
    startDate,
    endDate,
    selectedReportBarber,
    selectedReportChartType?.reportType,
  ]);

  // selectedReportChartType?.reportType === "stylistattendence"

  const [chartData, setChartData] = useState([]);

  const fetch_stylist_barberlist = async () => {
    try {
      const { data } = await api.post(
        `api/barber/getAllBarberBySalonId?salonId=${salonId}`
      );

      setStylistBarberList(data?.getAllBarbers);
    } catch (error) {}
  };

  const view_report = async () => {
    try {
      const reportData = {
        salonId,
        startDate,
        endDate,
        reportType: selectedReportChartType?.reportType,
        barberId: selectedReportBarber.map((item) => item?.barberId),
      };

      const { data } = await api.post(
        `/api/reports/getSalonChartReport`,
        reportData
      );

      setChartData(data?.response);
      if (!copyFilterBarberList?.length) {
        setCopyFilterBarberList(data?.response);
      }
    } catch (error) {}
  };

  const totalServed = chartData.reduce((sum, item) => sum + item.yaxis, 0);

  const toggleBarber = (barber) => {
    setSelectedReportBarber((prev) => {
      const exists = prev.some((item) => item.barberId === barber.barberId);

      if (exists) {
        // remove (re-enter works now)
        return prev.filter((item) => item.barberId !== barber.barberId);
      }

      // add
      return [...prev, barber];
    });
  };

  const resetFilter = () => {
    setSelectedReportBarber([]);
    setSelectedDates([]);
    setSelected_attendence_stylist(null);
    setStartDate(moment().subtract(31, "day").format("DD-MM-YYYY"));
    setEndDate(moment().subtract(1, "day").format("DD-MM-YYYY"));
  };

  const upcommingAnalyticsSelectionList =
    location?.state?.upcommingAnalytics?.filter(
      (upc) => upc?.id !== selectedReportChartType?.id
    );

  const [barber_attendence_list, setBarber_attendence_list] = useState([]);
  const [barber_attendence_list_loading, setBarber_attendence_list_loading] =
    useState(false);

  // useEffect(() => {
  //   if (selected_attendence_stylist?.barberId) {
  //     fetch_barber_attendence_list();
  //   }
  // }, [selected_attendence_stylist?.barberId, startDate, endDate]);

  useEffect(() => {
    if (!selected_attendence_stylist?.barberId) return;

    if ((startDate && endDate) || (!startDate && !endDate)) {
      fetch_barber_attendence_list();
    }
  }, [selected_attendence_stylist?.barberId, startDate, endDate]);

  const fetch_barber_attendence_list = async () => {
    try {
      const attendenceData = {
        salonId,
        barberId: selected_attendence_stylist?.barberId,
        startDate,
        endDate,
      };

      setBarber_attendence_list_loading(true);

      const { data } = await api.post(
        `/api/admin/getAttendenceByBarberId`,
        attendenceData
      );

      setBarber_attendence_list(data?.response?.attendance);
    } catch (error) {
    } finally {
      setBarber_attendence_list_loading(false);
    }
  };
  return selectedReportChartType?.reportType === "stylistattendence" ? (
    <div className={style.report_section_attendence}>
      <div className={style.report_header}>
        <div>
          <div>
            <button
              onClick={() => {
                navigate("/admin-reports");
              }}
            >
              <LeftArrow color="var(--text-primary)" />
            </button>
            <h2>Reports</h2>
          </div>
        </div>

        <div>
          {/* {reportUIArr.map((item, index) => {
            return (
              <button
                onClick={() => {
                  setSelectedReport(item);
                }}
                style={{
                  backgroundColor:
                    selectedReport.id === item.id
                      ? "var(--bg-secondary)"
                      : "var(--bg-primary)",
                }}
                key={index}
              >
                <item.icon
                  color={
                    selectedReport.id === item.id
                      ? "var(--btn-text-color)"
                      : "var(--text-primary)"
                  }
                />
              </button>
            );
          })} */}

          <button
            onClick={() => {
              setOpenFilterPopup((prev) => !prev);
            }}
            className={style.filter_btn}
          >
            <FilterIcon />
            <span>Filter</span>
          </button>

          {openFilterPopup && (
            <ClickAwayListener onClickAway={() => setOpenFilterPopup(false)}>
              <div className={style.filter_popup}>
                <div className={style.filter_popup_header}>
                  <p>Select Filter</p>
                  <button
                    onClick={() => setOpenFilterPopup(false)}
                    className={style.filterpopup_close_btn}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className={style.filter_popup_body}>
                  <div className={style.filter_section}>
                    <p>Date Range</p>
                    <Calendar
                      numberOfMonths={1}
                      value={selectedDates}
                      onChange={handleDateChange}
                      range
                      placeholder="dd/mm/yyyy - dd/mm/yyyy"
                      dateSeparator=" - "
                      calendarPosition="bottom-right"
                      format="DD/MM/YYYY"
                      className="dark-theme"
                    />
                  </div>

                  <div className={style.filter_section}>
                    <p>Select Stylist</p>
                    <div className={style.filter_chip_group}>
                      {stylistBarberList?.map((item) => {
                        const isActive =
                          selected_attendence_stylist?.barberId ===
                          item.barberId;

                        return (
                          <button
                            key={item.barberId}
                            onClick={() => setSelected_attendence_stylist(item)}
                            className={style.filter_chip}
                            style={{
                              backgroundColor: isActive
                                ? "var(--bg-secondary)"
                                : "transparent",
                              color: isActive
                                ? "var(--btn-text-color)"
                                : "var(--text-primary)",
                            }}
                          >
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={resetFilter}
                    className={style.filter_apply_btn}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </ClickAwayListener>
          )}
        </div>
      </div>

      <div className={style.report_mobile_header}>
        <div>
          <div>
            <button
              onClick={() => {
                navigate("/admin-reports");
              }}
            >
              <LeftArrow color="var(--text-primary)" />
            </button>
            <h2>Reports</h2>
          </div>

          <div>
            <button
              onClick={() => {
                setOpenFilter((prev) => !prev);
              }}
              className={style.filter_btn}
            >
              <FilterIcon />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {selected_attendence_stylist && (
        <div className={style.report_section_attendence_header}>
          <img
            src={selected_attendence_stylist?.profile?.[0]?.url}
            alt=""
            style={{
              border: `0.1rem solid var(--border-secondary)`,
            }}
          />
          <div>
            <h2>{selected_attendence_stylist?.name}</h2>
            <p>
              <span>
                <EmailIcon />
              </span>
              {selected_attendence_stylist?.email}
            </p>
            <p>
              <span>
                <ContactTel />
              </span>
              +{selected_attendence_stylist?.mobileCountryCode}{" "}
              {selected_attendence_stylist?.mobileNumber}
            </p>
          </div>
        </div>
      )}

      {!selected_attendence_stylist?.barberId ? (
        <div className={style.report_section_attendence_container_error}>
          <p>Select a barber to view their attendance records.</p>
        </div>
      ) : barber_attendence_list_loading ? (
        <div className={style.report_section_attendence_container_loading}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className={style.skeleton_item}>
              <Skeleton
                width="100%"
                height="15rem"
                baseColor="var(--loader-bg-color)"
                highlightColor="var(--loader-highlight-color)"
              />
            </div>
          ))}
        </div>
      ) : barber_attendence_list?.length > 0 ? (
        <div className={style.report_section_attendence_container}>
          {barber_attendence_list.map((item, index) => (
            <div
              key={item?._id}
              className={style.attendence_item}
              style={{
                backgroundColor: "var(--bg-primary)",
                border: `0.1rem solid var(--border-secondary)`,
              }}
            >
              <div>
                <p>{item.date}</p>
                <div
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  <p
                    style={{
                      color: "var(--btn-text-color)",
                    }}
                  >
                    {item.day}
                  </p>
                </div>
              </div>

              <div>
                <div>
                  <p>Time in</p>
                  <p>{item.signInTime || "-"}</p>
                </div>

                <div>
                  <p>Time out</p>
                  <p>{item.signOutTime || "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.report_section_attendence_container_error}>
          <p>
            No attendence available for this {selected_attendence_stylist?.name}
          </p>
        </div>
      )}

      {/* FILTER MODAL */}
      <Modal open={openFilter} onClose={() => setOpenFilter(false)}>
        <div className={style.modal_common_container}>
          <div className={style.filter_popup}>
            <div className={style.filter_popup_header}>
              <p>Select Filter</p>
              <button
                onClick={() => setOpenFilter(false)}
                className={style.filterpopup_close_btn}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={style.filter_popup_body}>
              <div className={style.filter_section}>
                <p>Date Range</p>
                <Calendar
                  numberOfMonths={1}
                  value={selectedDates}
                  onChange={handleDateChange}
                  range
                  placeholder="dd/mm/yyyy - dd/mm/yyyy"
                  dateSeparator=" - "
                  calendarPosition="bottom-left"
                  format="DD/MM/YYYY"
                  className="dark-theme"
                />
              </div>

              <div className={style.filter_section}>
                <p>Select Stylist</p>
                <div className={style.filter_chip_group}>
                  {stylistBarberList?.map((item) => {
                    const isActive =
                      selected_attendence_stylist?.barberId === item.barberId;

                    return (
                      <button
                        key={item.barberId}
                        onClick={() => setSelected_attendence_stylist(item)}
                        className={style.filter_chip}
                        style={{
                          backgroundColor: isActive
                            ? "var(--bg-secondary)"
                            : "transparent",
                          color: isActive
                            ? "var(--btn-text-color)"
                            : "var(--text-primary)",
                        }}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={resetFilter} className={style.filter_apply_btn}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  ) : (
    <div className={style.report_section}>
      <div className={style.report_header}>
        <div>
          <div>
            <button
              onClick={() => {
                navigate("/admin-reports");
              }}
            >
              <LeftArrow color="var(--text-primary)" />
            </button>
            <h2>Reports</h2>
          </div>

          <div>
            {/* <button>{selectedReportType}</button> */}
            {selectedReportBarber?.map((item) => {
              return <button key={item?.barberId}>{item?.xaxis}</button>;
            })}
            {selectedDates?.length === 2 && (
              <button>
                {selectedDates.map((item, index) => (
                  <span key={index}>
                    {item}
                    {index === 0 && " - "}
                  </span>
                ))}
              </button>
            )}
          </div>
        </div>

        <div>
          {reportUIArr.map((item, index) => {
            return (
              <button
                onClick={() => {
                  setSelectedReport(item);
                }}
                style={{
                  backgroundColor:
                    selectedReport.id === item.id
                      ? "var(--bg-secondary)"
                      : "var(--bg-primary)",
                }}
                key={index}
              >
                <item.icon
                  color={
                    selectedReport.id === item.id
                      ? "var(--btn-text-color)"
                      : "var(--text-primary)"
                  }
                />
              </button>
            );
          })}

          <button
            onClick={() => {
              setOpenFilterPopup((prev) => !prev);
            }}
            className={style.filter_btn}
          >
            <FilterIcon />
            <span>Filter</span>
          </button>

          {openFilterPopup && (
            <ClickAwayListener onClickAway={() => setOpenFilterPopup(false)}>
              <div className={style.filter_popup}>
                <div className={style.filter_popup_header}>
                  <p>Select Filter</p>
                  <button
                    onClick={() => setOpenFilterPopup(false)}
                    className={style.filterpopup_close_btn}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className={style.filter_popup_body}>
                  <div className={style.filter_section}>
                    <p>Date Range</p>
                    <Calendar
                      numberOfMonths={1}
                      value={selectedDates}
                      onChange={handleDateChange}
                      range
                      placeholder="dd/mm/yyyy - dd/mm/yyyy"
                      dateSeparator=" - "
                      calendarPosition="bottom-right"
                      format="DD/MM/YYYY"
                      className="dark-theme"
                    />
                  </div>

                  {/* <div className={style.filter_section}>
                    <p>Report Type</p>
                    <div className={style.filter_chip_group}>
                      {["Daily", "Weekly", "Monthly"].map((item, index) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSelectedReportType(item);
                          }}
                          className={style.filter_chip}
                          style={{
                            backgroundColor:
                              selectedReportType === item
                                ? "var(--bg-secondary)"
                                : "transparent",
                            color:
                              selectedReportType === item
                                ? "var(--btn-text-color)"
                                : "var(--text-primary)",
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div> */}

                  <div className={style.filter_section}>
                    <p>Select Stylist</p>
                    <div className={style.filter_chip_group}>
                      {copyFilterBarberList?.map((item) => {
                        const isActive = selectedReportBarber.some(
                          (b) => b.barberId === item.barberId
                        );

                        return (
                          <button
                            key={item.barberId}
                            onClick={() => toggleBarber(item)}
                            className={style.filter_chip}
                            style={{
                              backgroundColor: isActive
                                ? "var(--bg-secondary)"
                                : "transparent",
                              color: isActive
                                ? "var(--btn-text-color)"
                                : "var(--text-primary)",
                            }}
                          >
                            {item.xaxis}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={resetFilter}
                    className={style.filter_apply_btn}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </ClickAwayListener>
          )}
        </div>
      </div>

      <div className={style.report_mobile_header}>
        <div>
          <div>
            <button
              onClick={() => {
                navigate("/admin-reports");
              }}
            >
              <LeftArrow color="var(--text-primary)" />
            </button>
            <h2>Reports</h2>
          </div>

          <div>
            {reportUIArr.map((item, index) => {
              return (
                <button
                  onClick={() => {
                    setSelectedReport(item);
                  }}
                  style={{
                    backgroundColor:
                      selectedReport.id === item.id
                        ? "var(--bg-secondary)"
                        : "var(--bg-primary)",
                  }}
                  key={index}
                >
                  <item.icon
                    color={
                      selectedReport.id === item.id
                        ? "var(--btn-text-color)"
                        : "var(--text-primary)"
                    }
                  />
                </button>
              );
            })}

            <button
              onClick={() => {
                setOpenFilter((prev) => !prev);
              }}
              className={style.filter_btn}
            >
              <FilterIcon />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div>
          {selectedReportBarber?.map((item) => {
            return <button key={item?.barberId}>{item?.xaxis}</button>;
          })}
          {selectedDates?.length === 2 && (
            <button>
              {selectedDates.map((item, index) => (
                <span key={index}>
                  {item}
                  {index === 0 && " - "}
                </span>
              ))}
            </button>
          )}
        </div>
      </div>

      <div className={style.report_container}>
        <div className={style.report_main_container}>
          <div>
            <p style={{ textAlign: "center", width: "100%" }}>
              {selectedReportChartType?.headerTitle}
            </p>
            {/* <div>
              <button onClick={decreaseDate}>
                <LeftIcon color="var(--text-primary)" />
              </button>
              <p>{reportDateText}</p>
              <button onClick={increaseDate}>
                <RightIcon color="var(--text-primary)" />
              </button>
            </div> */}
          </div>

          {selectedReport.text === "Pie" ? (
            <div className={style.report_pie_container}>
              <div
                style={{
                  height: "80%",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {chartData.map((item, index) => (
                        <linearGradient
                          key={index}
                          id={`pieGrad-${index}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={item.fill} />
                          <stop offset="100%" stopColor={item.fill2} />
                        </linearGradient>
                      ))}
                    </defs>

                    <Pie
                      data={chartData}
                      dataKey="yaxis"
                      innerRadius="65%"
                      outerRadius="100%"
                      cornerRadius="12%"
                      paddingAngle={1}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={`url(#pieGrad-${index})`} />
                      ))}

                      <Label content={renderCenterContent(totalServed)} />

                      <LabelList
                        dataKey="yaxis"
                        position="inside"
                        fill="#fff"
                        fontSize={"1.4rem"}
                        fontWeight={600}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={style.report_pie_stylist_container}>
                {chartData?.map((item, index) => {
                  return (
                    <div key={item?.barberId}>
                      <div
                        style={{
                          backgroundColor: item?.fill,
                        }}
                      />
                      <p>{item?.xaxis}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={style.report_pie_container}>
              <div
                style={{
                  height: "100%",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={10} margin={{ top: 30 }}>
                    {/* 🔹 Dynamic gradients */}
                    <defs>
                      {chartData.map((item) => (
                        <linearGradient
                          key={item.barberId}
                          id={`grad-${item.barberId}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={item.fill} />
                          <stop offset="100%" stopColor={item.fill2} />
                        </linearGradient>
                      ))}
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 6"
                      stroke="rgba(0,0,0,0.08)"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="xaxis"
                      interval={0}
                      tick={renderXAxisTick}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Bar dataKey="yaxis" radius={[8, 8, 0, 0]}>
                      {/* 🔹 Apply gradient per bar */}
                      {chartData.map((item) => (
                        <Cell
                          key={item.barberId}
                          fill={`url(#grad-${item.barberId})`}
                        />
                      ))}

                      <LabelList
                        dataKey="yaxis"
                        position="top"
                        fill="var(--text-primary)"
                        fontSize={"1.4rem"}
                        fontWeight={600}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={style.report_pie_stylist_container}>
                {chartData?.map((item, index) => {
                  return (
                    <div key={item?.barberId}>
                      <div
                        style={{
                          backgroundColor: item?.fill,
                        }}
                      />
                      <p>{item?.xaxis}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className={style.report_content_container}>
          <p>Select analytics</p>

          {upcommingAnalyticsSelectionList?.map((item) => {
            return (
              <button
                onClick={() => setSelectedReportChartType(item)}
                key={item.id}
                className={style.report_section_item}
              >
                <div>{renderIcon(item.iconType)}</div>

                <div>
                  <p>{item.title}</p>
                  <p>{item.subTitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER MODAL */}
      <Modal open={openFilter} onClose={() => setOpenFilter(false)}>
        <div className={style.modal_common_container}>
          <div className={style.filter_popup}>
            <div className={style.filter_popup_header}>
              <p>Select Filter</p>
              <button
                onClick={() => setOpenFilter(false)}
                className={style.filterpopup_close_btn}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={style.filter_popup_body}>
              <div className={style.filter_section}>
                <p>Date Range</p>
                <Calendar
                  numberOfMonths={1}
                  value={selectedDates}
                  onChange={handleDateChange}
                  range
                  placeholder="dd/mm/yyyy - dd/mm/yyyy"
                  dateSeparator=" - "
                  calendarPosition="bottom-left"
                  format="DD/MM/YYYY"
                  className="dark-theme"
                />
              </div>

              {/* <div className={style.filter_section}>
                <p>Report Type</p>
                <div className={style.filter_chip_group}>
                  {["Daily", "Weekly", "Monthly"].map((item, index) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedReportType(item);
                      }}
                      className={style.filter_chip}
                      style={{
                        backgroundColor:
                          selectedReportType === item
                            ? "var(--bg-secondary)"
                            : "transparent",
                        color:
                          selectedReportType === item
                            ? "var(--btn-text-color)"
                            : "var(--text-primary)",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div> */}

              <div className={style.filter_section}>
                <p>Select Stylist</p>
                <div className={style.filter_chip_group}>
                  {copyFilterBarberList?.map((item) => {
                    const isActive = selectedReportBarber.some(
                      (b) => b.barberId === item.barberId
                    );

                    return (
                      <button
                        key={item.barberId}
                        onClick={() => toggleBarber(item)}
                        className={style.filter_chip}
                        style={{
                          backgroundColor: isActive
                            ? "var(--bg-secondary)"
                            : "transparent",
                          color: isActive
                            ? "var(--btn-text-color)"
                            : "var(--text-primary)",
                        }}
                      >
                        {item.xaxis}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={resetFilter} className={style.filter_apply_btn}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Report;

export const renderCenterContent = (totalServed) => {
  return ({ viewBox }) => {
    const { cx, cy } = viewBox;

    return (
      <>
        <circle cx={cx} cy={cy} r={60} fill="var(--bg-secondary)" />

        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--btn-text-color)"
          fontSize="1.6rem"
          fontWeight="600"
        >
          {totalServed}
        </text>
      </>
    );
  };
};

const renderXAxisTick = ({ x, y, payload }) => {
  const label =
    payload.value.length > 8 ? payload.value.slice(0, 8) + "…" : payload.value;

  return (
    <text x={x} y={y + 10} textAnchor="middle" fill="#6b7280" fontSize={12}>
      {label}
    </text>
  );
};

const renderIcon = (type) => {
  switch (type) {
    case "bar":
      return <BarIcon color="var(--btn-text-color)" />;
    case "customer":
      return <CustomerIcon color="var(--btn-text-color)" />;
    default:
      return null;
  }
};
