// import React, { useEffect, useRef, useState } from 'react'
// import style from "./QueHistory.module.css"
// import Skeleton from 'react-loading-skeleton'
// import { useDispatch, useSelector } from 'react-redux'
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import { CheckIcon, CloseIcon, CrownIcon, SearchIcon } from '../../icons'
// import { getAdminQueueListHistoryAction } from '../../Redux/Admin/Actions/QueueAction'

// const QueHistory = () => {

//     const darkMode = useSelector(darkmodeSelector)

//     const darkmodeOn = darkMode === "On"

//     const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

//     const dispatch = useDispatch()

//     const queuelistcontrollerRef = useRef(new AbortController());

//     useEffect(() => {
//         const controller = new AbortController();
//         queuelistcontrollerRef.current = controller;

//         dispatch(getAdminQueueListHistoryAction(salonId, controller.signal));

//         return () => {
//             if (queuelistcontrollerRef.current) {
//                 queuelistcontrollerRef.current.abort();
//             }
//         };
//     }, [salonId, dispatch]);


//     const getAdminQueueListHistory = useSelector(state => state.getAdminQueueListHistory)

//     const {
//         loading: getAdminQueueListHistoryLoading,
//         resolve: getAdminQueueListHistoryResolve,
//         queueListHistory: AdminQueueListHistory
//     } = getAdminQueueListHistory

//     const [copyAdminQueueHistory, setCopyAdminQueueHistory] = useState([])

//     useEffect(() => {
//         if (AdminQueueListHistory) {
//             setCopyAdminQueueHistory(AdminQueueListHistory)
//         }
//     }, [AdminQueueListHistory])

//     const [search, setSearch] = useState('')

//     const searchCustomHandler = (value) => {
//         setSearch(value);
//         const searchValue = value.toLowerCase().trim();

//         if (!searchValue) {
//             setCopyAdminQueueHistory(AdminQueueListHistory);
//         } else {
//             const filteredArray = AdminQueueListHistory?.filter((queue) => {
//                 return (
//                     queue.barberName.toLowerCase().includes(searchValue) ||
//                     queue.customerName.toLowerCase().includes(searchValue)
//                 )
//             });
//             setCopyAdminQueueHistory(filteredArray);
//         }
//     };


//     const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

//     const {
//       response: adminGetDefaultSalonResponse
//     } = adminGetDefaultSalon

//     return (
//         <div className={`${style.quehistory_wrapper} ${darkmodeOn && style.dark}`}>
//             <div>
//                 <p>Queue History</p>

//                 <div className={`${style.customer_search} ${darkmodeOn && style.dark}`}>
//                     <input
//                         type="text"
//                         placeholder='Search Queue'
//                         value={search}
//                         onChange={(e) => searchCustomHandler(e.target.value)}
//                     />

//                     <div><SearchIcon /></div>
//                 </div>

//             </div>

//             <div className={`${style.quehistory_wrapper_content}`}>

//                 {
//                     getAdminQueueListHistoryLoading ? (<div className={style.quehistory_wrapper_content_body}>
//                         <Skeleton count={6} height={"6rem"} style={{ marginBottom: "1rem" }}
//                             baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                             highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
//                     </div>) :
//                         getAdminQueueListHistoryResolve && copyAdminQueueHistory?.length > 0 ? (
//                             <>
//                                 <div className={`${style.quehistory_wrapper_content_body} ${darkmodeOn && style.dark}`}>
//                                     <div>
//                                         <p>#</p>
//                                         <p>Name</p>
//                                         <p>Barber Name</p>
//                                         <p>Time Joined Q</p>
//                                         <div><p>Qg Code</p></div>
//                                         <div><p>EWT</p></div>
//                                         <div><p>Price</p></div>
//                                         <div><p>Type</p></div>
//                                         <div><p>isAdmin</p></div>
//                                         <div><p>Status</p></div>
//                                     </div>

