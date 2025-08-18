import { BARBER_CONNECT_SALON_FAIL, BARBER_CONNECT_SALON_REQ, BARBER_CONNECT_SALON_SUCCESS, BARBER_DASHBOARD_SALON_INFO_FAIL, BARBER_DASHBOARD_SALON_INFO_REQ, BARBER_DASHBOARD_SALON_INFO_SUCCESS, CHANGE_BARBER_ONLINESTATUS_FAIL, CHANGE_BARBER_ONLINESTATUS_REQ, CHANGE_BARBER_ONLINESTATUS_SUCCESS, CONNECT_SALON_LIST_FAIL, CONNECT_SALON_LIST_REQ, CONNECT_SALON_LIST_SUCCESS, GET_BARBER_SALON_LOGO_FAIL, GET_BARBER_SALON_LOGO_REQ, GET_BARBER_SALON_LOGO_SUCCESS } from "../Constants/constants";

export const connectSalonListReducer = (state = {}, action) => {
    switch (action.type) {
        case CONNECT_SALON_LIST_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case CONNECT_SALON_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case CONNECT_SALON_LIST_FAIL:
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

export const barberConnectSalonReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_CONNECT_SALON_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case BARBER_CONNECT_SALON_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case BARBER_CONNECT_SALON_FAIL:
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

export const barberSalonStatusReducer = (state = {}, action) => {
    switch (action.type) {
        case CHANGE_BARBER_ONLINESTATUS_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case CHANGE_BARBER_ONLINESTATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case CHANGE_BARBER_ONLINESTATUS_FAIL:
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

export const barberGetSalonLogoReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_BARBER_SALON_LOGO_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_BARBER_SALON_LOGO_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case GET_BARBER_SALON_LOGO_FAIL:
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

export const barberDashboardSalonInfoReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_DASHBOARD_SALON_INFO_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case BARBER_DASHBOARD_SALON_INFO_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case BARBER_DASHBOARD_SALON_INFO_FAIL:
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