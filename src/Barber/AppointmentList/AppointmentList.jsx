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
import { ddmmformatDate } from '../../../utils/ddmmformatDate'
import { formatMinutesToHrMin } from '../../../utils/formatMinutesToHrMin'

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
                                        <p>{ddmmformatDate(appoint.appointmentDate)}</p>
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
                                                                ~ {' '}
                                                                {formatMinutesToHrMin(s.services.reduce(
                                                                    (total, service) => total + service.barberServiceEWT,
                                                                    0
                                                                ))}{' '}

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
                                                {ddmmformatDate(appoint.appointmentDate)}
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
                                                                        {formatMinutesToHrMin(s.services.reduce(
                                                                            (total, service) => total + service.barberServiceEWT,
                                                                            0
                                                                        ))}
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