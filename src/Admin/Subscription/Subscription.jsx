// import React, { useEffect, useState } from 'react'
// import style from './Subscription.module.css'
// import { useSelector } from 'react-redux'
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import api from '../../Redux/api/Api'
// import { ClickAwayListener, Modal } from '@mui/material'
// import { CloseIcon } from '../../icons'
// import toast from 'react-hot-toast'
// import { loadStripe } from '@stripe/stripe-js';
// import axios from 'axios'
// import Skeleton from 'react-loading-skeleton'

// const Subscription = () => {

//     const adminEmail = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)

//     const darkMode = useSelector(darkmodeSelector)

//     const darkmodeOn = darkMode === "On"

//     const [getSubscriptiondata, setGetSubscriptiondata] = useState([])
//     const [getSubscriptionLoading, setGetSubscriptionLoading] = useState(false)

//     useEffect(() => {
//         const getSubscriptiondata = async () => {
//             try {
//                 setGetSubscriptionLoading(true)
//                 const { data } = await api.post("/api/admin/getAllAdminSalonsSubcriptions", {
//                     adminEmail
//                 })

//                 setGetSubscriptiondata(data.response)
//                 setGetSubscriptionLoading(false)
//             } catch (error) {
//                 setGetSubscriptionLoading(false)
//             }
//         }
//         getSubscriptiondata()
//     }, [])

//     const [currentSalonCurrency, setCurrentSalonCurrency] = useState("")
//     const [currentSalonisoCurrency, setCurrentSalonisoCurrency] = useState("")
//     const [selectedSalonId, setSelectedSalonId] = useState(null)


//     const [appointmentCheck, setAppointmentCheck] = useState(false)
//     const [queueingCheck, setQueueingCheck] = useState(false)

//     const [servicesData, setServicesData] = useState([
//         {
//             id: 1,
//             name: "Appointment",
//             value: false,
//             price: 300,
//             quantity: 1
//         },
//         {
//             id: 2,
//             name: "Queueing",
//             value: false,
//             price: 200,
//             quantity: 1
//         }
//     ])


//     const [planValidityDate, setPlanValidityDate] = useState("")

//     const [paymentModalOpen, setPaymentModalOpen] = useState(false)
//     const [paymentType, setPaymentType] = useState("Free")

//     useEffect(() => {
//         if (paymentType === "Free") {
//             setPlanValidityDate(14)
//         } else {
//             setPlanValidityDate(30)
//         }
//     }, [paymentType])

//     // const [currentSalonCurrency, setCurrentSalonCurrency] = useState("")

//     const totalPrice = servicesData.reduce(
//         (total, item) => (item.value ? total + item.price : total),
//         0
//     );

//     const [cartData, setCartData] = useState([])

//     // const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY

//     //Payment Code

//     // const makePayment = async (product) => {

//     //     try {
//     //         const stripe = await loadStripe(STRIPE_KEY);

//     //         const response = await axios.post("https://iqb-final.onrender.com/api/create-checkout-session", product)

//     //         if (response.data && response.data.session && response.data.session.id) {
//     //             await stripe.redirectToCheckout({
//     //                 sessionId: response.data.session.id,
//     //             });

//     //         } else {
//     //             console.error("Invalid session data: ", response.data);
//     //         }

//     //     } catch (error) {
//     //         console.log(error)
//     //     }
//     // }


//     // const paymentHandler = () => {

//     //     if (cartData.length > 0) {
//     //         const paymentData = {
//     //             productInfo: {
//     //                 salonId: selectedSalonId,
//     // adminEmail: adminEmail,
//     // paymentType: "Paid",
//     //                 paymentExpiryDate: planValidityDate,
//     //                 isQueuing: queueingCheck,
//     //                 isAppointments: appointmentCheck,
//     //                 products: cartData.map(service => {
//     //                     const { value, id, ...rest } = service;
//     //                     return { ...rest, currency: currentSalonisoCurrency };
//     //                 })
//     //             }
//     //         }

//     //         // console.log(paymentData)

//     //         makePayment(paymentData)
//     //     } else {
//     //         toast.error("Please select a product !", {
//     //             duration: 3000,
//     //             style: {
//     //                 fontSize: "var(--font-size-2)",
//     //                 borderRadius: '0.3rem',
//     //                 background: '#333',
//     //                 color: '#fff',
//     //             },
//     //         });
//     //     }

