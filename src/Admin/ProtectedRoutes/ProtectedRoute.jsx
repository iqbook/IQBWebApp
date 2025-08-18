// import React, { useEffect, useState } from 'react';
// import api from '../../Redux/api/Api'
// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS } from '../../Redux/Admin/Constants/constants'
// import AuthLoader from '../../components/AuthLoader/AuthLoader';

// const ProtectedRoute = () => {
//     const [loggindata, setloggindata] = useState({});
//     const [logginerror, setlogginerror] = useState('');

//     const dispatch = useDispatch()

//     useEffect(() => {
//         const logginadmin = async () => {
//             try {
//                 const { data } = await api.get('/api/admin/adminloggedin');
//                 // console.log("Admin Logged in from protected Route ", data)
//                 setloggindata(data);
//                 dispatch({
//                     type: ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS,
//                     payload: data
//                 })
//             } catch (error) {
//                 if (error?.response?.data?.message === "UnAuthorized Admin" || error?.response?.data?.message === "Forbidden Admin") {
//                     localStorage.setItem("userAdminLoggedIn", "false")
//                     setlogginerror(error?.response?.data?.message)
//                 }

//             }
//         };

//         logginadmin();
//     }, [dispatch]);

//     let content;

//     const navigate = useNavigate()

//     const ErrorClickedHandler = () => {
//         localStorage.setItem("userAdminLoggedIn", "false")
//         navigate("/adminsignin")
//     }

//     if (Object.keys(loggindata).length > 0) {
//         // Data is present, render Outlet
//         content = <Outlet />;
//     } else {
//         // Data is not present, render a button or any other UI element
//         content = (
//             <div className='route_error_container'>
//                 {
//                     logginerror ? <div className='route_error_container_content'>
//                         <div>
//                             <h1 style={{ color: "var(--light-color-2)" }}>You are not authorize</h1>
//                             <p style={{ color: "var(--light-color-2)" }}>You tried to access a page you did not have prior authorization for.</p>
//                             <p style={{ color: "var(--light-color-2)" }}>Click the Link below to signin again</p>
//                             <button onClick={ErrorClickedHandler}>Signin</button>
//                         </div>
//                         <div>
//                             <img src="./403.jpg" alt="unauthorize" />
//                         </div>
//                     </div> : <AuthLoader />
//                 }

//             </div>
//         );
//     }

//     return <div>{content}</div>;
// };

// export default ProtectedRoute;



import React, { useEffect, useState } from 'react';
import api from '../../Redux/api/Api'
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS } from '../../Redux/Admin/Constants/constants'
import AuthLoader from '../../components/AuthLoader/AuthLoader';

const ProtectedRoute = () => {
    const [loggindata, setloggindata] = useState({});
    const [logginerror, setlogginerror] = useState('');

    const dispatch = useDispatch()

    useEffect(() => {
        const logginadmin = async () => {
            try {
                const { data } = await api.get('/api/admin/adminloggedin');
                // console.log("Admin Logged in from protected Route ", data)
                setloggindata(data);
                dispatch({
                    type: ADMIN_LOGGED_IN_MIDDLEWARE_SUCCESS,
                    payload: data
                })
            } catch (error) {
                if(error.response.status === 403 || error.response.status === 401){
                    localStorage.setItem("userAdminLoggedIn", "")
                    setlogginerror(error?.response?.data?.message)
                }

            }
        };

        logginadmin();
    }, [dispatch]);

    let content;

    const navigate = useNavigate()

    const ErrorClickedHandler = () => {
        localStorage.setItem("userAdminLoggedIn", "")
        navigate("/adminsignin")
    }

    if (Object.keys(loggindata).length > 0) {
        content = <Outlet />;
    } else {
        content = (
            <div className='route_error_container'>
                {
                    logginerror ? <div className='route_error_container_content'>
                        <div>
                            <h1 style={{ color: "var(--light-color-2)" }}>You are not authorize</h1>
                            <p style={{ color: "var(--light-color-2)" }}>You tried to access a page you did not have prior authorization for.</p>
                            <p style={{ color: "var(--light-color-2)" }}>Click the Link below to signin again</p>
                            <button onClick={ErrorClickedHandler}>Signin</button>
                        </div>
                        <div>
                            <img src="./403.jpg" alt="unauthorize" />
                        </div>
                    </div> : <AuthLoader />
                }

            </div>
        );
    }

    return <div>{content}</div>;
};

export default ProtectedRoute;
