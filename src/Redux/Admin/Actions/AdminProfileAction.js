import { ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS, ADMIN_SEND_VERIFY_EMAIL_FAIL, ADMIN_SEND_VERIFY_EMAIL_REQ, ADMIN_SEND_VERIFY_EMAIL_SUCCESS, ADMIN_SEND_VERIFY_MOBILE_FAIL, ADMIN_SEND_VERIFY_MOBILE_REQ, ADMIN_SEND_VERIFY_MOBILE_SUCCESS, ADMIN_SKIP_PROFILE_FAIL, ADMIN_SKIP_PROFILE_REQ, ADMIN_SKIP_PROFILE_SUCCESS, ADMIN_UPDATE_PASSWORD_FAIL, ADMIN_UPDATE_PASSWORD_REQ, ADMIN_UPDATE_PASSWORD_SUCCESS, ADMIN_UPDATE_PROFILE_FAIL, ADMIN_UPDATE_PROFILE_REQ, ADMIN_UPDATE_PROFILE_SUCCESS, ADMIN_UPLOAD_PROFILE_PIC_FAIL, ADMIN_UPLOAD_PROFILE_PIC_REQ, ADMIN_UPLOAD_PROFILE_PIC_SUCCESS, ADMIN_VERIFIED_EMAIL_STATUS_FAIL, ADMIN_VERIFIED_EMAIL_STATUS_REQ, ADMIN_VERIFIED_EMAIL_STATUS_SUCCESS, ADMIN_VERIFIED_MOBILE_STATUS_FAIL, ADMIN_VERIFIED_MOBILE_STATUS_REQ, ADMIN_VERIFIED_MOBILE_STATUS_SUCCESS } from "../Constants/constants";
import api from "../../api/Api";
import toast from "react-hot-toast";

export const adminUpdateProfileAction = (profiledata, navigate) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_UPDATE_PROFILE_REQ })

        const { data } = await api.put("/api/admin/updateAdminAcoountDetails", profiledata)

        dispatch({
            type: ADMIN_UPDATE_PROFILE_SUCCESS,
            payload: data
        })

        //calling this so that admin profile get updated and i dont have to refresh the page again
        const { data: adminloggedindata } = await api.get('/api/admin/adminloggedin');

        dispatch({
            type: ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: adminloggedindata
        })

        navigate("/admin-dashboard")

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_UPDATE_PROFILE_FAIL,
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
            type: ADMIN_UPDATE_PROFILE_FAIL,
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

export const adminSkipProfileAction = (profiledata, navigate) => async (dispatch) => {
    try {
        dispatch({
            type: ADMIN_SKIP_PROFILE_REQ
        });

        const { data } = await api.put("/api/admin/updateadminInfo", profiledata);

        dispatch({
            type: ADMIN_SKIP_PROFILE_SUCCESS,
            payload: { message: "Admin updated successfully" }
        });

        // localStorage.setItem("userAdminLoggedIn", "true")
        // localStorage.setItem("userBarberLoggedIn", "false")

        localStorage.setItem("userAdminLoggedIn", data?.accessToken)
        localStorage.setItem("userBarberLoggedIn", "")

        navigate("/admin-dashboard", { state: data })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_SKIP_PROFILE_FAIL,
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
            type: ADMIN_SKIP_PROFILE_FAIL,
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


export const adminSendVerifyEmailAction = (verifyemail, setOpenEmailModal) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_SEND_VERIFY_EMAIL_REQ })

        const { data } = await api.post("/api/admin/sendVerificationCodeForAdminEmail", { email: verifyemail })

        dispatch({
            type: ADMIN_SEND_VERIFY_EMAIL_SUCCESS,
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
                type: ADMIN_SEND_VERIFY_EMAIL_FAIL,
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
            type: ADMIN_SEND_VERIFY_EMAIL_FAIL,
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

export const adminSendVerifyMobileAction = (verifyemail, setOpenMobileModal) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_SEND_VERIFY_MOBILE_REQ })

        const { data } = await api.post("/api/admin/sendVerificationCodeForAdminMobile", { email: verifyemail })

        dispatch({
            type: ADMIN_SEND_VERIFY_MOBILE_SUCCESS,
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
                type: ADMIN_SEND_VERIFY_MOBILE_FAIL,
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
            type: ADMIN_SEND_VERIFY_MOBILE_FAIL,
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

export const adminVerifiedEmailStatusAction = (verifyemail, otp, setOpenEmailModal, setOtp, setChangeEmailVerifiedState) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_VERIFIED_EMAIL_STATUS_REQ })

        const { data } = await api.post("/api/admin/changeEmailVerifiedStatus", { email: verifyemail, verificationCode: otp })

        dispatch({
            type: ADMIN_VERIFIED_EMAIL_STATUS_SUCCESS,
            payload: data
        })

        //calling this so that admin profile get updated and i dont have to refresh the page again
        const { data: adminloggedindata } = await api.get('/api/admin/adminloggedin');

        dispatch({
            type: ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: adminloggedindata
        })

        setChangeEmailVerifiedState(true)
        setOpenEmailModal(false)
        setOtp(["", "", "", ""])

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_VERIFIED_EMAIL_STATUS_FAIL,
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
            type: ADMIN_VERIFIED_EMAIL_STATUS_FAIL,
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

export const adminVerifiedMobileStatusAction = (verifyemail, otp, setOpenMobileModal, setMobileOtp, setChangeMobileVerifiedState) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_VERIFIED_MOBILE_STATUS_REQ })

        const { data } = await api.post("/api/admin/changeMobileVerifiedStatus", { email: verifyemail, verificationCode: otp })

        dispatch({
            type: ADMIN_VERIFIED_MOBILE_STATUS_SUCCESS,
            payload: data
        })

        //calling this so that admin profile get updated and i dont have to refresh the page again
        const { data: adminloggedindata } = await api.get('/api/admin/adminloggedin');

        dispatch({
            type: ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: adminloggedindata
        })

        setChangeMobileVerifiedState(true)
        setOpenMobileModal(false)
        setMobileOtp(["", "", "", ""])

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_VERIFIED_MOBILE_STATUS_FAIL,
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
            type: ADMIN_VERIFIED_MOBILE_STATUS_FAIL,
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

export const adminUploadProfilePicAction = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_UPLOAD_PROFILE_PIC_REQ })

        const { data } = await api.post("/api/admin/changeEmailVerifiedStatus")

        dispatch({
            type: ADMIN_UPLOAD_PROFILE_PIC_SUCCESS,
            payload: data
        })


    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: ADMIN_UPLOAD_PROFILE_PIC_FAIL,
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
            type: ADMIN_UPLOAD_PROFILE_PIC_FAIL,
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


export const adminUpdatePasswordAction = (profiledata, navigate) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_UPDATE_PASSWORD_REQ })

        const { data } = await api.post("/api/admin/updateAdminPassword", profiledata)

        dispatch({
            type: ADMIN_UPDATE_PASSWORD_SUCCESS,
            payload: data
        })

        //calling this so that admin profile get updated and i dont have to refresh the page again
        const { data: adminloggedindata } = await api.get('/api/admin/adminloggedin');

        dispatch({
            type: ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS,
            payload: adminloggedindata
        })

        navigate("/admin-dashboard")

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
                type: ADMIN_UPDATE_PASSWORD_FAIL,
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
            type: ADMIN_UPDATE_PASSWORD_FAIL,
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