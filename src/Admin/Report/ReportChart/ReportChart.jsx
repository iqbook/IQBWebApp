// import React, { useEffect, useState } from "react";
// import style from "./ReportChart.module.css";
// import { BarIcon, LeftArrow } from "../../../icons";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Label,
//   LabelList,
//   Legend,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
// } from "recharts";
// import {
//   CloseIcon,
//   ContactTel,
//   CustomerIcon,
//   EmailIcon,
//   FilterIcon,
//   LeftIcon,
//   PieChartIcon,
//   RightIcon,
// } from "../../../newicons";
// import ClickAwayListener from "@mui/material/ClickAwayListener";
// import Calendar from "react-multi-date-picker";
// import { Box, Modal } from "@mui/material";
// import api from "../../../Redux/api/Api";
// import { useSelector } from "react-redux";
// import moment from "moment/moment";
// import { useLocation, useNavigate } from "react-router-dom";
// import Skeleton from "react-loading-skeleton";

// const Report = () => {
//   const location = useLocation();

//   const [selectedReportChartType, setSelectedReportChartType] = useState(
//     location?.state?.reportTypeItem
//   );

//   const navigate = useNavigate();

//   const salonId = useSelector(
//     (state) => state.AdminLoggedInMiddleware.adminSalonId
//   );

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

//   const [selectedReport, setSelectedReport] = useState(reportUIArr[1]);
//   const [openFilterPopup, setOpenFilterPopup] = useState(false);

//   const [selectedDates, setSelectedDates] = useState([]);

//   const [startDate, setStartDate] = useState(
//     // moment().subtract(31, "day").format("DD-MM-YYYY")
//     null
//   );
//   const [endDate, setEndDate] = useState(
//     // moment().subtract(1, "day").format("DD-MM-YYYY")
//     null
//   );

//   const handleDateChange = (dates) => {
//     const formatedDates = dates.map((date) => date.format("DD-MM-YYYY"));
//     setStartDate(formatedDates[0]);
//     setEndDate(formatedDates[1]);
//     setSelectedDates(formatedDates);
//     setSelectedReportType("daily");
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

//   const [selectedReportType, setSelectedReportType] = useState("daily");
//   const [selectedReportBarber, setSelectedReportBarber] = useState([]);
//   const [openFilter, setOpenFilter] = useState(false);

//   const [copyFilterBarberList, setCopyFilterBarberList] = useState([]);

//   const [stylistBarberList, setStylistBarberList] = useState([]);
//   const [selected_attendence_stylist, setSelected_attendence_stylist] =
//     useState(null);

//   useEffect(() => {
//     if (selectedReportChartType?.reportType === "stylistattendence") {
//       fetch_stylist_barberlist();
//     } else {
//       // if (startDate && endDate) {
//       view_report();
//       // }
//     }
//   }, [
//     startDate,
//     endDate,
//     selectedReportType,
//     selectedReportBarber,
//     selectedReportChartType?.reportType,
//   ]);

//   // selectedReportChartType?.reportType === "stylistattendence"

//   const [chartData, setChartData] = useState([]);

//   const fetch_stylist_barberlist = async () => {
//     try {
//       const { data } = await api.post(
//         `api/barber/getAllBarberBySalonId?salonId=${salonId}`
//       );

//       setStylistBarberList(data?.getAllBarbers);
//     } catch (error) {}
//   };

//   const [chartDefaultValue, setChartReportValueData] = useState(null);
//   const [selectedAllBarber, setSelectedAllBarber] = useState(false);

//   const view_report = async () => {
//     try {
//       const reportData = {
//         salonId,
//         startDate,
//         endDate,
//         reportType: selectedReportChartType?.reportType,
//         barberId: selectedReportBarber.map((item) => item?.barberId),
//         reportValue: selectedReportType,
//       };

//       const { data } = await api.post(
//         `/api/reports/getSalonChartReport`,
//         reportData
//       );

//       setChartData(data?.response);
//       setChartReportValueData(data?.dateRange);
//       if (!copyFilterBarberList?.length) {
//         setCopyFilterBarberList(data?.response);
//         setSelectedAllBarber(true);
//       }
//     } catch (error) {}
//   };

//   const totalServed = chartData.reduce((sum, item) => sum + item.yaxis, 0);

//   const toggleBarber = (barber) => {
//     setSelectedReportBarber((prev) => {
//       const exists = prev.some((item) => item.barberId === barber.barberId);

//       if (exists) {
//         // remove (re-enter works now)
//         return prev.filter((item) => item.barberId !== barber.barberId);
//       }

//       // add
//       return [...prev, barber];
//     });
//   };

//   const resetFilter = () => {
//     setSelectedReportBarber([]);
//     setSelectedDates([]);
//     setSelected_attendence_stylist(null);
//     setStartDate(moment().subtract(31, "day").format("DD-MM-YYYY"));
//     setEndDate(moment().subtract(1, "day").format("DD-MM-YYYY"));
//   };