//     // }

//     // const freePaymentHandler = async () => {
//     //     const paymentData = {
//     //         salonId: selectedSalonId,
//     //         isTrailEnabled: true,
//     //         trailStartDate: new Date()
//     //     }

//     //     // console.log(paymentData)

//     //     const confirm = window.confirm("Do you want to start free trial ?")

//     //     if (confirm) {
//     // try {
//     //     const { data } = await api.post("/api/salon/salonTrailPeriod", paymentData)

//     //     window.location.reload()

//     // } catch (error) {
//     //     toast.error(error.response.data.message, {
//     //         duration: 3000,
//     //         style: {
//     //             fontSize: "var(--font-size-2)",
//     //             borderRadius: '0.3rem',
//     //             background: '#333',
//     //             color: '#fff',
//     //         },
//     //     });
//     // }
//     //     }
//     // }

//     // useEffect(() => {
//     //     if (paymentType === "Free") {
//     //         setServicesData((prev) => {
//     //             const updatedArray = prev.map((s) => {
//     //                 return { ...s, value: true }
//     //             })
//     //             return updatedArray
//     //         })
//     //     } else {
//     //         setServicesData((prev) => {
//     //             const updatedArray = prev.map((s) => {
//     //                 return { ...s, value: false }
//     //             })
//     //             return updatedArray
//     //         })
//     //     }
//     // }, [paymentType])


//     const [isQueueClicked, setIsQueueClicked] = useState(false)
//     const [isAppointClicked, setisAppointClicked] = useState(false)


//     const [currentProductPrice, setCurrentProductPrice] = useState(0)

//     const [selectedProduct, setSelectedProduct] = useState({
//         productName: "",
//         productPrice: 0,
//         planValidityDate: "",
//         planType: ""
//     })

//     const [modalValue, setModalValue] = useState({
//         queue: false,
//         appointment: false
//     })

//     const freePaymentHandler = async () => {
//         const productInfo = {
//             salonId: selectedSalonId,
//             isTrailEnabled: true,
//             trailStartDate: new Date(),
//             adminEmail: adminEmail,
//             paymentType: "Free",
//             planValidityDate: planValidityDate,
//             products: [
//                 {
//                     productName: isQueueClicked ? "Queue" : isAppointClicked && "Appointment",
//                     productPrice: isQueueClicked ? 300 : isAppointClicked && 400,
//                     currency: currentSalonCurrency,
//                     isoCurrencyCode: currentSalonisoCurrency
//                 }
//             ]
//         }

//         const confirm = window.confirm("Do you want to start free trial ?")

//         if (confirm) {
//             try {
//                 const { data } = await api.post("/api/salon/salonTrailPeriod", productInfo)

//                 window.location.reload()

//             } catch (error) {
//                 toast.error(error.response.data.message, {
//                     duration: 3000,
//                     style: {
//                         fontSize: "var(--font-size-2)",
//                         borderRadius: '0.3rem',
//                         background: '#333',
//                         color: '#fff',
//                     },
//                 });
//             }
//         }

//         console.log(productInfo)
//     }

//     const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY

//     const makePayment = async (product) => {

//         try {
//             const stripe = await loadStripe(STRIPE_KEY);

//             const response = await axios.post("https://iqb-final.onrender.com/api/create-checkout-session", product)

//             if (response.data && response.data.session && response.data.session.id) {
//                 await stripe.redirectToCheckout({
//                     sessionId: response.data.session.id,
//                 });

//             } else {
//                 console.error("Invalid session data: ", response.data);
//             }

//         } catch (error) {
//             console.log(error)
//         }
//     }


//     const paidPaymentHandler = async () => {
//         const productInfo = {
//             salonId: selectedSalonId,
//             isTrailEnabled: false,
//             trailStartDate: new Date(),
//             adminEmail: adminEmail,
//             paymentType: "Paid",
//             planValidityDate: planValidityDate,
//             products: [
//                 {
//                     productName: isQueueClicked ? "Queue" : isAppointClicked && "Appointment",
//                     productPrice: isQueueClicked ? 300 : isAppointClicked && 400,
//                     currency: currentSalonCurrency,
//                     isoCurrencyCode: currentSalonisoCurrency
//                 }
//             ]
//         }

