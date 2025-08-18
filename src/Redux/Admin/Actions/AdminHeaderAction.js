import toast from "react-hot-toast";
import api from "../../api/Api";
import { ADMIN_APPLY_SALON_FAIL, ADMIN_APPLY_SALON_REQ, ADMIN_APPLY_SALON_SUCCESS, ADMIN_GET_DEFAULT_SALON_FAIL, ADMIN_GET_DEFAULT_SALON_REQ, ADMIN_GET_DEFAULT_SALON_SUCCESS } from "../Constants/constants";

export const adminApplySalonAction = (applySalondata) => async (dispatch) => {
    try {
        dispatch({
            type: ADMIN_APPLY_SALON_REQ
        })
        const { data } = await api.post(`/api/admin/changeDefaultSalonIdofAdmin`, applySalondata);

        dispatch({
            type: ADMIN_APPLY_SALON_SUCCESS,
            payload: data
        });

        localStorage.setItem("barberdata", JSON.stringify({}))
        localStorage.setItem("salondata", JSON.stringify({}))

        window.location.reload()
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_APPLY_SALON_FAIL,
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
            type: ADMIN_APPLY_SALON_FAIL,
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


export const adminGetDefaultSalonAction = (adminEmail, signal, adminSetSalon) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_GET_DEFAULT_SALON_REQ })

        const { data } = await api.post(`/api/admin/getDefaultSalonByAdmin`, {
            adminEmail
        }, { signal })

        dispatch({
            type: ADMIN_GET_DEFAULT_SALON_SUCCESS,
            payload: data
        })

        dispatch({
            type: "ADMIN_SET_SALON",
            payload: {
                currentActiveSalon: data?.response?.salonName,
                chooseSalonId: data?.response?.salonId
            }
        })


    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_GET_DEFAULT_SALON_FAIL,
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
                type: ADMIN_GET_DEFAULT_SALON_FAIL,
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