//   const upcommingAnalyticsSelectionList =
//     location?.state?.upcommingAnalytics?.filter(
//       (upc) => upc?.id !== selectedReportChartType?.id
//     );

//   const [barber_attendence_list, setBarber_attendence_list] = useState([]);
//   const [barber_attendence_list_loading, setBarber_attendence_list_loading] =
//     useState(false);

//   // useEffect(() => {
//   //   if (selected_attendence_stylist?.barberId) {
//   //     fetch_barber_attendence_list();
//   //   }
//   // }, [selected_attendence_stylist?.barberId, startDate, endDate]);

//   useEffect(() => {
//     if (!selected_attendence_stylist?.barberId) return;

//     if ((startDate && endDate) || (!startDate && !endDate)) {
//       fetch_barber_attendence_list();
//     }
//   }, [selected_attendence_stylist?.barberId, startDate, endDate]);

//   const fetch_barber_attendence_list = async () => {
//     try {
//       const attendenceData = {
//         salonId,
//         barberId: selected_attendence_stylist?.barberId,
//         startDate,
//         endDate,
//       };

//       setBarber_attendence_list_loading(true);

//       const { data } = await api.post(
//         `/api/admin/getAttendenceByBarberId`,
//         attendenceData
//       );

//       setBarber_attendence_list(data?.response?.attendance);
//     } catch (error) {
//     } finally {
//       setBarber_attendence_list_loading(false);
//     }
//   };

//   const [openStylistDropdown, setOpenStylistDropdown] = useState(false);
//   const [openStylistMobileDropdown, setOpenStylistMobileDropdown] =
//     useState(false);

//   return selectedReportChartType?.reportType === "stylistattendence" ? (
//     <div className={style.report_section_attendence}>
//       <div className={style.report_header}>
//         <div>
//           <div>
//             <button
//               onClick={() => {
//                 navigate("/admin-reports");
//               }}
//             >
//               <LeftArrow color="var(--text-primary)" />
//             </button>
//             <h2>Reports</h2>
//           </div>
//         </div>

//         <div>
//           {/* {reportUIArr.map((item, index) => {
//             return (
//               <button
//                 onClick={() => {
//                   setSelectedReport(item);
//                 }}
//                 style={{
//                   backgroundColor:
//                     selectedReport.id === item.id
//                       ? "var(--bg-secondary)"
//                       : "var(--bg-primary)",
//                 }}
//                 key={index}
//               >
//                 <item.icon
//                   color={
//                     selectedReport.id === item.id
//                       ? "var(--btn-text-color)"
//                       : "var(--text-primary)"
//                   }
//                 />
//               </button>
//             );
//           })} */}

//           <button
//             onClick={() => {
//               setOpenFilterPopup((prev) => !prev);
//             }}
//             className={style.filter_btn}
//           >
//             <FilterIcon />
//             <span>Filter</span>
//           </button>

//           {openFilterPopup && (
//             <ClickAwayListener onClickAway={() => setOpenFilterPopup(false)}>
//               <div className={style.filter_popup}>
//                 <div className={style.filter_popup_header}>
//                   <p>Select Filter</p>
//                   <button
//                     onClick={() => setOpenFilterPopup(false)}
//                     className={style.filterpopup_close_btn}
//                   >
//                     <CloseIcon />
//                   </button>
//                 </div>

//                 <div className={style.filter_popup_body}>
//                   <div className={style.filter_section}>
//                     <p>Date Range</p>
//                     <Calendar
//                       numberOfMonths={1}
//                       value={selectedDates}
//                       onChange={handleDateChange}
//                       range
//                       placeholder="dd/mm/yyyy - dd/mm/yyyy"
//                       dateSeparator=" - "
//                       calendarPosition="bottom-right"
//                       format="DD/MM/YYYY"
//                       className="dark-theme"
//                       maxDate={new Date()}
//                     />
//                   </div>

//                   <div className={style.filter_section}>
//                     <p>Select Stylist</p>
//                     <div className={style.filter_chip_group}>
//                       {stylistBarberList?.map((item) => {
//                         const isActive =
//                           selected_attendence_stylist?.barberId ===
//                           item.barberId;

//                         return (
//                           <button
//                             key={item.barberId}
//                             onClick={() => setSelected_attendence_stylist(item)}
//                             className={style.filter_chip}
//                             style={{
//                               backgroundColor: isActive
//                                 ? "var(--bg-secondary)"
//                                 : "transparent",
//                               color: isActive
//                                 ? "var(--btn-text-color)"
//                                 : "var(--text-primary)",
//                             }}
//                           >
//                             {item.name}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <button
//                     onClick={resetFilter}
//                     className={style.filter_apply_btn}
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </ClickAwayListener>
//           )}
//         </div>
//       </div>