//         // console.log(productInfo)

//         const confirm = window.confirm("Would you prefer to purchase now?")

//         // if (confirm) {
//         //     try {
//         //         const { data } = await api.post("/api/salon/salonTrailPaidPeriod", productInfo)

//         //         window.location.reload()

//         //     } catch (error) {
//         //         toast.error(error.response.data.message, {
//         //             duration: 3000,
//         //             style: {
//         //                 fontSize: "var(--font-size-2)",
//         //                 borderRadius: '0.3rem',
//         //                 background: '#333',
//         //                 color: '#fff',
//         //             },
//         //         });
//         //     }
//         // }

//         if (confirm) {
//             try {
//                 makePayment(productInfo)

//             } catch (error) {
//                 toast.error(error.response.data.message, {
//                     duration: 3000,
//                     style: {
//                         fontSize: "var(--font-size-2)",
//                         borderRadius: '0.3rem',
//                         background: '#333',
//                         color: '#fff',
//                     },
//                 });
//             }
//         }



//         // console.log(productInfo)
//     }


//     return (
//         <div className={`${style.subscription_status_wrapper} ${darkmodeOn && style.dark}`}>
//             <div>
//                 <p>Subscriptions</p>
//             </div>


//             <div className={`${style.subscription_status_content_wrapper} ${darkmodeOn && style.dark}`}>

//                 {
//                     getSubscriptionLoading ? (
//                         <>
//                             <Skeleton
//                                 count={1}
//                                 height={"25rem"}
//                                 baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                                 highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                                 style={{ marginBottom: "1rem" }} />

//                             <Skeleton
//                                 count={1}
//                                 height={"25rem"}
//                                 baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                                 highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                                 style={{ marginBottom: "1rem" }} />

//                             <Skeleton
//                                 count={1}
//                                 height={"25rem"}
//                                 baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                                 highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                                 style={{ marginBottom: "1rem" }} />

//                             <Skeleton
//                                 count={1}
//                                 height={"25rem"}
//                                 baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                                 highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                                 style={{ marginBottom: "1rem" }} />

//                             <Skeleton
//                                 count={1}
//                                 height={"25rem"}
//                                 baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                                 highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                                 style={{ marginBottom: "1rem" }} />

//                             <Skeleton
//                                 count={1}
//                                 height={"25rem"}
//                                 baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                                 highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                                 style={{ marginBottom: "1rem" }} />
//                         </>
//                     ) :
//                         getSubscriptiondata.map((s, index) => {
//                             return (
//                                 <div className={`${style.subscription_content_item} ${darkmodeOn && style.dark}`}
//                                     key={s.salonId}
//                                 >
//                                     <div>
//                                         <img src={s?.salonLogo?.[0]?.url} alt="" />
//                                         <p>{s?.salonName}</p>
//                                     </div>
//                                     <div>

//                                         {
//                                             s?.subscriptions.map((sub) => {
//                                                 return (
//                                                     <div>
//                                                         <div>
//                                                             <div>
//                                                                 <p>{sub?.name}</p>

//                                                                 {
//                                                                     sub?.trial === "Free" ? (
//                                                                         <div style={{
//                                                                             height: "3rem",
//                                                                             background: "var(--color-3)",
//                                                                             paddingInline: "1rem",
//                                                                             color: "var(--color-2)",
//                                                                             display: "flex",
//                                                                             justifyContent: "center",
//                                                                             alignItems: "center",
//                                                                             borderRadius: "2rem"
//                                                                         }}><p>Free</p></div>
//                                                                     ) : sub?.trial === "Paid" ? (
//                                                                         <div style={{
//                                                                             height: "3rem",
//                                                                             background: "rgba(0, 255, 0, 0.498)",
//                                                                             paddingInline: "1rem",
//                                                                             color: "var(--color-2)",
//                                                                             display: "flex",
//                                                                             justifyContent: "center",
//                                                                             alignItems: "center",
//                                                                             borderRadius: "2rem"
//                                                                         }}><p>Paid</p></div>
//                                                                     ) : null
//                                                                 }


