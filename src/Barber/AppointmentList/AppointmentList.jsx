// import React, { useEffect, useRef, useState } from 'react'
// import style from './AppointmentList.module.css'
// import { useSelector } from 'react-redux'
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import { ClickAwayListener, Modal } from '@mui/material'
// import { CloseIcon, EditIcon } from '../../icons'
// import { useDispatch } from 'react-redux'
// import { AppointmentAction, CancelAppointmentAction, ServeAppointmentAction } from '../../Redux/Barber/Actions/AppointmentAction'
// import Skeleton from 'react-loading-skeleton'
// import toast from 'react-hot-toast'
// import Accordion from '@mui/material/Accordion';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import Typography from '@mui/material/Typography';
// import { DeleteIcon, DropdownIcon } from '../../newicons'
// import { ddmmformatDate } from '../../../utils/ddmmformatDate'
// import { formatMinutesToHrMin } from '../../../utils/formatMinutesToHrMin'

// const AppointmentList = () => {

//     const salonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
//     const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

//     const darkMode = useSelector(darkmodeSelector)

//     const darkmodeOn = darkMode === "On"

//     const [openModal, setOpenModal] = useState(false)

//     const dispatch = useDispatch()

//     useEffect(() => {

//         dispatch(AppointmentAction({
//             salonId,
//             barberId,
//         }));
//     }, [dispatch]);

//     const appointmentList = useSelector((state) => state.AppointmentBarber)

//     const {
//         loading: appointmentLoading,
//         response: appointmentResponse
//     } = appointmentList;

//     const [modalData, setModalData] = useState({})
//     const [subject, setSubject] = useState("")
//     const [body, setBody] = useState("")

//     const ServeHandler = async (s) => {
//         const servebody = {
//             salonId: salonId,
//             barberId: s?.barberId,
//             _id: s?._id,
//             appointmentDate: s?.appointmentDate
//         }

//         const confirm = window.confirm("Are you sure ?")

//         if (confirm) {
//             dispatch(ServeAppointmentAction(servebody))
//         }
//     }

//     const CancelHandler = async () => {

//         if (!subject) {
//             return toast.error("Please enter subject", {
//                 duration: 3000,
//                 style: {
//                     fontSize: "var(--font-size-2)",
//                     borderRadius: '0.3rem',
//                     background: '#333',
//                     color: '#fff',
//                 },
//             });
//         }

//         if (!body) {
//             return toast.error("Please enter body", {
//                 duration: 3000,
//                 style: {
//                     fontSize: "var(--font-size-2)",
//                     borderRadius: '0.3rem',
//                     background: '#333',
//                     color: '#fff',
//                 },
//             });
//         }

//         const cancelbody = {
//             salonId,
//             barberId,
//             idsToCancel: [modalData._id],
//             appointmentDate: modalData.appointmentDate,
//             subject,
//             body
//         }


//         const confirm = window.confirm("Are you sure ?")

//         if (confirm) {
//             dispatch(CancelAppointmentAction(cancelbody, setCancelAllModalOpen, setOpenModal))
//         }
//     }

//     const CancelAllHandler = () => {

//         if (!subject) {
//             return toast.error("Please enter subject", {
//                 duration: 3000,
//                 style: {
//                     fontSize: "var(--font-size-2)",
//                     borderRadius: '0.3rem',
//                     background: '#333',
//                     color: '#fff',
//                 },
//             });
//         }

//         if (!body) {
//             return toast.error("Please enter body", {
//                 duration: 3000,
//                 style: {
//                     fontSize: "var(--font-size-2)",
//                     borderRadius: '0.3rem',
//                     background: '#333',
//                     color: '#fff',
//                 },
//             });
//         }


//         const cancelbody = {
//             salonId,
//             barberId,
//             idsToCancel: cancelAllAppoint.appointments.map((s) => s._id),
//             appointmentDate: cancelAllAppoint.appointmentDate,
//             subject,
//             body
//         }

//         // console.log(cancelbody)

//         const confirm = window.confirm("Are you sure ?")

//         if (confirm) {
//             dispatch(CancelAppointmentAction(cancelbody, setCancelAllModalOpen, setOpenModal))
//         }

//     }


