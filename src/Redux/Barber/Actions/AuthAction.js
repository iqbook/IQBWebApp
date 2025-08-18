import toast from "react-hot-toast";
import api from "../../api/Api";
import { BARBER_GOOGLE_SIGNIN_FAIL, BARBER_GOOGLE_SIGNIN_REQ, BARBER_GOOGLE_SIGNIN_SUCCESS, BARBER_GOOGLE_SIGNUP_FAIL, BARBER_GOOGLE_SIGNUP_REQ, BARBER_GOOGLE_SIGNUP_SUCCESS, BARBER_LOGOUT_FAIL, BARBER_LOGOUT_REQ, BARBER_LOGOUT_SUCCESS, BARBER_SIGNIN_FAIL, BARBER_SIGNIN_REQ, BARBER_SIGNIN_SUCCESS, BARBER_SIGNUP_EDIT_FAIL, BARBER_SIGNUP_EDIT_REQ, BARBER_SIGNUP_EDIT_SUCCESS, BARBER_SIGNUP_FAIL, BARBER_SIGNUP_REQ, BARBER_SIGNUP_SUCCESS } from "../Constants/constants";

// export const BarberGoogleloginAction = (token, navigate) => async (dispatch) => {
//     try {
//         dispatch({
//             type: BARBER_GOOGLE_SIGNIN_REQ
//         });

//         const { data } = await api.post(`/api/barber/googleBarberLogin?token=${token}`);

//         dispatch({
//             type: BARBER_GOOGLE_SIGNIN_SUCCESS,
//             payload: data
//         });

//         localStorage.setItem("userAdminLoggedIn", "false")
//         localStorage.setItem("userBarberLoggedIn", "true")

//         navigate("/barber-dashboard")

//     } catch (error) {

//         if (error?.response?.status === 500) {
//             dispatch({
//                 type: BARBER_GOOGLE_SIGNIN_FAIL,
//                 payload: "Something went wrong !"
//             });

//             toast.error("Something went wrong !", {
//                 duration: 3000,
//                 style: {
//                     fontSize: "var(--font-size-2)",
//                     borderRadius: '0.3rem',
//                     background: '#333',
//                     color: '#fff',
//                 },
//             });

//             return;
//         }

//         dispatch({
//             type: BARBER_GOOGLE_SIGNIN_FAIL,
//             payload: error.response.data
//         });

//         toast.error(error?.response?.data?.message, {
//             duration: 3000,
//             style: {
//                 fontSize: "var(--font-size-2)",
//                 borderRadius: '0.3rem',
//                 background: '#333',
//                 color: '#fff',
//             },
//         });
//     }
// };

// export const BarberGoogleSignupAction = (token, navigate) => async (dispatch) => {
//     try {
//         dispatch({
//             type: BARBER_GOOGLE_SIGNUP_REQ
//         });

//         const { data } = await api.post(`/api/barber/googleBarberSignUp?token=${token}`);

//         dispatch({
//             type: BARBER_GOOGLE_SIGNUP_SUCCESS,
//             payload: { message: "Barber signin successfully" }
//         });

//         navigate("/barber-signupeditprofile", { state: data })
//     } catch (error) {

//         if (error?.response?.status === 500) {
//             dispatch({
//                 type: BARBER_GOOGLE_SIGNUP_FAIL,
//                 payload: "Something went wrong !"
//             });

//             toast.error("Something went wrong !", {
//                 duration: 3000,
//                 style: {
//                     fontSize: "var(--font-size-2)",
//                     borderRadius: '0.3rem',
//                     background: '#333',
//                     color: '#fff',
//                 },
//             });

//             return;
//         }

//         dispatch({
//             type: BARBER_GOOGLE_SIGNUP_FAIL,
//             payload: error.response.data
//         });


//         toast.error(error?.response?.data?.message, {
//             duration: 3000,
//             style: {
//                 fontSize: "var(--font-size-2)",
//                 borderRadius: '0.3rem',
//                 background: '#333',
//                 color: '#fff',
//             },
//         });
//     }
// };

