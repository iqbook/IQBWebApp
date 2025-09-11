// import React, { useEffect, useRef } from 'react'
// import style from "./QueHistory.module.css"
// import Skeleton from 'react-loading-skeleton'
// import { useDispatch, useSelector } from 'react-redux'
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import { CrownIcon } from '../../icons'
// import { getBarberQueueListHistoryAction } from '../../Redux/Barber/Actions/BarberQueueAction'

// const QueHistory = () => {

//     const darkMode = useSelector(darkmodeSelector)

//     const darkmodeOn = darkMode === "On"


//     const salonId = useSelector(state => state.BarberLoggedInMiddleware.barberSalonId)
//     const barberId = useSelector(state => state.BarberLoggedInMiddleware.barberId)

//     const dispatch = useDispatch()

//     const queuelistcontrollerRef = useRef(new AbortController());

//     useEffect(() => {
//         const controller = new AbortController();
//         queuelistcontrollerRef.current = controller;

//         dispatch(getBarberQueueListHistoryAction(salonId, barberId, controller.signal));

//         return () => {
//             if (queuelistcontrollerRef.current) {
//                 queuelistcontrollerRef.current.abort();
//             }
//         };
//     }, [salonId, barberId, dispatch]);


//     const getBarberQueueListHistory = useSelector(state => state.getBarberQueueListHistory)

//     const {
//         loading: getBarberQueueListHistoryLoading,
//         resolve: getBarberQueueListHistoryResolve,
//         queueListHistory: BarberQueueListHistory
//     } = getBarberQueueListHistory

//     const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata)

//     console.log(barberProfile)

//     return (
//         <div className={`${style.quehistory_wrapper} ${darkmodeOn && style.dark}`}>
//             <div>
//                 <p>Queue History</p>
//             </div>

//             <div className={`${style.quehistory_wrapper_content}`}>

//                 {
//                     getBarberQueueListHistoryLoading ? (<div className={style.quehistory_wrapper_content_body}>
//                         <Skeleton count={6} height={"6rem"} style={{ marginBottom: "1rem" }}
//                             baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                             highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
//                     </div>) :
//                         getBarberQueueListHistoryResolve && BarberQueueListHistory?.length > 0 ? (
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
//                                         <div><p>Status</p></div>
//                                     </div>

//                                     {BarberQueueListHistory?.map((b, index) => (
//                                         <div
//                                             className={`${style.barber_queue_history_content_body_item} ${darkmodeOn && style.dark}`}
//                                             key={b?._id}
//                                             style={{
//                                                 borderBottom: BarberQueueListHistory.length - 1 === index && "none"
//                                             }}
//                                         >
//                                             <p>{b?.qPosition}</p>
//                                             <p>{b?.customerName}</p>
//                                             <p>{b?.barberName}</p>
//                                             <p>{b?.timeJoinedQ}</p>
//                                             <div><p>{b?.qgCode}</p></div>
//                                             <div><p>{b?.serviceEWT} mins</p></div>
//                                             <div><p>{barberProfile?.currency}{" "}{b?.services.reduce((sum, service) => sum + service.servicePrice, 0)}</p></div>
//                                             <div><p>{b?.serviceType === "Regular" ? "-" : <CrownIcon />}</p></div>
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



import React, { useEffect, useState, useRef } from 'react'
import style from "./QueHistory.module.css"
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import { CrownIcon } from '../../icons'
import { getBarberQueueListHistoryAction } from '../../Redux/Barber/Actions/BarberQueueAction'

import { CheckIcon, CloseIcon, CustomerIcon, DropdownIcon, GroupJoinIcon, KioskIcon, MobileIcon } from '../../newicons';
import { ClickAwayListener, Pagination } from '@mui/material';
import { formatMinutesToHrMin } from '../../../utils/formatMinutesToHrMin'