//       <div className={style.report_mobile_header}>
//         <div>
//           <div>
//             <button
//               onClick={() => {
//                 navigate("/admin-reports");
//               }}
//             >
//               <LeftArrow color="var(--text-primary)" />
//             </button>
//             <h2>Reports</h2>
//           </div>

//           <div>
//             <button
//               onClick={() => {
//                 setOpenFilter((prev) => !prev);
//               }}
//               className={style.filter_btn}
//             >
//               <FilterIcon />
//               <span>Filter</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {selected_attendence_stylist && (
//         <div className={style.report_section_attendence_header}>
//           <img
//             src={selected_attendence_stylist?.profile?.[0]?.url}
//             alt=""
//             style={{
//               border: `0.1rem solid var(--border-secondary)`,
//             }}
//           />
//           <div>
//             <h2>{selected_attendence_stylist?.name}</h2>
//             <p>
//               <span>
//                 <EmailIcon />
//               </span>
//               {selected_attendence_stylist?.email}
//             </p>
//             <p>
//               <span>
//                 <ContactTel />
//               </span>
//               +{selected_attendence_stylist?.mobileCountryCode}{" "}
//               {selected_attendence_stylist?.mobileNumber}
//             </p>
//           </div>
//         </div>
//       )}

//       {!selected_attendence_stylist?.barberId ? (
//         <div className={style.report_section_attendence_container_error}>
//           <p>Select a barber to view their attendance records.</p>
//         </div>
//       ) : barber_attendence_list_loading ? (
//         <div className={style.report_section_attendence_container_loading}>
//           {Array.from({ length: 12 }).map((_, index) => (
//             <div key={index} className={style.skeleton_item}>
//               <Skeleton
//                 width="100%"
//                 height="15rem"
//                 baseColor="var(--loader-bg-color)"
//                 highlightColor="var(--loader-highlight-color)"
//               />
//             </div>
//           ))}
//         </div>
//       ) : barber_attendence_list?.length > 0 ? (
//         <div className={style.report_section_attendence_container}>
//           {barber_attendence_list.map((item, index) => (
//             <div
//               key={item?._id}
//               className={style.attendence_item}
//               style={{
//                 backgroundColor: "var(--bg-primary)",
//                 border: `0.1rem solid var(--border-secondary)`,
//               }}
//             >
//               <div>
//                 <p>{item.date}</p>
//                 <div
//                   style={{
//                     backgroundColor: "var(--bg-secondary)",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "var(--btn-text-color)",
//                     }}
//                   >
//                     {item.day}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <div>
//                   <p>Time in</p>
//                   <p>{item.signInTime || "-"}</p>
//                 </div>

//                 <div>
//                   <p>Time out</p>
//                   <p>{item.signOutTime || "-"}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className={style.report_section_attendence_container_error}>
//           <p>
//             No attendence available for this {selected_attendence_stylist?.name}
//           </p>
//         </div>
//       )}

//       {/* FILTER MODAL */}
//       <Modal open={openFilter} onClose={() => setOpenFilter(false)}>
//         <div className={style.modal_common_container}>
//           <div className={style.filter_popup}>
//             <div className={style.filter_popup_header}>
//               <p>Select Filter</p>
//               <button
//                 onClick={() => setOpenFilter(false)}
//                 className={style.filterpopup_close_btn}
//               >
//                 <CloseIcon />
//               </button>
//             </div>

//             <div className={style.filter_popup_body}>
//               <div className={style.filter_section}>
//                 <p>Date Range</p>
//                 <Calendar
//                   numberOfMonths={1}
//                   value={selectedDates}
//                   onChange={handleDateChange}
//                   range
//                   placeholder="dd/mm/yyyy - dd/mm/yyyy"
//                   dateSeparator=" - "
//                   calendarPosition="bottom-left"
//                   format="DD/MM/YYYY"
//                   className="dark-theme"
//                 />
//               </div>

//               <div className={style.filter_section}>
//                 <p>Select Stylist</p>
//                 <div className={style.filter_chip_group}>
//                   {stylistBarberList?.map((item) => {
//                     const isActive =
//                       selected_attendence_stylist?.barberId === item.barberId;

