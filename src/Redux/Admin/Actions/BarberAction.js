import toast from "react-hot-toast";
import api from "../../api/Api";
import { ADMIN_ALL_SALON_SERVICES_FAIL, ADMIN_ALL_SALON_SERVICES_REQ, ADMIN_ALL_SALON_SERVICES_SUCCESS, ADMIN_APPROVE_BARBER_FAIL, ADMIN_APPROVE_BARBER_REQ, ADMIN_APPROVE_BARBER_SUCCESS, ADMIN_CREATE_BARBER_FAIL, ADMIN_CREATE_BARBER_REQ, ADMIN_CREATE_BARBER_SUCCESS, ADMIN_DELETE_BARBER_FAIL, ADMIN_DELETE_BARBER_REQ, ADMIN_DELETE_BARBER_SUCCESS, ADMIN_SEND_BARBER_MAIL_FAIL, ADMIN_SEND_BARBER_MAIL_REQ, ADMIN_SEND_BARBER_MAIL_SUCCESS, ADMIN_SEND_BARBER_MESSAGE_FAIL, ADMIN_SEND_BARBER_MESSAGE_REQ, ADMIN_SEND_BARBER_MESSAGE_SUCCESS, ADMIN_SEND_NOTIFICATION_FAIL, ADMIN_SEND_NOTIFICATION_REQ, ADMIN_SEND_NOTIFICATION_SUCCESS, ADMIN_UPDATE_BARBER_FAIL, ADMIN_UPDATE_BARBER_REQ, ADMIN_UPDATE_BARBER_SUCCESS, CHANGE_ADMIN_BARBER_CLOCKSTATUS_FAIL, CHANGE_ADMIN_BARBER_CLOCKSTATUS_REQ, CHANGE_ADMIN_BARBER_CLOCKSTATUS_SUCCESS, CHANGE_ADMIN_BARBER_ONLINESTATUS_FAIL, CHANGE_ADMIN_BARBER_ONLINESTATUS_REQ, CHANGE_ADMIN_BARBER_ONLINESTATUS_SUCCESS, GET_ADMIN_BARBERLIST_FAIL, GET_ADMIN_BARBERLIST_REQ, GET_ADMIN_BARBERLIST_SUCCESS, GET_ALL_BARBER_DASHBOARD_FAIL, GET_ALL_BARBER_DASHBOARD_REQ, GET_ALL_BARBER_DASHBOARD_SUCCESS } from "../Constants/constants";

export const getAdminBarberListAction = (salonId, signal) => async (dispatch) => {
    try {
        dispatch({ type: GET_ADMIN_BARBERLIST_REQ })

        const { data } = await api.post(`/api/barber/getAllBarberBySalonId?salonId=${salonId}`, {}, { signal })

        dispatch({
            type: GET_ADMIN_BARBERLIST_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: GET_ADMIN_BARBERLIST_FAIL,
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
                type: GET_ADMIN_BARBERLIST_FAIL,
                payload: error?.response?.data
            });
        }

    }
}


export const getBarberDashboardAction = (salonId, signal) => async (dispatch) => {
    try {
        dispatch({ type: GET_ALL_BARBER_DASHBOARD_REQ })

        const { data } = await api.get(`/api/admin/getAllBarbersForDashboard?salonId=${salonId}`, {}, { signal })

        dispatch({
            type: GET_ALL_BARBER_DASHBOARD_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: GET_ALL_BARBER_DASHBOARD_FAIL,
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
                type: GET_ALL_BARBER_DASHBOARD_FAIL,
                payload: error?.response?.data
            });
        }

    }
}

export const changeAdminBarberOnlineStatusAction = (barberOnlinedata, setCheckMap, b, originalIsOnline) => async (dispatch) => {
    try {
        dispatch({ type: CHANGE_ADMIN_BARBER_ONLINESTATUS_REQ })

        const { data } = await api.post(`/api/admin/changeBarberOnlineStatus`, barberOnlinedata)

        dispatch({
            type: CHANGE_ADMIN_BARBER_ONLINESTATUS_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: CHANGE_ADMIN_BARBER_ONLINESTATUS_FAIL,
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
            type: CHANGE_ADMIN_BARBER_ONLINESTATUS_FAIL,
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

        // Revert to original state
        setCheckMap((prevCheckMap) => {
            const newCheckMap = new Map(prevCheckMap);
            const key = `${b.salonId}-${b.barberId}`;
            newCheckMap.set(key, originalIsOnline);
            return newCheckMap;
        });
    }
}


export const changeAdminBarberClockStatusAction = (barberClockdata, setCheckMapClock, b, originalIsClock, setCheckMap) => async (dispatch) => {
    try {
        dispatch({ type: CHANGE_ADMIN_BARBER_CLOCKSTATUS_REQ })

        const { data } = await api.post(`/api/barber/changeBarberClockedInStatus`, barberClockdata)

        dispatch({
            type: CHANGE_ADMIN_BARBER_CLOCKSTATUS_SUCCESS,
            payload: data
        })

        setCheckMap((prevCheckMap) => {
            const newCheckMap = new Map(prevCheckMap);
            const key = `${b.salonId}-${b.barberId}`;
            newCheckMap.set(key, false);
            return newCheckMap;
        });

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: CHANGE_ADMIN_BARBER_CLOCKSTATUS_FAIL,
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
            type: CHANGE_ADMIN_BARBER_CLOCKSTATUS_FAIL,
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

        // Revert to original state
        setCheckMapClock((prevCheckMap) => {
            const newCheckMap = new Map(prevCheckMap);
            const key = `${b.salonId}-${b.barberId}`;
            newCheckMap.set(key, originalIsClock);
            return newCheckMap;
        });
    }
}

export const adminApproveBarberAction = (approvedata, setApproveBarberMap, b, originalIsOnline, setCheckMap, setCheckMapClock) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_APPROVE_BARBER_REQ })

        const { data } = await api.post(`/api/admin/approvedBarber`, approvedata)

        dispatch({
            type: ADMIN_APPROVE_BARBER_SUCCESS,
            payload: data
        })

        window.location.reload()

        // setCheckMap((prevCheckMap) => {
        //     if (approvedata?.isApproved === false) {
        //         const newCheckMap = new Map(prevCheckMap);
        //         const key = `${b.salonId}-${b.barberId}`;
        //         newCheckMap.set(key, false);
        //         return newCheckMap
        //     }
        // });

        // setCheckMapClock((prevCheckMap) => {
        //     if (approvedata?.isApproved === false) {
        //         const newCheckMap = new Map(prevCheckMap);
        //         const key = `${b.salonId}-${b.barberId}`;
        //         newCheckMap.set(key, false);
        //         return newCheckMap
        //     }
        // });

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_APPROVE_BARBER_FAIL,
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
            type: ADMIN_APPROVE_BARBER_FAIL,
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

        // Revert to original state
        setApproveBarberMap((prevCheckMap) => {
            const newCheckMap = new Map(prevCheckMap);
            const key = `${b.salonId}-${b.email}`;
            newCheckMap.set(key, originalIsOnline);
            return newCheckMap;
        });
    }

}


