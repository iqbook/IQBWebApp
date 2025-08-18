import toast from "react-hot-toast"
import { ADMIN_BARBER_SERVED_QUEUE_REQ, ADMIN_BARBER_SERVED_QUEUE_SUCCESS, ADMIN_BARBER_SERVED_QUEUE_FAIL, ADMIN_CANCEL_QUEUE_REQ, ADMIN_CANCEL_QUEUE_SUCCESS, ADMIN_CANCEL_QUEUE_FAIL, GET_ALL_QUEUELIST_SUCCESS, GET_QUEUE_HISTORY_REQ, GET_QUEUE_HISTORY_SUCCESS, GET_QUEUE_HISTORY_FAIL } from "../Constants/constants"
import api from "../../api/Api"
import { getAllQueueListAction } from "./DashboardAction"

export const adminServeQueueAction = (barberqueuedata, salonId, setChoosebarbermodalopen) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_BARBER_SERVED_QUEUE_REQ })

        const { data } = await api.post("/api/queue/barberServedQueue", barberqueuedata)

        dispatch({
            type: ADMIN_BARBER_SERVED_QUEUE_SUCCESS,
            payload: data
        })

        toast.success("Customer serve successfully", {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });

        setChoosebarbermodalopen({
            open: false,
            data: {}
        })

        const { data: queuelistdata } = await api.get(`/api/queue/getQListBySalonId?salonId=${salonId}`)

        dispatch({
            type: GET_ALL_QUEUELIST_SUCCESS,
            payload: queuelistdata
        })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_BARBER_SERVED_QUEUE_FAIL,
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
            type: ADMIN_BARBER_SERVED_QUEUE_FAIL,
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

export const adminCancelQueueAction = (canceldata, salonId, setChoosebarbermodalopen, setQueueItem, setChoosebarber, setChoosebarberemail) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_CANCEL_QUEUE_REQ })

        const { data } = await api.post(`/api/queue/cancelQ`, canceldata)

        dispatch({
            type: ADMIN_CANCEL_QUEUE_SUCCESS,
            payload: data
        })

        toast.success("Customer cancel successfully", {
            duration: 3000,
            style: {
                fontSize: "var(--font-size-2)",
                borderRadius: '0.3rem',
                background: '#333',
                color: '#fff',
            },
        });

        setChoosebarbermodalopen({
            open: false,
            data: {}
        })
        setQueueItem({})
        setChoosebarber("")
        setChoosebarberemail("")

        const { data: queuelistdata } = await api.get(`/api/queue/getQListBySalonId?salonId=${salonId}`)

        dispatch({
            type: GET_ALL_QUEUELIST_SUCCESS,
            payload: queuelistdata
        })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_CANCEL_QUEUE_FAIL,
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
            type: ADMIN_CANCEL_QUEUE_FAIL,
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

export const getAdminQueueListHistoryAction = (salonId, startDate, endDate, barberId, customerEmail, signal) => async (dispatch) => {
    try {
        dispatch({ type: GET_QUEUE_HISTORY_REQ })

        const { data } = await api.post("/api/queueHistory/getQueueHistoryBySalonId", {
            salonId,
            from: startDate,
            to: endDate,
            barberId: barberId,
            customerEmail: customerEmail
        }, { signal })

        dispatch({
            type: GET_QUEUE_HISTORY_SUCCESS,
            payload: data
        })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: GET_QUEUE_HISTORY_FAIL,
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
                type: GET_QUEUE_HISTORY_FAIL,
                payload: error?.response?.data
            });
        }
    }

}