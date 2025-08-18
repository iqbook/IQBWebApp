// import React, { useEffect, useRef, useState } from 'react'
// import style from './PaymentStatus.module.css'
// import { useSelector } from 'react-redux'
// import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
// import api from '../../../Redux/api/Api'
// import Skeleton from 'react-loading-skeleton'

// const PaymentStatus = () => {

//     const [paymentStatusdata, setPaymentStatusdata] = useState([])
//     const [paymentStatusLoading, setPaymentStatusLoading] = useState(false)

//     const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

//     const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

//     const {
//         loading: adminGetDefaultSalonLoading,
//         resolve: adminGetDefaultSalonResolve,
//         response: adminGetDefaultSalonResponse
//     } = adminGetDefaultSalon

//     const PaymentistControllerRef = useRef(new AbortController());

//     useEffect(() => {
//         if (salonId !== 0) {
//             try {
//                 const controller = new AbortController();
//                 PaymentistControllerRef.current = controller;

//                 const fetchpayments = async () => {
//                     setPaymentStatusLoading(true)
//                     const { data } = await api.post("/api/salon/getSalonPaymentsBySalonId", {
//                         salonId
//                     }, { signal: controller.signal })

//                     setPaymentStatusdata(data.response)
//                     setPaymentStatusLoading(false)
//                 }

//                 fetchpayments()
//             } catch (error) {
//                 setPaymentStatusLoading(false)
//             }
//         }

//         return () => {
//             if (PaymentistControllerRef.current) {
//                 PaymentistControllerRef.current.abort();
//             }
//         };
//     }, [salonId])

//     console.log(paymentStatusdata)

//     const darkMode = useSelector(darkmodeSelector)

//     const darkmodeOn = darkMode === "On"

//     // const paymentStatusdata = [
//     //     {
//     //         _id: 1,
//     //         name: "Appointment",
//     //         price: 300,
//     //         buyDate: "2025-01-01",
//     //         expiryDate: "2025-02-25",
//     //         status: true,
//     //         planValidity: 30
//     //     },
//     //     {
//     //         _id: 2,
//     //         name: "Queueing",
//     //         price: 200,
//     //         buyDate: "2025-01-01",
//     //         expiryDate: "2025-02-25",
//     //         status: false,
//     //         planValidity: 60
//     //     },
//     // ]

//     return (
//         <div className={`${style.payment_status_wrapper} ${darkmodeOn && style.dark}`}>
//             <div>
//                 <p>Payment</p>
//             </div>

//             <div className={`${style.payment_status_content_wrapper} ${darkmodeOn && style.dark}`}>

//                 {
//                     paymentStatusLoading ? (
//                         <div className={`${style.payment_content_body} ${darkmodeOn && style.dark}`}>
//                             <Skeleton
//                                 count={6}
//                                 height={"6rem"}
//                                 baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                                 highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                                 style={{ marginBottom: "1rem" }} />
//                         </div>
//                     ) : paymentStatusdata?.length > 0 ? (
//                         <div className={`${style.payment_content_body} ${darkmodeOn && style.dark}`}>
//                             <div>
//                                 <p>Customer Name</p>
//                                 <p>Product Name</p>
//                                 <p>Price</p>
//                                 <p>Purchase</p>
//                                 <p>Expiry</p>
//                                 <p
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "center",
//                                         alignItems: "center"
//                                     }}
//                                 >Status</p>
//                             </div>



//                             {paymentStatusdata.map((s, index) => (
//                                 <div key={s?._id}
//                                     style={{
//                                         borderBottom: paymentStatusdata.length - 1 === index && "none"
//                                     }}
//                                 >
//                                     <p>{s?.customerName}</p>
//                                     <p>
//                                         {
//                                             (s?.isQueuing && s?.isAppointments) ? ("Queueing, Appointment") :
//                                                 s?.isQueuing ? ("Queueing") :
//                                                     s?.isAppointments && ("Appointments")
//                                         }
//                                     </p>
//                                     <p>{adminGetDefaultSalonResponse?.currency}{" "}{s?.amount}</p>
//                                     <p>{s?.purchaseDate}</p>
//                                     <p>{s?.paymentExpiryDate}</p>
//                                     <p
//                                         style={{
//                                             height: "3.5rem",
//                                             width: "8rem",
//                                             borderRadius: "2rem",
//                                             backgroundColor: s?.activityStatus ? "var(--color-9)" : "var(--color-11)",
//                                             color: s?.activityStatus ? "var(--color-8)" : "var(--color-10)",
//                                             border: s?.activityStatus ? "0.1rem solid var(--color-8)" : "0.1rem solid var(--color-10)",
//                                             fontWeight: "500",
//                                             display: "flex",
//                                             justifyContent: "center",
//                                             alignItems: "center"
//                                         }}
//                                     >{s?.activityStatus ? "Active" : "Inactive"}</p>
//                                 </div>
//                             ))}