//                                                             </div>
//                                                             <p>{sub?.expirydate === "" ? "select a plan" : sub?.expirydate}</p>
//                                                             <button
//                                                                 onClick={() => {
//                                                                     setPaymentModalOpen(true)
//                                                                     setModalValue({
//                                                                         queue: sub?.name === "Queue" ? true : false,
//                                                                         appointment: sub?.name === "Appointment" ? true : false
//                                                                     })
//                                                                     setCurrentSalonCurrency(s?.currency)
//                                                                     setCurrentSalonisoCurrency(s?.isoCurrencyCode)
//                                                                     setSelectedSalonId(s?.salonId)
//                                                                     setIsQueueClicked(sub?.name === "Queue" ? true : false)
//                                                                     setisAppointClicked(sub?.name === "Appointment" ? true : false)

//                                                                 }}
//                                                             >{sub?.bought === "" ? "Buy" : "Renew"}</button>

//                                                         </div>
//                                                     </div>

//                                                 )
//                                             })
//                                         }

//                                         {/* <div>
//                                             <div>
//                                                 <div>
//                                                     <p>Queue</p>
//                                                     {
//                                                         s?.queueSubscriptions?.isQueueingTrailEnabled === "true" ? (
//                                                             <div style={{
//                                                                 height: "3rem",
//                                                                 background: "var(--color-3)",
//                                                                 paddingInline: "1rem",
//                                                                 color: "var(--color-2)",
//                                                                 display: "flex",
//                                                                 justifyContent: "center",
//                                                                 alignItems: "center",
//                                                                 borderRadius: "2rem"
//                                                             }}><p>Free</p></div>
//                                                         ) :
//                                                             s?.queueSubscriptions?.isQueueingTrailEnabled === "false" && (
//                                                                 <div style={{
//                                                                     height: "3rem",
//                                                                     background: "rgba(0, 255, 0, 0.498)",
//                                                                     paddingInline: "1rem",
//                                                                     color: "var(--color-2)",
//                                                                     display: "flex",
//                                                                     justifyContent: "center",
//                                                                     alignItems: "center",
//                                                                     borderRadius: "2rem"
//                                                                 }}><p>Paid</p></div>
//                                                             )
//                                                     }

//                                                 </div>
//                                                 <p>{s?.queueSubscriptions?.queueingExpiryDate}</p>
//                                                 <button
//                                                     onClick={() => {
//                                                         setPaymentModalOpen(true)
//                                                         setModalValue({
//                                                             queue: true,
//                                                             appointment: false
//                                                         })
//                                                         setCurrentSalonCurrency(s?.currency)
//                                                         setCurrentSalonisoCurrency(s?.isoCurrencyCode)
//                                                         setSelectedSalonId(s?.salonId)
//                                                         setIsQueueClicked(true)
//                                                         setisAppointClicked(false)

//                                                     }}
//                                                 >{s?.queueSubscriptions?.bought === "" ? "Buy" : "Renew"}</button>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <div>
//                                                 <div>
//                                                     <p>Appointment</p>
//                                                     {
//                                                         s?.appointmentSubscriptions?.isAppointmentTrailEnabled === "true" ? (
//                                                             <div style={{
//                                                                 height: "3rem",
//                                                                 background: "var(--color-3)",
//                                                                 paddingInline: "1rem",
//                                                                 color: "var(--color-2)",
//                                                                 display: "flex",
//                                                                 justifyContent: "center",
//                                                                 alignItems: "center",
//                                                                 borderRadius: "2rem"
//                                                             }}><p>Free</p></div>
//                                                         ) :
//                                                             s?.appointmentSubscriptions?.isAppointmentTrailEnabled === "false" && (
//                                                                 <div style={{
//                                                                     height: "3rem",
//                                                                     background: "rgba(0, 255, 0, 0.498)",
//                                                                     paddingInline: "1rem",
//                                                                     color: "var(--color-2)",
//                                                                     display: "flex",
//                                                                     justifyContent: "center",
//                                                                     alignItems: "center",
//                                                                     borderRadius: "2rem"
//                                                                 }}><p>Paid</p></div>
//                                                             )
//                                                     }
//                                                 </div>
//                                                 <p>{s?.appointmentSubscriptions?.appointmentExpiryDate}</p>
//                                                 <button
//                                                     onClick={() => {
//                                                         setPaymentModalOpen(true)
//                                                         setModalValue({
//                                                             queue: false,
//                                                             appointment: true
//                                                         })
//                                                         setIsQueueClicked(false)
//                                                         setisAppointClicked(true)
//                                                         setCurrentSalonCurrency(s?.currency)
//                                                         setCurrentSalonisoCurrency(s?.isoCurrencyCode)
//                                                         setSelectedSalonId(s?.salonId)
//                                                     }}
//                                                 >{s?.appointmentSubscriptions?.bought === "" ? "Buy" : "Renew"}</button>
//                                             </div>
//                                         </div> */}


