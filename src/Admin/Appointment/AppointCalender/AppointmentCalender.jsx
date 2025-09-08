// import React, { useEffect, useRef, useState } from 'react'
// import style from './AppointmentCalender.module.css'
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { useSelector } from 'react-redux';
// import api from "../../../Redux/api/Api"
// import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer';
// import { Link, useNavigate } from 'react-router-dom';

// const AppointmentCalender = () => {

//     const navigate = useNavigate()

//     const handleDateSelect = (selectInfo) => {

//         navigate("/admin-appointments-list", { state: selectInfo.dateStr })
//     };

//     const [appointmentData, setAppointmentData] = useState([])

//     const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

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


//     return (
//         <section className={`${style.section}`}>

//             <div className={`${style.list_container}`}>
//                 <FullCalendar
//                     plugins={[dayGridPlugin, interactionPlugin]}
//                     initialView='dayGridMonth'
//                     weekends={true}
//                     dateClick={handleDateSelect}
//                     events={appointmentData?.map((e) => (
//                         {
//                             title: `${e.barberName} - ${e.customerName}`, date: e.appointmentDate
//                         }
//                     ))}
//                     dayMaxEvents={true}
//                 />
//             </div>
//         </section>
//     )
// }

// export default AppointmentCalender

import React, { useEffect, useRef, useState } from 'react'
import style from './AppointmentCalender.module.css'
import { AppointmentIcon, LeftIcon, RightIcon } from '../../../newicons'
import moment from 'moment';
import { RightArrow } from '../../../icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminAppointmentListSalonIdAction } from '../../../Redux/Admin/Actions/AppointmentAction';
import { Skeleton } from '@mui/material';
import api from '../../../Redux/api/Api';

