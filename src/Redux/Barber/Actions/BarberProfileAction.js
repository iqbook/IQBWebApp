import toast from "react-hot-toast"
import api from "../../api/Api"
import { BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS, BARBER_SEND_VERIFY_EMAIL_FAIL, BARBER_SEND_VERIFY_EMAIL_REQ, BARBER_SEND_VERIFY_EMAIL_SUCCESS, BARBER_SEND_VERIFY_MOBILE_FAIL, BARBER_SEND_VERIFY_MOBILE_REQ, BARBER_SEND_VERIFY_MOBILE_SUCCESS, BARBER_SKIP_PROFILE_FAIL, BARBER_SKIP_PROFILE_REQ, BARBER_SKIP_PROFILE_SUCCESS, BARBER_UPDATE_PASSWORD_FAIL, BARBER_UPDATE_PASSWORD_REQ, BARBER_UPDATE_PASSWORD_SUCCESS, BARBER_UPDATE_PROFILE_FAIL, BARBER_UPDATE_PROFILE_REQ, BARBER_UPDATE_PROFILE_SUCCESS, BARBER_VERIFIED_EMAIL_STATUS_FAIL, BARBER_VERIFIED_EMAIL_STATUS_REQ, BARBER_VERIFIED_EMAIL_STATUS_SUCCESS, BARBER_VERIFIED_MOBILE_STATUS_FAIL, BARBER_VERIFIED_MOBILE_STATUS_REQ, BARBER_VERIFIED_MOBILE_STATUS_SUCCESS } from "../Constants/constants"

export const barberUpdateProfileAction = (profiledata, navigate) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_UPDATE_PROFILE_REQ })

        const { data } = await api.put("/api/barber/updateBarberAccountDetails", profiledata)

        dispatch({
            type: BARBER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })

        //calling this so that admin profile get updated and i dont have to refresh the page again
        const { data: barberloggedindata } = await api.get('/api/barber/barberloggedin');

        dispatch({
            type: BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: barberloggedindata
        })

        navigate("/barber-dashboard")

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_UPDATE_PROFILE_FAIL,
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
            type: BARBER_UPDATE_PROFILE_FAIL,
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

export const barberSkipProfileAction = (profiledata, navigate) => async (dispatch) => {
    try {
        dispatch({
            type: BARBER_SKIP_PROFILE_REQ
        });

        const { data } = await api.put("/api/barber/updateBarberInfo", profiledata);

        dispatch({
            type: BARBER_SKIP_PROFILE_SUCCESS,
            payload: { message: "Admin updated successfully" }
        });

        localStorage.setItem("userAdminLoggedIn", "")
        localStorage.setItem("userBarberLoggedIn", data?.accessToken)

        navigate("/barber-dashboard", { state: data })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_SKIP_PROFILE_FAIL,
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
            type: BARBER_SKIP_PROFILE_FAIL,
            payload: error.response.data
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

export const barberSendVerifyEmailAction = (verifyemail, setOpenEmailModal) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_SEND_VERIFY_EMAIL_REQ })

        const { data } = await api.post("/api/barber/sendVerificationCodeForBarberEmail", { email: verifyemail })

        dispatch({
            type: BARBER_SEND_VERIFY_EMAIL_SUCCESS,
            payload: data
        })

        setOpenEmailModal(true)

        toast.success("We have send a code to your email", {
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
                type: BARBER_SEND_VERIFY_EMAIL_FAIL,
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
            type: BARBER_SEND_VERIFY_EMAIL_FAIL,
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

export const barberSendVerifyMobileAction = (verifyemail, setOpenMobileModal) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_SEND_VERIFY_MOBILE_REQ })

        const { data } = await api.post("/api/barber/sendVerificationCodeForBarberMobile", { email: verifyemail })

        dispatch({
            type: BARBER_SEND_VERIFY_MOBILE_SUCCESS,
            payload: data
        })

        setOpenMobileModal(true)

        toast.success("We have send a sms to your mob No.", {
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
                type: BARBER_SEND_VERIFY_MOBILE_FAIL,
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
            type: BARBER_SEND_VERIFY_MOBILE_FAIL,
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

export const barberVerifiedEmailStatusAction = (verifyemail, otp, setOpenEmailModal, setOtp, setChangeEmailVerifiedState) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_VERIFIED_EMAIL_STATUS_REQ })

        const { data } = await api.post("/api/barber/changeBarberEmailVerifiedStatus", { email: verifyemail, verificationCode: otp })

        dispatch({
            type: BARBER_VERIFIED_EMAIL_STATUS_SUCCESS,
            payload: data
        })

        //calling this so that admin profile get updated and i dont have to refresh the page again
        const { data: barberloggedindata } = await api.get('/api/barber/barberloggedin');

        dispatch({
            type: BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: barberloggedindata
        })

        setChangeEmailVerifiedState(true)
        setOpenEmailModal(false)
        setOtp(["", "", "", ""])

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_VERIFIED_EMAIL_STATUS_FAIL,
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
            type: BARBER_VERIFIED_EMAIL_STATUS_FAIL,
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

export const barberVerifiedMobileStatusAction = (verifyemail, otp, setOpenMobileModal, setMobileOtp, setChangeMobileVerifiedState) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_VERIFIED_MOBILE_STATUS_REQ })

        const { data } = await api.post("/api/barber/changeBarberMobileVerifiedStatus", { email: verifyemail, verificationCode: otp })

        dispatch({
            type: BARBER_VERIFIED_MOBILE_STATUS_SUCCESS,
            payload: data
        })

        //calling this so that admin profile get updated and i dont have to refresh the page again
        const { data: barberloggedindata } = await api.get('/api/barber/barberloggedin');

        dispatch({
            type: BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: barberloggedindata
        })

        setChangeMobileVerifiedState(true)
        setOpenMobileModal(false)
        setMobileOtp(["", "", "", ""])

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_VERIFIED_MOBILE_STATUS_FAIL,
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
            type: BARBER_VERIFIED_MOBILE_STATUS_FAIL,
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


export const barberUpdatePasswordAction = (profiledata, navigate) => async (dispatch) => {
    try {
        dispatch({ type: BARBER_UPDATE_PASSWORD_REQ })

        const { data } = await api.post("/api/barber/updateBarberPassword", profiledata)

        dispatch({
            type: BARBER_UPDATE_PASSWORD_SUCCESS,
            payload: data
        })

        //calling this so that admin profile get updated and i dont have to refresh the page again
        const { data: barberloggedindata } = await api.get('/api/barber/barberloggedin');

        dispatch({
            type: BARBER_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: barberloggedindata
        })

        navigate("/barber-dashboard")

        toast.success("Password matched successfully", {
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
                type: BARBER_UPDATE_PASSWORD_FAIL,
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
            type: BARBER_UPDATE_PASSWORD_FAIL,
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