import React, { useEffect, useState } from 'react'
import style from './Appointment.module.css'
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import api from '../../Redux/api/Api'
import toast from 'react-hot-toast'
import Calendar from 'react-calendar'
import { LeftArrow, RightArrow } from '../../icons'
import moment from 'moment'

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
            day: "Sunday"
        },
        {
            id: 2,
            day: "Monday"
        },
        {
            id: 3,
            day: "Tuesday"
        },
        {
            id: 4,
            day: "Wednesday"
        },
        {
            id: 5,
            day: "Thursday"
        },
        {
            id: 6,
            day: "Friday"
        },
        {
            id: 7,
            day: "Saturday"
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


            const { data: appointmentDaysData } = await api.post("/api/barberAppointmentDays/getBarberAppointmentDays", {
                salonId,
                barberId
            })

            setGetBarberApptdates(appointmentDaysData.response.appointmentDays)
            setSelectedDays(appointmentDaysData.response.appointmentDays);

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

    const [getBarberApptdates, setGetBarberApptdates] = useState([])

    useEffect(() => {
        const getAppointdays = async () => {
            const { data } = await api.post("/api/barberAppointmentDays/getBarberAppointmentDays", {
                salonId,
                barberId
            })

            setGetBarberApptdates(data.response.appointmentDays)
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

    // console.log("getBarberApptdates ", getBarberApptdates)
    // console.log("getSalonoffDays ", getSalonoffDays)

    // Barber Day off new calendar logic

    const [currentMonth, setCurrentMonth] = useState(moment());
    const [offDays, setOffDays] = useState([]); // add if not defined

    const today = moment().startOf("day");
    const tomorrow = today.clone().add("day");

    const startOfMonth = currentMonth.clone().startOf("month");
    const endOfMonth = currentMonth.clone().endOf("month");
    const daysInMonth = currentMonth.daysInMonth();

    // Generate all days for the current month
    const allDays = Array.from({ length: daysInMonth }, (_, i) =>
        startOfMonth.clone().add(i, "days")
    );


    // 2. Filter only future dates (tomorrow onward)
    const futureDays = allDays.filter((day) => day.isSameOrAfter(tomorrow, "day"));
    const firstDayWeekday = startOfMonth.weekday();
    const leadingBlanks = Array.from({ length: firstDayWeekday }, (_, i) => ({
        type: 'blank',
        key: `blank-${i}`
    }));

    // Generate the days for the calendar grid
    const calendarDays = allDays.map((day) => ({
        type: 'date',
        day: day,
        isFuture: day.isSameOrAfter(tomorrow, "day")
    }));

    // Combine blanks and day objects
    const daysForDisplay = [...leadingBlanks, ...calendarDays];

    // Filter only future dates (tomorrow onward)
    const visibleDays = allDays.filter((day) => day.isSameOrAfter(tomorrow, "day"));

    // Prevent navigating to past months
    const handlePrevMonth = () => {
        const prevMonth = currentMonth.clone().subtract(1, "month");
        if (prevMonth.isBefore(today, "month")) return;
        setCurrentMonth(prevMonth);
    };

    // Navigate forward
    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, "month"));
    };


    const isPrevDisabled = currentMonth.isSameOrBefore(moment(), "month");
    const isNextDisabled = false;

    const onMobileClickDay = (day) => {
        const formattedDate = day.format("YYYY-MM-DD");

        setSelectedDates((prevDates) =>
            prevDates.includes(formattedDate)
                ? prevDates.filter((d) => d !== formattedDate)
                : [...prevDates, formattedDate]
        );
    }

    // console.log("getBarberApptdates ", getBarberApptdates)


    const isMobileSelected = (day) => {
        const formattedDate = day.format("YYYY-MM-DD");
        return selectedDates?.includes(formattedDate);
    };


    const isMobileDisabled = (day) => {
        const formattedDate = day.format("YYYY-MM-DD");
        return barberLeaveDaysdata?.includes(formattedDate);
    };

    // const isDayMobileDisabled = (day) => {
    //     const weekday = day.format("dddd"); // Gives full name e.g. "Monday"
    //     return (
    //         getSalonoffDays.includes(weekday) ||
    //         getBarberApptdates.includes(weekday)
    //     );
    // };

    const isDayMobileDisabled = (day) => {
        const weekday = day.format("dddd");
        // Day should be unavailable if it's not in getBarberApptdates, 
        // OR if it's in salon off days
        return (
            !getBarberApptdates.includes(weekday) ||
            getSalonoffDays.includes(weekday)
        );
    };



    const isBarberApptDayDisabled = (day) => {
        const weekday = day.format("dddd"); // Gives full name e.g. "Monday"
        return (
            getBarberApptdates.includes(weekday)
        );
    };



    return (
        <div className={`${style.section}`}>

            <div className={style.barber_appointment_content_wrapper}>
                <div className={style.barber_availability_container}>
                    <div>
                        <div>
                            <h2>Appointment Days</h2>
                            <p>
                                Select the days you're <strong>available</strong> for client appointments.
                            </p>
                        </div>

                        <button
                            onClick={submitHandler}
                            disabled={salonId === 0}
                            style={{
                                cursor: salonId === 0 ? "not-allowed" : "pointer"
                            }}>save</button>
                    </div>

                    <div>
                        {
                            days.map((d) => {
                                const isDisabled = getSalonoffDays.includes(d.day);
                                const isChecked = !isDisabled && selectedDays.includes(d.day);

                                return (
                                    <button
                                        key={d.id}
                                        className={`${style.appointmentWeekDay} ${isDisabled ? style.disabled : ''} ${isChecked ? style.apptAvailSelected : ''}`}
                                        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                                        onClick={() => {
                                            if (!isDisabled) checkdayHandler(d);
                                        }}
                                    >
                                        {d.day.slice(0, 3)}
                                    </button>
                                );
                            })
                        }

                    </div>
                </div>

                <div className={style.barber_dayoff_container}>
                    <div>
                        <div>
                            <h2>Day off</h2>
                            <p>Select dates on the calender to mark as unavailable</p>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div className={style.monthSelector}>
                                <button
                                    onClick={handlePrevMonth}
                                    className={style.iconBtn}
                                    disabled={isPrevDisabled}
                                    style={{
                                        opacity: isPrevDisabled ? 0.4 : 1,
                                        cursor: isPrevDisabled ? "not-allowed" : "pointer"
                                    }}
                                >
                                    <LeftArrow size={24} />
                                </button>
                                <p className={style.monthText}>
                                    {currentMonth.format("MMMM YYYY")}
                                </p>
                                <button
                                    onClick={handleNextMonth}
                                    className={style.iconBtn}
                                    disabled={isNextDisabled}
                                    style={{
                                        opacity: isNextDisabled ? 0.4 : 1,
                                        cursor: isNextDisabled ? "not-allowed" : "pointer"
                                    }}
                                >
                                    <RightArrow size={24} />
                                </button>
                            </div>
                            <button
                                className={style.reset_days}
                                onClick={() => offDayHandler([])}
                                disabled={salonId === 0}
                                style={{
                                    cursor: salonId === 0 ? "not-allowed" : "pointer"
                                }}
                            >Reset Off Days
                            </button>

                            <button
                                className={style.reset_days}
                                onClick={() => offDayHandler(selectedDates)}
                                disabled={salonId === 0}
                                style={{
                                    cursor: salonId === 0 ? "not-allowed" : "pointer"
                                }}
                            >Save</button>
                        </div>
                    </div>

                    <div className={style.calendarGrid}> {/* New: Wrapper for the grid */}

                        {
                            daysForDisplay.map((item) => {
                                if (item.type === 'blank') {
                                    return <div key={item.key} className={style.blankDay}></div>;
                                }

                                const day = item.day;
                                const formatted = day.format("YYYY-MM-DD");

                                const isLeaveDay = barberLeaveDaysdata?.includes(formatted); // actual leave date
                                const isSalonOffDay = getSalonoffDays.includes(day.format("dddd")); // salon off day (weekly)
                                const isAvailableDay = getBarberApptdates.includes(day.format("dddd")); // barber working
                                const isSelected = isMobileSelected(day);

                                // Only truly disabled days (not selectable)
                                const isDisabled = !isAvailableDay || isLeaveDay;

                                return (
                                    <button
                                        key={formatted}
                                        onClick={() => {
                                            if (item.isFuture && !isDisabled) {
                                                onMobileClickDay(day);
                                            }
                                        }}
                                        disabled={!item.isFuture || isDisabled} // leave & unavailable days disabled, salon off selectable
                                        className={`
          ${style.appointmentWeekDate}
          ${!item.isFuture ? style.pastDate : ''}
          ${isLeaveDay && !isSelected ? style.leave_dates : ''}
          ${isSalonOffDay ? style.salon_off_day : ''}
          ${isSelected ? style.highlighted_date : ''}
        `}

                                        style={{
                                            opacity: isLeaveDay ? 1 : (!item.isFuture || isDisabled ? 0.4 : 1), // leave fully visible
                                            cursor: !item.isFuture || isDisabled ? "not-allowed" : "pointer",
                                        }}

                                    >
                                        <div>
                                            <h2>{day.format("DD")}</h2>
                                            <p>{day.format("ddd")}</p>
                                            <p>
                                                {isLeaveDay
                                                    ? "Leave"
                                                    : isSalonOffDay
                                                        ? "Salon Off Day"
                                                        : isAvailableDay
                                                            ? "Available"
                                                            : "Unavailable"}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })
                        }

                    </div>

                </div>
            </div>

            <div className={`${style.barber_appointment_content_mobile_wrapper} ${darkmodeOn && style.dark}`}>
                <div className={style.button_group}>
                    <button
                        onClick={() => {
                            setBarberOffdates(false)
                            setAppointmentDates(true)
                        }}>Availability</button>
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
                    </div>
                }


                {
                    barberOffdates && <div className={style.leave_value_body}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div className={style.monthSelector}>
                                <button
                                    onClick={handlePrevMonth}
                                    className={style.iconBtn}
                                    disabled={isPrevDisabled}
                                    style={{
                                        opacity: isPrevDisabled ? 0.4 : 1,
                                        cursor: isPrevDisabled ? "not-allowed" : "pointer"
                                    }}
                                >
                                    <LeftArrow size={24} />
                                </button>
                                <p className={style.monthText}>
                                    {currentMonth.format("MMMM YYYY")}
                                </p>
                                <button
                                    onClick={handleNextMonth}
                                    className={style.iconBtn}
                                    disabled={isNextDisabled}
                                    style={{
                                        opacity: isNextDisabled ? 0.4 : 1,
                                        cursor: isNextDisabled ? "not-allowed" : "pointer"
                                    }}
                                >
                                    <RightArrow size={24} />
                                </button>
                            </div>
                            <button
                                className={style.reset_days}
                                onClick={() => offDayHandler([])}
                                disabled={salonId === 0}
                                style={{
                                    cursor: salonId === 0 ? "not-allowed" : "pointer"
                                }}
                            >Reset Off Days</button>
                        </div>


                        <div className={style.dayList}>
                            {visibleDays.map((day) => {
                                const formatted = day.format("YYYY-MM-DD");

                                return (
                                    <button
                                        key={formatted}
                                        onClick={() => {
                                            onMobileClickDay(day)
                                        }}
                                        disabled={isDayMobileDisabled(day)}

                                        className={`
    ${style.dayBtn}
    ${isMobileDisabled(day) && !isMobileSelected(day) ? style.leave_dates : ""}
    ${isMobileSelected(day) ? style.highlighted_date : ""}
  `}
                                        style={{
                                            opacity: isDayMobileDisabled(day) ? 0.4 : 1,
                                            cursor: isDayMobileDisabled(day) ? "not-allowed" : "pointer",
                                        }}
                                    >
                                        {day.format("ddd DD MMM YYYY")}

                                    </button>
                                );
                            })}
                        </div>

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