//     const [cancelAllModalOpen, setCancelAllModalOpen] = useState(false)
//     const [cancelAllAppoint, setCancelAllAppoint] = useState({})

//     const [expanded, setExpanded] = useState(false);

//     const handleChange = (panel) => (event, isExpanded) => {
//         setExpanded(isExpanded ? panel : false);
//     };

//     return (
//         <div className={`${style.section} ${darkmodeOn && style.dark}`}>
//             <div>
//                 <h2>Appointment List</h2>
//             </div>

//             <div className={`${style.appointment_content_wrapper} ${darkmodeOn && style.dark}`}>
//                 {
//                     appointmentLoading ? (
//                         <div style={{ width: "100%", height: "100%", display: "flex", gap: "1.2rem" }}>
//                             <Skeleton
//                                 count={1}
//                                 style={{ width: "30rem", height: "100%" }}
//                                 baseColor={"var(--loader-bg-color)"}
//                                 highlightColor={"var(--loader-highlight-color)"} />

//                             <Skeleton
//                                 count={1}
//                                 style={{ width: "30rem", height: "100%" }}
//                                 baseColor={"var(--loader-bg-color)"}
//                                 highlightColor={"var(--loader-highlight-color)"} />

//                             <Skeleton
//                                 count={1}
//                                 style={{ width: "30rem", height: "100%" }}
//                                 baseColor={"var(--loader-bg-color)"}
//                                 highlightColor={"var(--loader-highlight-color)"} />

//                         </div>
//                     ) : appointmentResponse?.length > 0 ? (
//                         appointmentResponse.map((appoint) => {
//                             return (
//                                 <main className={`${style.appointment_container} ${darkmodeOn ? style.dark : ''}`} key={appoint.appointmentDate}>
//                                     <div className={`${style.appointment_barber_container} ${darkmodeOn ? style.dark : ''}`}>
//                                         <p>{ddmmformatDate(appoint.appointmentDate)}</p>
//                                         <button onClick={() => {
//                                             setCancelAllModalOpen(true)
//                                             setSubject("")
//                                             setBody("")
//                                             setCancelAllAppoint(appoint)
//                                         }}>Cancel All</button>
//                                     </div>

//                                     <main className={style.appointment_content_list_container}>
//                                         {
//                                             appoint.appointments.map((s, index) => {
//                                                 return (
//                                                     <div
//                                                         className={`${style.appointment_body_customer_item} ${darkmodeOn ? style.dark : ''}`}
//                                                         key={index}
//                                                     >
//                                                         <div>
//                                                             <img src={s?.customerProfile?.[0]?.url} alt="" />
//                                                         </div>
//                                                         <div>
//                                                             <p>{s.customerName.length > 10 ? `${s.customerName.slice(0, 10)}...` : s.customerName}</p>
//                                                             <p>
//                                                                 {s.startTime}-{s.endTime}
//                                                             </p>
//                                                             <p>
//                                                                 ~ {' '}
//                                                                 {formatMinutesToHrMin(s.services.reduce(
//                                                                     (total, service) => total + service.barberServiceEWT,
//                                                                     0
//                                                                 ))}{' '}

//                                                             </p>
//                                                         </div>

//                                                         <div>
//                                                             <button
//                                                                 style={{
//                                                                     background: "#0285c7"
//                                                                 }}
//                                                                 onClick={() => ServeHandler(s)}
//                                                             >Serve</button>
//                                                             <button
//                                                                 onClick={() => {
//                                                                     setModalData(s)
//                                                                     setOpenModal(true)
//                                                                     setSubject("")
//                                                                     setBody("")
//                                                                 }}
//                                                                 style={{
//                                                                     background: "#450a0a"
//                                                                 }}

//                                                             >Cancel</button>
//                                                         </div>
//                                                     </div>
//                                                 )
//                                             })
//                                         }

//                                     </main>
//                                 </main>
//                             )
//                         })
//                     ) : (
//                         <div className={style.list_container_error}><p>No appointment available</p></div>
//                     )
//                 }

//             </div>

