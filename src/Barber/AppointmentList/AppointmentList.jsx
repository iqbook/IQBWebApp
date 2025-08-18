import React, { useEffect, useRef, useState } from 'react'
import style from './AppointmentList.module.css'
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import { ClickAwayListener, Modal } from '@mui/material'
import { CloseIcon, EditIcon } from '../../icons'
import { useDispatch } from 'react-redux'
import { AppointmentAction, CancelAppointmentAction, ServeAppointmentAction } from '../../Redux/Barber/Actions/AppointmentAction'
import Skeleton from 'react-loading-skeleton'
import toast from 'react-hot-toast'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { DeleteIcon, DropdownIcon } from '../../newicons'

const AppointmentList = () => {

    const salonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
    const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"

    const [openModal, setOpenModal] = useState(false)

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
            dispatch(ServeAppointmentAction(servebody))
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
            dispatch(CancelAppointmentAction(cancelbody, setCancelAllModalOpen, setOpenModal))
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
            dispatch(CancelAppointmentAction(cancelbody, setCancelAllModalOpen, setOpenModal))
        }

    }


    const [cancelAllModalOpen, setCancelAllModalOpen] = useState(false)
    const [cancelAllAppoint, setCancelAllAppoint] = useState({})

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const mobileData = [
        {
            "appointmentDate": "2025-05-01",
            "appointments": [
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 13,
                            "serviceName": "Hair Spa",
                            "servicePrice": 100,
                            "barberServiceEWT": 500,
                            "_id": "68136f99d93d788da654e86a"
                        }
                    ],
                    "appointmentNotes": "Hshhsb",
                    "appointmentDate": "2025-05-01",
                    "startTime": "07:00",
                    "endTime": "15:20",
                    "timeSlots": "07:00-15:20",
                    "customerEmail": "arghya@yopmail.com",
                    "customerName": "Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "68136f99d93d788da654e869",
                    "customerProfile": [
                        {
                            "public_id": "customers/Screenshot 2025-04-30 161237",
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1746699567/customers/Screenshot%202025-04-30%20161237.png",
                            "_id": "681c85305f214ec897ffcb54"
                        }
                    ]
                },
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 11,
                            "serviceName": "Haircut",
                            "servicePrice": 38,
                            "barberServiceEWT": 10,
                            "_id": "68136fb6d93d788da654edea"
                        }
                    ],
                    "appointmentNotes": "Udhhsb",
                    "appointmentDate": "2025-05-01",
                    "startTime": "15:30",
                    "endTime": "15:40",
                    "timeSlots": "15:30-15:40",
                    "customerEmail": "arghya@yopmail.com",
                    "customerName": "Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "68136fb6d93d788da654ede9",
                    "customerProfile": [
                        {
                            "public_id": "customers/Screenshot 2025-04-30 161237",
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1746699567/customers/Screenshot%202025-04-30%20161237.png",
                            "_id": "681c85305f214ec897ffcb54"
                        }
                    ]
                }
            ]
        },
        {
            "appointmentDate": "2025-05-08",
            "appointments": [
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 11,
                            "serviceName": "Haircut",
                            "servicePrice": 38,
                            "barberServiceEWT": 25,
                            "_id": "681891e1437f3879c5b1b02a"
                        }
                    ],
                    "appointmentNotes": "A",
                    "appointmentDate": "2025-05-08",
                    "startTime": "16:00",
                    "endTime": "16:25",
                    "timeSlots": "16:00-16:25",
                    "customerEmail": "arghya@gmail.com",
                    "customerName": "Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681891e1437f3879c5b1b029",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                },
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 12,
                            "serviceName": "Female Haircut",
                            "servicePrice": 40,
                            "barberServiceEWT": 17,
                            "_id": "6818940fbdd315d749590359"
                        }
                    ],
                    "appointmentNotes": "B",
                    "appointmentDate": "2025-05-08",
                    "startTime": "12:00",
                    "endTime": "12:17",
                    "timeSlots": "12:00-12:17",
                    "customerEmail": "biks@yopmail.com",
                    "customerName": "Biks",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "6818940fbdd315d749590358",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                },
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 12,
                            "serviceName": "Female Haircut",
                            "servicePrice": 40,
                            "barberServiceEWT": 17,
                            "_id": "681899af13f1aac02d823772"
                        }
                    ],
                    "appointmentNotes": "B",
                    "appointmentDate": "2025-05-08",
                    "startTime": "12:00",
                    "endTime": "12:17",
                    "timeSlots": "12:00-12:17",
                    "customerEmail": "biks@yopmail.com",
                    "customerName": "Biks",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681899af13f1aac02d823771",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                }
            ]
        },
        {
            "appointmentDate": "2025-05-11",
            "appointments": [
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 12,
                            "serviceName": "Female Haircut",
                            "servicePrice": 40,
                            "barberServiceEWT": 17,
                            "_id": "681c7e84ed160b5bff68a521"
                        }
                    ],
                    "appointmentNotes": "B",
                    "appointmentDate": "2025-05-11",
                    "startTime": "12:00",
                    "endTime": "12:17",
                    "timeSlots": "12:00-12:17",
                    "customerEmail": "biks@yopmail.com",
                    "customerName": "Biks",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681c7e84ed160b5bff68a520",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                },
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 11,
                            "serviceName": "Haircut",
                            "servicePrice": 38,
                            "barberServiceEWT": 25,
                            "_id": "681c8a1e7ca708bc6435bf13"
                        }
                    ],
                    "appointmentNotes": "A",
                    "appointmentDate": "2025-05-11",
                    "startTime": "16:00",
                    "endTime": "16:25",
                    "timeSlots": "16:00-16:25",
                    "customerEmail": "arghya@gmail.com",
                    "customerName": "Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681c8a1e7ca708bc6435bf12",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                },
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 11,
                            "serviceName": "Haircut",
                            "servicePrice": 38,
                            "barberServiceEWT": 25,
                            "_id": "681c8a387ca708bc6435bf66"
                        }
                    ],
                    "appointmentNotes": "A",
                    "appointmentDate": "2025-05-11",
                    "startTime": "16:00",
                    "endTime": "16:25",
                    "timeSlots": "16:00-16:25",
                    "customerEmail": "arghya@gmail.com",
                    "customerName": "11Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681c8a387ca708bc6435bf65",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                }
            ]
        },
        {
            "appointmentDate": "2025-05-09",
            "appointments": [
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 11,
                            "serviceName": "Haircut",
                            "servicePrice": 38,
                            "barberServiceEWT": 25,
                            "_id": "681c80295f214ec897ff79ef"
                        }
                    ],
                    "appointmentNotes": "A",
                    "appointmentDate": "2025-05-09",
                    "startTime": "16:00",
                    "endTime": "16:25",
                    "timeSlots": "16:00-16:25",
                    "customerEmail": "arghya@gmail.com",
                    "customerName": "Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681c80295f214ec897ff79ee",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                },
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 11,
                            "serviceName": "Haircut",
                            "servicePrice": 38,
                            "barberServiceEWT": 25,
                            "_id": "681c81315f214ec897ff91ed"
                        }
                    ],
                    "appointmentNotes": "A",
                    "appointmentDate": "2025-05-09",
                    "startTime": "16:00",
                    "endTime": "16:25",
                    "timeSlots": "16:00-16:25",
                    "customerEmail": "arghya@gmail.com",
                    "customerName": "Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681c81315f214ec897ff91ec",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                },
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 11,
                            "serviceName": "Haircut",
                            "servicePrice": 38,
                            "barberServiceEWT": 25,
                            "_id": "681c89d27ca708bc6435b67d"
                        }
                    ],
                    "appointmentNotes": "A",
                    "appointmentDate": "2025-05-09",
                    "startTime": "16:00",
                    "endTime": "16:25",
                    "timeSlots": "16:00-16:25",
                    "customerEmail": "arghya@gmail.com",
                    "customerName": "Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681c89d27ca708bc6435b67c",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                }
            ]
        },
        {
            "appointmentDate": "2025-05-12",
            "appointments": [
                {
                    "barberId": 1,
                    "services": [
                        {
                            "serviceId": 11,
                            "serviceName": "Haircut",
                            "servicePrice": 38,
                            "barberServiceEWT": 25,
                            "_id": "681c80775f214ec897ff8399"
                        }
                    ],
                    "appointmentNotes": "A",
                    "appointmentDate": "2025-05-12",
                    "startTime": "16:00",
                    "endTime": "16:25",
                    "timeSlots": "16:00-16:25",
                    "customerEmail": "arghya@gmail.com",
                    "customerName": "Arghya Ghosh",
                    "customerType": "Walk-In",
                    "methodUsed": "App",
                    "_id": "681c80775f214ec897ff8398",
                    "customerProfile": [
                        {
                            "url": "https://res.cloudinary.com/dpynxkjfq/image/upload/v1720520065/default-avatar-icon-of-social-media-user-vector_wl5pm0.jpg"
                        }
                    ]
                }
            ]
        }
    ]

    return (
        <div className={`${style.section} ${darkmodeOn && style.dark}`}>
            <div>
                <h2>Appointment List</h2>
            </div>

            <div className={`${style.appointment_content_wrapper} ${darkmodeOn && style.dark}`}>
                {
                    appointmentLoading ? (
                        <div style={{ width: "100%", height: "100%", display: "flex", gap: "1.2rem" }}>
                            <Skeleton
                                count={1}
                                style={{ width: "30rem", height: "100%" }}
                                baseColor={"var(--loader-bg-color)"}
                                highlightColor={"var(--loader-highlight-color)"} />

                            <Skeleton
                                count={1}
                                style={{ width: "30rem", height: "100%" }}
                                baseColor={"var(--loader-bg-color)"}
                                highlightColor={"var(--loader-highlight-color)"} />

                            <Skeleton
                                count={1}
                                style={{ width: "30rem", height: "100%" }}
                                baseColor={"var(--loader-bg-color)"}
                                highlightColor={"var(--loader-highlight-color)"} />

                        </div>
                    ) : appointmentResponse?.length > 0 ? (
                        appointmentResponse.map((appoint) => {
                            return (
                                <main className={`${style.appointment_container} ${darkmodeOn ? style.dark : ''}`} key={appoint.appointmentDate}>
                                    <div className={`${style.appointment_barber_container} ${darkmodeOn ? style.dark : ''}`}>
                                        <p>{appoint.appointmentDate}</p>
                                        <button onClick={() => {
                                            setCancelAllModalOpen(true)
                                            setSubject("")
                                            setBody("")
                                            setCancelAllAppoint(appoint)
                                        }}>Cancel All</button>
                                    </div>

                                    <main className={style.appointment_content_list_container}>
                                        {
                                            appoint.appointments.map((s, index) => {
                                                return (
                                                    <div
                                                        className={`${style.appointment_body_customer_item} ${darkmodeOn ? style.dark : ''}`}
                                                        key={index}
                                                    >
                                                        <div>
                                                            <img src={s?.customerProfile?.[0]?.url} alt="" />
                                                        </div>
                                                        <div>
                                                            <p>{s.customerName.length > 10 ? `${s.customerName.slice(0, 10)}...` : s.customerName}</p>
                                                            <p>
                                                                {s.startTime}-{s.endTime}
                                                            </p>
                                                            <p>
                                                                EWT -{' '}
                                                                {s.services.reduce(
                                                                    (total, service) => total + service.barberServiceEWT,
                                                                    0
                                                                )}{' '}
                                                                mins
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <button
                                                                style={{
                                                                    background: "#0285c7"
                                                                }}
                                                                onClick={() => ServeHandler(s)}
                                                            >Serve</button>
                                                            <button
                                                                onClick={() => {
                                                                    setModalData(s)
                                                                    setOpenModal(true)
                                                                    setSubject("")
                                                                    setBody("")
                                                                }}
                                                                style={{
                                                                    background: "#450a0a"
                                                                }}

                                                            >Delete</button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </main>
                                </main>
                            )
                        })
                    ) : (
                        <div className={style.list_container_error}><p>No appointment available</p></div>
                    )
                }

            </div>

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
                <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
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
                        <p>Appointment Date: {modalData.appointmentDate}</p>
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
                <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
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
                        }}>All appointments scheduled for <span style={{ textDecoration: "underline", color: "var(--bg-secondary)" }}>{cancelAllAppoint.appointmentDate}</span> have been selected for cancellation.</p>

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

            {
                appointmentLoading ? (
                    <div className={`${style.appointment_mobile_content_wrapper_loading} ${darkmodeOn && style.dark}`}>
                        <Skeleton
                            count={4}
                            style={{ height: "9rem", marginBottom: "1rem" }}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"} />
                    </div>
                ) : appointmentResponse?.length > 0 ? (
                    <div className={`${style.appointment_mobile_content_wrapper} ${darkmodeOn && style.dark}`} >
                        {
                            appointmentResponse.map((appoint, index) => {
                                return (
                                    <Accordion key={appoint.appointmentDate} expanded={expanded === `panel${appoint.appointmentDate}`} onChange={handleChange(`panel${appoint.appointmentDate}`)}>
                                        <AccordionSummary
                                            expandIcon={<DropdownIcon color='var(--text-primary)' />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            sx={{
                                                backgroundColor: "var(--bg-primary)",
                                                borderBottom: "0.1rem solid var(--border-secondary)"
                                            }}
                                        >
                                            <Typography component="span" sx={{ alignContent: "center", marginRight: "2rem", fontSize: "1.4rem", fontFamily: "AirbnbCereal_Medium", color: "var(--text-primary)" }}>
                                                {appoint.appointmentDate}
                                            </Typography>
                                            <button onClick={(e) => {
                                                e.stopPropagation()
                                                setCancelAllModalOpen(true)
                                                setSubject("")
                                                setBody("")
                                                setCancelAllAppoint(appoint)
                                            }}>Cancel All</button>
                                        </AccordionSummary>
                                        <AccordionDetails
                                            sx={{
                                                padding: "0px",
                                            }}
                                        >

                                            {
                                                appoint.appointments.map((s, index) => {
                                                    return (
                                                        <div
                                                            className={`${style.appointment_body_customer_mobile_item} ${darkmodeOn ? style.dark : ''}`}
                                                            key={index}
                                                            style={{ borderBottom: index === appoint.appointments.length - 1 && "none" }}
                                                        >
                                                            <div>
                                                                <div>
                                                                    <img src={s?.customerProfile?.[0]?.url} alt="" />
                                                                </div>
                                                                <div>
                                                                    <p>{s.customerName}</p>
                                                                    <p>
                                                                        {s.startTime}-{s.endTime}
                                                                    </p>
                                                                    <p>
                                                                        EWT -{' '}
                                                                        {s.services.reduce(
                                                                            (total, service) => total + service.barberServiceEWT,
                                                                            0
                                                                        )}{' '}
                                                                        mins
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <button
                                                                    style={{
                                                                        background: "#0285c7"
                                                                    }}
                                                                    onClick={() => ServeHandler(s)}
                                                                >Serve</button>
                                                                <button
                                                                    onClick={() => {
                                                                        setModalData(s)
                                                                        setOpenModal(true)
                                                                        setSubject("")
                                                                        setBody("")
                                                                    }}
                                                                    style={{
                                                                        background: "#450a0a"
                                                                    }}

                                                                >Delete</button>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </AccordionDetails>
                                    </Accordion>
                                )
                            })
                        }

                    </div>
                ) : (
                    <div className={`${style.appointment_mobile_content_wrapper_error} ${darkmodeOn && style.dark}`}>
                        <p>No appointment available</p>
                    </div>
                )
            }

        </div >
    )
}

export default AppointmentList