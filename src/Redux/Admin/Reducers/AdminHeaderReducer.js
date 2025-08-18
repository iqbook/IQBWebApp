import { ADMIN_APPLY_SALON_FAIL, ADMIN_APPLY_SALON_REQ, ADMIN_APPLY_SALON_SUCCESS, ADMIN_GET_DEFAULT_SALON_FAIL, ADMIN_GET_DEFAULT_SALON_REQ, ADMIN_GET_DEFAULT_SALON_SUCCESS, DARK_MODE_OFF, DARK_MODE_ON } from "../Constants/constants";

export const adminApplySalonReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_APPLY_SALON_REQ:
            return {
                ...state,
                resolve: false,
                loading: true
            };
        case ADMIN_APPLY_SALON_SUCCESS:
            return {
                ...state,
                resolve: true,
                loading: false,
                ...action.payload
            };
        case ADMIN_APPLY_SALON_FAIL:
            return {
                ...state,
                resolve: false,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const adminGetDefaultSalonReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GET_DEFAULT_SALON_REQ:
            return {
                ...state,
                resolve: false,
                loading: true
            };
        case ADMIN_GET_DEFAULT_SALON_SUCCESS:
            return {
                ...state,
                resolve: true,
                loading: false,
                ...action.payload
            };
        case ADMIN_GET_DEFAULT_SALON_FAIL:
            return {
                ...state,
                resolve: false,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};


const initialState = {
    darkmode: localStorage.getItem("dark") || "Off"
}

export const colorReducer = (state = initialState, action) => {
    switch (action.type) {
        case DARK_MODE_ON:
            return { ...state, darkmode: "On" };
        case DARK_MODE_OFF:
            return { ...state, darkmode: "Off" };
        default:
            return state;
    }
}


export const darkmodeSelector = (state) => state.color.darkmode

// export const adminSetSalonNameReducer = (state = "", action) => {
//     switch (action.type) {
//         case "ADMIN_SET_SALON_NAME":
//             return action.payload;
//         default:
//             return state;
//     }
// };

// export const adminSetSalonNameSalonIdReducer = (state = "", action) => {
//     switch (action.type) {
//         case "ADMIN_SET_SALON_NAME_SALON_ID":
//             return action.payload;
//         default:
//             return state;
//     }
// };

export const adminSetSalonReducer = (state = {
    currentActiveSalon: "",
    chooseSalonId: ""
}, action) => {
    switch (action.type) {
        case "ADMIN_SET_SALON":
            return {
                currentActiveSalon: action.payload.currentActiveSalon,
                chooseSalonId: action.payload.chooseSalonId
            };
        default:
            return state;
    }
};