export const BarberGoogleloginAction = (googleemail, navigate) => async (dispatch) => {
    try {
        dispatch({
            type: BARBER_GOOGLE_SIGNIN_REQ
        });

        const { data } = await api.post(`/api/barber/googleBarberLogin?token`, {
            email: googleemail
        });

        dispatch({
            type: BARBER_GOOGLE_SIGNIN_SUCCESS,
            payload: data
        });

        // localStorage.setItem("userAdminLoggedIn", "false")
        // localStorage.setItem("userBarberLoggedIn", "true")

        localStorage.setItem("userAdminLoggedIn", "")
        localStorage.setItem("userBarberLoggedIn", data?.accessToken)


        navigate("/barber-dashboard")

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_GOOGLE_SIGNIN_FAIL,
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
            type: BARBER_GOOGLE_SIGNIN_FAIL,
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
};

export const BarberGoogleSignupAction = (googleemail, navigate) => async (dispatch) => {
    try {
        dispatch({
            type: BARBER_GOOGLE_SIGNUP_REQ
        });

        const { data } = await api.post(`/api/barber/googleBarberSignUp`, {
            email: googleemail
        });

        dispatch({
            type: BARBER_GOOGLE_SIGNUP_SUCCESS,
            payload: { message: "Barber signin successfully" }
        });

        navigate("/barber-signupeditprofile", { state: data })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_GOOGLE_SIGNUP_FAIL,
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
            type: BARBER_GOOGLE_SIGNUP_FAIL,
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
};

export const BarberSigninAction = (signinData, navigate) => async (dispatch) => {
    try {
        dispatch({
            type: BARBER_SIGNIN_REQ
        });

        const {data} = await api.post("/api/barber/login", signinData);

        dispatch({
            type: BARBER_SIGNIN_SUCCESS,
            payload: { message: "Barber signin successfully" }
        });


        localStorage.setItem("userAdminLoggedIn", "")
        localStorage.setItem("userBarberLoggedIn", data?.accessToken)

        navigate("/barber-dashboard")
    } catch (error) {


        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_SIGNIN_FAIL,
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
            type: BARBER_SIGNIN_FAIL,
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
};

export const BarberSignupAction = (signupData, navigate) => async (dispatch) => {
    try {
        dispatch({
            type: BARBER_SIGNUP_REQ
        });

        const { data } = await api.post("/api/barber/register", signupData);

        dispatch({
            type: BARBER_SIGNUP_SUCCESS,
            payload: { message: "Barber signin successfully" }
        });

        navigate("/barber-signupeditprofile", { state: data })

    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_SIGNUP_FAIL,
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
            type: BARBER_SIGNUP_FAIL,
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
};

export const BarberSignupEditAction = (profiledata, navigate) => async (dispatch) => {
    try {
        dispatch({
            type: BARBER_SIGNUP_EDIT_REQ
        });

        const { data } = await api.put("/api/barber/updateBarberInfo", profiledata);

        dispatch({
            type: BARBER_SIGNUP_EDIT_SUCCESS,
            payload: { message: "Admin updated successfully" }
        });

        localStorage.setItem("userAdminLoggedIn", "")
        localStorage.setItem("userBarberLoggedIn", data?.accessToken)

        navigate("/barber-dashboard", { state: data })
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_SIGNUP_EDIT_FAIL,
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
            type: BARBER_SIGNUP_EDIT_FAIL,
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
};

export const BarberLogoutAction = (navigate) => async (dispatch) => {

    try {

        // dispatch({
        //     type: BARBER_LOGOUT_REQ
        // })

        // const { data } = await api.post("/api/barber/logout")

        // dispatch({
        //     type: BARBER_LOGOUT_SUCCESS,
        //     payload: data
        // })

        localStorage.setItem("userAdminLoggedIn", "")
        localStorage.setItem("userBarberLoggedIn", "")

        // navigate("/barbersignin")
        navigate("/")
    } catch (error) {

        if (error?.response?.status === 500) {
            dispatch({
                type: BARBER_LOGOUT_FAIL,
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
            type: BARBER_LOGOUT_FAIL,
            payload: error?.response?.data
        })

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