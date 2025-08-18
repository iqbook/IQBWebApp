import { ADMIN_SEND_VERIFY_EMAIL_FAIL, ADMIN_SEND_VERIFY_EMAIL_REQ, ADMIN_SEND_VERIFY_EMAIL_SUCCESS, ADMIN_SEND_VERIFY_MOBILE_FAIL, ADMIN_SEND_VERIFY_MOBILE_REQ, ADMIN_SEND_VERIFY_MOBILE_SUCCESS, ADMIN_SKIP_PROFILE_FAIL, ADMIN_SKIP_PROFILE_REQ, ADMIN_SKIP_PROFILE_SUCCESS, ADMIN_UPDATE_PASSWORD_FAIL, ADMIN_UPDATE_PASSWORD_REQ, ADMIN_UPDATE_PASSWORD_SUCCESS, ADMIN_UPDATE_PROFILE_FAIL, ADMIN_UPDATE_PROFILE_REQ, ADMIN_UPDATE_PROFILE_SUCCESS, ADMIN_UPLOAD_PROFILE_PIC_FAIL, ADMIN_UPLOAD_PROFILE_PIC_REQ, ADMIN_UPLOAD_PROFILE_PIC_SUCCESS, ADMIN_VERIFIED_EMAIL_STATUS_FAIL, ADMIN_VERIFIED_EMAIL_STATUS_REQ, ADMIN_VERIFIED_EMAIL_STATUS_SUCCESS, ADMIN_VERIFIED_MOBILE_STATUS_FAIL, ADMIN_VERIFIED_MOBILE_STATUS_REQ, ADMIN_VERIFIED_MOBILE_STATUS_SUCCESS } from "../Constants/constants";

export const adminUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_UPDATE_PROFILE_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_UPDATE_PROFILE_FAIL:
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

export const adminSkipProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_SKIP_PROFILE_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_SKIP_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_SKIP_PROFILE_FAIL:
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


export const adminSendVerifyEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_SEND_VERIFY_EMAIL_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_SEND_VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_SEND_VERIFY_EMAIL_FAIL:
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

export const adminSendVerifyMobileReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_SEND_VERIFY_MOBILE_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_SEND_VERIFY_MOBILE_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_SEND_VERIFY_MOBILE_FAIL:
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

export const adminVerifiedEmailStatusReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_VERIFIED_EMAIL_STATUS_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_VERIFIED_EMAIL_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_VERIFIED_EMAIL_STATUS_FAIL:
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


export const adminVerifiedMobileStatusReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_VERIFIED_MOBILE_STATUS_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_VERIFIED_MOBILE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_VERIFIED_MOBILE_STATUS_FAIL:
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


export const adminUploadProfilePicReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_UPLOAD_PROFILE_PIC_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_UPLOAD_PROFILE_PIC_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_UPLOAD_PROFILE_PIC_FAIL:
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


export const adminUpdatePasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_UPDATE_PASSWORD_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_UPDATE_PASSWORD_FAIL:
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