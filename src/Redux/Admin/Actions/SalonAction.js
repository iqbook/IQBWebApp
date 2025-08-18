import toast from "react-hot-toast";
import api from "../../api/Api";
import { ADMIN_CREATE_SALON_FAIL, ADMIN_CREATE_SALON_REQ, ADMIN_CREATE_SALON_SUCCESS, ADMIN_DELETE_SALON_FAIL, ADMIN_DELETE_SALON_REQ, ADMIN_DELETE_SALON_SUCCESS, ADMIN_EDIT_SALON_FAIL, ADMIN_EDIT_SALON_REQ, ADMIN_EDIT_SALON_SUCCESS, ADMIN_GETALLSALON_ICONS_FAIL, ADMIN_GETALLSALON_ICONS_REQ, ADMIN_GETALLSALON_ICONS_SUCCESS, ADMIN_GET_ALL_CITIES_FAIL, ADMIN_GET_ALL_CITIES_REQ, ADMIN_GET_ALL_CITIES_SUCCESS, ADMIN_GET_ALL_COUNTRIES_FAIL, ADMIN_GET_ALL_COUNTRIES_REQ, ADMIN_GET_ALL_COUNTRIES_SUCCESS, ADMIN_GET_ALL_TIMEZONES_FAIL, ADMIN_GET_ALL_TIMEZONES_REQ, ADMIN_GET_ALL_TIMEZONES_SUCCESS, ADMIN_GET_DEFAULT_SALON_SUCCESS, ADMIN_GET_SALON_IMAGES_FAIL, ADMIN_GET_SALON_IMAGES_REQ, ADMIN_GET_SALON_IMAGES_SUCCESS, ADMIN_GET_SALON_LOGO_FAIL, ADMIN_GET_SALON_LOGO_REQ, ADMIN_GET_SALON_LOGO_SUCCESS, ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS, ADMIN_UPDATE_SALON_SETTINGS_FAIL, ADMIN_UPDATE_SALON_SETTINGS_REQ, ADMIN_UPDATE_SALON_SETTINGS_SUCCESS, GET_ADMIN_SALONLIST_FAIL, GET_ADMIN_SALONLIST_REQ, GET_ADMIN_SALONLIST_SUCCESS, GET_ALL_SALON_CATEGORIES_FAIL, GET_ALL_SALON_CATEGORIES_REQ, GET_ALL_SALON_CATEGORIES_SUCCESS } from "../Constants/constants"

export const getAdminSalonListAction = (email, signal) => async (dispatch) => {
    try {
        dispatch({ type: GET_ADMIN_SALONLIST_REQ })

        const { data } = await api.post(`/api/admin/getAllSalonsByAdmin`, {
            adminEmail: email
        }, { signal })

        dispatch({
            type: GET_ADMIN_SALONLIST_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: GET_ADMIN_SALONLIST_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        if (error.name !== 'CanceledError') {
            dispatch({
                type: GET_ADMIN_SALONLIST_FAIL,
                payload: error?.response?.data
            });
        }

    }
}

export const getAdminAllSalonIconAction = (signal) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_GETALLSALON_ICONS_REQ })

        const { data } = await api.get(`/api/icons/getAllIcons`, { signal })

        dispatch({
            type: ADMIN_GETALLSALON_ICONS_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_GETALLSALON_ICONS_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        if (error.name !== 'CanceledError') {
            dispatch({
                type: ADMIN_GETALLSALON_ICONS_FAIL,
                payload: error?.response?.data
            });

            toast.error(error?.response?.data?.message, {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

    }
}

export const getAdminAllCountriesAction = (countryname) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_GET_ALL_COUNTRIES_REQ })

        const { data } = await api.post(`/api/country/getAllCountries?name=${countryname}`)

        dispatch({
            type: ADMIN_GET_ALL_COUNTRIES_SUCCESS,
            payload: data
        })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_GET_ALL_COUNTRIES_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        dispatch({
            type: ADMIN_GET_ALL_COUNTRIES_FAIL,
            payload: error?.response?.data
        });
    }
}

export const getAdminAllCitiesAction = (cityname, countrycode) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_GET_ALL_CITIES_REQ })

        const { data } = await api.post(`/api/country/getAllCities?countryCode=${countrycode}&cityName=${cityname}`)

        dispatch({
            type: ADMIN_GET_ALL_CITIES_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_GET_ALL_CITIES_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }


        dispatch({
            type: ADMIN_GET_ALL_CITIES_FAIL,
            payload: error?.response?.data
        });

    }
}

export const getAdminAllTimezoneAction = (countrycode) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_GET_ALL_TIMEZONES_REQ })

        const { data } = await api.post(`/api/country/getAllTimeZones?countryCode=${countrycode}`)

        dispatch({
            type: ADMIN_GET_ALL_TIMEZONES_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_GET_ALL_TIMEZONES_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        dispatch({
            type: ADMIN_GET_ALL_TIMEZONES_FAIL,
            payload: error?.response?.data
        });

        toast.error(error?.response?.data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });
    }
}