//                                     </div>
//                                 </div>
//                             )
//                         })
//                 }


//             </div>

//             <p></p>
//             <Modal
//                 open={paymentModalOpen}
//                 // onClose={() => {
//                 //     setPaymentModalOpen(false)
//                 //     setServicesData([
//                 //         {
//                 //             id: 1,
//                 //             name: "Appointment",
//                 //             value: false,
//                 //             price: 300,
//                 //             currency: "usd",
//                 //             quantity: 1
//                 //         },
//                 //         {
//                 //             id: 2,
//                 //             name: "Queueing",
//                 //             value: false,
//                 //             price: 200,
//                 //             currency: "usd",
//                 //             quantity: 1
//                 //         }
//                 //     ])
//                 //     setAppointmentCheck(false)
//                 //     setQueueingCheck(false)
//                 //     setPaymentType("Free")
//                 // }}

//                 onClose={() => {
//                     setModalValue({
//                         queue: false,
//                         appointment: false
//                     })
//                     setPaymentModalOpen(false)
//                 }}

//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//             >
//                 <div className={`${style.modal_payment_container} ${darkmodeOn && style.dark}`}>
//                     <div>
//                         <p>Buy Services</p>
//                         <button onClick={() => {
//                             // setPaymentModalOpen(false)
//                             // setPaymentType("Free")
//                             setModalValue({
//                                 queue: false,
//                                 appointment: false
//                             })
//                             setPaymentModalOpen(false)
//                             setPaymentType("Free")
//                         }}><CloseIcon /></button>
//                     </div>

//                     <div className={`${style.modal_payment_content_container} ${darkmodeOn && style.dark}`}>

//                         <div>
//                             <p>{modalValue.queue ? "Queue" : "Appointment"}</p>
//                             <p>{paymentType === "Free" ? `${currentSalonCurrency}0` : `${currentSalonCurrency}${modalValue.queue ? 300 : 400}`}</p>
//                         </div>
//                         <div>
//                             <p>Plan Validity</p>
//                             <p>{paymentType === "Free" ? 14 : planValidityDate}days</p>
//                         </div>

//                         <div>
//                             <p>Type</p>
//                             <select
//                                 value={paymentType}
//                                 onChange={(e) => setPaymentType(e.target.value)}
//                             >
//                                 {/* <option value="" disabled>Select</option> */}
//                                 <option value="Free">Free</option>
//                                 <option value="Paid">Paid</option>
//                             </select>
//                         </div>
//                         <p>

//                         </p>
//                         {
//                             paymentType === "Free" ?
//                                 (<button className={style.salon_payment_btn}
//                                     onClick={freePaymentHandler}
//                                 >Free</button>) :
//                                 (<button className={style.salon_payment_btn}
//                                     onClick={paidPaymentHandler}
//                                 // onClick={paymentHandler}
//                                 >Pay</button>)
//                         }
//                     </div>
//                 </div>

//             </Modal>

//         </div>
//     )
// }

// export default Subscription



import React, { useEffect, useState } from 'react'
import style from './Subscription.module.css'
import { useSelector } from 'react-redux'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import api from '../../Redux/api/Api'
import { ClickAwayListener, Modal } from '@mui/material'
import { CloseIcon } from '../../icons'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'

