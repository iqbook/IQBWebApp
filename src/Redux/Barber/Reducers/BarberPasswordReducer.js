import { BARBER_FORGET_PASSWORD_FAIL, BARBER_FORGET_PASSWORD_REQ, BARBER_FORGET_PASSWORD_SUCCESS, BARBER_RESET_PASSWORD_FAIL, BARBER_RESET_PASSWORD_REQ, BARBER_RESET_PASSWORD_SUCCESS } from "../Constants/constants";

export const barberForgetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_FORGET_PASSWORD_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case BARBER_FORGET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case BARBER_FORGET_PASSWORD_FAIL:
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

export const barberResetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_RESET_PASSWORD_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case BARBER_RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case BARBER_RESET_PASSWORD_FAIL:
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