const QueHistory = () => {

    const darkMode = useSelector(darkmodeSelector)

    const darkmodeOn = darkMode === "On"


    const salonId = useSelector(state => state.BarberLoggedInMiddleware.barberSalonId)
    const barberId = useSelector(state => state.BarberLoggedInMiddleware.barberId)

    const dispatch = useDispatch()

    const queuelistcontrollerRef = useRef(new AbortController());

    useEffect(() => {
        const controller = new AbortController();
        queuelistcontrollerRef.current = controller;

        dispatch(getBarberQueueListHistoryAction(salonId, barberId, controller.signal));

        return () => {
            if (queuelistcontrollerRef.current) {
                queuelistcontrollerRef.current.abort();
            }
        };
    }, [salonId, barberId, dispatch]);


    const getBarberQueueListHistory = useSelector(state => state.getBarberQueueListHistory)

    const {
        loading: getBarberQueueListHistoryLoading,
        resolve: getBarberQueueListHistoryResolve,
        queueListHistory: BarberQueueListHistory
    } = getBarberQueueListHistory

    const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata?.user?.[0])

    // ================================

    const headRows = [
        { id: 1, heading: "Barber ID", key: "qpos" },
        { id: 2, heading: "Name", key: "customerName" },
        { id: 3, heading: `${barberProfile?.salonType === "Barber Shop" ? "BarberName" : "StylistName"}`, key: "barberName" },
        { id: 4, heading: "Time Joined", key: "timejoined" },
        { id: 5, heading: "Qg Code", key: "qgcode" },
        { id: 6, heading: "Price", key: "price" },
        { id: 7, heading: "Type", key: "type" },
        { id: 8, heading: "Est. Time", key: "estimatedtime" },
        { id: 9, heading: "Status", key: "status" },
    ];

    const [queuehistoryDataCopy, setQueuehistoryDataCopy] = useState([])

    const [queuehistoryData, setQueuehistoryData] = useState([])
    const [mobileQueueList, setMobileQueueList] = useState([])

    useEffect(() => {
        if (getBarberQueueListHistoryResolve && BarberQueueListHistory.length > 0) {
            setQueuehistoryData(BarberQueueListHistory)
            setQueuehistoryDataCopy(BarberQueueListHistory)
            setMobileQueueList(BarberQueueListHistory)
        }

    }, [BarberQueueListHistory])

    const [settingsIndex, setSettingsIndex] = useState("")

    const [rowsPerPage, SetRowsPerPage] = useState(10)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(rowsPerPage)
    const [sortOrder, setSortOrder] = useState("asc")
    const [sortColumn, setSortColumn] = useState("")
    const [query, setQuery] = useState("")

    const [QueuehistoryPaginationData, setQueuehistoryPaginationData] = useState([])

    useEffect(() => {
        if (queuehistoryData.length > 0) {
            setQueuehistoryPaginationData(queuehistoryData.slice(startIndex, endIndex))
        }
    }, [queuehistoryData])

    useEffect(() => {
        const totalPages = Math.ceil(queuehistoryData.length / rowsPerPage); // Calculate based on filtered data
        setTotalPages(totalPages);

        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, queuehistoryData.length);

        setStartIndex(startIndex);
        setEndIndex(endIndex);
        setQueuehistoryPaginationData(queuehistoryData.slice(startIndex, endIndex));
    }, [queuehistoryData, page, rowsPerPage]);


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
                filteredData = queuehistoryDataCopy.filter((item) =>
                    item.customerName.toLowerCase().trim().includes(query.toLowerCase()) ||
                    item.barberName.toLowerCase().trim().includes(query.toLowerCase())
                );
            }

            setMobileQueueList(filteredData);

        } else {
            let filteredData = queuehistoryDataCopy;

            if (query.trim() !== '') {
                filteredData = queuehistoryDataCopy.filter((item) =>
                    item.customerName.toLowerCase().trim().includes(query.toLowerCase()) ||
                    item.barberName.toLowerCase().trim().includes(query.toLowerCase())
                );
            }

            setQueuehistoryData(filteredData);
            setPage(1); // Reset page on filter
        }

    }, [query]);

    const [selectOpen, setSelectOpen] = useState(false)


    return (
        <section className={`${style.section}`}>
            <div>
                <h2>Queue History</h2>
                <div>

                    <input
                        type='text'
                        placeholder='Search'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className={`${style.list_container}`}>

                {
                    getBarberQueueListHistoryLoading ? (
                        <div className={`${style.list_body_container_loader}`}>
                            <Skeleton
                                count={6}
                                height={"6.5rem"}
                                baseColor={"var(--loader-bg-color)"}
                                highlightColor={"var(--loader-highlight-color)"}
                                style={{ marginBottom: "1rem" }} />
                        </div>
                    ) : getBarberQueueListHistoryResolve && QueuehistoryPaginationData?.length > 0 ? (
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
                                QueuehistoryPaginationData?.map((item, index) => {
                                    return (
                                        <div key={item._id} style={{ borderBottom: (index === endIndex - 1) || (index === QueuehistoryPaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                                            <div><p>{item.qPosition}</p></div>
                                            <div>
                                                <div>
                                                    <div><img src={item.customerProfile?.[0]?.url} alt="" /></div>
                                                    <p>{item.customerName}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <div><img src={item.barberProfile?.[0]?.url} alt="" /></div>
                                                    <p>{item.barberName}</p>
                                                </div>
                                            </div>
                                            <div><p>{item.timeJoinedQ}</p></div>
                                            <div><p>{item.qgCode}</p></div>
                                            <div><p>{barberProfile?.currency}{" "}{item?.services.reduce((sum, service) => sum + service.servicePrice, 0)}</p></div>
                                            <div><p>{item.serviceType}</p></div>
                                            <div><p>{formatMinutesToHrMin(item.serviceEWT)}</p></div>
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
                getBarberQueueListHistoryLoading ? (
                    <div className={style.list_container_mobile_loader}>
                        <Skeleton
                            count={6}
                            height={"19.5rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                            style={{ marginBottom: "1rem" }}
                        />
                    </div>
                ) : getBarberQueueListHistoryResolve && QueuehistoryPaginationData?.length > 0 ? (
                    <div className={style.list_container_mobile}>
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
                                                <p>{barberProfile?.currency}{" "}{Array.isArray(item?.services)
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

        </section>
    )
}

export default QueHistory

