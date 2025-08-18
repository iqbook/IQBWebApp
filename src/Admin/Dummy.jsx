import React, { useEffect, useState } from 'react'
import style from './Dummy.module.css'
import Calendar from 'react-calendar'
import { useSelector } from 'react-redux'

const Dummy = () => {

    const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

    const {
        response: adminGetDefaultSalonResponse
    } = adminGetDefaultSalon

    const [getMinDate, setGetMinDate] = useState("")
    const [getMaxDate, setGetMaxDate] = useState("")

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

            };

            calculateDates();
        }

    }, [adminGetDefaultSalonResponse]);

    const salonDayOffDays = ["2025-01-29", "2025-01-30", "2025-01-31"]

    return (
        <div>
            <Calendar
                minDate={getMinDate}
                maxDate={getMaxDate}

                // tileDisabled={({ date }) =>
                //     salonDayOffDays.includes(date.toISOString().split('T')[0])
                // }
                tileClassName={({ date }) =>
                    salonDayOffDays.includes(date.toISOString().split('T')[0])
                        ? style.disabledDay
                        : ''
                }
            />
        </div>
    )
}

export default Dummy