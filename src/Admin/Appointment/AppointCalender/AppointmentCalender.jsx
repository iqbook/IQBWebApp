import React, { useEffect, useRef, useState } from 'react'
import style from './AppointmentCalender.module.css'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useSelector } from 'react-redux';
import api from "../../../Redux/api/Api"
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer';
import { Link, useNavigate } from 'react-router-dom';

const AppointmentCalender = () => {

    const navigate = useNavigate()

    const handleDateSelect = (selectInfo) => {

        navigate("/admin-appointments-list", { state: selectInfo.dateStr })
        // console.log(selectInfo.dateStr); // Log the selected date's start date
    };

    const [appointmentData, setAppointmentData] = useState([])

    const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

    const AppointmentRef = useRef(null);

    useEffect(() => {

        if (AppointmentRef.current) {
            AppointmentRef.current.abort(); // Abort previous request if it exists
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


    return (
        <section className={`${style.section}`}>

            <div className={`${style.list_container}`}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView='dayGridMonth'
                    weekends={true}
                    dateClick={handleDateSelect}
                    events={appointmentData?.map((e) => (
                        {
                            title: `${e.barberName} - ${e.customerName}`, date: e.appointmentDate
                        }
                    ))}
                    dayMaxEvents={true}
                />
            </div>
        </section>
    )
}

export default AppointmentCalender