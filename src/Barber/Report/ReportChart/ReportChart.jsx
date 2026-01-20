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
// const barberId = useSelector(
//   (state) => state.BarberLoggedInMiddleware.barberId
// );
// const location = useLocation();

// const [selectedReportChartType, setSelectedReportChartType] = useState(
//   location?.state?.reportTypeItem
// );

// const navigate = useNavigate();

// const salonId = useSelector(
//   (state) => state.BarberLoggedInMiddleware.barberSalonId
// );

// const reportUIArr = [
//   {
//     id: 1,
//     text: "Pie",
//     icon: PieChartIcon,
//   },
//   {
//     id: 2,
//     text: "Bar",
//     icon: BarIcon,
//   },
// ];

// const [selectedReport, setSelectedReport] = useState(reportUIArr[1]);
// const [openFilterPopup, setOpenFilterPopup] = useState(false);

// const [selectedDates, setSelectedDates] = useState([]);

// const [startDate, setStartDate] = useState(null);
// // moment().subtract(31, "day").format("DD-MM-YYYY")
// const [endDate, setEndDate] = useState(null);
// // moment().subtract(1, "day").format("DD-MM-YYYY")

// const handleDateChange = (dates) => {
//   const formatedDates = dates.map((date) => date.format("DD-MM-YYYY"));
//   setStartDate(formatedDates[0]);
//   setEndDate(formatedDates[1]);
//   setSelectedDates(formatedDates);
//   setSelectedReportValue("daily");
// };

// const [isMobile, setIsMobile] = useState(false);

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

// const [selectedReportValue, setSelectedReportValue] = useState("daily");
// const [selectedReportBarber, setSelectedReportBarber] = useState([]);
// const [openFilter, setOpenFilter] = useState(false);

// const [stylistBarberList, setStylistBarberList] = useState([]);
// const [selected_attendence_stylist, setSelected_attendence_stylist] =
//   useState(null);

// useEffect(() => {
//   if (selectedReportChartType?.reportType === "stylistattendence") {
//     if (startDate && endDate) {
//       fetch_barber_attendence_list();
//     }
//   } else {
//     view_report();
//   }
// }, [
//   startDate,
//   endDate,
//   selectedReportBarber,
//   selectedReportChartType?.reportType,
//   selectedReportValue,
// ]);

// // selectedReportChartType?.reportType === "stylistattendence"

// const [chartData, setChartData] = useState([]);
// const [chartDefaultValue, setChartReportValueData] = useState(null);

// const view_report = async () => {
//   try {
//     const reportData = {
//       salonId,
//       startDate,
//       endDate,
//       reportValue: selectedReportValue,
//       reportType: selectedReportChartType?.reportType,
//       barberId,
//     };

//     const { data } = await api.post(
//       `/api/reports/getBarberChartReport`,
//       reportData
//     );

//     setChartData(data?.response);
//     setChartReportValueData(data?.dateRange);
//   } catch (error) {}
// };

// const totalServed = chartData.reduce((sum, item) => sum + item.yaxis, 0);

// const toggleBarber = (barber) => {
//   setSelectedReportBarber((prev) => {
//     const exists = prev.some((item) => item.barberId === barber.barberId);

//     if (exists) {
//       // remove (re-enter works now)
//       return prev.filter((item) => item.barberId !== barber.barberId);
//     }

//     // add
//     return [...prev, barber];
//   });
// };

// const resetFilter = () => {
//   setSelectedReportBarber([]);
//   setSelectedDates([]);
//   setSelected_attendence_stylist(null);
//   setStartDate(null);
//   setEndDate(null);
//   setSelectedReportValue("daily");
// };

// const upcommingAnalyticsSelectionList =
//   location?.state?.upcommingAnalytics?.filter(
//     (upc) => upc?.id !== selectedReportChartType?.id
//   );

// const [barber_attendence_list, setBarber_attendence_list] = useState([]);
// const [barber_attendence_list_loading, setBarber_attendence_list_loading] =
//   useState(false);

// // useEffect(() => {
// //   if (selected_attendence_stylist?.barberId) {
// //     fetch_barber_attendence_list();
// //   }
// // }, [selected_attendence_stylist?.barberId, startDate, endDate]);

// const fetch_barber_attendence_list = async () => {
//   try {
//     const attendenceData = {
//       salonId,
//       barberId,
//       startDate,
//       endDate,
//     };

//     setBarber_attendence_list_loading(true);

//     const { data } = await api.post(
//       `/api/barber/getAttendenceByBarberId`,
//       attendenceData
//     );

//     setBarber_attendence_list(data?.response?.attendance);
//   } catch (error) {
//   } finally {
//     setBarber_attendence_list_loading(false);
//   }
// };