//                     return (
//                       <button
//                         key={item.barberId}
//                         onClick={() => setSelected_attendence_stylist(item)}
//                         className={style.filter_chip}
//                         style={{
//                           backgroundColor: isActive
//                             ? "var(--bg-secondary)"
//                             : "transparent",
//                           color: isActive
//                             ? "var(--btn-text-color)"
//                             : "var(--text-primary)",
//                         }}
//                       >
//                         {item.name}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               <button onClick={resetFilter} className={style.filter_apply_btn}>
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   ) : (
//     <div className={style.report_section}>
//       <div className={style.report_header}>
//         <div>
//           <div>
//             <button
//               onClick={() => {
//                 navigate("/admin-reports");
//               }}
//             >
//               <LeftArrow color="var(--text-primary)" />
//             </button>
//             <h2>Reports</h2>
//           </div>
//           <div>
//             {["daily", "weekly", "monthly"].map((item, index) => (
//               <button
//                 key={item}
//                 onClick={() => {
//                   setStartDate(null);
//                   setEndDate(null);
//                   setSelectedDates([]);
//                   setSelectedReportType(item);
//                 }}
//                 className={style.report_type_chip}
//                 style={{
//                   backgroundColor:
//                     selectedReportType === item
//                       ? "var(--bg-secondary)"
//                       : "transparent",
//                   color:
//                     selectedReportType === item
//                       ? "var(--btn-text-color)"
//                       : "var(--text-primary)",
//                 }}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           {reportUIArr.map((item, index) => {
//             return (
//               <button
//                 className={style.graph_btn}
//                 onClick={() => {
//                   setSelectedReport(item);
//                 }}
//                 style={{
//                   backgroundColor:
//                     selectedReport.id === item.id
//                       ? "var(--bg-secondary)"
//                       : "var(--bg-primary)",
//                 }}
//                 key={index}
//               >
//                 <item.icon
//                   color={
//                     selectedReport.id === item.id
//                       ? "var(--btn-text-color)"
//                       : "var(--text-primary)"
//                   }
//                 />
//               </button>
//             );
//           })}

// <Calendar
//   numberOfMonths={1}
//   value={selectedDates}
//   onChange={handleDateChange}
//   range
//   placeholder="dd/mm/yyyy - dd/mm/yyyy"
//   dateSeparator=" - "
//   calendarPosition="bottom-right"
//   format="DD/MM/YYYY"
//   className="dark-theme"
//   maxDate={new Date()}
// />

//           <button
//             onClick={() => setOpenStylistDropdown((prev) => !prev)}
//             className={style.stylist_btn}
//           >
//             <span>
//               <CustomerIcon />
//             </span>
//             Select Stylists
//           </button>

//           {openStylistDropdown && (
//             <ClickAwayListener
//               onClickAway={() => setOpenStylistDropdown(false)}
//             >
//               <div className={style.filter_popup}>
//                 <div className={style.filter_popup_header}>
//                   <p>Select Stylists</p>
//                   <button
//                     onClick={() => setOpenStylistDropdown(false)}
//                     className={style.filterpopup_close_btn}
//                   >
//                     <CloseIcon />
//                   </button>
//                 </div>

//                 <div className={style.filter_popup_body}>
//                   <div className={style.barber_item}>
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedReportBarber.length === 0 && selectedAllBarber
//                       }
//                       onChange={() => {
//                         setSelectedReportBarber([]);
//                         setSelectedAllBarber(true);
//                       }}
//                       // onClick={(e) => e.stopPropagation()}
//                     />
//                     <p>All</p>
//                   </div>
//                   {copyFilterBarberList?.map((item) => {
//                     const isChecked = selectedReportBarber.some(
//                       (b) => b.barberId === item.barberId
//                     );

//                     return (
//                       <div
//                         key={item.barberId}
//                         className={style.barber_item}
//                         onClick={() => toggleBarber(item)}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={isChecked}
//                           onChange={() => toggleBarber(item)}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                         <p>{item.xaxis}</p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </ClickAwayListener>
//           )}
//         </div>
//       </div>

//       <div className={style.report_mobile_header}>
//         <div>
//           <div>
//             <button
//               onClick={() => {
//                 navigate("/admin-reports");
//               }}
//             >
//               <LeftArrow color="var(--text-primary)" />
//             </button>
//             <h2>Reports</h2>
//           </div>

//           <div>
//             {reportUIArr.map((item, index) => {
//               return (
//                 <button
//                   onClick={() => {
//                     setSelectedReport(item);
//                   }}
//                   style={{
//                     backgroundColor:
//                       selectedReport.id === item.id
//                         ? "var(--bg-secondary)"
//                         : "var(--bg-primary)",
//                   }}
//                   key={index}
//                 >
//                   <item.icon
//                     color={
//                       selectedReport.id === item.id
//                         ? "var(--btn-text-color)"
//                         : "var(--text-primary)"
//                     }
//                   />
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className={style.stylist_calender_mobile_header}>
//           {/* Calendar */}
//           <Calendar
//             numberOfMonths={1}
//             value={selectedDates}
//             onChange={handleDateChange}
//             range
//             placeholder="dd/mm/yyyy - dd/mm/yyyy"
//             dateSeparator=" - "
//             // calendarPosition="bottom-right"
//             format="DD/MM/YYYY"
//             className="dark-theme"
//             maxDate={new Date()}
//           />

//           {/* Open dropdown button */}
//           <button
//             className={style.stylist_btn}
//             onMouseDown={(e) => {
//               e.stopPropagation();
//               setOpenStylistMobileDropdown(true);
//             }}
//           >
//             {/* <span>
//               <CustomerIcon />
//             </span> */}
//             Select Stylists
//           </button>
//         </div>

//         <div className={style.stylist_calender_report_value}>
//           <div>
//             {["daily", "weekly", "monthly"].map((item, index) => (
//               <button
//                 key={item}
//                 onClick={() => {
//                   setStartDate(null);
//                   setEndDate(null);
//                   setSelectedDates([]);
//                   setSelectedReportType(item);
//                 }}
//                 className={style.report_type_chip}
//                 style={{
//                   backgroundColor:
//                     selectedReportType === item
//                       ? "var(--bg-secondary)"
//                       : "transparent",
//                   color:
//                     selectedReportType === item
//                       ? "var(--btn-text-color)"
//                       : "var(--text-primary)",
//                 }}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className={style.report_container}>
//         <div className={style.report_main_container}>
//           <div>
//             <p style={{ textAlign: "center", width: "100%" }}>
//               {selectedReportChartType?.headerTitle}
//             </p>
//           </div>
//           {startDate && endDate ? (
//             <>
//               <div className={style.appointment_date_chip}>
//                 {startDate}
//                 <span style={{ margin: "0 8px" }}>-</span>
//                 {endDate}
//               </div>
//             </>
//           ) : chartDefaultValue ? (
//             <>
//               <div className={style.appointment_date_chip}>
//                 {chartDefaultValue?.startDate}
//                 <span style={{ margin: "0 8px" }}>-</span>
//                 {chartDefaultValue?.endDate}
//               </div>
//             </>
//           ) : null}

//           <div className={style.report_test_wrapper_container}>
//             {/* <div className={style.report_test_container}>
//               <div
//                 style={{
//                   width: dummyData.length * MIN_BAR_WIDTH,
//                   height: "100%",
//                 }}
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={dummyData}
//                     margin={{ top: 30, right: 20, left: 10, bottom: 20 }}
//                     barCategoryGap={20}
//                   >
//                     <CartesianGrid strokeDasharray="4 6" vertical={false} />

//                     <XAxis
//                       dataKey="name"
//                       interval={0}
//                       tick={{ fontSize: 12 }}
//                       axisLine={false}
//                       tickLine={false}
//                     />

//                     <YAxis axisLine={false} tickLine={false} />

//                     <Bar
//                       dataKey="value"
//                       radius={[8, 8, 0, 0]}
//                       maxBarSize={80} // ✅ never exceed 80px
//                     >
//                       <LabelList
//                         dataKey="value"
//                         position="top"
//                         fontSize={12}
//                         fontWeight={600}
//                       />
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div> */}

