import React, { useEffect, useState } from 'react'
import style from "./MobileCus.module.css"
import { ClickAwayListener, Modal } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

const MobileCust = () => {

    const [openDropdown, setOpenDropdown] = useState(false)

    const [selectedSalonId, setSelectedSalonId] = useState(0)
    const [selectedEmail, setSelectedEmail] = useState("")
    const [selectedSalonName, setSelectedSalonName] = useState("")
    const [selectedVendorAccountId, setSelectedVendorAccountId] = useState("")
    const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState("")
    const [selectedCurrency, setSelectedCurrency] = useState("")

    const [customerName, setCustomerName] = useState("")
    const [customerEmail, setCustomerEmail] = useState("")

    const [products, setProducts] = useState([
        {
            _id: 1,
            image: "https://www.shutterstock.com/image-photo/book-your-appointment-text-on-600nw-2400843205.jpg",
            name: "Appointment",
            price: 1500,
            // currency: "usd",
            unit: 1
        }
    ])

    useEffect(() => {
        setProducts((prev) => {
            const updatedArray = prev.map((s) => {
                return { ...s, currency: selectedCurrency }
            })
            return updatedArray
        })
    }, [selectedSalonId])

    const [getAllSalonData, setGetAllSalonData] = useState([])

    const BASE_URL = "https://iqb-final.onrender.com"

    useEffect(() => {
        const getAllSalondataFunc = async () => {
            const { data } = await axios.get(`${BASE_URL}/api/mobileRoutes/getallSalonsTest`)
            setGetAllSalonData(data.response)
        }

        getAllSalondataFunc()
    }, [])

    useEffect(() => {
        if (selectedEmail) {
            const getVendorEmail = async () => {
                const { data } = await axios.post(`${BASE_URL}/api/mobileRoutes/getAdminByEmailTest`, { adminEmail: selectedEmail })
                setSelectedVendorAccountId(data?.response?.vendorAccountDetails?.vendorAccountId)
            }

            getVendorEmail()
        }
    }, [selectedEmail])

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const paymentHandler = async (product) => {

        if (!customerName) {
            return toast.error("Please enter customer name", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

        if (!customerEmail) {
            return toast.error("Please enter customer email", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

        if (!emailRegex.test(customerEmail)) {
            return toast.error("Invalid email format", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: "0.3rem",
                    background: "#333",
                    color: "#fff",
                },
            });
        }

        if (!selectedSalonName) {
            return toast.error("Please enter salon name", {
                duration: 3000,
                style: {
                    fontSize: "var(--font-size-2)",
                    borderRadius: '0.3rem',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

        const paymentData = {
            productInfo: {
                salonId: selectedSalonId,
                salonName: selectedSalonName,
                adminEmail: selectedEmail,
                vendorAccountId: selectedVendorAccountId,
                customerName: customerName,
                customerEmail: customerEmail,
                paymentType: "Paid",
                isAppointments: true,
                products: products,
                currency: selectedCurrencySymbol,
                isoCurrencyCode: selectedCurrency
            }
        }

        console.log(paymentData)

        makePayment(paymentData)
    }

    const makePayment = async (product) => {

        try {
            const stripe = await loadStripe('pk_test_51QiEoiBFW0Etpz0PujBksQP2p8rCRaq1gXfFfbM48EohSKBOKorS1tyPrV0QU4TNEoJONsLK2rOkXITDUltlysdQ00LZX8pnZm');

            const response = await axios.post("https://iqb-final.onrender.com/api/vendor-create-checkout-session", product)

            if (response.data && response.data.session && response.data.session.id) {
                await stripe.redirectToCheckout({
                    sessionId: response.data.session.id,
                });

            } else {
                console.error("Invalid session data: ", response.data);
            }

        } catch (error) {
            console.log(error)
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

    return (
        <main className={style.mobile_cus_container}>
            <button onClick={() => { window.location.href = "/" }}>Home</button>
            <h3>Dummy Customer Page</h3>

            <div>
                <input
                    type="text"
                    placeholder='Enter Customer Name'
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>

            <div>
                <input
                    type="text"
                    placeholder='Enter Customer Email'
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                />
            </div>

            <ClickAwayListener onClickAway={() => setOpenDropdown(false)}>
                <div>
                    <input type="text" placeholder={"Select salon"} value={selectedSalonName} onClick={() => setOpenDropdown((prev) => !prev)} readOnly />
                    {openDropdown && <div>
                        {
                            getAllSalonData.map((s, index) => {
                                return (
                                    <p key={index}
                                        onClick={() => {
                                            setSelectedSalonName(s?.salonName)
                                            setSelectedEmail(s?.adminEmail)
                                            setSelectedSalonId(s?.salonId)
                                            setSelectedCurrencySymbol(s?.currency)
                                            setSelectedCurrency(s?.isoCurrencyCode)
                                            setOpenDropdown(false)
                                        }}
                                    >{s?.salonName}</p>
                                )
                            })
                        }
                    </div>}
                </div>
            </ClickAwayListener>

            <div>
                <p>Selected Salon Name: {selectedSalonName}</p>
                <p>Selected Vendor Email: {selectedEmail}</p>
                <p>Selected Salon ID: {selectedSalonId}</p>
                <p>Vendor AccountID: {selectedVendorAccountId ? selectedVendorAccountId : "No ID"}</p>
                <p>Customer Name: {customerName}</p>
                <p>Customer Email: {customerEmail}</p>
            </div>

            {
                products.map((product) => {
                    return (
                        <div className={style.product_item} key={product._id}>
                            <img src={product.image} alt="camera" />
                            <div>
                                <p>Product Name: {product.name}</p>
                                <p>Product Price: {product?.currency}{product.price}</p>
                                <p>Quantity: {product.unit}</p>
                            </div>
                            <button onClick={() => paymentHandler(product)}>Check-out</button>
                        </div>
                    )
                })
            }

        </main>
    )
}

export default MobileCust