//   return selectedReportChartType?.reportType === "stylistattendence" ? (
//     <div className={style.report_section_attendence}>
//       <div className={style.report_header}>
//         <div>
//           <div>
//             <button
//               onClick={() => {
//                 navigate("/barber-reports");
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
//                     />
//                   </div>

//                   {/* <div className={style.filter_section}>
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
//                   </div> */}

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
//                 navigate("/barber-reports");
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

//       {!startDate && !endDate ? (
//         <div className={style.report_section_attendence_container_error}>
//           <p>Select a time range to view your attendance records.</p>
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

//               {/* <div className={style.filter_section}>
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
//               </div> */}

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
//                 navigate("/barber-reports");
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
//                   setSelectedReportValue(item);
//                 }}
//                 className={style.report_type_chip}
//                 style={{
//                   backgroundColor:
//                     selectedReportValue === item
//                       ? "var(--bg-secondary)"
//                       : "transparent",
//                   color:
//                     selectedReportValue === item
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

//           <Calendar
//             numberOfMonths={1}
//             value={selectedDates}
//             onChange={handleDateChange}
//             range
//             placeholder="dd/mm/yyyy - dd/mm/yyyy"
//             dateSeparator=" - "
//             calendarPosition="bottom-right"
//             format="DD/MM/YYYY"
//             className="dark-theme"
//             maxDate={new Date()}
//           />
//         </div>
//       </div>

//       <div className={style.report_mobile_header}>
//         <div>
//           <div>
//             <button
//               onClick={() => {
//                 navigate("/barber-reports");
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

//             {/* <button
//               onClick={() => {
//                 setOpenFilter((prev) => !prev);
//               }}
//               className={style.filter_btn}
//             >
//               <FilterIcon />
//               <span>Filter</span>
//             </button> */}
//           </div>
//         </div>

//         <Calendar
//           numberOfMonths={1}
//           value={selectedDates}
//           onChange={handleDateChange}
//           range
//           placeholder="dd/mm/yyyy - dd/mm/yyyy"
//           dateSeparator=" - "
//           calendarPosition="bottom-right"
//           format="DD/MM/YYYY"
//           className="dark-theme"
//           maxDate={new Date()}
//         />