const AppointmentCalender = () => {

    const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
    const [appointmentData, setAppointmentData] = useState([])

    const AppointmentRef = useRef(null);

    useEffect(() => {

        if (AppointmentRef.current) {
            AppointmentRef.current.abort();
        }

        const newController = new AbortController();
        AppointmentRef.current = newController;

        const signal = newController.signal;

        const apfunc = async () => {
            const { data } = await api.post("/api/appointments/getAllAppointmentsBySalonId", {
                salonId: salonId
            }, { signal })
            setAppointmentData(data?.response)
        }

        apfunc();

        return () => {
            AppointmentRef.current.abort();
        };

    }, [salonId])

    // console.log("appointmentData ", appointmentData)

    const [dates, setDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(moment(moment().format("YYYY-MM"), "YYYY-MM")); // Current month start
    const rangeDays = 21;

    const isNextDisabled = currentMonth.clone().add(1, 'month').startOf('month').isAfter(rangeDays);

    const generateDatesForMonth = (monthMoment, rangeDays) => {
        const today = moment().startOf("day");
        const maxAllowedDate = today.clone().add(rangeDays, "days");

        let tempDates = [];

        const startOfMonth = monthMoment.clone().startOf("month");
        const endOfMonth = monthMoment.clone().endOf("month");

        // ✅ If current month, start from today; else, start from startOfMonth
        const loopStart = monthMoment.isSame(today, "month")
            ? today.clone()
            : startOfMonth;

        // ✅ Cap at maxAllowedDate
        const loopEnd = moment.min(endOfMonth, maxAllowedDate);

        // ✅ Generate dates only if within range
        for (let day = loopStart.clone(); day.isSameOrBefore(loopEnd); day.add(1, "day")) {
            tempDates.push({
                dayName: day.format("ddd").slice(0, 1),
                dayFullName: day.format("dddd"),
                date: day.format("DD"),
                month: day.format("MMM"),
                year: day.format("YYYY"),
                fullDate: day.format("YYYY-MM-DD"),
                slots: Math.floor(Math.random() * 10),
            });
        }

        setDates(tempDates);
    };

    // Load current month initially
    useEffect(() => {
        generateDatesForMonth(currentMonth, rangeDays);
    }, [currentMonth]);

    // Go to next month
    const nextMonthFunc = () => {
        setCurrentMonth((prev) => prev.clone().add(1, "month"));
    };

    // Go to previous month
    const prevMonthFunc = () => {
        setCurrentMonth((prev) => prev.clone().subtract(1, "month"));
    };

    const [selectedDay, setSelectedDay] = useState("")

    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedDay) {
            dispatch(getAdminAppointmentListSalonIdAction({
                salonId,
            }, selectedDay?.fullDate));
        }

    }, [dispatch, selectedDay]);

    const getAdminAppointmentListSalonId = useSelector((state) => state.getAdminAppointmentListSalonId)

    const {
        loading: getAdminAppointmentListSalonIdLoading,
        response: getAdminAppointmentListSalonIdResponse
    } = getAdminAppointmentListSalonId;

    // console.log(selectedDay?.fullDate)
    // console.log("getAdminAppointmentListSalonIdResponse ", getAdminAppointmentListSalonIdResponse)

    const [searchBarber, setSearchBarber] = useState("")

    return (
        <section className={style.appointmentSection}>
            <div className={style.calenderDayCalender}>
                <div>
                    <p>{currentMonth.format('MMMM YYYY')}</p>
                    <div>
                        <button onClick={prevMonthFunc}><LeftIcon size={"1rem"} /></button>
                        <button
                            onClick={nextMonthFunc}
                            disabled={isNextDisabled}
                        ><RightIcon size={"1rem"} /></button>
                    </div>
                </div>

                <div>
                    {
                        dates.map((item) => {
                            return (
                                <div
                                    key={item.fullDate}
                                    className={style.dayItem}>
                                    <div>
                                        <p>{item.dayName}</p>
                                        <button
                                            onClick={() => {
                                                setSelectedDay(item)
                                                // setSelectedDayAllAppointments(item.appointments)
                                            }}
                                            style={{
                                                position: "relative",
                                                color: "var(--text-primary)",
                                                backgroundColor: selectedDay.date === item.date ? "var(--input-bg-color)" : undefined
                                            }}
                                        >{item.date}
                                            {
                                                appointmentData?.some(
                                                    (appointment) => appointment.appointmentDate === item.fullDate
                                                ) ? (
                                                    <span style={{
                                                        position: "absolute",
                                                        bottom: "-0.7rem",
                                                        left: "50%",            // ✅ Use left instead of right
                                                        transform: "translateX(-50%)", // ✅ This perfectly centers horizontally
                                                        width: "0.4rem",
                                                        height: "0.4rem",
                                                        backgroundColor: "var(--text-primary)",
                                                        borderRadius: "50%"
                                                    }}></span>
                                                ) : (null)
                                            }

                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>

            </div>

            {
                getAdminAppointmentListSalonIdLoading ? (
                    <div className={style.appointmentList_loading}>
                        {
                            [0, 1, 2, 3, 4, 5].map((item, index) => {
                                return (
                                    <Skeleton
                                        key={index}
                                        count={1}
                                        style={{ width: "100%", height: "8rem" }}
                                        baseColor={"var(--loader-bg-color)"}
                                        highlightColor={"var(--loader-highlight-color)"} />
                                )
                            })
                        }
                    </div>
                ) : getAdminAppointmentListSalonIdResponse?.length > 0 ? (
                    <div className={style.appointmentList}>
                        {
                            selectedDay && (
                                <div>
                                    <div>
                                        <div>
                                            <b>{selectedDay?.month}</b>{" "}
                                            <b>{selectedDay?.date} ,</b>
                                        </div>
                                        <p>{selectedDay?.dayFullName}</p>
                                    </div>

                                    {/* <button
                                onClick={() => {
                                    setCancelAllModalOpen(true)
                                    setSubject("")
                                    setBody("")
                                    setCancelAllAppoint(AppointmentListBarberResponse?.[0])
                                }}
                            > Cancel All</button> */}

                                    <input
                                        type="text"
                                        value={searchBarber}
                                        onChange={(e) => setSearchBarber(e.target.value)}
                                        placeholder='Search Barber'
                                    />
                                </div>
                            )
                        }

                        {
                            getAdminAppointmentListSalonIdResponse?.map((item, index) => {
                                return (
                                    <div
                                        key={item._id}
                                        className={style.appointmentItem}
                                        onClick={() => {
                                            // if (isMobile) {
                                            //     setOpenMobileModal({
                                            //         open: true,
                                            //         data: item
                                            //     })
                                            // }
                                        }}
                                    >
                                        <div>
                                            <div className={style.bar}></div>

                                            <div>
                                                <div>
                                                    <img src={item?.customerProfile?.[0]?.url} alt="" />
                                                </div>
                                                <div>
                                                    <p>{item?.customerName}</p>
                                                    <p>{item?.timeSlots}</p>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                )
                            })
                        }

                    </div>
                ) : (

                    <div div className={style.empty_appointment_list}>
                        <div>
                            <div><AppointmentIcon color={"var(--text-primary)"} /></div>
                            <h2>No appointments available</h2>
                            <p>There are currently no appointments scheduled. When a new appointment is made, it will appear here.</p>
                        </div>
                    </div>

                )
            }


        </section>
    )
}

export default AppointmentCalender