import { ADMIN_FORGET_PASSWORD_FAIL, ADMIN_FORGET_PASSWORD_REQ, ADMIN_FORGET_PASSWORD_SUCCESS, ADMIN_RESET_PASSWORD_FAIL, ADMIN_RESET_PASSWORD_REQ, ADMIN_RESET_PASSWORD_SUCCESS } from "../Constants/constants";

export const adminForgetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_FORGET_PASSWORD_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_FORGET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_FORGET_PASSWORD_FAIL:
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

export const adminResetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_RESET_PASSWORD_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_RESET_PASSWORD_FAIL:
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