import toast from "react-hot-toast";
import { GET_APPOINTMENT_HISTORY_FAIL, GET_APPOINTMENT_HISTORY_REQ, GET_APPOINTMENT_HISTORY_SUCCESS } from "../Constants/constants";
import api from "../../api/Api";

export const getAdminAppointmentHistoryAction = (salonId, startDate, endDate, barberId, customerEmail, signal) => async (dispatch) => {
    try {
        dispatch({ type: GET_APPOINTMENT_HISTORY_REQ })

        const { data } = await api.post("/api/appointmentHistory/getAppointmentHistoryBySalonId", {
            salonId,
            from: startDate,
            to: endDate,
            barberId: barberId,
            customerEmail: customerEmail
        }, { signal })

        dispatch({
            type: GET_APPOINTMENT_HISTORY_SUCCESS,
            payload: data
        })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: GET_APPOINTMENT_HISTORY_FAIL,
                payload: "Something went wrong !"
            });

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

        if (error.name !== 'CanceledError') {
            dispatch({
                type: GET_APPOINTMENT_HISTORY_FAIL,
                payload: error?.response?.data
            });
        }
    }

}