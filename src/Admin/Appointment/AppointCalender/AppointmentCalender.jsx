// import React, { useEffect, useRef, useState } from 'react'
// import style from './AppointmentCalender.module.css'
// import { AppointmentIcon, LeftIcon, RightIcon } from '../../../newicons'
// import moment from 'moment';
// import { RightArrow } from '../../../icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAdminAppointmentListSalonIdAction } from '../../../Redux/Admin/Actions/AppointmentAction';
// import { Skeleton } from '@mui/material';
// import api from '../../../Redux/api/Api';
// import { CLEAR_ALL_APPOINTMENTSLIST, GET_APPOINTMENTSLIST_BY_BARBERNAME } from '../../../Redux/Admin/Constants/constants';

// const AppointmentCalender = () => {

//     const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

//     const {
//         response: adminGetDefaultSalonResponse
//     } = adminGetDefaultSalon

//     const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
//     const [appointmentData, setAppointmentData] = useState([])

//     const AppointmentRef = useRef(null);

//     useEffect(() => {

//         if (AppointmentRef.current) {
//             AppointmentRef.current.abort();
//         }

//         const newController = new AbortController();
//         AppointmentRef.current = newController;

//         const signal = newController.signal;

//         const apfunc = async () => {
//             const { data } = await api.post("/api/appointments/getAllAppointmentsBySalonId", {
//                 salonId: salonId
//             }, { signal })
//             setAppointmentData(data?.response)
//         }

//         apfunc();

//         return () => {
//             AppointmentRef.current.abort();
//         };

//     }, [salonId])

//     // ⬇️ inside component
//     const [maxAppointmentDays, setMaxAppointmentDays] = useState(0);

//     useEffect(() => {
//         const fetchSalonMaxAppointmentDays = async () => {
//             try {
//                 const { data } = await api.post("/api/salonSettings/getSalonSettings", {
//                     salonId: salonId
//                 });

//                 // convert to number
//                 setMaxAppointmentDays(Number(data?.response?.appointmentAdvanceDays || 0));
//             } catch (error) {
//                 console.log(error);
//             }
//         };

//         fetchSalonMaxAppointmentDays();
//     }, [salonId]);


//     // console.log("appointmentData ", appointmentData)

//     const [dates, setDates] = useState([]);
//     const [currentMonth, setCurrentMonth] = useState(moment(moment().format("YYYY-MM"), "YYYY-MM")); // Current month start


//     const isNextDisabled = currentMonth.clone().add(1, 'month').startOf('month').isAfter(maxAppointmentDays);

//     const generateDatesForMonth = (monthMoment, maxAppointmentDays) => {
//         const today = moment().startOf("day");
//         const maxAllowedDate = today.clone().add(maxAppointmentDays, "days");

//         let tempDates = [];

//         const startOfMonth = monthMoment.clone().startOf("month");
//         const endOfMonth = monthMoment.clone().endOf("month");

//         // ✅ If current month, start from today; else, start from startOfMonth
//         const loopStart = monthMoment.isSame(today, "month")
//             ? today.clone()
//             : startOfMonth;

//         // ✅ Cap at maxAllowedDate
//         const loopEnd = moment.min(endOfMonth, maxAllowedDate);

//         // ✅ Generate dates only if within range
//         for (let day = loopStart.clone(); day.isSameOrBefore(loopEnd); day.add(1, "day")) {
//             tempDates.push({
//                 dayName: day.format("ddd").slice(0, 1),
//                 dayFullName: day.format("dddd"),
//                 date: day.format("DD"),
//                 month: day.format("MMM"),
//                 year: day.format("YYYY"),
//                 fullDate: day.format("YYYY-MM-DD"),
//                 slots: Math.floor(Math.random() * 10),
//             });
//         }

//         setDates(tempDates);
//     };

//     // Load current month initially
//     useEffect(() => {
//         generateDatesForMonth(currentMonth, maxAppointmentDays);
//     }, [currentMonth]);

//     // Go to next month
//     const nextMonthFunc = () => {
//         setCurrentMonth((prev) => prev.clone().add(1, "month"));
//     };

//     // Go to previous month
//     const prevMonthFunc = () => {
//         setCurrentMonth((prev) => prev.clone().subtract(1, "month"));
//     };

//     const [selectedDay, setSelectedDay] = useState("")

//     const dispatch = useDispatch()

//     useEffect(() => {
//         if (selectedDay) {
//             dispatch(getAdminAppointmentListSalonIdAction({
//                 salonId,
//             }, selectedDay?.fullDate));
//         }

//         return () => {
//             dispatch({
//                 type: CLEAR_ALL_APPOINTMENTSLIST,
//             })
//         }

//     }, [dispatch, selectedDay]);

