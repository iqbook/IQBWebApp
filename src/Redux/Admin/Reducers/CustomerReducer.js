import { GET_ALL_CUSTOMERLIST_FAIL, GET_ALL_CUSTOMERLIST_REQ, GET_ALL_CUSTOMERLIST_SUCCESS } from "../Constants/constants";

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