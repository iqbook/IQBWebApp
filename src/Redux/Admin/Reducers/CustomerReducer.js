import { ADMIN_SEND_CUSTOMER_NOTIFICATION_FAIL, ADMIN_SEND_CUSTOMER_NOTIFICATION_REQ, ADMIN_SEND_CUSTOMER_NOTIFICATION_SUCCESS, GET_ALL_CUSTOMERLIST_FAIL, GET_ALL_CUSTOMERLIST_REQ, GET_ALL_CUSTOMERLIST_SUCCESS } from "../Constants/constants";

export const adminGetAllCustomerListReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_CUSTOMERLIST_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_ALL_CUSTOMERLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case GET_ALL_CUSTOMERLIST_FAIL:
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

export const adminSendCustomerNotificationReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_SEND_CUSTOMER_NOTIFICATION_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_SEND_CUSTOMER_NOTIFICATION_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_SEND_CUSTOMER_NOTIFICATION_FAIL:
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