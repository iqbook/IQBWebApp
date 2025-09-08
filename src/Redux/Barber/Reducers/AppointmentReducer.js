import { CANCEL_APPOINT_FAIL, CANCEL_APPOINT_REQ, CANCEL_APPOINT_SUCCESS, GET_APPOINTMENT_HISTORY_FAIL, GET_APPOINTMENT_HISTORY_REQ, GET_APPOINTMENT_HISTORY_SUCCESS, GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_FAIL, GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_REQ, GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_SUCCESS, GET_BARBER_APPOINT_LIST_FAIL, GET_BARBER_APPOINT_LIST_REQ, GET_BARBER_APPOINT_LIST_SUCCESS, SERVE_APPOINT_FAIL, SERVE_APPOINT_REQ, SERVE_APPOINT_SUCCESS } from "../Constants/constants";

export const AppointmentReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_BARBER_APPOINT_LIST_REQ:
            return { ...state, loading: true };
        case GET_BARBER_APPOINT_LIST_SUCCESS:
            return { ...state, loading: false, response: action.payload.response, error: null };
        case GET_BARBER_APPOINT_LIST_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const CancelAppointmentReducer = (state = {}, action) => {
    switch (action.type) {
        case CANCEL_APPOINT_REQ:
            return { ...state, loading: true };
        case CANCEL_APPOINT_SUCCESS:
            return { ...state, loading: false, response: action.payload.response, error: null };
        case CANCEL_APPOINT_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


export const ServeAppointmentReducer = (state = {}, action) => {
    switch (action.type) {
        case SERVE_APPOINT_REQ:
            return { ...state, loading: true };
        case SERVE_APPOINT_SUCCESS:
            return { ...state, loading: false, response: action.payload, error: null };
        case SERVE_APPOINT_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const getBarberAppointmentHistoryReducer = (state = {}, action) => {
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


export const AppointmentListBarberReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_REQ:
            return { ...state, loading: true };
        case GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_SUCCESS:
            return { ...state, loading: false, response: action.payload.response, error: null };
        case GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};