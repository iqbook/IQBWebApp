import React, { useEffect, useRef, useState } from 'react'
import "./SalonAppointmentSettings.css"
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminUpdateSalonSettingsAction } from '../../../Redux/Admin/Actions/SalonAction';
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader';
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer';

const SalonAppointmentSettings = () => {

    const location = useLocation()
    const currentSalon = location?.state

    // console.log(currentSalon)

    const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

    const [timeOptions, setTimeOptions] = useState([]);

    // Function to add leading zero for single-digit hours and minutes
    const addLeadingZero = (num) => (num < 10 ? '0' : '') + num;

    // Function to generate time options
    const generateTimeOptions = () => {
        const options = [];

        // Loop through hours (0 to 23)
        for (let hour = 0; hour < 24; hour++) {
            // Loop through minutes (0 and 30)
            for (let minute = 0; minute < 60; minute += 30) {
                // Format the time as HH:mm
                const time = addLeadingZero(hour) + ':' + addLeadingZero(minute);
                options.push({ value: time, label: time });
            }
        }

        setTimeOptions(options);
    };

    // Call the function to generate time options when the component mounts

    useEffect(() => {
        generateTimeOptions();
    }, []);


    const [startTime, setStartTime] = useState(currentSalon?.appointmentSettings?.appointmentStartTime)
    const [startTimeDrop, setStartTimeDrop] = useState(false)

    const startTimeDropHandler = () => {
        setStartTimeDrop((prev) => !prev)
    }

    const setStartTimeHandler = (value) => {
        setStartTime(value)
        setStartTimeDrop(false)
    }

    const startTimeinputRef = useRef()
    const startTimeDropRef = useRef()

    useEffect(() => {
        const handleClickStartTimeOutside = (event) => {
            if (
                startTimeinputRef.current &&
                startTimeDropRef.current &&
                !startTimeinputRef.current.contains(event.target) &&
                !startTimeDropRef.current.contains(event.target)
            ) {
                setStartTimeDrop(false);
            }
        };

        document.addEventListener('mousedown', handleClickStartTimeOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickStartTimeOutside);
        };
    }, []);


    const [endTime, setEndTime] = useState(currentSalon?.appointmentSettings?.appointmentEndTime)
    const [endTimeDrop, setEndTimeDrop] = useState(false)

    const endTimeDropHandler = () => {
        setEndTimeDrop((prev) => !prev)
    }

    const setEndTimeHandler = (value) => {
        setEndTime(value)
        setEndTimeDrop(false)
    }

    const endTimeinputRef = useRef()
    const endTimeDropRef = useRef()

    useEffect(() => {
        const handleClickEndTimeOutside = (event) => {
            if (
                endTimeinputRef.current &&
                endTimeDropRef.current &&
                !endTimeinputRef.current.contains(event.target) &&
                !endTimeDropRef.current.contains(event.target)
            ) {
                setEndTimeDrop(false);
            }
        };

        document.addEventListener('mousedown', handleClickEndTimeOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickEndTimeOutside);
        };
    }, []);


    const [intervalTime, setIntervalTime] = useState(currentSalon?.appointmentSettings?.intervalInMinutes)
    const [intervalTimeDrop, setIntervalTimeDrop] = useState(false)

    const intervalTimeDropHandler = () => {
        setIntervalTimeDrop((prev) => !prev)
    }

    const setIntervalTimeHandler = (value) => {
        setIntervalTime(value)
        setIntervalTimeDrop(false)
    }

    const intervalTimeinputRef = useRef()
    const intervalTimeDropRef = useRef()

    useEffect(() => {
        const handleClickIntervalTimeOutside = (event) => {
            if (
                intervalTimeinputRef.current &&
                intervalTimeDropRef.current &&
                !intervalTimeinputRef.current.contains(event.target) &&
                !intervalTimeDropRef.current.contains(event.target)
            ) {
                setIntervalTimeDrop(false);
            }
        };

        document.addEventListener('mousedown', handleClickIntervalTimeOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickIntervalTimeOutside);
        };
    }, []);

    const [intervalTimemin, setIntervalTimemin] = useState([])

    const generateTimeIntervalInMinutes = () => {
        const options = []
        for (let i = 1; i <= 60; i++) {
            options.push(i);
        }

        setIntervalTimemin(options)
    }

    useEffect(() => {
        generateTimeIntervalInMinutes()
    }, [])

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const updateSalonAppointment = () => {
        const appointmentdata = {
            salonId,
            appointmentSettings: {
                startTime,
                endTime,
                intervalInMinutes: intervalTime
            }
        }

        console.log(appointmentdata)

        dispatch(adminUpdateSalonSettingsAction(appointmentdata, navigate))
    }

    const adminUpdateSalonSettings = useSelector(state => state.adminUpdateSalonSettings)

    const {
        loading: adminUpdateSalonSettingsLoading,
    } = adminUpdateSalonSettings

    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"

    return (
        <div className={`salon_appointment_wrapper ${darkmodeOn && "dark"}`}>
            <p>Salon Appointment Settings</p>

            <div className={`salon_appointment_content ${darkmodeOn && "dark"}`}>
                <div>
                    <div>
                        <p>Start Time</p>
                        <input
                            type="text"
                            value={`${startTime ? `${startTime} hr` : ''}`}
                            onClick={() => startTimeDropHandler()}
                            ref={startTimeinputRef}
                        />

                        {startTimeDrop && <div ref={startTimeDropRef}>
                            {timeOptions.map((option) => (
                                <p key={option} value={option} onClick={() => setStartTimeHandler(option?.value)}>
                                    {option?.value} hr
                                </p>
                            ))}
                        </div>}
                    </div>

                    <div>
                        <p>End Time</p>
                        <input
                            type="text"
                            value={`${endTime ? `${endTime} hr` : ''}`}
                            onClick={() => endTimeDropHandler()}
                            ref={endTimeinputRef}
                        />

                        {endTimeDrop && <div ref={endTimeDropRef}>
                            {timeOptions.map((option) => (
                                <p key={option} value={option} onClick={() => setEndTimeHandler(option?.value)}>
                                    {option?.value} hr
                                </p>
                            ))}
                        </div>}
                    </div>

                    <div>
                        <p>Intvl Tm</p>
                        <input
                            type="text"
                            value={`${intervalTime ? `${intervalTime} mins` : ''}`}
                            onClick={() => intervalTimeDropHandler()}
                            ref={intervalTimeinputRef}
                        />

                        {intervalTimeDrop && <div ref={intervalTimeDropRef}>
                            {intervalTimemin.map((option) => (
                                <p key={option} value={option} onClick={() => setIntervalTimeHandler(option)}>
                                    {option} mins
                                </p>
                            ))}
                        </div>}
                    </div>


                    <div>
                        {
                            adminUpdateSalonSettingsLoading ? <button style={{
                                display: "grid",
                                placeItems: "center"
                            }}><ButtonLoader /></button> : <button onClick={updateSalonAppointment}>Update</button>
                        }

                    </div>
                </div>

                <div>
                    <img src="/passwordReset_img.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default SalonAppointmentSettings