export const adminAllSalonServicesAction = (salonId, signal) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_ALL_SALON_SERVICES_REQ })

        const { data } = await api.get(`/api/salon/getAllSalonServices?salonId=${salonId}`, { signal })

        dispatch({
            type: ADMIN_ALL_SALON_SERVICES_SUCCESS,
            payload: data
        })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_ALL_SALON_SERVICES_FAIL,
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
                type: ADMIN_ALL_SALON_SERVICES_FAIL,
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

export const adminCreateBarberAction = (barberdata, navigate) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_CREATE_BARBER_REQ })

        const { data } = await api.post(`/api/barber/createBarberByAdmin`, barberdata)

        dispatch({
            type: ADMIN_CREATE_BARBER_SUCCESS,
            payload: data
        })

        localStorage.setItem("barberdata", JSON.stringify({}))

        navigate("/admin-barber")
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_CREATE_BARBER_FAIL,
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
            type: ADMIN_CREATE_BARBER_FAIL,
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

export const adminUpdateBarberAction = (barberdata, navigate) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_UPDATE_BARBER_REQ })

        const { data } = await api.put(`/api/barber/updateBarberByAdmin`, barberdata)

        dispatch({
            type: ADMIN_UPDATE_BARBER_SUCCESS,
            payload: data
        })

        navigate("/admin-barber")
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_UPDATE_BARBER_FAIL,
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
            type: ADMIN_UPDATE_BARBER_FAIL,
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

export const adminDeleteBarberAction = (email, barber) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_DELETE_BARBER_REQ })

        const { data } = await api.post(`/api/admin/deleteBarberByEmail`, { email })

        dispatch({
            type: ADMIN_DELETE_BARBER_SUCCESS,
            payload: data
        })

        toast.success(data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });

        dispatch({
            type: "FILTER_BARBERLIST",
            payload: barber.email
        })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_DELETE_BARBER_FAIL,
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
            type: ADMIN_DELETE_BARBER_FAIL,
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


export const adminSendBarberEmailAction = (maildata, setSubject, setMessage, setOpenBarberEmail) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_SEND_BARBER_MAIL_REQ })

        const { data } = await api.post(`/api/bulkMessageAndEmails/sendBulkEmails`, maildata)

        dispatch({
            type: ADMIN_SEND_BARBER_MAIL_SUCCESS,
            payload: data
        })

        setSubject("")
        setMessage("")
        toast.success(data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });

        setOpenBarberEmail(false)
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_SEND_BARBER_MAIL_FAIL,
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
            type: ADMIN_SEND_BARBER_MAIL_FAIL,
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


export const adminSendBarberMessageAction = (smsdata, setMessage, setOpenBarberMessage) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_SEND_BARBER_MESSAGE_REQ })

        const { data } = await api.post(`/api/bulkMessageAndEmails/sendBulkTextMessages`, smsdata)

        dispatch({
            type: ADMIN_SEND_BARBER_MESSAGE_SUCCESS,
            payload: data
        })

        setMessage("")
        toast.success(data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });

        setOpenBarberMessage(false)
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_SEND_BARBER_MESSAGE_FAIL,
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
            type: ADMIN_SEND_BARBER_MESSAGE_FAIL,
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


export const adminSendNotificationAction = (notificationData, setBarberTitle, setBarberMessage, setOpenBarberMessage) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_SEND_NOTIFICATION_REQ })

        const { data } = await api.post(`/api/notifications/send-multiple-notification`, notificationData)

        dispatch({
            type: ADMIN_SEND_NOTIFICATION_SUCCESS,
            payload: data
        })

        setBarberTitle("")
        setBarberMessage("")

        toast.success(data?.message, {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });

        setOpenBarberMessage(false)
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_SEND_NOTIFICATION_FAIL,
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
            type: ADMIN_SEND_NOTIFICATION_FAIL,
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