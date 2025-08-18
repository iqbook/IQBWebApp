import toast from "react-hot-toast"
import api from "../../api/Api"
import { ADMIN_FORGET_PASSWORD_FAIL, ADMIN_FORGET_PASSWORD_REQ, ADMIN_FORGET_PASSWORD_SUCCESS, ADMIN_RESET_PASSWORD_FAIL, ADMIN_RESET_PASSWORD_REQ, ADMIN_RESET_PASSWORD_SUCCESS } from "../Constants/constants"

export const adminForgetPasswordAction = (email) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_FORGET_PASSWORD_REQ })

        const { data } = await api.post("/api/admin/forget-password",{email:email})

        dispatch({
            type: ADMIN_FORGET_PASSWORD_SUCCESS,
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
                type: ADMIN_FORGET_PASSWORD_FAIL,
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
            type: ADMIN_FORGET_PASSWORD_FAIL,
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

export const adminResetPasswordAction = (password,token,navigate) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_RESET_PASSWORD_REQ })

        const { data } = await api.post(`/api/admin/reset-password/${token}`,{password:password})

        dispatch({
            type: ADMIN_RESET_PASSWORD_SUCCESS,
            payload: data
        })

        navigate("/adminpasswordreset")

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_RESET_PASSWORD_FAIL,
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
            type: ADMIN_RESET_PASSWORD_FAIL,
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