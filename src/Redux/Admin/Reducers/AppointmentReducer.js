import { GET_APPOINTMENT_HISTORY_FAIL, GET_APPOINTMENT_HISTORY_REQ, GET_APPOINTMENT_HISTORY_SUCCESS } from "../Constants/constants";

export const getAdminAppointmentHistoryReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_APPOINTMENT_HISTORY_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_APPOINTMENT_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                appointmentHistory: action.payload.response
            };
        case GET_APPOINTMENT_HISTORY_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload
            };
        default:
            return state;
    }
}