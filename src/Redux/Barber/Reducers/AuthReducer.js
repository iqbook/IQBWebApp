import { BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS, BARBER_GOOGLE_SIGNIN_REQ, BARBER_GOOGLE_SIGNIN_SUCCESS, BARBER_GOOGLE_SIGNIN_FAIL, BARBER_SIGNIN_REQ, BARBER_SIGNIN_SUCCESS, BARBER_SIGNIN_FAIL, BARBER_SIGNUP_REQ, BARBER_SIGNUP_SUCCESS, BARBER_SIGNUP_FAIL, BARBER_SIGNUP_EDIT_REQ, BARBER_SIGNUP_EDIT_SUCCESS, BARBER_SIGNUP_EDIT_FAIL, BARBER_LOGOUT_SUCCESS, BARBER_LOGOUT_FAIL, BARBER_LOGOUT_REQ, BARBER_GOOGLE_SIGNUP_REQ, BARBER_GOOGLE_SIGNUP_SUCCESS, BARBER_GOOGLE_SIGNUP_FAIL } from "../Constants/constants";

export const BarberLoggedInMiddlewareReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS:
            return {
                ...state,
                loading: false,
                barberSalonId: Number(action?.payload?.user[0]?.salonId),
                barberId: Number(action?.payload?.user[0]?.barberId),
                barberEmail: action?.payload?.user[0]?.email,
                barberName: action?.payload?.user[0]?.name,
                entiredata: action?.payload
            };
        default:
            return state;
    }
};

export const BarberGoogleLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_GOOGLE_SIGNIN_REQ:
            return { ...state, loading: true };
        case BARBER_GOOGLE_SIGNIN_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case BARBER_GOOGLE_SIGNIN_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const BarberGoogleSignupReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_GOOGLE_SIGNUP_REQ:
            return { ...state, loading: true };
        case BARBER_GOOGLE_SIGNUP_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case BARBER_GOOGLE_SIGNUP_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const BarberSigninReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_SIGNIN_REQ:
            return { ...state, loading: true };
        case BARBER_SIGNIN_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case BARBER_SIGNIN_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export const BarberSignupReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_SIGNUP_REQ:
            return { ...state, loading: true };
        case BARBER_SIGNUP_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case BARBER_SIGNUP_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export const BarberSignupEditReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_SIGNUP_EDIT_REQ:
            return { ...state, loading: true };
        case BARBER_SIGNUP_EDIT_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case BARBER_SIGNUP_EDIT_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export const BarberLogoutReducer = (state = {}, action) => {
    switch (action.type) {
        case BARBER_LOGOUT_REQ:
            return { ...state, loading: true };
        case BARBER_LOGOUT_SUCCESS:
            return { ...state, loading: false, ...action.payload };
        case BARBER_LOGOUT_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};