//         <div className={style.stylist_calender_report_value}>
//           <div>
//             {["daily", "weekly", "monthly"].map((item, index) => (
//               <button
//                 key={item}
//                 onClick={() => {
//                   setStartDate(null);
//                   setEndDate(null);
//                   setSelectedDates([]);
//                   setSelectedReportValue(item);
//                 }}
//                 className={style.report_type_chip}
//                 style={{
//                   backgroundColor:
//                     selectedReportValue === item
//                       ? "var(--bg-secondary)"
//                       : "transparent",
//                   color:
//                     selectedReportValue === item
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
//             <div className={style.report_test_container}>
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
//                   minWidth={
//                     chartData.length *
//                     (selectedReportValue === "weekly" ? 150 : 120)
//                   } // ensures min 80px per bar + gap
//                   height="100%"
//                 >
//                   <BarChart
//                     data={chartData}
//                     margin={{
//                       top: 30,
//                     }}
//                     barCategoryGap={50}
//                   >
//                     <defs>
//                       {chartData.map((item, index) => (
//                         <linearGradient
//                           key={index}
//                           id={`grad-${index}`}
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
//                       {chartData.map((item, index) => (
//                         <Cell key={index} fill={`url(#grad-${index})`} />
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
//                 <p>Report Type</p>
//                 <div className={style.filter_chip_group}>
//                   {["daily", "weekly", "monthly"].map((item, index) => (
//                     <button
//                       key={item}
//                       onClick={() => {
//                         setSelectedReportValue(item);
//                       }}
//                       className={style.filter_chip}
//                       style={{
//                         backgroundColor:
//                           selectedReportValue === item
//                             ? "var(--bg-secondary)"
//                             : "transparent",
//                         color:
//                           selectedReportValue === item
//                             ? "var(--btn-text-color)"
//                             : "var(--text-primary)",
//                       }}
//                     >
//                       {item}
//                     </button>
//                   ))}
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
//     payload.value.length > 20 ? payload.value.slice(0, 8) + "…" : payload.value;

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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarIcon, LeftArrow } from "../../../icons";
import {
  CloseIcon,
  ContactTel,
  CustomerIcon,
  EmailIcon,
  FilterIcon,
  LeftIcon,
  PieChartIcon,
  ResetIcon,
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

const dummyChartData = [
  { xaxis: "Jan", barber1: 30, barber2: 20 },
  { xaxis: "Feb", barber1: 45, barber2: 35 },
  { xaxis: "Mar", barber1: 28, barber2: 40 },
  { xaxis: "Apr", barber1: 60, barber2: 50 },
  { xaxis: "May", barber1: 55, barber2: 42 },
];

const dummyBarbers = [
  { key: "barber1", name: "John", color: "#3b82f6" },
  { key: "barber2", name: "Alex", color: "#10b981" },
  { key: "barber3", name: "Mike", color: "#f59e0b" },
  { key: "barber4", name: "Chris", color: "#ef4444" },
  { key: "barber5", name: "Ryan", color: "#8b5cf6" },
  { key: "barber6", name: "David", color: "#ec4899" },
  { key: "barber7", name: "Sam", color: "#22c55e" },
  { key: "barber8", name: "Tom", color: "#06b6d4" },
  { key: "barber9", name: "James", color: "#f97316" },
  { key: "barber10", name: "Daniel", color: "#6366f1" },
  { key: "barber11", name: "Ben", color: "#14b8a6" },
  { key: "barber12", name: "Leo", color: "#84cc16" },
  { key: "barber13", name: "Mark", color: "#eab308" },
  { key: "barber14", name: "Nathan", color: "#a855f7" },
  { key: "barber15", name: "Oliver", color: "#0ea5e9" },
  { key: "barber16", name: "Ethan", color: "#fb7185" },
  { key: "barber17", name: "Luke", color: "#4ade80" },
  { key: "barber18", name: "Aaron", color: "#38bdf8" },
  { key: "barber19", name: "Noah", color: "#f472b6" },
  { key: "barber20", name: "Jacob", color: "#c084fc" },
];

const dummyAnalyticsList = [
  {
    id: 1,
    title: "Total Revenue",
    subTitle: "Overall earnings",
    iconType: "revenue",
  },
  {
    id: 2,
    title: "Appointments",
    subTitle: "Booked sessions",
    iconType: "appointments",
  },
  {
    id: 3,
    title: "Top Stylists",
    subTitle: "Best performers",
    iconType: "stylists",
  },
];

const ReportChart = () => {
  const barberId = useSelector(
    (state) => state.BarberLoggedInMiddleware.barberId
  );
  const location = useLocation();

  const [selectedReportChartType, setSelectedReportChartType] = useState(
    location?.state?.reportTypeItem
  );

  const navigate = useNavigate();

  const salonId = useSelector(
    (state) => state.BarberLoggedInMiddleware.barberSalonId
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

  const [startDate, setStartDate] = useState(null);
  // moment().subtract(31, "day").format("DD-MM-YYYY")
  const [endDate, setEndDate] = useState(null);
  // moment().subtract(1, "day").format("DD-MM-YYYY")

  const handleDateChange = (dates) => {
    const formatedDates = dates.map((date) => date.format("DD-MM-YYYY"));
    setStartDate(formatedDates[0]);
    setEndDate(formatedDates[1]);
    setSelectedDates(formatedDates);
    setSelectedReportValue(null);
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

  const [selectedReportValue, setSelectedReportValue] = useState("daily");
  const [selectedReportBarber, setSelectedReportBarber] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const [stylistBarberList, setStylistBarberList] = useState([]);
  const [selected_attendence_stylist, setSelected_attendence_stylist] =
    useState(null);

  useEffect(() => {
    if (selectedReportChartType?.reportType === "stylistattendence") {
      if (startDate && endDate) {
        fetch_barber_attendence_list();
      }
    } else {
      view_report();
    }
  }, [
    startDate,
    endDate,
    selectedReportBarber,
    selectedReportChartType?.reportType,
    selectedReportValue,
  ]);

  // selectedReportChartType?.reportType === "stylistattendence"

  const [chartData, setChartData] = useState([]);
  const [chartBarberListData, setChartBarberListData] = useState([]);

  const [chartDefaultValue, setChartReportValueData] = useState(null);

  const view_report = async () => {
    try {
      const reportData = {
        salonId,
        startDate,
        endDate,
        reportValue: selectedReportValue,
        reportType: selectedReportChartType?.reportType,
        barberId,
      };

      const { data } = await api.post(
        `/api/reports/getBarberLineGraphReport`,
        reportData
      );

      setChartData(data?.response?.data);
      setChartBarberListData(data?.response?.barbers);

      // setChartReportValueData(data?.dateRange);
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
    setSelectedReportValue("daily");
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

  // useEffect(() => {
  //   if (selected_attendence_stylist?.barberId) {
  //     fetch_barber_attendence_list();
  //   }
  // }, [selected_attendence_stylist?.barberId, startDate, endDate]);

  const fetch_barber_attendence_list = async () => {
    try {
      const attendenceData = {
        salonId,
        barberId,
        startDate,
        endDate,
      };

      setBarber_attendence_list_loading(true);

      const { data } = await api.post(
        `/api/barber/getAttendenceByBarberId`,
        attendenceData
      );

      setBarber_attendence_list(data?.response?.attendance);
    } catch (error) {
    } finally {
      setBarber_attendence_list_loading(false);
    }
  };

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

  return selectedReportChartType?.reportType === "stylistattendence" ? (
    <div className={style.stylist_attendence_section}>
      {/* ================= HEADER ================= */}
      <div className={style.stylist_attendence_header}>
        <div>
          <div>
            <button
              className={style.common_stylist_button}
              onClick={() => navigate("/barber-reports")}
            >
              <LeftArrow color="var(--text-primary)" />
            </button>
            <h2>Reports</h2>
          </div>
        </div>

        <div>
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

          <button
            className={style.stylist_attendence_reset_button}
            onClick={resetFilter}
          >
            <ResetIcon />
          </button>
        </div>
      </div>

      {/* ================= STYLIST INFO ================= */}
      {selected_attendence_stylist && (
        <div className={style.stylist_attendence_profile}>
          <img
            src={selected_attendence_stylist?.profile?.[0]?.url}
            alt={selected_attendence_stylist?.name}
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

      {/* ================= EMPTY / LOADING / DATA ================= */}
      {!startDate && !endDate ? (
        <div className={style.stylist_attendence_empty}>
          <p>Select a time range to view your attendance records.</p>
        </div>
      ) : barber_attendence_list_loading ? (
        <div className={style.stylist_attendence_loading}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className={style.stylist_attendence_skeleton}>
              <Skeleton
                width="100%"
                height="14rem"
                baseColor="var(--loader-bg-color)"
                highlightColor="var(--loader-highlight-color)"
              />
            </div>
          ))}
        </div>
      ) : barber_attendence_list?.length > 0 ? (
        <div className={style.stylist_attendence_list}>
          {barber_attendence_list.map((item) => (
            <div key={item?._id} className={style.stylist_attendence_card}>
              {/* Date Row */}
              <div className={style.stylist_attendence_date}>
                <p>{item.date}</p>
                <span
                  className={style.stylist_attendence_day}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--btn-text-color)",
                  }}
                >
                  {item.day}
                </span>
              </div>

              <div className={style.stylist_attendence_divider} />

              {/* Time Row */}
              <div className={style.stylist_attendence_time}>
                <div className={style.stylist_attendence_time_block}>
                  <p>Time in</p>
                  <p>{item.signInTime || "-"}</p>
                </div>

                <div className={style.stylist_attendence_time_block}>
                  <p>Time out</p>
                  <p>{item.signOutTime || "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.stylist_attendence_empty}>
          <p>No attendance available for {selected_attendence_stylist?.name}</p>
        </div>
      )}
    </div>
  ) : (
    <div className={style.report_body}>
      {/* Header */}
      <div className={style.report_header}>
        <div className={style.header_left}>
          <button
            className={style.back_button}
            onClick={() => {
              navigate("/barber-reports");
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

      {/* Main Layout */}
      <div className={style.report_main_container}>
        {/* Left Section */}
        <div className={style.left_report_container}>
          {/* Filter Tabs */}
          <div className={style.left_report_container_header}>
            {/* <button className={`${style.filter_button} ${style.active_filter}`}>
              Daily
            </button>
            <button className={style.filter_button}>Weekly</button>
            <button className={style.filter_button}>Monthly</button> */}

            {["daily", "weekly", "monthly"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setSelectedDates([]);
                  setSelectedReportValue(item);
                }}
                className={`${style.filter_button} ${
                  selectedReportValue === item ? style.active_filter : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className={style.chart_scroll_wrapper}>
            <div className={style.chart_inner}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="rgba(148, 163, 184, 0.35)"
                  />
                  <XAxis
                    interval={0} 
                    minTickGap={0} 
                    dataKey="xaxis"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-secondary)", fontSize: "1.2rem" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-secondary)", fontSize: "1.2rem" }}
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

          {/* Barber Legend */}
          {/* <div className={style.stylist_scroll_container}>
            <div className={style.stylist_container}>
              {dummyBarbers.map((barber) => (
                <button
                  key={barber.key}
                  className={`${style.barberItem_legend} ${style.active_barber}`}
                >
                  <span
                    className={style.dot}
                    style={{ backgroundColor: barber.color }}
                  />
                  {barber.name}
                </button>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Section */}
        <div className={style.right_report_container}>
          <div className={style.right_header}>
            <h3>Analytics Overview</h3>
            <p className={style.right_subtitle}>
              Track performance insights across your salon
            </p>
          </div>

          <div className={style.analytics_list}>
            {upcommingAnalyticsSelectionList.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelectedReportChartType(item)}
                className={`${style.report_section_item} ${
                  index === 0 ? style.active_item : ""
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportChart;