//             <div
//               className={style.report_test_container}
//               style={{ overflowX: "auto" }}
//             >
//               {selectedReport.text === "Pie" ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <defs>
//                       {chartData.map((item, index) => (
//                         <linearGradient
//                           key={index}
//                           id={`pieGrad-${index}`}
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop offset="0%" stopColor={item.fill} />
//                           <stop offset="100%" stopColor={item.fill2} />
//                         </linearGradient>
//                       ))}
//                     </defs>

//                     <Pie
//                       data={chartData}
//                       dataKey="yaxis"
//                       innerRadius="65%"
//                       outerRadius="100%"
//                       cornerRadius="12%"
//                       paddingAngle={1}
//                     >
//                       {chartData.map((_, index) => (
//                         <Cell key={index} fill={`url(#pieGrad-${index})`} />
//                       ))}

//                       <Label content={renderCenterContent(totalServed)} />

//                       <LabelList
//                         dataKey="yaxis"
//                         position="inside"
//                         fill="#fff"
//                         fontSize={"1.4rem"}
//                         fontWeight={600}
//                       />
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <ResponsiveContainer
//                   minWidth={chartData.length * 120} // ensures min 80px per bar + gap
//                   height="100%"
//                 >
//                   <BarChart
//                     data={chartData}
//                     margin={{
//                       top: 30,
//                     }}
//                     barCategoryGap={20}
//                   >
//                     <defs>
//                       {chartData.map((item) => (
//                         <linearGradient
//                           key={item.barberId}
//                           id={`grad-${item.barberId}`}
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop offset="0%" stopColor={item.fill} />
//                           <stop offset="100%" stopColor={item.fill2} />
//                         </linearGradient>
//                       ))}
//                     </defs>

//                     <CartesianGrid
//                       strokeDasharray="4 6"
//                       stroke="rgba(0,0,0,0.08)"
//                       vertical={false}
//                     />

//                     <XAxis
//                       dataKey="xaxis"
//                       // interval={0}
//                       // tick={renderXAxisTick}
//                       // axisLine={false}
//                       // tickLine={false}
//                       interval={0}
//                       tick={{ fontSize: 12 }}
//                       axisLine={false}
//                       tickLine={false}
//                     />

//                     {/* <YAxis axisLine={false} tickLine={false} /> */}

//                     <Bar
//                       dataKey="yaxis"
//                       radius={[8, 8, 0, 0]}
//                       barSize={80} // ✅ minimum bar width
//                     >
//                       {chartData.map((item) => (
//                         <Cell
//                           key={item.barberId}
//                           fill={`url(#grad-${item.barberId})`}
//                         />
//                       ))}

