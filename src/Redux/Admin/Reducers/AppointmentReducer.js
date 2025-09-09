import { CLEAR_ALL_APPOINTMENTSLIST, GET_ALL_APPOINTMENTSLIST_FAIL, GET_ALL_APPOINTMENTSLIST_REQ, GET_ALL_APPOINTMENTSLIST_SUCCESS, GET_APPOINTMENT_HISTORY_FAIL, GET_APPOINTMENT_HISTORY_REQ, GET_APPOINTMENT_HISTORY_SUCCESS, GET_APPOINTMENTSLIST_BY_BARBERNAME } from "../Constants/constants";

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


const initialState = {
    loading: false,
    resolve: false,
    response: null,
    allAppointments: null,
    error: null,
};

export const getAdminAppointmentListSalonIdReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_APPOINTMENTSLIST_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_ALL_APPOINTMENTSLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                response: action.payload.response,
                allAppointments: action.payload.response,
            };
        case GET_ALL_APPOINTMENTSLIST_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload
            };

        case GET_APPOINTMENTSLIST_BY_BARBERNAME:
            const barbername = action.payload.trim().toLowerCase();

            if (!state.allAppointments) {
                return state;
            }

            if (!barbername) {
                return {
                    ...state,
                    response: [...state.allAppointments],
                };
            }

            const filteredAppointments = state.allAppointments.filter(
                (appointment) =>
                    appointment.barbername &&
                    appointment.barbername.toLowerCase().includes(barbername)
            );

            return {
                ...state,
                response: filteredAppointments
            };

        case CLEAR_ALL_APPOINTMENTSLIST:
            return initialState; // This is the corrected line

        default:
            return state;
    }
};