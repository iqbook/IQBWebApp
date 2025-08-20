import React, { useEffect, useState } from 'react'
import style from "./AppointmentList.module.css"
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
import api from "../../../Redux/api/Api"
import "react-calendar/dist/Calendar.css";
import Skeleton from 'react-loading-skeleton'
import { useLocation, useNavigate } from 'react-router-dom'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { DropdownIcon } from '../../../newicons'
import { ddmmformatDate } from '../../../../utils/ddmmformatDate'
import { formatMinutesToHrMin } from '../../../../utils/formatMinutesToHrMin'

const AppointmentList = () => {

    const location = useLocation()
    // console.log(location.state)


    const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"


    const [selectedDate, setSelectedDate] = useState(location.state)

    const [loading, setLoading] = useState(false)
    const [appointmentList, setAppointmentList] = useState([])

    useEffect(() => {
        try {
            setLoading(true)
            const getAppointmentList = async () => {
                const { data } = await api.post("/api/appointments/getAllAppointmentsBySalonIdAndDate", {
                    salonId,
                    appointmentDate: selectedDate
                })

                setAppointmentList(data)
                setLoading(false)
            }

            getAppointmentList()
        } catch (error) {
            setLoading(false)
        }
    }, [selectedDate])

    const navigate = useNavigate()


    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    return (
        <div className={`${style.section} ${darkmodeOn && style.dark}`}>
            <div>
                <h2>Appointment List</h2>

                <p>{ddmmformatDate(location.state)}</p>

            </div>

            <div className={`${style.appointment_content_wrapper} ${darkmodeOn && style.dark}`}>
                {
                    loading ? (
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
                    ) : appointmentList?.response?.length > 0 ? (
                        appointmentList?.response?.map((appoint) => (
                            <React.Fragment key={appoint.barberId}>
                                <main className={`${style.appointment_container} ${darkmodeOn ? style.dark : ''}`}>
                                    <div className={`${style.appointment_barber_container} ${darkmodeOn ? style.dark : ''}`}>
                                        <div>
                                            <img src={appoint.barberProfile?.[0]?.url} alt="profile" />
                                        </div>
                                        <p>{appoint.barbername}</p>
                                    </div>

                                    <main className={style.appointment_content_list_container}>
                                        {appoint?.appointments.map((cus) => (
                                            <div
                                                className={`${style.appointment_body_customer_item} ${darkmodeOn ? style.dark : ''}`}
                                                key={cus._id}
                                            >
                                                <div>
                                                    <img src={cus.customerProfile?.[0]?.url} alt="" />
                                                </div>
                                                <div>
                                                    <p>{cus.customerName}</p>
                                                    <p>
                                                        Time: {cus.startTime} - {cus.endTime}
                                                    </p>
                                                    <p>
                                                        Ewt -{' '}
                                                        {formatMinutesToHrMin(cus.services.reduce(
                                                            (total, service) => total + service.barberServiceEWT,
                                                            0
                                                        ))}
                                                    </p>
                                                </div>
                                                {/* <button className={style.edit_app_btn}
                                                    onClick={() => {
                                                        navigate("/admin-book-editappointments", {
                                                            state: {
                                                                ...cus,
                                                                barberName: appoint.barbername
                                                            }
                                                        });
                                                    }}

                                                >Edit</button> */}
                                            </div>
                                        ))}
                                    </main>
                                </main>
                            </React.Fragment>
                        ))
                    ) : (
                        <div className={style.list_container_error}><p>No appointment available</p></div>
                    )
                }

            </div>


            {
                loading ? (
                    <div className={`${style.appointment_mobile_content_wrapper_loading} ${darkmodeOn && style.dark}`}>
                        <Skeleton
                            count={4}
                            style={{ height: "9rem", marginBottom: "1rem" }}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"} />
                    </div>
                ) : appointmentList?.response?.length > 0 ? (
                    <div className={`${style.appointment_mobile_content_wrapper} ${darkmodeOn && style.dark}`} >
                        {
                            appointmentList?.response?.map((appoint, index) => {
                                return (
                                    <Accordion key={appoint.barberId} expanded={expanded === `panel${appoint.barberId}`} onChange={handleChange(`panel${appoint.barberId}`)}>
                                        <AccordionSummary
                                            expandIcon={<DropdownIcon color='var(--text-primary)' />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            sx={{
                                                backgroundColor: "var(--bg-primary)",
                                                borderBottom: "0.1rem solid var(--border-secondary)"
                                            }}
                                        >
                                            <div style={{
                                                height: '4.5rem',
                                                width: '4.5rem',
                                                border: '0.1rem solid rgba(0, 0, 0, 0.2)',
                                                borderRadius: '50%',
                                                marginRight: "2rem"
                                            }}>
                                                <img style={{ width: "inherit", height: "inherit", borderRadius: "inherit" }} src={appoint.barberProfile?.[0]?.url} alt="profile" />
                                            </div>
                                            <Typography component="span" sx={{ alignContent: "center", marginRight: "2rem", fontSize: "1.4rem", fontFamily: "AirbnbCereal_Medium", color: "var(--text-primary)" }}>
                                                {appoint.barbername}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails
                                            sx={{
                                                padding: "0px",
                                            }}
                                        >

                                            {
                                                appoint.appointments.map((cus, index) => {
                                                    return (
                                                        <div
                                                            className={`${style.appointment_body_customer_mobile_item} ${darkmodeOn ? style.dark : ''}`}
                                                            key={index}
                                                            style={{ borderBottom: index === appoint.appointments.length - 1 && "none" }}
                                                        >
                                                            <div>
                                                                <div>
                                                                    <img src={cus.customerProfile?.[0]?.url} alt="" />
                                                                </div>
                                                                <div>
                                                                    <p>{cus.customerName}</p>
                                                                    <p>
                                                                        {cus.startTime} - {cus.endTime}
                                                                    </p>
                                                                    <p>
                                                                        Ewt -{' '}
                                                                        {formatMinutesToHrMin(cus.services.reduce(
                                                                            (total, service) => total + service.barberServiceEWT,
                                                                            0
                                                                        ))}
                                                                    </p>
                                                                </div>
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