//                         </div>
//                     ) : (
//                         <div className={`${style.payment_content_body_error} ${darkmodeOn && style.dark}`}>
//                             <p>No payments available</p>
//                         </div>
//                     )
//                 }

//             </div>

//         </div>
//     )
// }

// export default PaymentStatus

import React, { useEffect, useRef, useState } from 'react'
import style from "./PaymentStatus.module.css"
import { DropdownIcon, SalonThreeDotsIcon, SortDownIcon, SortUpDownArrowIcon, SortUpIcon } from '../../../newicons';
import { ClickAwayListener, FormControl, MenuItem, Pagination, Select, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import styled from "@emotion/styled";
import api from '../../../Redux/api/Api';
import { useSelector } from 'react-redux';
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer';
import Skeleton from 'react-loading-skeleton';

const PaymentStatus = () => {


  const [paymentStatusdata, setPaymentStatusdata] = useState([])
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(false)

  const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

  const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

  const {
    loading: adminGetDefaultSalonLoading,
    resolve: adminGetDefaultSalonResolve,
    response: adminGetDefaultSalonResponse
  } = adminGetDefaultSalon

  const PaymentistControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (salonId !== 0) {
      try {
        const controller = new AbortController();
        PaymentistControllerRef.current = controller;

        const fetchpayments = async () => {
          setPaymentStatusLoading(true)
          const { data } = await api.post("/api/salonPayments/getSalonPaymentHistoryBySalonId", {
            salonId
          }, { signal: controller.signal })

          setPaymentStatusdata(data.response)
          setPaymentStatusLoading(false)
        }

        fetchpayments()
      } catch (error) {
        setPaymentStatusLoading(false)
      }
    }

    return () => {
      if (PaymentistControllerRef.current) {
        PaymentistControllerRef.current.abort();
      }
    };
  }, [salonId])

  // console.log(paymentStatusdata)

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  // =======================================

  const headRows = [
    { id: 1, heading: "Invoice No.", key: "" },
    { id: 2, heading: "Product", key: "product" },
    { id: 3, heading: "Purchased", key: "purchased" },
    { id: 4, heading: "Expired", key: "expired" },
    { id: 5, heading: "Price", key: "price" },
    { id: 6, heading: "Transaction ID", key: "transactionid" },
    { id: 7, heading: "Time Period", key: "timeperiod" },
  ];


  const [paymenthistoryData, setpaymenthistoryData] = useState([])

  useEffect(() => {
    if (paymentStatusdata?.length > 0) {
      setpaymenthistoryData(paymentStatusdata)
    }
  }, [paymentStatusdata])

  const [settingsIndex, setSettingsIndex] = useState("")

  const [rowsPerPage, SetRowsPerPage] = useState(10)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowsPerPage)
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortColumn, setSortColumn] = useState("")

  const [salonPaymenthistoryPaginationData, setSalonPaymenthistoryPaginationData] = useState([])

  useEffect(() => {
    if (paymenthistoryData.length > 0) {
      setSalonPaymenthistoryPaginationData(paymenthistoryData.slice(startIndex, endIndex))
    }
  }, [paymenthistoryData])

  useEffect(() => {
    const totalPages = Math.ceil(paymenthistoryData.length / rowsPerPage);
    setTotalPages(totalPages);
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, paymenthistoryData.length);
    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setSalonPaymenthistoryPaginationData(paymenthistoryData.slice(startIndex, endIndex));
  }, [paymenthistoryData, page, rowsPerPage]);


  const handleChange = (event, value) => {
    setPage(value);
  }


  const [selectOpen, setSelectOpen] = useState(false)

  const navigate = useNavigate()



  return (
    <section className={`${style.section}`}>
      <div>
        <h2>Payment History</h2>
        {/* <button onClick={() => navigate("/admin-salon/createsalon")}>Create</button> */}
      </div>

      <div className={`${style.list_container}`}>

        {
          paymentStatusLoading ? (
            <div className={`${style.list_body_container_loader}`}>
              <Skeleton
                count={6}
                height={"6.5rem"}
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
                style={{ marginBottom: "1rem" }} />
            </div>
          ) : paymentStatusdata?.length > 0 ? (
            <div className={`${style.list_body_container}`}>

              <div className={`${style.headRow}`}>
                {
                  headRows.map((item, index) => {
                    return (
                      <div key={item.id}>
                        <button>
                          {item.heading}
                        </button>
                      </div>
                    )
                  })
                }

              </div>
              {
                salonPaymenthistoryPaginationData?.map((item, index) => {
                  return (
                    <div key={item._id} style={{ borderBottom: (index === endIndex - 1) || (index === salonPaymenthistoryPaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                      <div><p>{item.invoiceNumber}</p></div>
                      <div><p>{item.products?.[0]?.productName}</p></div>
                      <div><p>{item.purchaseDate}</p></div>
                      <div><p>{item.paymentExpiryDate}</p></div>
                      <div><p>{adminGetDefaultSalon?.response?.currency}{" "}{item.products?.[0]?.productPrice}</p></div>
                      <div><p>{item.paymentIntentId}</p></div>
                      <div><p>{item?.timePeriod}days</p></div>

                    </div>
                  )
                })
              }
            </div>
          ) : (
            <div className={`${style.list_body_container_error}`}>
              <p>No payment history available</p>
            </div>
          )
        }

        <div className={`${style.pagination_container}`}>
          <div></div>
          <div>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "var(--text-primary)",
                  fontSize: "1.4rem",
                },
                "& .Mui-selected": { backgroundColor: "var(--bg-secondary) !important", color: "var(--btn-text-color)" },
              }}
            />
          </div>
          <div>
            <div>
              <p>Rows Per Page</p>

              <ClickAwayListener onClickAway={() => setSelectOpen(false)}>
                <div className={`${style.select_container}`}>
                  <div onClick={() => setSelectOpen((prev) => !prev)}>
                    <input type="text" value={rowsPerPage} readOnly />
                    <div><DropdownIcon /></div>
                  </div>

                  {
                    selectOpen ? (<ul>
                      {
                        [10, 20, 30, 50].map((item, index) => {
                          return (
                            <li key={item} onClick={() => {
                              setPage(1)
                              SetRowsPerPage(item)
                              setSelectOpen(false)
                            }}
                              style={{
                                background: item === rowsPerPage ? "var(--bg-secondary)" : null,
                                color: item === rowsPerPage ? "var(--btn-text-color)" : null,
                                borderBottom: index === [10, 20, 30, 50].length - 1 ? "none" : "0.1rem solid var(--border-secondary)"
                              }}
                            >{item}</li>
                          )
                        })
                      }

                    </ul>) : (null)
                  }
                </div>
              </ClickAwayListener>

            </div>
            <div>
              <p>{startIndex} - {endIndex}{" "} of {totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {
        paymentStatusLoading ? (
          <div className={style.list_container_mobile_loader}>
            <Skeleton
              count={6}
              height={"14rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }} />
          </div>
        ) : paymentStatusdata?.length > 0 ? (
          <div className={style.list_container_mobile}>

            {
              paymentStatusdata?.map((item, index) => {
                return (
                  <div className={style.list_mobile_item} key={item._id}>
                    <div>
                      <p>{item.products?.[0]?.productName}</p>
                      <p><span>Transaction ID :</span>&nbsp;{item.paymentIntentId}</p>
                    </div>

                    <div>
                      <div>
                        <div>
                          <p>Invoice No.</p>
                          <p>{item.invoiceNumber}</p>
                        </div>

                        <div>
                          <p>Validity</p>
                          <p>{item.purchaseDate} - {item.paymentExpiryDate}</p>
                        </div>
                      </div>

                      <div>
                        <div>
                          <p>Plan</p>
                          <p>{item?.timePeriod} Days</p>
                        </div>

                        <div>
                          <p>Price</p>
                          <p>{adminGetDefaultSalon?.response?.currency}{" "}{item.products?.[0]?.productPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            }

          </div>
        ) : (
          <div className={style.list_container_mobile_error}>
            <p>No payment history available</p>
          </div>
        )
      }

      {/* <div className={style.list_container_mobile}>

        <div className={style.list_mobile_item}>
          <div>
            <p>Queueing</p>
            <p><span>Transaction ID : pi_3qysvsdv</span></p>
          </div>

          <div>
            <div>
              <div>
                <p>Invoice No.</p>
                <p>IQB-MAR-016</p>
              </div>

              <div>
                <p>Validity</p>
                <p>1 Mar 2025 - 30 Mar 2025</p>
              </div>
            </div>

            <div>
              <div>
                <p>Plan</p>
                <p>30 Days</p>
              </div>

              <div>
                <p>Price</p>
                <p>$ 120</p>
              </div>
            </div>
          </div>
        </div>

      </div> */}

      {/* <div className={style.list_container_mobile_loader}>
        <Skeleton
          count={6}
          height={"14rem"}
          baseColor={"var(--loader-bg-color)"}
          highlightColor={"var(--loader-highlight-color)"}
          style={{ marginBottom: "1rem" }} />
      </div> */}

      {/* <div className={style.list_container_mobile_error}>
        <p>No payment history available</p>
      </div> */}

    </section>
  )
}

export default PaymentStatus