//             <Modal
//                 open={openModal}
//                 onClose={() => {
//                     setOpenModal(false)
//                     setModalData({})
//                     setSubject("")
//                     setBody("")
//                 }}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//             >
//                 <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
//                     <div>
//                         <p>Cancel Appointment</p>
//                         <button onClick={() => {
//                             setOpenModal(false)
//                             setModalData({})
//                             setSubject("")
//                             setBody("")
//                         }}><CloseIcon /></button>
//                     </div>

//                     <div className={`${style.modal_content_container} ${darkmodeOn && style.dark}`}>
//                         <p>Appointment Date: {ddmmformatDate(modalData.appointmentDate)}</p>
//                         <p>Customer Name: {modalData.customerName}</p>
//                         <p>Customer Email: {modalData.customerEmail}</p>
//                         <p>Time: {modalData.startTime} - {modalData.endTime}</p>

//                         <p>Reason for cancelling appointment</p>
//                         <div>
//                             <p>Subject</p>
//                             <input
//                                 type="text"
//                                 value={subject}
//                                 placeholder='Enter your subject'
//                                 onChange={(e) => setSubject(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <p>Body</p>
//                             <textarea name="" id=""
//                                 value={body}
//                                 placeholder='Reason for cancelling appointment'
//                                 onChange={(e) => setBody(e.target.value)}
//                             ></textarea>
//                         </div>
//                         <button className={style.cancel_btn} onClick={CancelHandler}>Cancel</button>
//                     </div>
//                 </div>

//             </Modal>


//             <Modal
//                 open={cancelAllModalOpen}
//                 onClose={() => {
//                     setCancelAllModalOpen(false)
//                     setSubject("")
//                     setBody("")
//                     setCancelAllAppoint({})
//                 }}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//             >
//                 <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
//                     <div>
//                         <p>Cancel Appointment</p>
//                         <button onClick={() => {
//                             setCancelAllModalOpen(false)
//                             setSubject("")
//                             setBody("")
//                             setCancelAllAppoint({})
//                         }}><CloseIcon /></button>
//                     </div>

//                     <div className={`${style.modal_content_container} ${darkmodeOn && style.dark}`}>
//                         <p style={{
//                             fontWeight: 600,
//                             marginBottom: "2rem"
//                         }}>All appointments scheduled for <span style={{ textDecoration: "underline", color: "var(--bg-secondary)" }}>{ddmmformatDate(cancelAllAppoint.appointmentDate)}</span> have been selected for cancellation.</p>

//                         <p>Reason for cancelling appointment</p>
//                         <div>
//                             <p>Subject</p>
//                             <input
//                                 type="text"
//                                 value={subject}
//                                 placeholder='Enter your subject'
//                                 onChange={(e) => setSubject(e.target.value)}
//                             />
//                         </div>

//                         <div>
//                             <p>Body</p>
//                             <textarea name="" id=""
//                                 value={body}
//                                 placeholder='Reason for cancelling appointment'
//                                 onChange={(e) => setBody(e.target.value)}
//                             ></textarea>
//                         </div>
//                         <button className={style.cancel_btn} onClick={CancelAllHandler}>Cancel</button>
//                     </div>
//                 </div>

//             </Modal>

//             {
//                 appointmentLoading ? (
//                     <div className={`${style.appointment_mobile_content_wrapper_loading} ${darkmodeOn && style.dark}`}>
//                         <Skeleton
//                             count={4}
//                             style={{ height: "9rem", marginBottom: "1rem" }}
//                             baseColor={"var(--loader-bg-color)"}
//                             highlightColor={"var(--loader-highlight-color)"} />
//                     </div>
//                 ) : appointmentResponse?.length > 0 ? (
//                     <div className={`${style.appointment_mobile_content_wrapper} ${darkmodeOn && style.dark}`} >
//                         {
//                             appointmentResponse.map((appoint, index) => {
//                                 return (
//                                     <Accordion key={appoint.appointmentDate} expanded={expanded === `panel${appoint.appointmentDate}`} onChange={handleChange(`panel${appoint.appointmentDate}`)}>
//                                         <AccordionSummary
//                                             expandIcon={<DropdownIcon color='var(--text-primary)' />}
//                                             aria-controls="panel1bh-content"
//                                             id="panel1bh-header"
//                                             sx={{
//                                                 backgroundColor: "var(--bg-primary)",
//                                                 borderBottom: "0.1rem solid var(--border-secondary)"
//                                             }}
//                                         >
//                                             <Typography component="span" sx={{ alignContent: "center", marginRight: "2rem", fontSize: "1.4rem", fontFamily: "AirbnbCereal_Medium", color: "var(--text-primary)" }}>
//                                                 {ddmmformatDate(appoint.appointmentDate)}
//                                             </Typography>
//                                             <button onClick={(e) => {
//                                                 e.stopPropagation()
//                                                 setCancelAllModalOpen(true)
//                                                 setSubject("")
//                                                 setBody("")
//                                                 setCancelAllAppoint(appoint)
//                                             }}>Cancel All</button>
//                                         </AccordionSummary>
//                                         <AccordionDetails
//                                             sx={{
//                                                 padding: "0px",
//                                             }}
//                                         >