//                                     {copyAdminQueueHistory?.map((b, index) => (
//                                         <div
//                                             className={`${style.barber_queue_history_content_body_item} ${darkmodeOn && style.dark}`}
//                                             key={b?._id}
//                                             style={{
//                                                 borderBottom: copyAdminQueueHistory.length - 1 === index && "none"
//                                             }}
//                                         >
//                                             <p>{b?.qPosition}</p>
//                                             <p>{b?.customerName}</p>
//                                             <p>{b?.barberName}</p>
//                                             <p>{b?.timeJoinedQ}</p>
//                                             <div><p>{b?.qgCode}</p></div>
//                                             <div><p>{b?.serviceEWT} mins</p></div>
//                                             <div><p>{adminGetDefaultSalon?.response?.currency}{" "}{b?.services.reduce((sum, service) => sum + service.servicePrice, 0)}</p></div>
//                                             <div><p>{b?.serviceType === "Regular" ? "-" : <CrownIcon />}</p></div>
//                                             <div>
//                                                 {
//                                                     b?.isAdmin ? (<p style={{ color: "green" }}><CheckIcon /></p>) : (<p style={{ fontSize: "2rem", fontWeight: "700", color: "red" }}><CloseIcon /></p>)
//                                                 }
//                                             </div>
//                                             <div><p style={{ color: b?.status == "served" ? "green" : "red" }}>{b?.status}</p></div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </>
//                         ) : (
//                             <div className={`${style.quehistory_wrapper_content_body_error} ${darkmodeOn && style.dark}`}>
//                                 <p>No Queue history available</p>
//                             </div>
//                         )
//                 }

//             </div>
//         </div>
//     )
// }

// export default QueHistory


import React, { useEffect, useRef, useState } from 'react'
import style from "./QueHistory.module.css"
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import { AppointmentIcon, CheckIcon, CloseIcon, CustomerIcon, DropdownIcon, GroupJoinIcon, KioskIcon, MobileIcon, ResetIcon, SearchIcon } from '../../newicons';
import { getAdminQueueListHistoryAction } from '../../Redux/Admin/Actions/QueueAction'
import { ClickAwayListener, Pagination } from '@mui/material'
import { Calendar } from 'react-multi-date-picker'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { formatMinutesToHrMin } from '../../../utils/formatMinutesToHrMin'