//     const getAdminAppointmentListSalonId = useSelector((state) => state.getAdminAppointmentListSalonId)

//     const {
//         loading: getAdminAppointmentListSalonIdLoading,
//         response: getAdminAppointmentListSalonIdResponse,
//     } = getAdminAppointmentListSalonId;


//     const [searchBarber, setSearchBarber] = useState("")

//     useEffect(() => {
//         // Only dispatch the filter action if a search term is present.
//         // The reducer will handle an empty search term by resetting the list.
//         dispatch({
//             type: GET_APPOINTMENTSLIST_BY_BARBERNAME,
//             payload: searchBarber,
//         })
//     }, [searchBarber, dispatch])


//     return (
//         <section className={style.appointmentSection}>
//             <div className={style.calenderDayCalender}>
//                 <div>
//                     <p>{currentMonth.format('MMMM YYYY')}</p>
//                     <div>
//                         <button onClick={prevMonthFunc}><LeftIcon size={"1rem"} /></button>
//                         <button
//                             onClick={nextMonthFunc}
//                             disabled={isNextDisabled}
//                         ><RightIcon size={"1rem"} /></button>
//                     </div>
//                 </div>

//                 <div>
//                     {
//                         dates.map((item) => {
//                             return (
//                                 <div
//                                     key={item.fullDate}
//                                     className={style.dayItem}>
//                                     <div>
//                                         <p>{item.dayName}</p>
//                                         <button
//                                             onClick={() => {
//                                                 setSelectedDay(item)
//                                                 // setSelectedDayAllAppointments(item.appointments)
//                                             }}
//                                             style={{
//                                                 position: "relative",
//                                                 color: "var(--text-primary)",
//                                                 backgroundColor: selectedDay.date === item.date ? "var(--input-bg-color)" : undefined
//                                             }}
//                                         >{item.date}
//                                             {
//                                                 appointmentData?.some(
//                                                     (appointment) => appointment.appointmentDate === item.fullDate
//                                                 ) ? (
//                                                     <span style={{
//                                                         position: "absolute",
//                                                         bottom: "-0.7rem",
//                                                         left: "50%",            // ✅ Use left instead of right
//                                                         transform: "translateX(-50%)", // ✅ This perfectly centers horizontally
//                                                         width: "0.4rem",
//                                                         height: "0.4rem",
//                                                         backgroundColor: "var(--text-primary)",
//                                                         borderRadius: "50%"
//                                                     }}></span>
//                                                 ) : (null)
//                                             }

//                                         </button>
//                                     </div>
//                                 </div>
//                             )
//                         })
//                     }

//                 </div>

//             </div>

//             {
//                 selectedDay && (
//                     <div className={style.selectedDay_Container}>
//                         <div>
//                             <div>
//                                 <b>{selectedDay?.month}</b>{" "}
//                                 <b>{selectedDay?.date} ,</b>
//                             </div>
//                             <p>{selectedDay?.dayFullName}</p>
//                         </div>

//                         <input
//                             type="text"
//                             value={searchBarber}
//                             onChange={(e) => setSearchBarber(e.target.value)}
//                             placeholder={`Search ${adminGetDefaultSalonResponse?.salonType === "Barber Shop" ? "Barber" : "Stylist"}`}
//                         />
//                     </div>
//                 )
//             }

//             {
//                 getAdminAppointmentListSalonIdLoading ? (
//                     <div className={style.appointmentList_loading}>
//                         {
//                             [0, 1, 2, 3, 4, 5].map((item, index) => {
//                                 return (
//                                     <Skeleton
//                                         key={index}
//                                         count={1}
//                                         style={{ width: "100%", height: "8rem" }}
//                                         baseColor={"var(--loader-bg-color)"}
//                                         highlightColor={"var(--loader-highlight-color)"} />
//                                 )
//                             })
//                         }
//                     </div>
//                 ) : getAdminAppointmentListSalonIdResponse?.length > 0 ? (
//                     <div className={style.appointmentList}>


//                         {
//                             getAdminAppointmentListSalonIdResponse?.map((item, index) => {
//                                 return (
//                                     <div
//                                         key={item._id}
//                                         className={style.appointmentItem}
//                                     >
//                                         <div>
//                                             <div className={style.bar}></div>

//                                             <div>
//                                                 <div>
//                                                     <img src={item?.customerProfile?.[0]?.url} alt="" />
//                                                 </div>
//                                                 <div>
//                                                     <p>{item?.customerName}</p>
//                                                     <p>{item?.timeSlots}</p>
//                                                 </div>
//                                             </div>

//                                             <p style={{
//                                                 position: "absolute",
//                                                 right: "1rem"
//                                             }}>{item?.barbername}</p>

