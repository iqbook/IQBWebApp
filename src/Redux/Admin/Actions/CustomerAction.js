import { GET_ALL_CUSTOMERLIST_FAIL, GET_ALL_CUSTOMERLIST_REQ, GET_ALL_CUSTOMERLIST_SUCCESS } from "../Constants/constants"
import toast from "react-hot-toast";
import api from "../../api/Api";

export const adminGetAllCustomerListAction = (salonId, signal) => async (dispatch) => {
    try {
        dispatch({ type: GET_ALL_CUSTOMERLIST_REQ })

        const { data } = await api.get(`/api/customers/getAllCustomers?salonId=${salonId}`, { signal })

        dispatch({
            type: GET_ALL_CUSTOMERLIST_SUCCESS,
            payload: data
        })
    } catch (error) {


        if (error?.response?.status === 500) {
            dispatch({
                type: GET_ALL_CUSTOMERLIST_FAIL,
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
                type: GET_ALL_CUSTOMERLIST_FAIL,
                payload: error?.response?.data
            });
        }

    }
}