//                                             {
//                                                 appoint.appointments.map((s, index) => {
//                                                     return (
//                                                         <div
//                                                             className={`${style.appointment_body_customer_mobile_item} ${darkmodeOn ? style.dark : ''}`}
//                                                             key={index}
//                                                             style={{ borderBottom: index === appoint.appointments.length - 1 && "none" }}
//                                                         >
//                                                             <div>
//                                                                 <div>
//                                                                     <img src={s?.customerProfile?.[0]?.url} alt="" />
//                                                                 </div>
//                                                                 <div>
//                                                                     <p>{s.customerName}</p>
//                                                                     <p>
//                                                                         {s.startTime}-{s.endTime}
//                                                                     </p>
//                                                                     <p>
//                                                                         EWT -{' '}
//                                                                         {formatMinutesToHrMin(s.services.reduce(
//                                                                             (total, service) => total + service.barberServiceEWT,
//                                                                             0
//                                                                         ))}
//                                                                     </p>
//                                                                 </div>
//                                                             </div>

//                                                             <div>
//                                                                 <button
//                                                                     style={{
//                                                                         background: "#0285c7"
//                                                                     }}
//                                                                     onClick={() => ServeHandler(s)}
//                                                                 >Serve</button>
//                                                                 <button
//                                                                     onClick={() => {
//                                                                         setModalData(s)
//                                                                         setOpenModal(true)
//                                                                         setSubject("")
//                                                                         setBody("")
//                                                                     }}
//                                                                     style={{
//                                                                         background: "#450a0a"
//                                                                     }}

//                                                                 >Cancel</button>
//                                                             </div>
//                                                         </div>
//                                                     )
//                                                 })
//                                             }

//                                         </AccordionDetails>
//                                     </Accordion>
//                                 )
//                             })
//                         }

//                     </div>
//                 ) : (
//                     <div className={`${style.appointment_mobile_content_wrapper_error} ${darkmodeOn && style.dark}`}>
//                         <p>No appointment available</p>
//                     </div>
//                 )
//             }

//         </div >
//     )
// }

// export default AppointmentList


import React, { useEffect, useState } from 'react'
import style from './AppointmentList.module.css'
import { AppointmentIcon, LeftIcon, RightIcon } from '../../newicons'
import moment from "moment";
import { RightArrow, CloseIcon } from '../../icons';
import { Modal, Skeleton } from '@mui/material';
import ButtonLoader from '../../components/ButtonLoader/ButtonLoader';
import { useDispatch, useSelector } from 'react-redux'
import { AppointmentAction, AppointmentListBarberAction, CancelAppointmentAction, ServeAppointmentAction } from '../../Redux/Barber/Actions/AppointmentAction'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import { ddmmformatDate } from '../../../utils/ddmmformatDate'
import { formatMinutesToHrMin } from '../../../utils/formatMinutesToHrMin'
import toast from 'react-hot-toast'

