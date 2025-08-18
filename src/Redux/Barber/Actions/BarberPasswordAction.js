import toast from "react-hot-toast"
import api from "../../api/Api"
import { BARBER_FORGET_PASSWORD_FAIL, BARBER_FORGET_PASSWORD_REQ, BARBER_FORGET_PASSWORD_SUCCESS, BARBER_RESET_PASSWORD_FAIL, BARBER_RESET_PASSWORD_REQ, BARBER_RESET_PASSWORD_SUCCESS } from "../Constants/constants"

export const barberForgetPasswordAction = (email) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_FORGET_PASSWORD_REQ })

        const { data } = await api.post("/api/barber/forget-password",{email:email})

        dispatch({
            type: BARBER_FORGET_PASSWORD_SUCCESS,
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

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_FORGET_PASSWORD_FAIL,
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
            type: BARBER_FORGET_PASSWORD_FAIL,
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

export const barberResetPasswordAction = (password,token,navigate) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_RESET_PASSWORD_REQ })

        const { data } = await api.post(`/api/barber/reset-password/${token}`,{password:password})

        dispatch({
            type: BARBER_RESET_PASSWORD_SUCCESS,
            payload: data
        })

        navigate("/barberpasswordreset")

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_RESET_PASSWORD_FAIL,
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
            type: BARBER_RESET_PASSWORD_FAIL,
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