export const adminDeleteSalonAction = (salonId, salonmongoid) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_DELETE_SALON_REQ })

        const { data } = await api.post(`/api/salon/deleteSalon`, { salonId: salonId })

        dispatch({
            type: ADMIN_DELETE_SALON_SUCCESS,
            payload: data
        })

        dispatch({
            type: "FILTER_SALONLIST",
            payload: salonmongoid
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_DELETE_SALON_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        dispatch({
            type: ADMIN_DELETE_SALON_FAIL,
            payload: error?.response?.data
        });

        toast.error(error?.response?.data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });
    }
}

export const adminCreateSalonAction = (salondata, navigate) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_CREATE_SALON_REQ })

        const { data } = await api.post("/api/salon/createSalonByAdmin", salondata)

        dispatch({
            type: ADMIN_CREATE_SALON_SUCCESS,
            payload: data
        })

        dispatch({
            type: "ADMIN_SET_SALON",
            payload: {
                currentActiveSalon: data?.response?.salonName,
                chooseSalonId: data?.response?.salonId

            }
        })

        const { data: adminloggedindata } = await api.get('/api/admin/adminloggedin');

        dispatch({
            type: ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: adminloggedindata
        })

        localStorage.setItem("salondata", JSON.stringify({}))

        navigate("/admin-salon")

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_CREATE_SALON_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        dispatch({
            type: ADMIN_CREATE_SALON_FAIL,
            payload: error?.response?.data
        });

        toast.error(error?.response?.data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });
    }
}


export const adminEditSalonAction = (salondata, navigate, email) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_EDIT_SALON_REQ })

        const { data } = await api.put("/api/salon/updateSalonBySalonIdAndAdminEmail", salondata)

        dispatch({
            type: ADMIN_EDIT_SALON_SUCCESS,
            payload: data
        })

        const { data: getDefaultSalonData } = await api.post(`/api/admin/getDefaultSalonByAdmin`, {
            adminEmail: email
        })

        dispatch({
            type: ADMIN_GET_DEFAULT_SALON_SUCCESS,
            payload: getDefaultSalonData
        })

        navigate("/admin-salon")

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_EDIT_SALON_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        dispatch({
            type: ADMIN_EDIT_SALON_FAIL,
            payload: error?.response?.data
        });

        toast.error(error?.response?.data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });
    }
}

export const adminUpdateSalonSettingsAction = (appointmentdata, setOpenSalonSettings, email) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_UPDATE_SALON_SETTINGS_REQ })

        const { data } = await api.put("/api/salonSettings/updateSalonSettings", appointmentdata)

        dispatch({
            type: ADMIN_UPDATE_SALON_SETTINGS_SUCCESS,
            payload: data
        })

        setOpenSalonSettings(false)

        const { data: salonlist_data } = await api.post(`/api/admin/getAllSalonsByAdmin`, {
            adminEmail: email
        })

        dispatch({
            type: GET_ADMIN_SALONLIST_SUCCESS,
            payload: salonlist_data
        })


        const { data: defaultsalondata } = await api.post(`/api/admin/getDefaultSalonByAdmin`, {
            adminEmail: email
        })

        dispatch({
            type: ADMIN_GET_DEFAULT_SALON_SUCCESS,
            payload: defaultsalondata
        })

        dispatch({
            type: "ADMIN_SET_SALON",
            payload: {
                currentActiveSalon: defaultsalondata?.response?.salonName,
                chooseSalonId: defaultsalondata?.response?.salonId
            }
        })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_UPDATE_SALON_SETTINGS_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        dispatch({
            type: ADMIN_UPDATE_SALON_SETTINGS_FAIL,
            payload: error?.response?.data
        });

        toast.error(error?.response?.data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });
    }
}

export const getAdminSalonImagesAction = (salonId) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_GET_SALON_IMAGES_REQ })

        const { data } = await api.post(`/api/salon/getSalonImages`, {
            salonId
        })

        dispatch({
            type: ADMIN_GET_SALON_IMAGES_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_GET_SALON_IMAGES_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }

        if (error.name !== 'CanceledError') {
            dispatch({
                type: ADMIN_GET_SALON_IMAGES_FAIL,
                payload: error?.response?.data
            });

            toast.error(error?.response?.data?.message, {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

    }
}

export const getAdminSalonLogoAction = (salonId) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_GET_SALON_LOGO_REQ })

        const { data } = await api.post(`/api/salon/getSalonLogo`, {
            salonId
        })

        dispatch({
            type: ADMIN_GET_SALON_LOGO_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_GET_SALON_LOGO_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }


        if (error.name !== 'CanceledError') {
            dispatch({
                type: ADMIN_GET_SALON_LOGO_FAIL,
                payload: error?.response?.data
            });

            toast.error(error?.response?.data?.message, {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

    }
}


export const getAllSalonCategoriesAction = (signal) => async (dispatch) => {
    try {
        dispatch({ type: GET_ALL_SALON_CATEGORIES_REQ })

        const { data } = await api.get(`/api/salon/getAllCategories`, { signal })

        dispatch({
            type: GET_ALL_SALON_CATEGORIES_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: GET_ALL_SALON_CATEGORIES_FAIL,
                payload: "Something went wrong !"
            });

            toast.error("Something went wrong !", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });

            return;
        }


        if (error.name !== 'CanceledError') {
            dispatch({
                type: GET_ALL_SALON_CATEGORIES_FAIL,
                payload: error?.response?.data
            });

            toast.error(error?.response?.data?.message, {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

    }
}