const QueHistory = () => {

    const [barberData, setBarberData] = useState({
        barberName: "",
        barberEmail: "",
        barberId: "",
        barber: false
    })

    const [customerData, setCustomerData] = useState({
        customerName: "",
        customerEmail: "",
        customer: false
    })

    useEffect(() => {
        const QueueHistoryBarber = localStorage.getItem("QueueHistoryBarber")
            ? JSON.parse(localStorage.getItem("QueueHistoryBarber"))
            : null;

        const QueueHistoryCustomer = localStorage.getItem("QueueHistoryCustomer")
            ? JSON.parse(localStorage.getItem("QueueHistoryCustomer"))
            : null;

        if (QueueHistoryBarber) {
            setBarberData({
                barberName: QueueHistoryBarber?.name,
                barberEmail: QueueHistoryBarber?.email,
                barberId: QueueHistoryBarber?.barberId,
                barber: QueueHistoryBarber?.barber
            });
        }

        if (QueueHistoryCustomer) {
            setCustomerData({
                customerName: QueueHistoryCustomer?.name,
                customerEmail: QueueHistoryCustomer?.email,
                customer: QueueHistoryCustomer?.customer
            });
        }

        return () => {
            localStorage.removeItem("QueueHistoryBarber")
            localStorage.removeItem("QueueHistoryCustomer")
        }
    }, []);

    // console.log("Barber Data ", barberData)
    // console.log("Customer Data ", customerData)


    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"

    const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

    const dispatch = useDispatch()

    const queuelistcontrollerRef = useRef(new AbortController());

    const [selectedDates, setSelectedDates] = useState([])


    useEffect(() => {
        const controller = new AbortController();
        queuelistcontrollerRef.current = controller;

        const abortIfPending = () => {
            if (queuelistcontrollerRef.current) {
                queuelistcontrollerRef.current.abort();
            }
        };

        const getTotalDays = (start, end) => {
            const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
            const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
            return (utcEnd - utcStart) / (1000 * 60 * 60 * 24) + 1;
        };

        if (selectedDates.length === 2) {
            const startDate = new Date(selectedDates[0]);
            const endDate = new Date(selectedDates[1]);

            const totalDays = getTotalDays(startDate, endDate);

            if (totalDays > 30) {
                setSelectedDates([]);
                toast.error("Date range cannot exceed 30 days", {
                    duration: 3000,
                    style: {
                        fontSize: "var(--font-size-2)",
                        borderRadius: '0.3rem',
                        background: '#333',
                        color: '#fff',
                    },
                });
            } else {
                dispatch(getAdminQueueListHistoryAction(salonId, startDate, endDate, barberData?.barberId, customerData?.customerEmail, controller.signal));
            }

        } else if (selectedDates.length === 0) {
            dispatch(getAdminQueueListHistoryAction(salonId, "", "", barberData?.barberId, customerData?.customerEmail, controller.signal));
        }

        return abortIfPending;
    }, [salonId, dispatch, selectedDates, barberData, customerData]);


    const getAdminQueueListHistory = useSelector(state => state.getAdminQueueListHistory)

    const {
        loading: getAdminQueueListHistoryLoading,
        resolve: getAdminQueueListHistoryResolve,
        queueListHistory: AdminQueueListHistory
    } = getAdminQueueListHistory

    const [copyAdminQueueHistory, setCopyAdminQueueHistory] = useState([])

    useEffect(() => {
        if (AdminQueueListHistory) {
            setCopyAdminQueueHistory(AdminQueueListHistory)
        }
    }, [AdminQueueListHistory])

    const [search, setSearch] = useState('')

    const searchCustomHandler = (value) => {
        setSearch(value);
        const searchValue = value.toLowerCase().trim();

        if (!searchValue) {
            setCopyAdminQueueHistory(AdminQueueListHistory);
        } else {
            const filteredArray = AdminQueueListHistory?.filter((queue) => {
                return (
                    queue.barberName.toLowerCase().includes(searchValue) ||
                    queue.customerName.toLowerCase().includes(searchValue)
                )
            });
            setCopyAdminQueueHistory(filteredArray);
        }
    };


    const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

    const {
        response: adminGetDefaultSalonResponse
    } = adminGetDefaultSalon

    // console.log(adminGetDefaultSalonResponse)

    // ==========================================================

    const headRows = [
        { id: 1, heading: "QPos", key: "qpos" },
        { id: 2, heading: "Name", key: "customerName" },
        { id: 3, heading: "Barber Name", key: "barberName" },
        { id: 4, heading: "Time Joined", key: "timejoined" },
        { id: 5, heading: "Qg Code", key: "qgcode" },
        { id: 6, heading: "Price", key: "price" },
        { id: 7, heading: "Type", key: "type" },
        { id: 8, heading: "Est. Time", key: "estimatedtime" },
        { id: 9, heading: "isAdmin", key: "isAdmin" },
        { id: 10, heading: "Status", key: "status" },
    ];

    const [queuehistoryDataCopy, setQueuehistoryDataCopy] = useState([])
    const [queuehistoryData, setQueuehistoryData] = useState([])
    const [queueHistoryPaginationData, setQueueHistoryPaginationData] = useState([])
    const [mobileQueueList, setMobileQueueList] = useState([])

    useEffect(() => {
        if (getAdminQueueListHistoryResolve && AdminQueueListHistory.length > 0) {
            setQueuehistoryData(AdminQueueListHistory)
            setQueuehistoryDataCopy(AdminQueueListHistory)
            setMobileQueueList(AdminQueueListHistory)
        }

    }, [AdminQueueListHistory])


    const [settingsIndex, setSettingsIndex] = useState("")

    const [rowsPerPage, SetRowsPerPage] = useState(10)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(0)
    const [sortOrder, setSortOrder] = useState("asc")
    const [sortColumn, setSortColumn] = useState("")
    const [query, setQuery] = useState("")


    const paginationFunction = () => {
        const totalPages = Math.ceil(queuehistoryDataCopy.length / rowsPerPage);
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, queuehistoryDataCopy.length)

        setQueueHistoryPaginationData(queuehistoryDataCopy.slice(startIndex, endIndex));
        setTotalPages(totalPages);
        setStartIndex(startIndex);
        setEndIndex(endIndex);
    }

    useEffect(() => {
        if (queuehistoryDataCopy.length > 0) {
            paginationFunction()
        }
    }, [queuehistoryDataCopy, page, rowsPerPage])


    const handleChange = (event, value) => {
        setPage(value);
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



    useEffect(() => {

        if (mobileWidth) {
            let filteredData = queuehistoryDataCopy;

            if (query.trim() !== '') {
                filteredData = queuehistoryData.filter((item) =>
                    item.customerName.toLowerCase().trim().includes(query.toLowerCase()) ||
                    item.barberName.toLowerCase().trim().includes(query.toLowerCase())
                );
            }

            setMobileQueueList(filteredData)
        } else {
            if (query.trim() !== "") {
                const filterData = queuehistoryData.filter((item) =>
                    item.customerName.toLowerCase().trim().includes(query.toLowerCase()) ||
                    item.barberName.toLowerCase().trim().includes(query.toLowerCase())
                );
                setQueuehistoryDataCopy(filterData);
                setPage(1)
            } else {
                setQueuehistoryDataCopy(queuehistoryData);
                setPage(1)
            }
        }

    }, [query]);


    const [selectOpen, setSelectOpen] = useState(false)

    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false)
    const handleDateChange = (dates) => {
        const formatedDates = dates.map((date) => date.format("YYYY-MM-DD"))
        setSelectedDates(formatedDates)
    }

    const resetHandler = () => {
        dispatch(getAdminQueueListHistoryAction(salonId, "", "",));
        setSelectedDates([])
        setQuery("")
        localStorage.removeItem("QueueHistoryBarber")
        localStorage.removeItem("QueueHistoryCustomer")
        setBarberData({
            barberName: "",
            barberEmail: "",
            barberId: ""
        })
        setCustomerData({
            customerName: "",
            customerEmail: "",
            customer: false
        })

    }

    return (
        <section className={`${style.section}`}>
            <div>
                <h2>Queue History </h2>
                <div>

                    <button onClick={resetHandler}><ResetIcon /></button>

                    <div>
                        <button
                            title='Calender'
                            onClick={() => setCalendarOpen(!calendarOpen)}
                        ><AppointmentIcon /></button>

                        {calendarOpen && (
                            <div style={{ position: "absolute", top: "4rem", right: "0rem", zIndex: 200 }}>
                                <ClickAwayListener onClickAway={() => setCalendarOpen(false)}>
                                    <Calendar
                                        numberOfMonths={2}
                                        value={selectedDates}
                                        onChange={handleDateChange}
                                        range
                                        placeholder='yyyy-mm-dd - yyyy-mm-dd'
                                        dateSeparator={" - "}
                                        calendarPosition={"bottom-right"}
                                        className={true ? "dark-theme" : "light-theme"}
                                        style={{
                                            // background: true ? "#222" : "#fff"
                                        }}
                                    />
                                </ClickAwayListener>
                            </div>
                        )}
                    </div>

                    <input
                        type='text'
                        placeholder='Search'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className={`${style.mobile_header}`}>
                <h2>Queue History</h2>
                <div>
                    {
                        mobileSearchOpen ? (
                            <ClickAwayListener onClickAway={() => setMobileSearchOpen(false)}>
                                <div className={`${style.input_type_2}`}>
                                    <input
                                        type='text'
                                        placeholder='Search'
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />

                                    <button onClick={() => setMobileSearchOpen(false)}>
                                        <CloseIcon />
                                    </button>

                                </div>
                            </ClickAwayListener>
                        ) : (
                            <div style={{ position: "relative" }}>

                                <button onClick={resetHandler}><ResetIcon /></button>

                                <button
                                    title='Calender'
                                    onClick={() => setMobileCalendarOpen(!mobileCalendarOpen)}
                                ><AppointmentIcon /></button>

                                {mobileCalendarOpen && (
                                    <div style={{ position: "absolute", top: "4.5rem", right: "0rem", zIndex: 10 }}>
                                        <ClickAwayListener onClickAway={() => setMobileCalendarOpen(false)}>
                                            <Calendar
                                                numberOfMonths={1}
                                                value={selectedDates}
                                                onChange={handleDateChange}
                                                range
                                                placeholder='yyyy-mm-dd - yyyy-mm-dd'
                                                // onChange={handleDateChange}
                                                dateSeparator={" - "}
                                                calendarPosition={"bottom-right"}
                                                className={true ? "dark-theme" : "light-theme"}
                                                style={{
                                                    // background: true ? "#222" : "#fff"
                                                }}
                                            />
                                        </ClickAwayListener>
                                    </div>
                                )}

                                <button onClick={() => setMobileSearchOpen(true)}><SearchIcon /></button>

                            </div>
                        )
                    }

                </div>

            </div>

            <div className={`${style.list_container}`}>

                {
                    getAdminQueueListHistoryLoading ? (
                        <div className={`${style.list_body_container_loader}`}>
                            <Skeleton
                                count={6}
                                height={"6.5rem"}
                                baseColor={"var(--loader-bg-color)"}
                                highlightColor={"var(--loader-highlight-color)"}
                                style={{ marginBottom: "1rem" }} />
                        </div>
                    ) : getAdminQueueListHistoryResolve && AdminQueueListHistory.length > 0 ? (
                        <div className={`${style.list_body_container}`}>

                            <div className={`${style.headRow}`}>
                                {
                                    headRows.map((item, index) => {
                                        return (
                                            <div key={item.id}>
                                                <button
                                                    className={`${item.key === "customerName" || item.key === "barberName" ? style.name_head_btn : ""}`}
                                                // onClick={() => sortFunction(item.key)}
                                                >
                                                    {item.key === "customerName" || item.key === "barberName" ? (
                                                        <>
                                                            <span></span>
                                                            {item.heading}
                                                        </>
                                                    ) : (
                                                        item.heading
                                                    )}

                                                    {/* <span>{item.key && (sortColumn === item.key ? (sortOrder === 'asc' ? <SortUpIcon /> : <SortDownIcon />) : <SortUpDownArrowIcon />)}</span> */}
                                                </button>
                                            </div>
                                        )
                                    })
                                }

                            </div>

                            {
                                queueHistoryPaginationData.map((item, index) => {
                                    return (
                                        <div key={item._id} style={{ borderBottom: (index === endIndex - 1) || (index === queueHistoryPaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                                            <div><p>{item.qPosition}</p></div>
                                            <div>
                                                <div>
                                                    <div><img src={item?.customerProfile?.[0]?.url} alt="" /></div>
                                                    <p>{item.customerName}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <div><img src={item?.barberProfile?.[0]?.url} alt="" /></div>
                                                    <p>{item.barberName}</p>
                                                </div>
                                            </div>
                                            <div><p>{item.timeJoinedQ}</p></div>
                                            <div><p>{item.qgCode}</p></div>
                                            {/* <div><p>{adminGetDefaultSalon?.response?.currency}{" "}{item?.services.reduce((sum, service) => sum + service?.servicePrice, 0)}</p></div> */}
                                            <div><p>{adminGetDefaultSalon?.response?.currency}{" "}{Array.isArray(item?.services)
                                                ? item.services.reduce((sum, service) => sum + (service.servicePrice || 0), 0)
                                                : 0}</p></div>
                                            <div><p>{item.serviceType}</p></div>
                                            <div><p>{formatMinutesToHrMin(item.serviceEWT)}</p></div>
                                            <div><span>{item?.isAdmin ? (<CheckIcon color={"green"} />) : (<CloseIcon color={"var(--bg-secondary)"} />)}</span></div>
                                            <div><p style={{
                                                color: item.status === "served" ? "green" : "red"
                                            }}>{item.status}</p></div>

                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div className={`${style.list_body_container_error}`}>
                            <p>No queue history available</p>
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
                getAdminQueueListHistoryLoading ? (
                    <div className={style.list_container_mobile_loader}>
                        <Skeleton
                            count={6}
                            height={"19.5rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                            style={{ marginBottom: "1rem" }}
                        />
                    </div>
                ) : getAdminQueueListHistoryResolve && AdminQueueListHistory.length > 0 ? (
                    <div className={style.list_container_mobile}>
                        {barberData?.barber ? <p style={{ marginBottom: "2rem" }}>Barber - {barberData?.barberName}</p> : null}
                        {customerData?.customer ? <p style={{ marginBottom: "2rem" }}>Customer - {customerData?.customerName}</p> : null}
                        {
                            mobileQueueList?.map((item, index) => {
                                return (
                                    <div className={style.list_mobile_item} key={item._id}>
                                        <div>
                                            <div>
                                                <img src={item?.customerProfile?.[0]?.url} alt="" width={50} height={50} />
                                                <div>
                                                    <p>{item.customerName}</p>
                                                    <p>{item.barberName}</p>
                                                    <p>{item?.services?.map((item) => item.serviceName).join(", ")}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p>{adminGetDefaultSalon?.response?.currency}{" "}{Array.isArray(item?.services)
                                                    ? item.services.reduce((sum, service) => sum + (service.servicePrice || 0), 0)
                                                    : 0}</p>
                                                <p>{item.timeJoinedQ}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <div>{item.methodUsed === "App" ? <MobileIcon color={"#1ADB6A"} /> : <KioskIcon color={"#1ADB6A"} />}</div>
                                                <p>Mode</p>
                                            </div>

                                            <div>
                                                <div>{item.joinedQType === "Single-Join" ? <CustomerIcon color={"#1ADB6A"} /> : <GroupJoinIcon color={"#1ADB6A"} />}</div>
                                                <p>Type</p>
                                            </div>

                                            <div>
                                                <div>{item.status === "served" ? <CheckIcon color={"#1ADB6A"} /> : <CloseIcon color={"#FC3232"} />}</div>
                                                <p> {item.status === "served" ? "Served" : "Cancelled"}</p>
                                            </div>
                                        </div>



                                    </div>
                                )
                            })
                        }

                    </div>
                ) : (
                    <div className={style.list_container_mobile_error}>
                        <p>No queue history available</p>
                    </div>
                )
            }



        </section >
    )
}

export default QueHistory