const Subscription = () => {

    const adminEmail = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)

    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"

    const [getSubscriptiondata, setGetSubscriptiondata] = useState([])
    const [getSubscriptionLoading, setGetSubscriptionLoading] = useState(false)

    useEffect(() => {
        const getSubscriptiondata = async () => {
            try {
                setGetSubscriptionLoading(true)
                const { data } = await api.post("/api/admin/getAllAdminSalonsSubcriptions", {
                    adminEmail
                })

                setGetSubscriptiondata(data.response)
                setGetSubscriptionLoading(false)
            } catch (error) {
                setGetSubscriptionLoading(false)
            }
        }
        getSubscriptiondata()
    }, [])

    const [currentSalonCurrency, setCurrentSalonCurrency] = useState("")
    const [currentSalonisoCurrency, setCurrentSalonisoCurrency] = useState("")
    const [selectedSalonId, setSelectedSalonId] = useState(null)


    const [appointmentCheck, setAppointmentCheck] = useState(false)
    const [queueingCheck, setQueueingCheck] = useState(false)

    const [servicesData, setServicesData] = useState([
        {
            id: 1,
            name: "Appointment",
            value: false,
            price: 300,
            quantity: 1
        },
        {
            id: 2,
            name: "Queueing",
            value: false,
            price: 200,
            quantity: 1
        }
    ])


    const [planValidityDate, setPlanValidityDate] = useState("")

    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [paymentType, setPaymentType] = useState("Paid")

    useEffect(() => {
        if (paymentType === "Free") {
            setPlanValidityDate(14)
        } else {
            setPlanValidityDate(30)
        }
    }, [paymentType])


    const totalPrice = servicesData.reduce(
        (total, item) => (item.value ? total + item.price : total),
        0
    );


    const [isQueueClicked, setIsQueueClicked] = useState(false)
    const [isAppointClicked, setisAppointClicked] = useState(false)


    const [currentProductPrice, setCurrentProductPrice] = useState(0)

    const [selectedProduct, setSelectedProduct] = useState({
        productName: "",
        productPrice: 0,
        planValidityDate: "",
        planType: ""
    })

    const [modalValue, setModalValue] = useState({
        queue: false,
        appointment: false
    })

    const freePaymentHandler = async () => {
        const productInfo = {
            salonId: selectedSalonId,
            isTrailEnabled: true,
            trailStartDate: new Date(),
            adminEmail: adminEmail,
            paymentType: "Free",
            planValidityDate: planValidityDate,
            products: [
                {
                    productName: isQueueClicked ? "Queue" : isAppointClicked && "Appointment",
                    productPrice: isQueueClicked ? 300 : isAppointClicked && 400,
                    currency: currentSalonCurrency,
                    isoCurrencyCode: currentSalonisoCurrency
                }
            ]
        }

        const confirm = window.confirm("Do you want to start free trial ?")

        if (confirm) {
            try {
                const { data } = await api.post("/api/salon/salonTrailPeriod", productInfo)

                window.location.reload()

            } catch (error) {
                toast.error(error.response.data.message, {
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

        // console.log(productInfo)
    }

    const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY

    const makePayment = async (product) => {

        try {
            const stripe = await loadStripe(STRIPE_KEY);

            const response = await axios.post("https://iqb-final.onrender.com/api/create-checkout-session", product)

            if (response.data && response.data.session && response.data.session.id) {
                await stripe.redirectToCheckout({
                    sessionId: response.data.session.id,
                });

            } else {
                console.error("Invalid session data: ", response.data);
            }

        } catch (error) {
            console.log(error)
        }
    }


    const paidPaymentHandler = async () => {
        const productInfo = {
            salonId: selectedSalonId,
            isTrailEnabled: false,
            trailStartDate: new Date(),
            adminEmail: adminEmail,
            paymentType: "Paid",
            planValidityDate: planValidityDate,
            products: [
                {
                    productName: isQueueClicked ? "Queue" : isAppointClicked && "Appointment",
                    productPrice: isQueueClicked ? 300 : isAppointClicked && 400,
                    currency: currentSalonCurrency,
                    isoCurrencyCode: currentSalonisoCurrency
                }
            ]
        }

        // console.log(productInfo)

        const confirm = window.confirm("Would you prefer to purchase now?")

        if (confirm) {
            try {
                makePayment(productInfo)

            } catch (error) {
                toast.error(error.response.data.message, {
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



        // console.log(productInfo)
    }

    const [mobileWidth, setMobileWidth] = useState(window.innerWidth <= 430 ? true : false)

    useEffect(() => {
        const resizeHandler = () => {
            if (window.innerWidth <= 430) {
                setMobileWidth(true)
            } else {
                setMobileWidth(false)
            }
        }
        window.addEventListener("resize", resizeHandler)

        return () => {
            window.removeEventListener("resize", resizeHandler)
        }
    }, [])

    // console.log(mobileWidth)

    return (
        <div className={`${style.section}`}>
            <div>
                <h2>Subscriptions</h2>
            </div>

            {
                getSubscriptionLoading ? (
                    <div className={`${style.list_body_container_loader}`}>
                        <Skeleton
                            count={1}
                            height={"25rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                        />

                        <Skeleton
                            count={1}
                            height={"25rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                        />

                        <Skeleton
                            count={1}
                            height={"25rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                        />

                        <Skeleton
                            count={1}
                            height={"25rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                        />

                        <Skeleton
                            count={1}
                            height={"25rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                        />

                        <Skeleton
                            count={1}
                            height={"25rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                        />
                    </div>
                ) :
                    getSubscriptiondata.length > 0 ?
                        <div className={`${style.subscription_status_content_wrapper} ${darkmodeOn && style.dark}`}>
                            {
                                getSubscriptiondata.map((s, index) => {
                                    return (
                                        <div className={`${style.subscription_content_item} ${darkmodeOn && style.dark}`}
                                            key={s.salonId}

                                        >
                                            <div>
                                                <img src={s?.salonLogo?.[0]?.url} alt="" />
                                                <p>{s?.salonName}</p>
                                            </div>
                                            <div>

                                                {
                                                    s?.subscriptions.map((sub, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div>
                                                                    <div>
                                                                        <p>{sub?.name}</p>

                                                                        {
                                                                            sub?.trial === "Free" ? (
                                                                                <div style={{
                                                                                    height: "2.2rem",
                                                                                    background: "#0285c755",
                                                                                    paddingInline: "1rem",
                                                                                    color: "var(--color-2)",
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    borderRadius: "2rem",
                                                                                    fontSize: "1.4rem",
                                                                                }}><p>Free</p></div>
                                                                            ) : sub?.trial === "Paid" ? (
                                                                                <div style={{
                                                                                    height: "2.2rem",
                                                                                    background: "oklch(93.8% 0.127 124.321)",
                                                                                    paddingInline: "1rem",
                                                                                    color: "var(--color-2)",
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    borderRadius: "2rem",
                                                                                    fontSize: "1.4rem"
                                                                                }}><p style={{ color: "#000"}}>Paid</p></div>
                                                                            ) : null
                                                                        }


                                                                    </div>
                                                                    <p>{sub?.expirydate === "" ? "select a plan" : sub?.expirydate}</p>
                                                                    <button
                                                                        // className={mobileWidth ? style.mobile_renew_btn : style.renew_btn}
                                                                        className={mobileWidth ? style.mobile_renew_btn : style.renew_btn}
                                                                        onClick={() => {
                                                                            setPaymentModalOpen(true)
                                                                            setModalValue({
                                                                                queue: sub?.name === "Queue" ? true : false,
                                                                                appointment: sub?.name === "Appointment" ? true : false
                                                                            })
                                                                            setCurrentSalonCurrency(s?.currency)
                                                                            setCurrentSalonisoCurrency(s?.isoCurrencyCode)
                                                                            setSelectedSalonId(s?.salonId)
                                                                            setIsQueueClicked(sub?.name === "Queue" ? true : false)
                                                                            setisAppointClicked(sub?.name === "Appointment" ? true : false)

                                                                        }}
                                                                    >{sub?.bought === "" ? "Buy" : "Renew"}</button>

                                                                </div>
                                                            </div>

                                                        )
                                                    })
                                                }


                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        : (<div className={`${style.list_body_container_error}`}>
                            <p>No subscription available</p>
                        </div>)

            }


            {
                getSubscriptionLoading ? (
                    <div className={`${style.list_container_mobile_loader}`}>
                        <Skeleton
                            count={6}
                            height={"25rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                            style={{ marginBottom: "2rem" }}
                        />
                    </div>
                ) :
                    getSubscriptiondata.length > 0 ?
                        <div className={`${style.subscription_status_mobile_content_wrapper} ${darkmodeOn && style.dark}`}>
                            {
                                getSubscriptiondata.map((s, index) => {
                                    return (
                                        <div className={`${style.subscription_mobile_content_item} ${darkmodeOn && style.dark}`}
                                            key={s.salonId}

                                        >
                                            <div>
                                                <img src={s?.salonLogo?.[0]?.url} alt="" />
                                                <p>{s?.salonName}</p>
                                            </div>
                                            <div>

                                                {
                                                    s?.subscriptions.map((sub, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div>
                                                                    <div>
                                                                        <p>{sub?.name}</p>

                                                                        {
                                                                            sub?.trial === "Free" ? (
                                                                                <div style={{
                                                                                    height: "2.2rem",
                                                                                    background: "#0285c755",
                                                                                    paddingInline: "1rem",
                                                                                    color: "var(--color-2)",
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    borderRadius: "2rem",
                                                                                    fontSize: "1.4rem"
                                                                                }}><p>Free</p></div>
                                                                            ) : sub?.trial === "Paid" ? (
                                                                                <div style={{
                                                                                    height: "2.2rem",
                                                                                    background: "#00A36C",
                                                                                    paddingInline: "1rem",
                                                                                    color: "var(--color-2)",
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    alignItems: "center",
                                                                                    borderRadius: "2rem",
                                                                                    fontSize: "1.4rem"
                                                                                }}><p>Paid</p></div>
                                                                            ) : null
                                                                        }


                                                                    </div>
                                                                    <p>{sub?.expirydate === "" ? "select a plan" : sub?.expirydate}</p>
                                                                </div>
                                                                <button
                                                                    className={style.renew_btn}
                                                                    onClick={() => {
                                                                        setPaymentModalOpen(true)
                                                                        setModalValue({
                                                                            queue: sub?.name === "Queue" ? true : false,
                                                                            appointment: sub?.name === "Appointment" ? true : false
                                                                        })
                                                                        setCurrentSalonCurrency(s?.currency)
                                                                        setCurrentSalonisoCurrency(s?.isoCurrencyCode)
                                                                        setSelectedSalonId(s?.salonId)
                                                                        setIsQueueClicked(sub?.name === "Queue" ? true : false)
                                                                        setisAppointClicked(sub?.name === "Appointment" ? true : false)

                                                                    }}
                                                                >{sub?.bought === "" ? "Buy" : "Renew"}</button>

                                                            </div>

                                                        )
                                                    })
                                                }


                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        : (<div className={`${style.list_container_mobile_error}`}>
                            <p>No subscription available</p>
                        </div>)
            }


            <p></p>

            <Modal
                open={paymentModalOpen}
                onClose={() => {
                    setModalValue({
                        queue: false,
                        appointment: false
                    })
                    setPaymentModalOpen(false)
                }}

                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={`${style.modal_payment_container} ${darkmodeOn && style.dark}`}>
                    <div>
                        <p>Buy Services</p>
                        <button onClick={() => {
                            setModalValue({
                                queue: false,
                                appointment: false
                            })
                            setPaymentModalOpen(false)
                            setPaymentType("Paid")
                        }}><CloseIcon /></button>
                    </div>

                    <div className={`${style.modal_payment_content_container} ${darkmodeOn && style.dark}`}>

                        <div>
                            <p>{modalValue.queue ? "Queue" : "Appointment"}</p>
                            <p>{paymentType === "Free" ? `${currentSalonCurrency}0` : `${currentSalonCurrency}${modalValue.queue ? 300 : 400}`}</p>
                        </div>
                        <div>
                            <p>Plan Validity</p>
                            <p>{paymentType === "Free" ? 14 : planValidityDate}days</p>
                        </div>

                        {/* <div>
                            <p>Type</p>
                            <select
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                            >
                                <option value="Free">Free</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div> */}
                        <p>

                        </p>
                        {
                            paymentType === "Free" ?
                                (<button className={style.salon_payment_btn}
                                    onClick={freePaymentHandler}
                                >Free</button>) :
                                (<button className={style.salon_payment_btn}
                                    onClick={paidPaymentHandler}
                                >Pay</button>)
                        }
                    </div>
                </div>

            </Modal>

        </div>
    )
}

export default Subscription