//                       <LabelList
//                         dataKey="yaxis"
//                         position="top"
//                         fill="var(--text-primary)"
//                         fontSize="1.4rem"
//                         fontWeight={600}
//                       />
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//             </div>

//             <div className={style.report_pie_stylist_container}>
//               {chartData?.map((item, index) => {
//                 return (
//                   <div key={item?.barberId}>
//                     <div
//                       style={{
//                         backgroundColor: item?.fill,
//                       }}
//                     />
//                     <p>{item?.xaxis}</p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* {selectedReport.text === "Pie" ? (
//             <div className={style.report_pie_container}>
//               <div>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <defs>
//                       {chartData.map((item, index) => (
//                         <linearGradient
//                           key={index}
//                           id={`pieGrad-${index}`}
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop offset="0%" stopColor={item.fill} />
//                           <stop offset="100%" stopColor={item.fill2} />
//                         </linearGradient>
//                       ))}
//                     </defs>

//                     <Pie
//                       data={chartData}
//                       dataKey="yaxis"
//                       innerRadius="65%"
//                       outerRadius="100%"
//                       cornerRadius="12%"
//                       paddingAngle={1}
//                     >
//                       {chartData.map((_, index) => (
//                         <Cell key={index} fill={`url(#pieGrad-${index})`} />
//                       ))}

//                       <Label content={renderCenterContent(totalServed)} />

//                       <LabelList
//                         dataKey="yaxis"
//                         position="inside"
//                         fill="#fff"
//                         fontSize={"1.4rem"}
//                         fontWeight={600}
//                       />
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className={style.report_pie_stylist_container}>
//                 {chartData?.map((item, index) => {
//                   return (
//                     <div key={item?.barberId}>
//                       <div
//                         style={{
//                           backgroundColor: item?.fill,
//                         }}
//                       />
//                       <p>{item?.xaxis}</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ) : (
//             <div className={style.report_pie_container}>
//               <div>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={chartData} barGap={10} margin={{ top: 30 }}>
//                     <defs>
//                       {chartData.map((item) => (
//                         <linearGradient
//                           key={item.barberId}
//                           id={`grad-${item.barberId}`}
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop offset="0%" stopColor={item.fill} />
//                           <stop offset="100%" stopColor={item.fill2} />
//                         </linearGradient>
//                       ))}
//                     </defs>

//                     <CartesianGrid
//                       strokeDasharray="4 6"
//                       stroke="rgba(0,0,0,0.08)"
//                       vertical={false}
//                     />

//                     <XAxis
//                       dataKey="xaxis"
//                       interval={0}
//                       tick={renderXAxisTick}
//                       axisLine={false}
//                       tickLine={false}
//                     />

//                     <Bar
//                       dataKey="yaxis"
//                       radius={[8, 8, 0, 0]}
//                       barSize={200}
//                       // maxBarSize={60}
//                     >
//                       {chartData.map((item) => (
//                         <Cell
//                           key={item.barberId}
//                           fill={`url(#grad-${item.barberId})`}
//                         />
//                       ))}

//                       <LabelList
//                         dataKey="yaxis"
//                         position="top"
//                         fill="var(--text-primary)"
//                         fontSize={"1.4rem"}
//                         fontWeight={600}
//                       />
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className={style.report_pie_stylist_container}>
//                 {chartData?.map((item, index) => {
//                   return (
//                     <div key={item?.barberId}>
//                       <div
//                         style={{
//                           backgroundColor: item?.fill,
//                         }}
//                       />
//                       <p>{item?.xaxis}</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )} */}
//         </div>
//         <div className={style.report_content_container}>
//           <p>Select analytics</p>

//           {upcommingAnalyticsSelectionList?.map((item) => {
//             return (
//               <button
//                 onClick={() => setSelectedReportChartType(item)}
//                 key={item.id}
//                 className={style.report_section_item}
//               >
//                 <div>{renderIcon(item.iconType)}</div>

//                 <div>
//                   <p>{item.title}</p>
//                   <p>{item.subTitle}</p>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* FILTER MODAL */}
//       <Modal
//         open={openStylistMobileDropdown}
//         onClose={() => setOpenStylistMobileDropdown(false)}
//       >
//         <div className={style.modal_common_container}>
//           <div className={style.filter_popup_header}>
//             <p>Select Stylists</p>
//             <button
//               onClick={() => setOpenStylistMobileDropdown(false)}
//               className={style.filterpopup_close_btn}
//             >
//               <CloseIcon />
//             </button>
//           </div>

//           <div className={style.filter_popup_body}>
//             {copyFilterBarberList?.map((item) => {
//               const isChecked = selectedReportBarber.some(
//                 (b) => b.barberId === item.barberId
//               );