const AppointmentList = () => {

    const salonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
    const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

    const dispatch = useDispatch()

    useEffect(() => {

        dispatch(AppointmentAction({
            salonId,
            barberId,
        }));
    }, [dispatch]);

    const appointmentList = useSelector((state) => state.AppointmentBarber)

    const {
        loading: appointmentLoading,
        response: appointmentResponse
    } = appointmentList;


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

    const [openMobileModal, setOpenMobileModal] = useState({
        open: false,
        data: {}
    })

    useEffect(() => {
        if (selectedDay) {
            dispatch(AppointmentListBarberAction({
                salonId,
                barberId,
                appointmentDate: selectedDay?.fullDate
            }));
        }
    }, [selectedDay])

    const AppointmentListBarber = useSelector((state) => state.AppointmentListBarber)

    const {
        loading: AppointmentListBarberLoading,
        response: AppointmentListBarberResponse
    } = AppointmentListBarber;


    const darkMode = useSelector(darkmodeSelector)
    const darkmodeOn = darkMode === "On"

    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState({})
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    const ServeHandler = async (s) => {
        const servebody = {
            salonId: salonId,
            barberId: s?.barberId,
            _id: s?._id,
            appointmentDate: s?.appointmentDate
        }

        const confirm = window.confirm("Are you sure ?")

        if (confirm) {
            dispatch(ServeAppointmentAction(servebody, {
                salonId,
                barberId,
                appointmentDate: selectedDay?.fullDate
            }, setOpenMobileModal))
        }
    }

    const CancelHandler = async () => {

        if (!subject) {
            return toast.error("Please enter subject", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

        if (!body) {
            return toast.error("Please enter body", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

        const cancelbody = {
            salonId,
            barberId,
            idsToCancel: [modalData._id],
            appointmentDate: modalData.appointmentDate,
            subject,
            body
        }


        const confirm = window.confirm("Are you sure ?")

        if (confirm) {
            dispatch(CancelAppointmentAction(cancelbody, setCancelAllModalOpen, setOpenModal, {
                salonId,
                barberId,
                appointmentDate: selectedDay?.fullDate
            }, setOpenMobileModal))
        }
    }

    const CancelAllHandler = () => {

        if (!subject) {
            return toast.error("Please enter subject", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

        if (!body) {
            return toast.error("Please enter body", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }


        const cancelbody = {
            salonId,
            barberId,
            idsToCancel: cancelAllAppoint.appointments.map((s) => s._id),
            appointmentDate: cancelAllAppoint.appointmentDate,
            subject,
            body
        }

        // console.log(cancelbody)

        const confirm = window.confirm("Are you sure ?")

        if (confirm) {
            dispatch(CancelAppointmentAction(cancelbody, setCancelAllModalOpen, setOpenModal, setOpenMobileModal))
        }

    }

    const [cancelAllModalOpen, setCancelAllModalOpen] = useState(false)
    const [cancelAllAppoint, setCancelAllAppoint] = useState({})
    const [selectedDayAllAppointments, setSelectedDayAllAppointments] = useState([])

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        // Function to check mobile width
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // ✅ Attach event listeners
        window.addEventListener("resize", handleResize);

        // ✅ Initial check
        handleResize();

        // ✅ Cleanup event listeners
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // console.log("isMobile ", isMobile)


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
                                                appointmentResponse?.some(
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
                AppointmentListBarberLoading ? (
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
                ) : AppointmentListBarberResponse?.[0]?.appointments?.length > 0 ? (
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

                                    <button
                                        onClick={() => {
                                            setCancelAllModalOpen(true)
                                            setSubject("")
                                            setBody("")
                                            setCancelAllAppoint(AppointmentListBarberResponse?.[0])
                                        }}
                                    > Cancel All</button>
                                </div>
                            )
                        }

                        {
                            AppointmentListBarberResponse?.[0]?.appointments?.map((item) => {
                                return (
                                    <div
                                        key={item._id}
                                        className={style.appointmentItem}
                                        onClick={() => {
                                            if (isMobile) {
                                                setOpenMobileModal({
                                                    open: true,
                                                    data: item
                                                })
                                            }
                                        }}
                                    >
                                        <div>
                                            <div className={style.bar}></div>

                                            <div>
                                                <div><img src={item?.customerProfile?.[0]?.url} alt="" /></div>
                                                <div>
                                                    <p>{item?.customerName}</p>
                                                    <p>{item?.timeSlots}</p>
                                                </div>
                                            </div>

                                        </div>

                                        <div>
                                            <button onClick={() => ServeHandler(item)}>Serve</button>
                                            <button
                                                onClick={() => {
                                                    setModalData(item)
                                                    setOpenModal(true)
                                                    setSubject("")
                                                    setBody("")
                                                }}
                                            >Cancel</button>

                                            <button><RightArrow /></button>
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


            <Modal
                open={openMobileModal.open}
                onClose={() => {
                    setOpenMobileModal({
                        open: false,
                        data: {}
                    })
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={style.modal_container}>
                    <div>
                        <p>{openMobileModal?.data?.customerName}</p>
                        <p>{openMobileModal?.data?.timeSlots}</p>
                    </div>
                    <div>
                        {
                            false ? <button style={{
                                display: "grid",
                                placeItems: "center",
                            }}><ButtonLoader /></button> : <button
                                style={{
                                    background: "#0285c7",
                                    color: "#fff"
                                }}
                                onClick={() => ServeHandler(openMobileModal?.data)}
                            >Serve</button>
                        }

                        {
                            false ? <button style={{
                                display: "grid",
                                placeItems: "center",
                            }}><ButtonLoader /></button> : <button
                                style={{
                                    background: "#450a0a",
                                    color: "#fff"
                                }}
                                onClick={() => {
                                    setModalData(openMobileModal?.data)
                                    setOpenModal(true)
                                    setSubject("")
                                    setBody("")
                                }}
                            >Cancel</button>
                        }

                    </div>
                </div>
            </Modal>

            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false)
                    setModalData({})
                    setSubject("")
                    setBody("")
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={`${style.modal_cancel_container} ${darkmodeOn && style.dark}`}>
                    <div>
                        <p>Cancel Appointment</p>
                        <button onClick={() => {
                            setOpenModal(false)
                            setModalData({})
                            setSubject("")
                            setBody("")
                        }}><CloseIcon /></button>
                    </div>

                    <div className={`${style.modal_content_container} ${darkmodeOn && style.dark}`}>
                        <p>Appointment Date: {ddmmformatDate(modalData.appointmentDate)}</p>
                        <p>Customer Name: {modalData.customerName}</p>
                        <p>Customer Email: {modalData.customerEmail}</p>
                        <p>Time: {modalData.startTime} - {modalData.endTime}</p>

                        <p>Reason for cancelling appointment</p>
                        <div>
                            <p>Subject</p>
                            <input
                                type="text"
                                value={subject}
                                placeholder='Enter your subject'
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div>
                            <p>Body</p>
                            <textarea name="" id=""
                                value={body}
                                placeholder='Reason for cancelling appointment'
                                onChange={(e) => setBody(e.target.value)}
                            ></textarea>
                        </div>
                        <button className={style.cancel_btn} onClick={CancelHandler}>Cancel</button>
                    </div>
                </div>

            </Modal>


            <Modal
                open={cancelAllModalOpen}
                onClose={() => {
                    setCancelAllModalOpen(false)
                    setSubject("")
                    setBody("")
                    setCancelAllAppoint({})
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={`${style.modal_cancel_container} ${darkmodeOn && style.dark}`}>
                    <div>
                        <p>Cancel Appointment</p>
                        <button onClick={() => {
                            setCancelAllModalOpen(false)
                            setSubject("")
                            setBody("")
                            setCancelAllAppoint({})
                        }}><CloseIcon /></button>
                    </div>

                    <div className={`${style.modal_content_container} ${darkmodeOn && style.dark}`}>
                        <p style={{
                            fontWeight: 600,
                            marginBottom: "2rem"
                        }}>All appointments scheduled for <span style={{ textDecoration: "underline", color: "var(--bg-secondary)" }}>{ddmmformatDate(cancelAllAppoint.appointmentDate)}</span> have been selected for cancellation.</p>

                        <p>Reason for cancelling appointment</p>
                        <div>
                            <p>Subject</p>
                            <input
                                type="text"
                                value={subject}
                                placeholder='Enter your subject'
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div>
                            <p>Body</p>
                            <textarea name="" id=""
                                value={body}
                                placeholder='Reason for cancelling appointment'
                                onChange={(e) => setBody(e.target.value)}
                            ></textarea>
                        </div>
                        <button className={style.cancel_btn} onClick={CancelAllHandler}>Cancel</button>
                    </div>
                </div>

            </Modal>

        </section >
    )
}

export default AppointmentList