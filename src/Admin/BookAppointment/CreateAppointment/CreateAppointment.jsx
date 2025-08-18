import React, { useEffect, useRef, useState } from 'react'
import style from './CreateAppointment.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
import { ClickAwayListener, Modal } from '@mui/material'
import Calendar from 'react-calendar'
import { CloseIcon, DropdownIcon } from '../../../icons'
import { getAdminBarberListAction } from '../../../Redux/Admin/Actions/BarberAction'
import Skeleton from 'react-loading-skeleton'
import api from '../../../Redux/api/Api'
import { useNavigate } from "react-router-dom"
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader'
import toast from 'react-hot-toast'

const CreateAppointment = () => {

    const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

    const {
        response: adminGetDefaultSalonResponse
    } = adminGetDefaultSalon

    // console.log(adminGetDefaultSalonResponse.appointmentAdvanceDays)

    const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"

    //Calender Logic

    const [getMinDate, setGetMinDate] = useState("")
    const [getMaxDate, setGetMaxDate] = useState("")
    const [getMinSmallDate, setGetMinSmallDate] = useState("")
    const [getMaxSmallDate, setGetMaxSmallDate] = useState("")


    useEffect(() => {

        if (adminGetDefaultSalonResponse) {
            const calculateDates = () => {


                const today = new Date();

                const minDate = new Date(today);
                minDate.setDate(today.getDate() + 1);
                setGetMinDate(minDate);

                const maxDate = new Date(today);
                maxDate.setDate(today.getDate() + adminGetDefaultSalonResponse?.appointmentAdvanceDays);
                setGetMaxDate(maxDate);

                const minSmallDate = minDate.toISOString().split("T")[0];
                setGetMinSmallDate(minSmallDate);

                const maxSmallDate = maxDate.toISOString().split("T")[0];
                setGetMaxSmallDate(maxSmallDate);
            };

            calculateDates();
        }

    }, [adminGetDefaultSalonResponse]);


    const [dateOfBirth, setDateOfBirth] = useState("");
    const [openCalender, setOpenCalender] = useState(false)

    const [dateOfBirthError, setDateOfBirthError] = useState("");

    const handleClickAway = () => {
        setOpenCalender(false);
    };

    const [value, onChange] = useState(new Date());

    const convertDateToYYYYMMDD = (dateInput) => {
        const date = new Date(dateInput);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onChangeHandler = (dateInput) => {
        setDateOfBirthError("")
        const formattedDate = convertDateToYYYYMMDD(dateInput);
        onChange(formattedDate)
        setDateOfBirth(formattedDate)
        // setHandler(setDateOfBirth, formattedDate, "dateOfBirth", setDateOfBirthError)
        setOpenCalender(false)
        setSelectTimeslotError("")
    }


    const onChangeDateMobileHandler = (dateInput) => {
        const selectedDate = new Date(dateInput);
        const selectedDay = selectedDate.getDay();

        if (barberofappointmentdays.includes(selectedDay)) {
            setDateOfBirthError("Selected day is not available for appointment. Please choose another date.");
            setDateOfBirth("");
        } else {
            setDateOfBirthError("");
            setDateOfBirth(dateInput);
            setSelectTimeslotError("")
        }
    }


    const [mobileValue, setMobileValue] = useState(false);

    useEffect(() => {

        const handleResize = () => {
            if (window.innerWidth <= 576) {
                setMobileValue(true);
            } else {
                setMobileValue(false);
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [selectBarberDrop, setSelectBarberDrop] = useState(false)
    const [selectServicesDrop, setSelectServicesDrop] = useState(false)
    const [selectTimeSlotsDrop, setSelectTimeSlotsDrop] = useState(false)


    const [BarberList, setBarberList] = useState([])
    const [getAdminBarberListLoading, setGetAdminBarberListLoading] = useState(false)

    const BookAppointmentBarberListcontrollerRef = useRef(new AbortController());

    useEffect(() => {
        const controller = new AbortController();
        BookAppointmentBarberListcontrollerRef.current = controller;

        const getBookAppointmentBarberListAction = async () => {
            try {
                setGetAdminBarberListLoading(true)
                const { data } = await api.post(`/api/mobileRoutes/bookAppointmentBarbers`, {
                    salonId
                }, { signal: controller.signal })

                setBarberList(data.response)
                setGetAdminBarberListLoading(false)

            } catch (error) {

                if (error?.response?.status === 500) {
                    toast.error("Something went wrong !", {
                        duration: 3000,
                        style: {
                            fontSize: "var(--font-size-2)",
                            borderRadius: '0.3rem',
                            background: '#333',
                            color: '#fff',
                        },
                    });

                    return;
                }
                setGetAdminBarberListLoading(false)
            }
        }

        getBookAppointmentBarberListAction()

        return () => {
            if (BookAppointmentBarberListcontrollerRef.current) {
                BookAppointmentBarberListcontrollerRef.current.abort();
            }
        };
    }, [salonId]);


    const [selectedBarber, setSelectedBarber] = useState("")
    const [selectedBarberId, setSelectedBarberId] = useState(0)


    const [barberServicesdata, setBarberServicesdata] = useState([])
    const [barberServicesLoading, setBarberServicesLoading] = useState(false)

    useEffect(() => {
        if (selectedBarberId !== 0) {
            try {
                const fetchServices = async () => {
                    setBarberServicesLoading(true)
                    const { data } = await api.post("/api/mobileRoutes/getServicesByBarber", {
                        barberId: selectedBarberId,
                        salonId
                    })
                    setBarberServicesLoading(false)
                    setBarberServicesdata(data.response)
                }


                fetchServices()
            } catch (error) {
                console.log(error)
                setBarberServicesLoading(false)
            }
        }
    }, [salonId, selectedBarberId])

    // console.log(dateOfBirth)

    const [timeslotloading, setTimeslotloading] = useState(false)
    const [timeslotdata, setTimeslotdata] = useState([])


    useEffect(() => {
        if (selectedBarberId !== 0 && dateOfBirth && salonId !== 0) {
            try {
                const fetchTimeslots = async () => {
                    setTimeslotloading(true)
                    const { data } = await api.post("/api/mobileRoutes/getEngageBarberTimeSlots", {
                        barberId: selectedBarberId,
                        salonId,
                        date: dateOfBirth
                    })
                    setTimeslotloading(false)
                    setTimeslotdata(data.response)
                }


                fetchTimeslots()
            } catch (error) {
                console.log(error)
                setTimeslotloading(false)
            }
        }
    }, [salonId, selectedBarberId, dateOfBirth])

    const [selectedServices, setSelectedServices] = useState([])

    const serviceAddHandler = (service) => {
        setSelectedServices([...selectedServices, service])
    }

    const servicedeleteHandler = (service) => {
        setSelectedServices((prev) => {
            const updatedArray = prev.filter((b) => b.serviceId !== service.serviceId)
            return updatedArray
        })
    }


    const [selectedTimeslot, setSelectedTimeslot] = useState("")

    const [customerName, setCustomerName] = useState("")
    const [customerEmail, setCustomerEmail] = useState("")
    const [appointmentNote, setAppointmentNote] = useState("")

    const navigate = useNavigate()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [previewdata, setPreviewdata] = useState({})

    const bookAppointmentPreviewHandler = async () => {
        if (!customerName) {
            toast.error("Please enter customer name", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setCustomerNameError("Please enter customer name")
        }

        if (customerName.length === 0 || customerName.length > 20) {
            toast.error("Name must be between 1 to 20 characters", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setCustomerNameError("Name must be between 1 to 20 characters");
        }

        if (!customerEmail) {
            toast.error("Please enter email", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setCustomerEmailError("Please enter customer email")
        }

        if (!emailRegex.test(customerEmail)) {
            toast.error("Invalid email format", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: "0.3rem",
                    background: "#333",
                    color: "#fff",
                },
            });
            return setCustomerEmailError("Invalid email format");
        }

        if (!appointmentNote) {
            toast.error("Please enter name", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setAppointmentNoteError("Please enter appointment note")
        }

        if (appointmentNote.length === 0 || appointmentNote.length > 20) {
            toast.error("Appointment note must be between 1 to 20 characters", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
            return setAppointmentNoteError("Appointment note must be between 1 to 20 characters");
        }

        if (!dateOfBirth) {
            toast.error("Please select appointment date", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return setDateOfBirthError("Please select appointment date")
        }

        if (!selectedBarberId) {
            toast.error("Please select barber", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return setSelectBarberError("Please select barber")
        }

        if (selectedServices.length === 0) {
            toast.error("Please select service", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return setSelectServiceError("Please select service")
        }


        if (!selectedTimeslot) {
            toast.error("Please select timeslot", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return setSelectTimeslotError("Please select timeslot")
        }

        const bookData = {
            salonId,
            barberId: selectedBarberId,
            barberName: selectedBarber,
            serviceId: selectedServices.map((s) => s.serviceId),
            appointmentDate: dateOfBirth,
            appointmentNotes: appointmentNote,
            startTime: selectedTimeslot,
            customerEmail,
            customerName,
            customerType: "Walk-In",
            methodUsed: "App"
        }

        setPreviewdata(bookData)

        setOpenModal(true)
    }

    const [bookappointmentLoader, setBookAppointmentLoader] = useState(false)

    const bookAppointmentHandler = async () => {
        try {
            setBookAppointmentLoader(true)

            await api.post("/api/mobileRoutes/createAppointment", previewdata)

            setBookAppointmentLoader(false)
            setPreviewdata({})
            setOpenModal(false)

            navigate("/admin-appointments")

        } catch (error) {
            setBookAppointmentLoader(false)
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

    const [customerNameError, setCustomerNameError] = useState("")
    const [customerEmailError, setCustomerEmailError] = useState("")
    const [appointmentNoteError, setAppointmentNoteError] = useState("")
    const [selectBarberError, setSelectBarberError] = useState("")
    const [selectServiceError, setSelectServiceError] = useState("")
    const [selectTimeslotError, setSelectTimeslotError] = useState("")


    const [openModal, setOpenModal] = useState(false)

    // console.log(selectedServices)


    const [barberofappointmentdays, setBarberofappointmentdays] = useState([])
    const [barberfullybookeddays, setBarberfullybookeddays] = useState([])

    useEffect(() => {
        if (selectedBarberId) {
            const getbarberappdayshandler = async () => {
                const { data } = await api.post("/api/barberAppointmentDays/GetBarberDisabledAppointmentDates", {
                    salonId,
                    barberId: selectedBarberId
                })

                // console.log(data)

                // setBarberofappointmentdays(data.response?.appointmentDays)
                setBarberofappointmentdays(data?.response)
            }

            const getfullybookedDayshandler = async () => {
                const { data } = await api.post("/api/barberAppointmentDays/getFullyBookedDatesBySalonIdBarberId", {
                    salonId,
                    barberId: selectedBarberId
                })

                console.log(data)
                setBarberfullybookeddays(data?.response)
            }

            getbarberappdayshandler()
            getfullybookedDayshandler()
        }
    }, [selectedBarberId])


    const isDisabled = (date) => {
        const formattedDate = date.toLocaleDateString("en-CA").split('T')[0];
        return barberofappointmentdays?.includes(formattedDate);
    };

    return (
        <div className={`${style.appointment_book_wrapper} ${darkmodeOn && style.dark}`}>
            <div>
                <p>Book Appointment</p>
            </div>

            <div className={`${style.appointment_book_content_wrapper} ${darkmodeOn && style.dark}`}>
                <div>
                    <div>
                        <p>Customer Name</p>
                        <input
                            type="text"
                            placeholder='Enter customer name'
                            value={customerName}
                            onChange={(e) => {
                                setCustomerNameError("")
                                setCustomerName(e.target.value)
                            }}
                            style={{ border: customerNameError && "0.1rem solid red" }}
                        />
                        <p className={style.error_message}>{customerNameError}</p>
                    </div>

                    <div>
                        <p>Customer Email</p>
                        <input
                            type="email"
                            placeholder='Enter email'
                            value={customerEmail}
                            onChange={(e) => {
                                setCustomerEmailError("")
                                setCustomerEmail(e.target.value)
                            }}
                            style={{ border: customerEmailError && "0.1rem solid red" }}
                        />
                        <p className={style.error_message}>{customerEmailError}</p>
                    </div>

                    <div>
                        <p>Customer Type</p>
                        <input type="email" value={"Walk-In"} readOnly />
                        <p></p>
                    </div>

                    <div>
                        <p>Appointment Note</p>
                        <input
                            type="text"
                            placeholder='Enter appointment note'
                            value={appointmentNote}
                            onChange={(e) => {
                                setAppointmentNoteError("")
                                setAppointmentNote(e.target.value)
                            }}
                            style={{ border: appointmentNoteError && "0.1rem solid red" }}
                        />
                        <p className={style.error_message}>{appointmentNoteError}</p>
                    </div>


                </div>

                <div>

                    <div>
                        <p>Select Barber</p>
                        <input
                            type="text"
                            placeholder='Select Barber'
                            value={selectedBarber}
                            onClick={() => {
                                setSelectBarberError("")
                                setSelectBarberDrop((prev) => !prev)
                            }}
                            style={{
                                border: selectBarberError && "0.1rem solid red"
                            }}
                            readOnly
                        />
                        <button
                            onClick={() => {
                                setSelectBarberError("")
                                setSelectBarberDrop((prev) => !prev)
                            }}
                            className={`${style.dropicon} ${darkmodeOn && style.dark}`}
                        > <DropdownIcon /></button>
                        {
                            selectBarberDrop && <ClickAwayListener onClickAway={() => setSelectBarberDrop(false)}><div>
                                {
                                    getAdminBarberListLoading ? (
                                        <div>
                                            <Skeleton count={6} height={"6rem"} style={{ marginBottom: "1rem" }}
                                                baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
                                                highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
                                        </div>)
                                        : BarberList?.length > 0 ? (
                                            <div className={`${style.barber_content_body} ${darkmodeOn && style.dark}`}>
                                                {
                                                    BarberList.map((b) => {
                                                        return (
                                                            <div onClick={() => {
                                                                setSelectedBarber(b?.name)
                                                                setSelectedBarberId(b?.barberId)
                                                                setSelectBarberDrop(false)
                                                                setSelectedServices([])
                                                                setDateOfBirthError("")
                                                                setSelectServiceError("")
                                                                setOpenCalender(false)
                                                                setDateOfBirth("")
                                                            }}
                                                                key={b.barberId}
                                                                style={{
                                                                    border: selectedBarberId === b?.barberId && "0.1rem solid rgba(0,0,0,0.6)"
                                                                }}
                                                            >
                                                                <div><img src={b?.profile?.[0]?.url} alt="" /></div>
                                                                <p>{b?.name}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <div className={`${style.barber_content_body_error} ${darkmodeOn && style.dark}`}>
                                                <p>Barbers not available</p>
                                            </div>
                                        )
                                }
                            </div></ClickAwayListener>
                        }
                        <p className={style.error_message}>{selectBarberError}</p>

                    </div>

                    <div>
                        <p>Select Services</p>
                        <input
                            type="text"
                            placeholder='Select Services'
                            value={selectedServices?.map((s) => s?.serviceName)}
                            style={{
                                border: selectServiceError && "0.1rem solid red"
                            }}
                            onClick={(e) => {
                                if (!selectedBarberId) {
                                    return setSelectServiceError("Select barber to see services")
                                } else {
                                    setSelectServiceError("")
                                    setSelectServicesDrop((prev) => !prev)
                                }
                            }}
                            readOnly
                        />
                        <button
                            onClick={(e) => {
                                if (!selectedBarberId) {
                                    return setSelectServiceError("Select barber to see services")
                                } else {
                                    setSelectServiceError("")
                                    setSelectServicesDrop((prev) => !prev)
                                }
                            }}
                            className={`${style.dropicon} ${darkmodeOn && style.dark}`}
                        > <DropdownIcon /></button>
                        {
                            selectServicesDrop && <ClickAwayListener onClickAway={() => setSelectServicesDrop(false)}><div>
                                {
                                    barberServicesLoading ? (
                                        <div>
                                            <Skeleton count={6} height={"6rem"} style={{ marginBottom: "1rem" }}
                                                baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
                                                highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
                                        </div>)
                                        : barberServicesdata?.length > 0 ? (
                                            <div className={`${style.barber_content_body} ${darkmodeOn && style.dark}`}>
                                                {
                                                    barberServicesdata.map((b) => {
                                                        return (
                                                            <div className={`${style.service_item} ${darkmodeOn && style}`}>
                                                                <div><img src={b?.serviceIcon?.url} alt="" /></div>
                                                                <div>
                                                                    <p>{b?.serviceName}</p>
                                                                    <p>{adminGetDefaultSalonResponse.currency}{" "}{b?.servicePrice}</p>
                                                                </div>
                                                                {
                                                                    selectedServices.find((c) => c.serviceId === b.serviceId) ? (<button onClick={() => servicedeleteHandler(b)} className={style.delete_btn}>Delete</button>) : (<button onClick={() => serviceAddHandler(b)} className={style.add_btn}>Add</button>)
                                                                }

                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <div className={`${style.barber_content_body_error} ${darkmodeOn && style.dark}`}>
                                                <p>Services not available</p>
                                            </div>
                                        )
                                }
                            </div></ClickAwayListener>
                        }
                        <p className={style.error_message}>{selectServiceError}</p>
                    </div>

                    {/* {
                        mobileValue ? (<div>
                            <p>Select appointment date</p>
                            <input
                                type='date'
                                placeholder='DD/MM/YY'
                                value={dateOfBirth}
                                onChange={(e) => {
                                    if (selectedBarberId === 0) {
                                        return setDateOfBirthError("Please select barber")
                                    }
                                    onChangeDateMobileHandler(e.target.value)
                                }
                                }
                                style={{
                                    colorScheme: darkmodeOn ? "dark" : "light",
                                    border: dateOfBirthError && "0.1rem solid red"
                                }}
                                min={getMinSmallDate}
                                max={getMaxSmallDate}
                            />
                            <p className={style.error_message}>{dateOfBirthError}</p>
                        </div>) : (
                            
                            <div className={style.calender_container}>
                            <p>Select appointment date</p>

                            <input
                                type='text'
                                placeholder='Select Date'
                                value={dateOfBirth}
                                onClick={() => {
                                    if (selectedBarberId === 0) {
                                        return setDateOfBirthError("Please select barber")
                                    }
                                    setOpenCalender(true)
                                }
                                }
                                style={{
                                    border: dateOfBirthError && "0.1rem solid red"
                                }}
                                readOnly
                            />
                            <span onClick={() => {
                                if (selectedBarberId === 0) {
                                    return setDateOfBirthError("Please select barber")
                                }
                                setOpenCalender((prev) => !prev)
                            }} className={`${style.dropicon} ${darkmodeOn && style.dark}`}><DropdownIcon /></span>
                            <p className={style.error_message}>{dateOfBirthError}</p>
                            {
                                openCalender > 0 && <ClickAwayListener onClickAway={handleClickAway}>
                                    <div className={style.calender_drop_container}>
                                        <Calendar
                                            onChange={onChangeHandler}
                                            value={value}
                                            minDate={getMinDate}
                                            maxDate={getMaxDate}
                                            // tileDisabled={({ date, view }) => {
                                            //     return view === 'month' && barberofappointmentdays?.includes(date.getDay());
                                            // }}
                                            tileDisabled={({ date }) => isDisabled(date)}
                                        />
                                    </div>
                                </ClickAwayListener>
                            }
                        </div>)
                    } */}

                    <div className={style.calender_container}>
                        <p>Select appointment date</p>

                        <input
                            type='text'
                            placeholder='Select Date'
                            value={dateOfBirth}
                            onClick={() => {
                                if (selectedBarberId === 0) {
                                    return setDateOfBirthError("Please select barber")
                                }
                                setOpenCalender(true)
                            }
                            }
                            style={{
                                border: dateOfBirthError && "0.1rem solid red"
                            }}
                            readOnly
                        />
                        <span onClick={() => {
                            if (selectedBarberId === 0) {
                                return setDateOfBirthError("Please select barber")
                            }
                            setOpenCalender((prev) => !prev)
                        }} className={`${style.dropicon} ${darkmodeOn && style.dark}`}><DropdownIcon /></span>
                        <p className={style.error_message}>{dateOfBirthError}</p>
                        {
                            openCalender > 0 && <ClickAwayListener onClickAway={handleClickAway}>
                                <div className={style.calender_drop_container}>
                                    <Calendar
                                        onChange={onChangeHandler}
                                        value={value}
                                        minDate={getMinDate}
                                        maxDate={getMaxDate}
                                        // tileDisabled={({ date, view }) => {
                                        //     return view === 'month' && barberofappointmentdays?.includes(date.getDay());
                                        // }}
                                        tileDisabled={({ date }) => isDisabled(date)}
                                        tileClassName={({ date }) =>
                                            barberfullybookeddays.includes(date.toLocaleDateString('en-CA'))
                                                ? style.bookedDays
                                                : ''
                                        }
                                    />
                                </div>
                            </ClickAwayListener>
                        }
                    </div>


                    <div>
                        <p>Select Timeslot</p>
                        <input
                            type="text"
                            placeholder='Select Timeslot'
                            value={selectedTimeslot}
                            onClick={() => {
                                if (!dateOfBirth || !selectedBarberId) {
                                    return setSelectTimeslotError("Select barber and date to see timeslots")
                                }

                                setSelectTimeslotError("")
                                setSelectTimeSlotsDrop((prev) => !prev)
                            }}
                            style={{
                                border: selectTimeslotError && "0.1rem solid red"
                            }}
                            readOnly
                        />
                        <button
                            onClick={() => {
                                if (!dateOfBirth || !selectedBarberId) {
                                    return setSelectTimeslotError("Select barber and date to see timeslots")
                                }

                                setSelectTimeslotError("")
                                setSelectTimeSlotsDrop((prev) => !prev)
                            }}
                            className={`${style.dropicon} ${darkmodeOn && style.dark}`}
                        > <DropdownIcon /></button>

                        {
                            selectTimeSlotsDrop && <ClickAwayListener onClickAway={() => setSelectTimeSlotsDrop(false)}><div>
                                {
                                    timeslotloading ? (
                                        <div>
                                            <Skeleton count={6} height={"6rem"} style={{ marginBottom: "1rem" }}
                                                baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
                                                highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
                                        </div>)
                                        : timeslotdata?.length > 0 ? (
                                            <div className={`${style.barber_content_body} ${darkmodeOn && style.dark}`}>
                                                {
                                                    timeslotdata.map((b) => {
                                                        return (
                                                            <div
                                                                className={`${style.timeslot_item} ${darkmodeOn && style.dark}`}
                                                                style={{
                                                                    border: selectedTimeslot === b?.timeInterval && "1px solid black"
                                                                }}
                                                            >
                                                                <p>Start Time - {b?.timeInterval}</p>

                                                                <button
                                                                    disabled={b?.disabled}
                                                                    style={{
                                                                        cursor: b?.disabled ? "not-allowed" : "pointer",
                                                                        backgroundColor: b?.disabled && "gray",
                                                                        color: b?.disabled && "#fff",
                                                                        border: b?.disabled && "#fff"
                                                                    }}
                                                                    onClick={() => {
                                                                        setSelectedTimeslot(b?.timeInterval)
                                                                        setSelectTimeSlotsDrop(false)
                                                                    }}
                                                                    className={`${style.timeslot_add_btn} ${darkmodeOn && style.dark}`}
                                                                >{b?.disabled ? "Booked" : "Add"}</button>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <div className={`${style.barber_content_body_error} ${darkmodeOn && style.dark}`}>
                                                <p>Time slots not available</p>
                                            </div>
                                        )
                                }
                            </div></ClickAwayListener>
                        }
                        <p className={style.error_message}>{selectTimeslotError}</p>
                    </div>
                </div>

            </div>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
                    <div>
                        <p>Preview</p>
                        <button onClick={() => setOpenModal(false)}><CloseIcon /></button>
                    </div>
                    <div className={style.modal_content_container}>
                        <p>Customer Name - <span>{previewdata.customerName}</span></p>
                        <p>Customer Email - <span>{previewdata.customerEmail}</span></p>
                        <p>Customer Type - <span>{previewdata.customerType}</span></p>
                        <p>Appointment Note - <span>{previewdata.appointmentNotes}</span></p>
                        <p>Barber Name - <span>{previewdata.barberName}</span></p>
                        <p>Appointment Date - <span>{previewdata.appointmentDate}</span></p>
                        <p>Timeslot - <span>{previewdata.startTime}</span></p>
                        <p>Selected Services - </p>
                        <div className={`${style.modal_content_service_body} ${darkmodeOn && style.dark}`}>
                            {
                                selectedServices.map((b) => {
                                    return (
                                        <div className={`${style.modal_service_item} ${darkmodeOn && style}`}>
                                            <div>
                                                <img src={b?.serviceIcon?.url} alt="" />
                                            </div>
                                            <div>
                                                <p>{b?.serviceName}</p>
                                                <p>{adminGetDefaultSalonResponse?.currency}{" "}{b?.servicePrice}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {
                            bookappointmentLoader ? <button><ButtonLoader /></button> : <button onClick={bookAppointmentHandler}>Book</button>
                        }

                    </div>
                </div>

            </Modal>

            <button className={style.book_appointment_btn} onClick={bookAppointmentPreviewHandler}>Book</button>


        </div>
    )
}

export default CreateAppointment