//               return (
//                 <div
//                   key={item.barberId}
//                   className={style.barber_item}
//                   onClick={() => toggleBarber(item)}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={isChecked}
//                     onChange={() => toggleBarber(item)}
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <p>{item.xaxis}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Report;

// export const renderCenterContent = (totalServed) => {
//   return ({ viewBox }) => {
//     const { cx, cy } = viewBox;

//     return (
//       <>
//         <circle cx={cx} cy={cy} r={60} fill="var(--bg-secondary)" />

//         <text
//           x={cx}
//           y={cy}
//           textAnchor="middle"
//           dominantBaseline="middle"
//           fill="var(--btn-text-color)"
//           fontSize="1.6rem"
//           fontWeight="600"
//         >
//           {totalServed}
//         </text>
//       </>
//     );
//   };
// };

// const renderXAxisTick = ({ x, y, payload }) => {
//   const label =
//     payload.value.length > 8 ? payload.value.slice(0, 8) + "…" : payload.value;

//   return (
//     <text x={x} y={y + 10} textAnchor="middle" fill="#6b7280" fontSize={12}>
//       {label}
//     </text>
//   );
// };

// const renderIcon = (type) => {
//   switch (type) {
//     case "bar":
//       return <BarIcon color="var(--btn-text-color)" />;
//     case "customer":
//       return <CustomerIcon color="var(--btn-text-color)" />;
//     default:
//       return null;
//   }
// };

