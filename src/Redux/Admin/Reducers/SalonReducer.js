import { ADMIN_CREATE_SALON_FAIL, ADMIN_CREATE_SALON_REQ, ADMIN_CREATE_SALON_SUCCESS, ADMIN_DELETE_SALON_FAIL, ADMIN_DELETE_SALON_REQ, ADMIN_DELETE_SALON_SUCCESS, ADMIN_EDIT_SALON_FAIL, ADMIN_EDIT_SALON_REQ, ADMIN_EDIT_SALON_SUCCESS, ADMIN_GETALLSALON_ICONS_FAIL, ADMIN_GETALLSALON_ICONS_REQ, ADMIN_GETALLSALON_ICONS_SUCCESS, ADMIN_GET_ALL_CITIES_FAIL, ADMIN_GET_ALL_CITIES_REQ, ADMIN_GET_ALL_CITIES_SUCCESS, ADMIN_GET_ALL_COUNTRIES_FAIL, ADMIN_GET_ALL_COUNTRIES_REQ, ADMIN_GET_ALL_COUNTRIES_SUCCESS, ADMIN_GET_ALL_TIMEZONES_FAIL, ADMIN_GET_ALL_TIMEZONES_REQ, ADMIN_GET_ALL_TIMEZONES_SUCCESS, ADMIN_GET_SALON_IMAGES_FAIL, ADMIN_GET_SALON_IMAGES_REQ, ADMIN_GET_SALON_IMAGES_SUCCESS, ADMIN_GET_SALON_LOGO_FAIL, ADMIN_GET_SALON_LOGO_REQ, ADMIN_GET_SALON_LOGO_SUCCESS, ADMIN_UPDATE_SALON_SETTINGS_FAIL, ADMIN_UPDATE_SALON_SETTINGS_REQ, ADMIN_UPDATE_SALON_SETTINGS_SUCCESS, GET_ADMIN_SALONLIST_FAIL, GET_ADMIN_SALONLIST_REQ, GET_ADMIN_SALONLIST_SUCCESS, GET_ALL_SALON_CATEGORIES_FAIL, GET_ALL_SALON_CATEGORIES_REQ, GET_ALL_SALON_CATEGORIES_SUCCESS } from "../Constants/constants";

export const getAdminSalonListReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ADMIN_SALONLIST_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_ADMIN_SALONLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case GET_ADMIN_SALONLIST_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload
            };
        case "FILTER_SALONLIST":

            const filteredSalons = state.salons.filter((b) => b._id !== action.payload);

            return {
                ...state,
                salons: filteredSalons
            };
        default:
            return state;
    }
}

export const getAdminAllSalonIconReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GETALLSALON_ICONS_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_GETALLSALON_ICONS_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_GETALLSALON_ICONS_FAIL:
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


const CountryInitialState = {
    loading: false,
    resolve: false,
    response: {},
    error: {}
};

export const getAdminAllCountriesReducer = (state = CountryInitialState, action) => {
    switch (action.type) {
        case ADMIN_GET_ALL_COUNTRIES_REQ:
            return {
                ...state,
                loading: true,
                resolve: false,
                error: {}, // Reset error when a new request is initiated,
                response: {}
            };

        case ADMIN_GET_ALL_COUNTRIES_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                response: action.payload?.response || {}, // Safely access payload properties
                error: {} // Clear any previous errors on success
            };

        case ADMIN_GET_ALL_COUNTRIES_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload, // Handle error appropriately
                response: {}
            };

        default:
            return state;
    }
};



const CityInitialState = {
    loading: false,
    resolve: false,
    response: {},
    error: {}
};

export const getAdminAllCitiesReducer = (state = CityInitialState, action) => {
    switch (action.type) {
        case ADMIN_GET_ALL_CITIES_REQ:
            return {
                ...state,
                loading: true,
                resolve: false,
                error: {}, // Reset error when a new request is initiated,
                response: {}
            };

        case ADMIN_GET_ALL_CITIES_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                response: action.payload?.response || {}, // Safely access payload properties
                error: {} // Clear any previous errors on success
            };

        case ADMIN_GET_ALL_CITIES_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload, // Handle error appropriately
                response: {}
            };

        default:
            return state;
    }
};


// export const getAdminAllCitiesReducer = (state = {}, action) => {
//     switch (action.type) {
//         case ADMIN_GET_ALL_CITIES_REQ:
//             return {
//                 ...state,
//                 loading: true,
//                 resolve: false
//             };
//         case ADMIN_GET_ALL_CITIES_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 resolve: true,
//                 ...action.payload
//             };
//         case ADMIN_GET_ALL_CITIES_FAIL:
//             return {
//                 ...state,
//                 loading: false,
//                 resolve: false,
//                 error: action.payload
//             };
//         default:
//             return state;
//     }
// }

export const getAdminAllTimezoneReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GET_ALL_TIMEZONES_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_GET_ALL_TIMEZONES_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_GET_ALL_TIMEZONES_FAIL:
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

export const adminDeleteSalonReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_DELETE_SALON_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_DELETE_SALON_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_DELETE_SALON_FAIL:
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

export const adminCreateSalonReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_CREATE_SALON_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_CREATE_SALON_SUCCESS:
            return {
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_CREATE_SALON_FAIL:
            return {
                ...state,
                loading: false,
                resolve: false,
                error: action.payload
            };
        case "ADMIN_RESET_SALON":
                return {};
        default:
            return state;
    }
}

export const adminEditSalonReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_EDIT_SALON_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_EDIT_SALON_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_EDIT_SALON_FAIL:
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

export const adminUpdateSalonSettingsReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_UPDATE_SALON_SETTINGS_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_UPDATE_SALON_SETTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_UPDATE_SALON_SETTINGS_FAIL:
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


export const getAdminSalonImagesReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GET_SALON_IMAGES_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_GET_SALON_IMAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_GET_SALON_IMAGES_FAIL:
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

export const getAdminSalonLogoReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GET_SALON_LOGO_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case ADMIN_GET_SALON_LOGO_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case ADMIN_GET_SALON_LOGO_FAIL:
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

export const getAllSalonCategoriesReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_SALON_CATEGORIES_REQ:
            return {
                ...state,
                loading: true,
                resolve: false
            };
        case GET_ALL_SALON_CATEGORIES_SUCCESS:
            return {
                ...state,
                loading: false,
                resolve: true,
                ...action.payload
            };
        case GET_ALL_SALON_CATEGORIES_FAIL:
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