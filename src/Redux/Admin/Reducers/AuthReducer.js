import { ADMIN_GOOGLE_SIGNIN_FAIL, ADMIN_GOOGLE_SIGNIN_REQ, ADMIN_GOOGLE_SIGNIN_SUCCESS, ADMIN_GOOGLE_SIGNUP_FAIL, ADMIN_GOOGLE_SIGNUP_REQ, ADMIN_GOOGLE_SIGNUP_SUCCESS, ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS, ADMIN_LOGOUT_FAIL, ADMIN_LOGOUT_REQ, ADMIN_LOGOUT_SUCCESS, ADMIN_SIGNIN_FAIL, ADMIN_SIGNIN_REQ, ADMIN_SIGNIN_SUCCESS, ADMIN_SIGNUP_EDIT_FAIL, ADMIN_SIGNUP_EDIT_REQ, ADMIN_SIGNUP_EDIT_SUCCESS, ADMIN_SIGNUP_FAIL, ADMIN_SIGNUP_REQ, ADMIN_SIGNUP_SUCCESS } from "../Constants/constants";

export const AdminLoggedInMiddlewareReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS:
            return {
                ...state,
                loading: false,
                adminSalonId: Number(action.payload.user[0].salonId),
                adminEmail: action.payload.user[0].email,
                adminName: action.payload.user[0].name,
                entiredata: action.payload
            };
        default:
            return state;
    }
};


export const AdminGoogleLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GOOGLE_SIGNIN_REQ:
            return { ...state, loading: true };
        case ADMIN_GOOGLE_SIGNIN_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case ADMIN_GOOGLE_SIGNIN_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const AdminGoogleSignupReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GOOGLE_SIGNUP_REQ:
            return { ...state, loading: true };
        case ADMIN_GOOGLE_SIGNUP_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case ADMIN_GOOGLE_SIGNUP_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export const AdminSignupReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_SIGNUP_REQ:
            return { ...state, loading: true };
        case ADMIN_SIGNUP_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case ADMIN_SIGNUP_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}


export const AdminSigninReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_SIGNIN_REQ:
            return { ...state, loading: true };
        case ADMIN_SIGNIN_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case ADMIN_SIGNIN_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}


export const AdminSignupEditReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_SIGNUP_EDIT_REQ:
            return { ...state, loading: true };
        case ADMIN_SIGNUP_EDIT_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case ADMIN_SIGNUP_EDIT_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}


export const AdminLogoutReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_LOGOUT_REQ:
            return { ...state, loading: true };
        case ADMIN_LOGOUT_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case ADMIN_LOGOUT_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};