import React, { useEffect, useState } from "react";
import style from "./ReportChart.module.css";
import { BarIcon, LeftArrow } from "../../../icons";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
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
  ResetIcon,
} from "../../../newicons";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Calendar from "react-multi-date-picker";
import { Box, Modal } from "@mui/material";
import api from "../../../Redux/api/Api";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const ReportChart = () => {
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
      icon: BarIcon,
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
    // moment().subtract(31, "day").format("DD-MM-YYYY")
    null
  );
  const [endDate, setEndDate] = useState(
    // moment().subtract(1, "day").format("DD-MM-YYYY")
    null
  );

  const handleDateChange = (dates) => {
    const formatedDates = dates.map((date) => date.format("DD-MM-YYYY"));
    setStartDate(formatedDates[0]);
    setEndDate(formatedDates[1]);
    setSelectedDates(formatedDates);
    setSelectedReportType(null);
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

  const [selectedReportType, setSelectedReportType] = useState("daily");
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
      // if (startDate && endDate) {
      view_report();
      // }
    }
  }, [
    startDate,
    endDate,
    selectedReportType,
    selectedReportBarber,
    selectedReportChartType?.reportType,
  ]);

  // selectedReportChartType?.reportType === "stylistattendence"

  const fetch_stylist_barberlist = async () => {
    try {
      const { data } = await api.post(
        `api/barber/getAllBarberBySalonId?salonId=${salonId}`
      );

      setStylistBarberList(data?.getAllBarbers);
    } catch (error) {}
  };

  const [chartDefaultValue, setChartReportValueData] = useState(null);
  const [selectedAllBarber, setSelectedAllBarber] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [chartBarberListData, setChartBarberListData] = useState([]);

  const view_report = async () => {
    try {
      const reportData = {
        salonId,
        startDate,
        endDate,
        reportType: selectedReportChartType?.reportType,
        barberId: selectedReportBarber.map((item) => item?.barberId),
        reportValue: selectedReportType,
      };

      const { data } = await api.post(
        `/api/reports/getSalonLineGraphReport`,
        reportData
      );

      setChartData(data?.response?.data);
      setChartBarberListData(data?.response?.barbers);

      // setChartData(data?.response);
      // setChartReportValueData(data?.dateRange);
      if (!copyFilterBarberList?.length) {
        setCopyFilterBarberList(data?.response?.barbers);
        setSelectedReportBarber(
          data?.response?.barbers?.map((item) => {
            return {
              barberId: Number(item.key),
            };
          })
        );
        // setSelectedAllBarber(true);
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

  // useEffect(() => {
  //   if (selectedReportBarber.length === 0) {
  //     setSelectedReportBarber(
  //       copyFilterBarberList?.map((item) => {
  //         return {
  //           barberId: Number(item.key),
  //         };
  //       })
  //     );
  //   }
  // }, [selectedReportBarber]);

  const resetFilter = () => {
    setSelectedReportType("daily");
    setSelectedReportBarber(
      copyFilterBarberList?.map((item) => {
        return {
          barberId: Number(item.key),
        };
      })
    );
    setSelectedDates([]);
    setSelected_attendence_stylist(null);
    setStartDate(null);
    setEndDate(null);
  };

  const upcommingAnalyticsSelectionList =
    location?.state?.upcommingAnalytics?.filter(
      (upc) => upc?.id !== selectedReportChartType?.id
    );

  const [barber_attendence_list, setBarber_attendence_list] = useState([]);
  const [barber_attendence_list_loading, setBarber_attendence_list_loading] =
    useState(false);

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

  const [openStylistDropdown, setOpenStylistDropdown] = useState(false);
  const [openStylistMobileDropdown, setOpenStylistMobileDropdown] =
    useState(false);

  // const toggleBarberFromLegend = (barber) => {
  //   const barberId = Number(barber.key);

  //   setSelectedReportBarber((prev) => {
  //     const exists = prev.some((b) => b.barberId === barberId);

  //     if (exists) {
  //       // remove
  //       return prev.filter((b) => b.barberId !== barberId);
  //     }

  //     // add
  //     return [...prev, { barberId }];
  //   });

  //   if (selectedReportBarber.length === 0) {
  //     console.log("Array is empty");
  //   }
  // };

  const toggleBarberFromLegend = (barber) => {
    const barberId = Number(barber.key);

    setSelectedReportBarber((prev) => {
      const exists = prev.some((b) => b.barberId === barberId);

      let updated;

      if (exists) {
        updated = prev.filter((b) => b.barberId !== barberId);
      } else {
        updated = [...prev, { barberId }];
      }

      if (updated.length === 0) {
        return copyFilterBarberList.map((item) => ({
          barberId: Number(item.key),
        }));
      }

      return updated;
    });
  };

  //End of logic

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className={style.tooltip}>
        <p className={style.tooltipMonth}>{label}</p>

        {/* Scrollable content */}
        <div className={style.tooltipScroll}>
          {payload.map((item) => (
            <div key={item.dataKey} className={style.tooltipRow}>
              <span
                className={style.tooltipDot}
                style={{ backgroundColor: item.stroke }}
              />
              <span className={style.tooltipName}>
                {chartBarberListData.find((b) => b.key === item.dataKey)?.name}
              </span>
              <span className={style.tooltipValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
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

  return (
    <div className={style.report_body}>
      <div className={style.report_header}>
        <div className={style.header_left}>
          <button
            className={style.back_button}
            onClick={() => {
              navigate("/admin-reports");
            }}
          >
            <LeftArrow color="var(--text-primary)" />
          </button>
          <p className={style.title}>{selectedReportChartType?.headerTitle}</p>
        </div>

        <div className={style.header_right}>
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
            maxDate={new Date()}
          />
          <button className={style.reset_button} onClick={resetFilter}>
            <ResetIcon />
          </button>
        </div>
      </div>

      <div className={style.report_main_container}>
        <div className={style.left_report_container}>
          <div className={style.left_report_container_header}>
            {["daily", "weekly", "monthly"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setSelectedDates([]);
                  setSelectedReportType(item);
                }}
                className={`${style.filter_button} ${
                  selectedReportType === item ? style.active_filter : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className={style.chart_scroll_wrapper}>
            <div className={style.chart_inner}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="rgba(148, 163, 184, 0.35)"
                  />
                  <XAxis
                    dataKey="xaxis"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{ fill: "var(--text-secondary)", fontSize: "1.2rem" }}
                    padding={{ left: 12, right: 32 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-secondary)", fontSize: "1.2rem" }}
                    // domain={["dataMin - 3", "dataMax + 3"]}
                  />

                  <Tooltip
                    wrapperStyle={{ pointerEvents: "auto" }}
                    content={<CustomTooltip />}
                  />

                  {chartBarberListData.map((barber) => (
                    <Line
                      key={barber.key}
                      type="monotone"
                      dataKey={barber.key}
                      stroke={barber.color}
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: barber.color,
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horizontal Stylist List */}
          <div className={style.stylist_scroll_container}>
            <div className={style.stylist_container}>
              {copyFilterBarberList.map((barber) => {
                const isActive = selectedReportBarber.some(
                  (b) => b.barberId === Number(barber.key)
                );

                return (
                  <button
                    key={barber.key}
                    className={`${style.barberItem_legend} ${
                      isActive ? style.active_barber : style.inactive_barber
                    }`}
                    onClick={() => toggleBarberFromLegend(barber)}
                  >
                    <span
                      className={style.dot}
                      style={{ backgroundColor: barber.color }}
                    />
                    {barber.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={style.right_report_container}>
          {/* Header */}
          <div className={style.right_header}>
            <h3>Analytics Overview</h3>
            <p className={style.right_subtitle}>
              Track performance insights across your salon
            </p>
          </div>

          {/* Analytics List */}
          <div className={style.analytics_list}>
            {upcommingAnalyticsSelectionList?.map((item) => {
              const isActive = selectedReportChartType?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedReportChartType(item)}
                  className={`${style.report_section_item} ${
                    isActive ? style.active_item : ""
                  }`}
                >
                  <div className={style.icon_wrapper}>
                    {renderIcon(item.iconType)}
                  </div>

                  <div className={style.text_wrapper}>
                    <p className={style.item_title}>{item.title}</p>
                    <p className={style.item_subtitle}>{item.subTitle}</p>
                  </div>

                  <div className={style.arrow}>→</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportChart;
