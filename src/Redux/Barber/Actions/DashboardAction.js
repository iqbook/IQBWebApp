import toast from "react-hot-toast";
import { BARBER_CONNECT_SALON_FAIL, BARBER_CONNECT_SALON_REQ, BARBER_CONNECT_SALON_SUCCESS, BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS, CHANGE_BARBER_ONLINESTATUS_FAIL, CHANGE_BARBER_ONLINESTATUS_REQ, CHANGE_BARBER_ONLINESTATUS_SUCCESS, CONNECT_SALON_LIST_FAIL, CONNECT_SALON_LIST_REQ, CONNECT_SALON_LIST_SUCCESS, GET_BARBER_SALON_LOGO_FAIL, GET_BARBER_SALON_LOGO_REQ, GET_BARBER_SALON_LOGO_SUCCESS, BARBER_DASHBOARD_SALON_INFO_FAIL, BARBER_DASHBOARD_SALON_INFO_SUCCESS, BARBER_DASHBOARD_SALON_INFO_REQ } from "../Constants/constants";
import api from "../../api/Api";

export const connectSalonListAction = () => async (dispatch) => {
    try {
        dispatch({ type: CONNECT_SALON_LIST_REQ })

        const { data } = await api.get(`/api/barber/getAllSalons`)

        dispatch({
            type: CONNECT_SALON_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: CONNECT_SALON_LIST_FAIL,
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
                type: CONNECT_SALON_LIST_FAIL,
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

export const barberConnectSalonAction = (connectsalondata) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_CONNECT_SALON_REQ })

        const { data } = await api.post(`/api/barber/connectBarberToSalon`, connectsalondata)

        dispatch({
            type: BARBER_CONNECT_SALON_SUCCESS,
            payload: data
        })

        const { data: barberloggedindata } = await api.get('/api/barber/barberloggedin');

        dispatch({
            type: BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: barberloggedindata
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_CONNECT_SALON_FAIL,
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
            type: BARBER_CONNECT_SALON_FAIL,
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

export const barberSalonStatusAction = (salonStatusdata) => async (dispatch) => {
    try {
        dispatch({ type: CHANGE_BARBER_ONLINESTATUS_REQ })

        const { data } = await api.post(`/api/barber/changeBarberOnlineStatus`, salonStatusdata)

        dispatch({
            type: CHANGE_BARBER_ONLINESTATUS_SUCCESS,
            payload: data
        })

        const { data: barberloggedin } = await api.get('/api/barber/barberloggedin');

        dispatch({
            type: BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: barberloggedin
        })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: CHANGE_BARBER_ONLINESTATUS_FAIL,
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
            type: CHANGE_BARBER_ONLINESTATUS_FAIL,
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

export const barberGetSalonLogoAction = (salonId) => async (dispatch) => {
    try {
        dispatch({ type: GET_BARBER_SALON_LOGO_REQ })

        const { data } = await api.post(`/api/salon/getSalonLogo`, {
            salonId
        })

        

        dispatch({
            type: GET_BARBER_SALON_LOGO_SUCCESS,
            payload: data
        })


    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: GET_BARBER_SALON_LOGO_FAIL,
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
            type: GET_BARBER_SALON_LOGO_FAIL,
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


export const barberDashboardSalonInfoAction = (salonId) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_DASHBOARD_SALON_INFO_REQ })

        const { data } = await api.post(`api/barber/getSalonInfoBySalonId`, {
            salonId
        })

        dispatch({
            type: BARBER_DASHBOARD_SALON_INFO_SUCCESS,
            payload: data
        })


    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_DASHBOARD_SALON_INFO_FAIL,
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
            type: BARBER_DASHBOARD_SALON_INFO_FAIL,
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
