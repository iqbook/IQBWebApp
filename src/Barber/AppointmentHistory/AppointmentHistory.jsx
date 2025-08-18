import React, { useEffect, useRef, useState } from 'react'
import style from './AppointmentHistory.module.css'
import { AppointmentIcon, CheckIcon, CloseIcon, DropdownIcon, ResetIcon } from '../../newicons'
import { ClickAwayListener, Pagination } from '@mui/material'
import { Calendar } from 'react-multi-date-picker'
import { SearchIcon } from '../../icons'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { getBarberAppointmentHistoryAction } from '../../Redux/Barber/Actions/AppointmentAction'
import toast from 'react-hot-toast'

const AppointmentHistory = () => {

    const salonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
    const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

    const [query, setQuery] = useState("")
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [selectOpen, setSelectOpen] = useState(false)

    const [selectedDates, setSelectedDates] = useState([])
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);

    const handleDateChange = (dates) => {
        const formatedDates = dates.map((date) => date.format("YYYY-MM-DD"))
        setSelectedDates(formatedDates)
    }

    const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

    const {
        response: adminGetDefaultSalonResponse
    } = adminGetDefaultSalon

    const headRows = [
        { id: 1, heading: "Name", key: "customerName" },
        { id: 2, heading: "Barber Name", key: "barberName" },
        { id: 3, heading: "Start Time", key: "startTime" },
        { id: 4, heading: "End Time", key: "endTime" },
        { id: 5, heading: "Price", key: "price" },
        { id: 6, heading: "Date", key: "date" },
        { id: 7, heading: "Status", key: "status" },
    ];

    const dispatch = useDispatch()

    const queuelistcontrollerRef = useRef(new AbortController());

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
                dispatch(getBarberAppointmentHistoryAction(salonId, startDate, endDate, barberId, controller.signal));
            }

        } else if (selectedDates.length === 0) {
            dispatch(getBarberAppointmentHistoryAction(salonId, "", "", barberId, controller.signal));
        }


        return abortIfPending;
    }, [dispatch, selectedDates, salonId])

    const getBarberAppointmentHistory = useSelector(state => state.getBarberAppointmentHistory)

    const {
        loading: getBarberAppointmentHistoryLoading,
        resolve: getBarberAppointmentHistoryResolve,
        appointmentHistory: BarberAppointmentHistory
    } = getBarberAppointmentHistory

    // console.log(BarberAppointmentHistory)


    const [appointmenthistoryDataCopy, setappointmenthistoryDataCopy] = useState([])
    const [appointmenthistoryData, setappointmenthistoryData] = useState([])
    const [appointmentHistoryPaginationData, setappointmentHistoryPaginationData] = useState([])
    const [mobileQueueList, setMobileQueueList] = useState([])

    useEffect(() => {
        if (getBarberAppointmentHistoryResolve && BarberAppointmentHistory.length > 0) {
            setappointmenthistoryData(BarberAppointmentHistory)
            setappointmenthistoryDataCopy(BarberAppointmentHistory)
            setMobileQueueList(BarberAppointmentHistory)
        }

    }, [BarberAppointmentHistory])

    const [rowsPerPage, SetRowsPerPage] = useState(10)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(0)
    const [sortOrder, setSortOrder] = useState("asc")
    const [sortColumn, setSortColumn] = useState("")

    const paginationFunction = () => {
        const totalPages = Math.ceil(appointmenthistoryDataCopy.length / rowsPerPage);
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, appointmenthistoryDataCopy.length)

        setappointmentHistoryPaginationData(appointmenthistoryDataCopy.slice(startIndex, endIndex));
        setTotalPages(totalPages);
        setStartIndex(startIndex);
        setEndIndex(endIndex);
    }


    useEffect(() => {
        if (appointmenthistoryDataCopy.length > 0) {
            paginationFunction()
        }
    }, [appointmenthistoryDataCopy, page, rowsPerPage])


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
            let filteredData = appointmenthistoryDataCopy;

            if (query.trim() !== '') {
                filteredData = appointmenthistoryData.filter((item) =>
                    item.customerName.toLowerCase().trim().includes(query.toLowerCase())
                );
            }

            setMobileQueueList(filteredData)
        } else {
            if (query.trim() !== "") {
                const filterData = appointmenthistoryData.filter((item) =>
                    item.customerName.toLowerCase().trim().includes(query.toLowerCase()) ||
                    item.barberName.toLowerCase().trim().includes(query.toLowerCase())
                );
                setappointmenthistoryDataCopy(filterData);
                setPage(1)
            } else {
                setappointmenthistoryDataCopy(appointmenthistoryData);
                setPage(1)
            }
        }

    }, [query]);


    const resetHandler = () => {
        dispatch(getBarberAppointmentHistoryAction(salonId, "", "", barberId));
    }

    const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata?.user?.[0])

    return (
        <section className={`${style.section}`}>
            <div>
                <h2>Appointment History </h2>
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
                        placeholder='Search Customer'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className={`${style.mobile_header}`}>
                <h2>Apointment History</h2>
                <div>
                    {
                        mobileSearchOpen ? (
                            <ClickAwayListener onClickAway={() => setMobileSearchOpen(false)}>
                                <div className={`${style.input_type_2}`}>
                                    <input
                                        type='text'
                                        placeholder='Search Customer'
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
                    getBarberAppointmentHistoryLoading ? (
                        <div className={`${style.list_body_container_loader}`}>
                            <Skeleton
                                count={6}
                                height={"6.5rem"}
                                baseColor={"var(--loader-bg-color)"}
                                highlightColor={"var(--loader-highlight-color)"}
                                style={{ marginBottom: "1rem" }} />
                        </div>
                    ) : getBarberAppointmentHistoryResolve && BarberAppointmentHistory.length > 0 ? (
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
                                appointmentHistoryPaginationData.map((item, index) => {
                                    return (
                                        <div key={item._id} style={{ borderBottom: (index === endIndex - 1) || (index === appointmentHistoryPaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                                            {/* <div><p>{item.barberId}</p></div> */}
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
                                            <div><p>{item.startTime}</p></div>
                                            <div><p>{item.endTime}</p></div>
                                            {/* <div><p>{adminGetDefaultSalon?.response?.currency}{" "}{item?.services.reduce((sum, service) => sum + service?.servicePrice, 0)}</p></div> */}
                                            <div><p>{barberProfile?.currency}{" "}{Array.isArray(item?.services)
                                                ? item.services.reduce((sum, service) => sum + (service.servicePrice || 0), 0)
                                                : 0}</p></div>
                                            {/* <div><p>{item.serviceType}</p></div>
                                                        <div><p>{item.serviceEWT} mins</p></div>
                                                        <div><span>{item?.isAdmin ? (<CheckIcon color={"green"} />) : (<CloseIcon color={"var(--bg-secondary)"} />)}</span></div> */}
                                            <div><p>{item.appointmentDate?.split("T")[0]}</p></div>
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
                            <p>No appointment history available</p>
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
                getBarberAppointmentHistoryLoading ? (
                    <div className={style.list_container_mobile_loader}>
                        <Skeleton
                            count={6}
                            height={"19.5rem"}
                            baseColor={"var(--loader-bg-color)"}
                            highlightColor={"var(--loader-highlight-color)"}
                            style={{ marginBottom: "1rem" }}
                        />
                    </div>
                ) : getBarberAppointmentHistoryResolve && BarberAppointmentHistory.length > 0 ? (
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
                                                <p>{adminGetDefaultSalon?.response?.currency}{" "}{Array.isArray(item?.services)
                                                    ? item.services.reduce((sum, service) => sum + (service.servicePrice || 0), 0)
                                                    : 0}</p>
                                                <p>{item?.appointmentDate?.split(["T"])[0]}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {/* <div>
                                                            <div>{item.methodUsed === "App" ? <MobileIcon color={"#1ADB6A"} /> : <KioskIcon color={"#1ADB6A"} />}</div>
                                                            <p>Mode</p>
                                                        </div>
            
                                                        <div>
                                                            <div>{item.joinedQType === "Single-Join" ? <CustomerIcon color={"#1ADB6A"} /> : <GroupJoinIcon color={"#1ADB6A"} />}</div>
                                                            <p>Type</p>
                                                        </div> */}

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
                        <p>No appointment history available</p>
                    </div>
                )
            }

        </section>
    )
}

export default AppointmentHistory