//                                         </div>

//                                     </div>

//                                 )
//                             })
//                         }

//                     </div>
//                 ) : (

//                     <div div className={style.empty_appointment_list}>
//                         <div>
//                             <div><AppointmentIcon color={"var(--text-primary)"} /></div>
//                             <h2>No appointments available</h2>
//                             <p>There are currently no appointments scheduled. When a new appointment is made, it will appear here.</p>
//                         </div>
//                     </div>

//                 )
//             }


//         </section >
//     )
// }

// export default AppointmentCalender


import React, { useEffect, useRef, useState } from 'react';
import style from './AppointmentCalender.module.css';
import { AppointmentIcon, LeftIcon, RightIcon } from '../../../newicons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminAppointmentListSalonIdAction } from '../../../Redux/Admin/Actions/AppointmentAction';
import { Skeleton } from '@mui/material';
import api from '../../../Redux/api/Api';
import { CLEAR_ALL_APPOINTMENTSLIST, GET_APPOINTMENTSLIST_BY_BARBERNAME } from '../../../Redux/Admin/Constants/constants';

const AppointmentCalender = () => {
    const adminGetDefaultSalon = useSelector((state) => state.adminGetDefaultSalon);
    const { response: adminGetDefaultSalonResponse } = adminGetDefaultSalon;
    const salonId = useSelector((state) => state.AdminLoggedInMiddleware.adminSalonId);
    const [appointmentData, setAppointmentData] = useState([]);
    const AppointmentRef = useRef(null);
    const dispatch = useDispatch();

    // Fetch all appointments for the salon on component mount
    useEffect(() => {
        const fetchAppointments = async () => {
            const controller = new AbortController();
            AppointmentRef.current = controller;
            const signal = controller.signal;

            try {
                const { data } = await api.post('/api/appointments/getAllAppointmentsBySalonId', { salonId }, { signal });
                setAppointmentData(data?.response || []);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Failed to fetch appointments:', error);
                }
            }
        };

        if (salonId) {
            fetchAppointments();
        }

        return () => {
            if (AppointmentRef.current) {
                AppointmentRef.current.abort();
            }
        };
    }, [salonId]);

    const [maxAppointmentDays, setMaxAppointmentDays] = useState(0);

    // Fetch the max appointment days setting for the salon
    useEffect(() => {
        const fetchSalonMaxAppointmentDays = async () => {
            try {
                const { data } = await api.post('/api/salonSettings/getSalonSettings', { salonId });
                setMaxAppointmentDays(Number(data?.response?.appointmentAdvanceDays || 0));
            } catch (error) {
                console.error('Failed to fetch salon settings:', error);
            }
        };
        if (salonId) {
            fetchSalonMaxAppointmentDays();
        }
    }, [salonId]);

    const [dates, setDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
    const [selectedDay, setSelectedDay] = useState(null);

    const generateDatesForMonth = (monthMoment, maxDays) => {
        const today = moment().startOf('day');
        const tomorrow = today.clone().add(1, 'day');
        const maxAllowedDate = today.clone().add(maxDays, 'days').startOf('day');

        let tempDates = [];

        // start from tomorrow if current month is same as today's
        const loopStart = monthMoment.isSame(today, 'month') ? tomorrow : monthMoment.clone().startOf('month');

        // loop until maxAllowedDate (not end of month)
        for (let day = loopStart.clone(); day.isSameOrBefore(maxAllowedDate); day.add(1, 'day')) {
            tempDates.push({
                dayName: day.format('ddd').slice(0, 1),
                dayFullName: day.format('dddd'),
                date: day.format('DD'),
                month: day.format('MMM'),
                year: day.format('YYYY'),
                fullDate: day.format('YYYY-MM-DD'),
            });
        }

        setDates(tempDates);

        if (!selectedDay && tempDates.length > 0) {
            setSelectedDay(tempDates[0]);
        }
    };


    // Recalculate dates whenever currentMonth or maxAppointmentDays changes
    useEffect(() => {
        generateDatesForMonth(currentMonth, maxAppointmentDays);
    }, [currentMonth, maxAppointmentDays]);


    // Fetch appointment list for the selected day
    useEffect(() => {
        if (selectedDay) {
            dispatch(getAdminAppointmentListSalonIdAction({ salonId }, selectedDay.fullDate));
        }

        return () => {
            dispatch({ type: CLEAR_ALL_APPOINTMENTSLIST });
        };
    }, [dispatch, selectedDay, salonId]);

    const getAdminAppointmentListSalonId = useSelector((state) => state.getAdminAppointmentListSalonId);
    const { loading: getAdminAppointmentListSalonIdLoading, response: getAdminAppointmentListSalonIdResponse } = getAdminAppointmentListSalonId;

    const [searchBarber, setSearchBarber] = useState('');

    // Filter appointments by barber name
    useEffect(() => {
        dispatch({
            type: GET_APPOINTMENTSLIST_BY_BARBERNAME,
            payload: searchBarber,
        });
    }, [searchBarber, dispatch]);

    // Go to next month
    const nextMonthFunc = () => {
        setCurrentMonth((prev) => prev.clone().add(1, 'month'));
    };

    // Go to previous month
    const prevMonthFunc = () => {
        setCurrentMonth((prev) => prev.clone().subtract(1, 'month'));
    };

    // Disable the "Previous" button if the current month is the same as the present month
    const isPrevDisabled = currentMonth.isSame(moment(), 'month');
    // Disable the "Next" button if the next month is beyond the allowed appointment days
    const isNextDisabled = currentMonth.clone().add(1, 'month').startOf('month').isAfter(moment().add(maxAppointmentDays, 'days'));


    const currentSalonType = localStorage.getItem("CurrentSalonType")

    return (
        <section className={style.appointmentSection}>
            <div className={style.calenderDayCalender}>
                <div>
                    <p>{currentMonth.format('MMMM YYYY')}</p>
                    <div>
                        <button onClick={prevMonthFunc} disabled={isPrevDisabled}>
                            <LeftIcon size={'1rem'} />
                        </button>
                        <button onClick={nextMonthFunc} disabled={isNextDisabled}>
                            <RightIcon size={'1rem'} />
                        </button>
                    </div>
                </div>

                <div>
                    {dates.map((item) => (
                        <div key={item.fullDate} className={style.dayItem}>
                            <div>
                                <p>{item.dayName}</p>
                                <button
                                    onClick={() => {
                                        const selectedMonthYear = moment(`${item.year}-${item.month}-${item.date}`, 'YYYY-MMM-DD');

                                        if (!selectedMonthYear.isSame(currentMonth, 'month')) {
                                            setCurrentMonth((prev) => prev.clone().add(1, 'month'));
                                        }

                                        setSelectedDay(item);
                                    }}
                                    style={{
                                        position: 'relative',
                                        color: 'var(--text-primary)',
                                        backgroundColor: selectedDay?.fullDate === item.fullDate ? 'var(--input-bg-color)' : 'transparent',
                                    }}
                                >
                                    {item.date}
                                    {appointmentData?.some((appointment) => appointment.appointmentDate === item.fullDate) ? (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                bottom: '-0.7rem',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '0.4rem',
                                                height: '0.4rem',
                                                backgroundColor: 'var(--text-primary)',
                                                borderRadius: '50%',
                                            }}
                                        ></span>
                                    ) : null}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {selectedDay && (
                <div className={style.selectedDay_Container}>
                    <div>
                        <div>
                            <b>{selectedDay?.month}</b> <b>{selectedDay?.date},</b>
                        </div>
                        <p>{selectedDay?.dayFullName}</p>
                    </div>

                    <input
                        type='text'
                        value={searchBarber}
                        onChange={(e) => setSearchBarber(e.target.value)}
                        placeholder={`Search ${currentSalonType === "Barber Shop" ? "Barber" : currentSalonType === "Hair Dresser" ? "Stylist" : "Barber"}`}
                    />
                </div>
            )}

            {getAdminAppointmentListSalonIdLoading ? (
                <div className={style.appointmentList_loading}>
                    {[0, 1, 2, 3, 4, 5].map((item) => (
                        <Skeleton
                            key={item}
                            count={1}
                            style={{ width: '100%', height: '8rem' }}
                            baseColor={'var(--loader-bg-color)'}
                            highlightColor={'var(--loader-highlight-color)'}
                        />
                    ))}
                </div>
            ) : getAdminAppointmentListSalonIdResponse?.length > 0 ? (
                <div className={style.appointmentList}>
                    {getAdminAppointmentListSalonIdResponse.map((item) => (
                        <div key={item._id} className={style.appointmentItem}>
                            <div>
                                <div className={style.bar}></div>
                                <div>
                                    <div>
                                        <img src={item?.customerProfile?.[0]?.url} alt='' />
                                    </div>
                                    <div>
                                        <p>{item?.customerName}</p>
                                        <p>{item?.timeSlots}</p>
                                    </div>
                                </div>
                                <p style={{ position: 'absolute', right: '1rem' }}>{item?.barbername}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={style.empty_appointment_list}>
                    <div>
                        <div><AppointmentIcon color={'var(--text-primary)'} /></div>
                        <h2>No appointments available</h2>
                        <p>There are currently no appointments scheduled. When a new appointment is made, it will appear here.</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AppointmentCalender;