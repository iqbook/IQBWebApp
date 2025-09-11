import React, { useEffect, useState } from 'react'
import style from './Appointment.module.css'
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import api from '../../Redux/api/Api'
import toast from 'react-hot-toast'
import Calendar from 'react-calendar'

const Appointment = () => {

    const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata?.user[0])

    const salonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
    const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

    const [getSalonoffDays, setGetSalonoffDays] = useState([])

    useEffect(() => {
        if (salonId !== 0) {
            const fetchSalonOffDaysHandler = async () => {
                try {
                    const { data } = await api.post("/api/salonSettings/getSalonoffDays", { salonId })
                    setGetSalonoffDays(data?.response)
                } catch (error) {
                    toast.error(error?.response?.data?.message, {
                        duration: 3000,
                        style: {
                            fontSize: "var(--font-size-2)",
                            borderRadius: '0.3rem',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                }
            }

            fetchSalonOffDaysHandler()
        }
    }, [salonId])

    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"

    const days = [
        {
            id: 1,
            day: "Monday"
        },
        {
            id: 2,
            day: "Tuesday"
        },
        {
            id: 3,
            day: "Wednesday"
        },
        {
            id: 4,
            day: "Thursday"
        },
        {
            id: 5,
            day: "Friday"
        },
        {
            id: 6,
            day: "Saturday"
        },
        {
            id: 7,
            day: "Sunday"
        }
    ]

    const [appointmentdates, setAppointmentDates] = useState(true)
    const [barberOffdates, setBarberOffdates] = useState(false)

    const [selectedDays, setSelectedDays] = useState([])

    const checkdayHandler = (day) => {

        setSelectedDays((prev) => {
            if (prev.includes(day.day)) {
                return prev.filter((d) => d !== day.day);
            } else {
                return [...prev, day.day];
            }
        });
    }

    const submitHandler = async () => {
        try {
            const appdata = {
                salonId,
                barberId,
                appointmentDays: selectedDays
            }

            const { data } = await api.post("/api/barberAppointmentDays/addBarberAppointmentDays", appdata)

            toast.success(data?.message, {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        } catch (error) {
            toast.error(error?.response?.data?.message, {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    }

    const [getAppdates, setGetAppdates] = useState([])

    useEffect(() => {
        const getAppointdays = async () => {
            const { data } = await api.post("/api/barberAppointmentDays/getBarberAppointmentDays", {
                salonId,
                barberId
            })

            setGetAppdates(data.response.appointmentDays)
            setSelectedDays(data.response.appointmentDays);
        }
        getAppointdays()
    }, [])

    const [selectedDates, setSelectedDates] = useState([]);

    const onClickDay = (date) => {

        const formattedDate = date.toLocaleDateString("en-CA");

        setSelectedDates((prevDates) =>
            prevDates.includes(formattedDate)
                ? prevDates.filter((d) => d !== formattedDate)
                : [...prevDates, formattedDate]
        );
    };

    const isSelected = (date) => {
        const formattedDate = date.toLocaleDateString("en-CA");
        return selectedDates?.includes(formattedDate);
    };

    const offDayHandler = async (selectedDates) => {
        const { data } = await api.post("/api/barberDayOff/addBarberDayOffs", {
            salonId,
            barberId,
            barberDayOffs: selectedDates
        })

        toast.success(data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });

        setSelectedDates([])
        getBarberLeaveDaysFunc()
    }

    const [barberLeaveDaysdata, setBarberLeaveDaysdata] = useState([])

    const getBarberLeaveDaysFunc = async () => {
        const { data } = await api.post("/api/barberDayOff/getBarberDayOffs", {
            salonId,
            barberId
        })

        setBarberLeaveDaysdata(data.response)
    }

    useEffect(() => {
        getBarberLeaveDaysFunc()
    }, [])


    const isDisabled = (date) => {
        const formattedDate = date.toLocaleDateString("en-CA").split('T')[0];
        return barberLeaveDaysdata?.includes(formattedDate);
    };

    return (
        <div className={`${style.section}`}>
            <div>
                <h2>Appointment</h2>
            </div>

            <div className={style.barber_appointment_content_wrapper}>
                <div>
                    <p>Choose appointment days</p>
                    <div className={style.heading}>
                        <p>#</p>
                        <p>Days</p>
                    </div>

                    {
                        days.map((d) => {
                            const isDisabled = getSalonoffDays.includes(d.day);
                            const isChecked = !isDisabled && selectedDays.includes(d.day);

                            return (
                                <label
                                    key={d.id}
                                    className={`${style.value} ${isDisabled ? style.disabled : ''}`}
                                    style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{ accentColor: "blue" }}
                                        onChange={() => checkdayHandler(d)}
                                        checked={isChecked}
                                        disabled={isDisabled}
                                    />
                                    <p>{d.day}</p>
                                </label>
                            );
                        })
                    }



                    <button
                        className={style.submit}
                        onClick={submitHandler}
                        disabled={salonId === 0}
                        style={{
                            cursor: salonId === 0 ? "not-allowed" : "pointer"
                        }}
                    >Save</button>

                </div>

                <div>
                    <p>{`${barberProfile?.salonType === "Barber Shop" ? "Barber" : "Stylist"}`} Off Days</p>
                    <div className={style.leave_value_body}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "2rem"
                        }}>
                            <p>Select Off Days</p>
                            <button
                                className={style.reset_days}
                                onClick={() => offDayHandler([])}
                                disabled={salonId === 0}
                                style={{
                                    cursor: salonId === 0 ? "not-allowed" : "pointer"
                                }}
                            >Reset Off Days</button>
                        </div>
                        {
                            <div style={{ marginBottom: "2rem" }}>
                                <Calendar
                                    onClickDay={onClickDay}
                                    // tileClassName={({ date }) =>
                                    //     isSelected(date) ? style.highlighted_date : ""
                                    // }

                                    minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                    tileClassName={({ date }) => {
                                        if (isSelected(date)) {
                                            return style.highlighted_date;
                                        } else if (isDisabled(date)) {
                                            return style.leave_dates;
                                        }
                                        return null;
                                    }}

                                // tileDisabled={({ date }) => isDisabled(date)}
                                />
                            </div>
                        }

                        <button
                            className={style.submit}
                            onClick={() => offDayHandler(selectedDates)}
                            disabled={salonId === 0}
                            style={{
                                cursor: salonId === 0 ? "not-allowed" : "pointer"
                            }}
                        >Save</button>
                    </div>
                </div>
            </div>

            <div className={`${style.barber_appointment_content_mobile_wrapper} ${darkmodeOn && style.dark}`}>
                <div className={style.button_group}>
                    <button
                        onClick={() => {
                            setBarberOffdates(false)
                            setAppointmentDates(true)
                        }}>Appointment Days</button>
                    <button
                        onClick={() => {
                            setBarberOffdates(true)
                            setAppointmentDates(false)
                        }}>Barber Off Days</button>
                </div>
                {
                    appointmentdates && <div className={style.value_body}>
                        <div className={style.heading}>
                            <p>#</p>
                            <p>Days</p>
                        </div>
                        {
                            days.map((d) => {
                                return (
                                    <div key={d.id} className={style.value}>
                                        <input
                                            type="checkbox"
                                            style={{
                                                accentColor: "blue"
                                            }}
                                            onChange={() => checkdayHandler(d)}
                                            checked={!getSalonoffDays.includes(d.day) && selectedDays.includes(d.day)}
                                            disabled={getSalonoffDays.includes(d.day)}
                                        />
                                        <p>{d.day}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                }

                {
                    barberOffdates && <div className={style.leave_value_body}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <p>Select Off Days</p>
                            <button
                                className={style.reset_days}
                                onClick={() => offDayHandler([])}
                                disabled={salonId === 0}
                                style={{
                                    cursor: salonId === 0 ? "not-allowed" : "pointer"
                                }}
                            >Reset Off Days</button>
                        </div>
                        {
                            <div style={{ marginBottom: "2rem" }}>
                                <Calendar
                                    onClickDay={onClickDay}
                                    // tileClassName={({ date }) =>
                                    //     isSelected(date) ? style.highlighted_date : ""
                                    // }

                                    minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                    tileClassName={({ date }) => {
                                        if (isSelected(date)) {
                                            return style.highlighted_date;
                                        } else if (isDisabled(date)) {
                                            return style.leave_dates;
                                        }
                                        return null;
                                    }}

                                // tileDisabled={({ date }) => isDisabled(date)}
                                />
                            </div>
                        }
                    </div>
                }
                <button
                    className={style.submit}
                    onClick={appointmentdates ? submitHandler : () => offDayHandler(selectedDates)}
                    disabled={salonId === 0}
                    style={{
                        cursor: salonId === 0 ? "not-allowed" : "pointer"
                    }}
                >Save</button>
            </div>
        </div>
    )
}

export default Appointment