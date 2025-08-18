import { BARBER_SEND_CUSTOMER_MAIL_FAIL, BARBER_SEND_CUSTOMER_MAIL_REQ, BARBER_SEND_CUSTOMER_MAIL_SUCCESS, BARBER_SEND_CUSTOMER_MESSAGE_FAIL, BARBER_SEND_CUSTOMER_MESSAGE_REQ, BARBER_SEND_CUSTOMER_MESSAGE_SUCCESS, GET_BARBER_ALL_CUSTOMERLIST_FAIL, GET_BARBER_ALL_CUSTOMERLIST_REQ, GET_BARBER_ALL_CUSTOMERLIST_SUCCESS } from "../Constants/constants";

export const barberGetAllCustomerListReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_BARBER_ALL_CUSTOMERLIST_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_BARBER_ALL_CUSTOMERLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case GET_BARBER_ALL_CUSTOMERLIST_FAIL:
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

export const barberSendCustomerEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_SEND_CUSTOMER_MAIL_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case BARBER_SEND_CUSTOMER_MAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case BARBER_SEND_CUSTOMER_MAIL_FAIL:
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


export const barberSendCustomerMessageReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_SEND_CUSTOMER_MESSAGE_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case BARBER_SEND_CUSTOMER_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case BARBER_SEND_CUSTOMER_MESSAGE_FAIL:
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