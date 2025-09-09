// import React, { useEffect, useRef, useState } from 'react'
// import style from "./Queue.module.css"

// import { useNavigate } from 'react-router-dom'
// import { CloseIcon, CrownIcon, DeleteIcon, SearchIcon, ServeIcon } from '../../icons'
// import Skeleton from 'react-loading-skeleton'
// import { useDispatch, useSelector } from 'react-redux'
// import { getAllQueueListAction } from '../../Redux/Admin/Actions/DashboardAction'
// import { adminCancelQueueAction, adminServeQueueAction } from '../../Redux/Admin/Actions/QueueAction'
// import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
// import toast from 'react-hot-toast'
// import { Modal } from '@mui/material'
// import { getAdminBarberListAction } from '../../Redux/Admin/Actions/BarberAction'
// import ButtonLoader from '../../components/ButtonLoader/ButtonLoader'

// const Queue = () => {

// const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
// const adminEmail = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)

// const dispatch = useDispatch()

// const queuelistcontrollerRef = useRef(new AbortController());

// useEffect(() => {
//   const controller = new AbortController();
//   queuelistcontrollerRef.current = controller;

//   dispatch(getAllQueueListAction(salonId, controller.signal));

//   return () => {
//     if (queuelistcontrollerRef.current) {
//       queuelistcontrollerRef.current.abort();
//     }
//   };
// }, [salonId, dispatch]);

// const getAllQueueList = useSelector(state => state.getAllQueueList)

// const {
//   loading: getAllQueueListLoading,
//   resolve: getAllQueueListResolve,
//   queueList: queuelist
// } = getAllQueueList

// const [copyQueueList, setCopyQueueList] = useState([])

// useEffect(() => {
//   if (queuelist) {
//     setCopyQueueList(queuelist)
//   }
// }, [queuelist])

// const [search, setSearch] = useState("")

// const searchHandler = (value) => {
//   setSearch(value)
//   const searchValue = value.toLowerCase().trim();

//   if (!search) {
//     setCopyQueueList(queuelist)
//   } else {
//     setCopyQueueList((prev) => {
//       const filteredArray = queuelist?.filter((queue) => {
//         return (queue.name.toLowerCase().includes(searchValue) ||
//           queue.barberName.toLowerCase().includes(searchValue))
//       })
//       return filteredArray
//     })
//   }
// }

// const darkMode = useSelector(darkmodeSelector)

// const darkmodeOn = darkMode === "On"

// const selectHandler = (b) => {
//   if (b.qPosition !== 1) {
//     return toast.error("Queue position is not 1", {
//       duration: 3000,
//       style: {
//         fontSize: "var(--font-size-2)",
//         borderRadius: '0.3rem',
//         background: '#333',
//         color: '#fff',
//       },
//     });
//   }

//   const confirm = window.confirm("Are you Sure ?")

//   const queueData = {
//     adminEmail,
//     barberId: b.barberId,
//     salonId,
//     services: b.services,
//     _id: b._id
//   }

//   if (confirm) {
//     setChoosebarber(b?.barberName)
//     setChoosebarberemail(b?.barberEmail)
//     setChoosebarbermodalopen({
//       open: true,
//       data: queueData
//     })
//   }
// }


// const cancelQHandler = (b) => {
//   const confirm = window.confirm("Are you Sure ?")

//   const queueData = {
//     adminEmail,
//     barberId: b.barberId,
//     salonId,
//     _id: b._id
//   }

//   if (confirm) {
//     // console.log(queueData)
//     dispatch(adminCancelQueueAction(queueData, salonId))
//   }

// }

// const adminServeQueue = useSelector(state => state.adminServeQueue)

// const {
//   loading: adminServeQueueLoading
// } = adminServeQueue

// const adminCancelQueue = useSelector(state => state.adminCancelQueue)

// const {
//   loading: adminCancelQueueLoading
// } = adminCancelQueue

// const [choosebarbermodalopen, setChoosebarbermodalopen] = useState({
//   open: false,
//   data: {}
// })

// const [choosebarber, setChoosebarber] = useState("")
// const [choosebarberemail, setChoosebarberemail] = useState("")

// const BarberListcontrollerRef = useRef(new AbortController());

// useEffect(() => {
//   const controller = new AbortController();
//   BarberListcontrollerRef.current = controller;

//   dispatch(getAdminBarberListAction(salonId, controller.signal));

//   return () => {
//     if (BarberListcontrollerRef.current) {
//       BarberListcontrollerRef.current.abort();
//     }
//   };
// }, [salonId, dispatch]);

// const getAdminBarberList = useSelector(state => state.getAdminBarberList)

// const {
//   loading: getAdminBarberListLoading,
//   resolve: getAdminBarberListResolve,
//   getAllBarbers: BarberList
// } = getAdminBarberList


// const [copybarberlistdata, setCopybarberlistdata] = useState([])

// useEffect(() => {
//   if (BarberList) {
//     const clockedinbarbers = BarberList?.filter((b) => {
//       return b.isClockedIn
//     })
//     setCopybarberlistdata(clockedinbarbers)
//   }
// }, [BarberList])

// const serveQHandler = () => {

//   const queuedata = {
//     ...choosebarbermodalopen.data,
//     servedByEmail: choosebarberemail
//   }

//   dispatch(adminServeQueueAction(queuedata, salonId, setChoosebarbermodalopen))
// }


//   return (
//     <div className={`${style.admin_queue_wrapper} ${darkmodeOn && style.dark}`}>
//       <div>
//         <p>Queue List</p>

//         <div className={`${style.customer_search} ${darkmodeOn && style.dark}`}>
//           <input
//             type="text"
//             placeholder='Search Queue'
//             value={search}
//             onChange={(e) => searchHandler(e.target.value)}
//           />

//           <div><SearchIcon /></div>
//         </div>

//       </div>

//       <div className={`${style.admin_queue_content_wrapper} ${darkmodeOn && style.dark}`}>

//         {
//           getAllQueueListLoading ?
//             <div className={style.admin_queue_content_body}>
//               <Skeleton count={6} height={"6rem"} style={{ marginBottom: "1rem" }}
//                 baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                 highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"} />
//             </div> :
//             getAllQueueListResolve && copyQueueList?.length > 0 ?
//               <>
//                 <div className={`${style.admin_queue_content_body} ${darkmodeOn && style.dark}`}>
//                   <div>
//                     <p>#</p>
//                     <p>Name</p>
//                     <p>Barber Name</p>
//                     <p>Time Joined Q</p>
//                     <div><p>Qg Code</p></div>
//                     <div><p>EWT</p></div>
//                     <div><p>Type</p></div>
//                     <div><p>Serve</p></div>
//                     <div><p>Cancel</p></div>
//                   </div>

//                   {copyQueueList?.map((b, index) => (
//                     <div
//                       className={`${style.admin_queue_content_body_item} ${darkmodeOn && style.dark}`}
//                       key={b._id}
//                       style={{
//                         borderBottom: copyQueueList.length - 1 === index && "none"
//                       }}
//                     >
//                       <p>{b.qPosition === 1 ? "Next" : b.qPosition}</p>
//                       <p>{b.name.length > 18 ? b.name.slice(0, 18) + "..." : b.name}</p>
//                       <p>{b.barberName.length > 18 ? b.barberName.slice(0, 18) + "..." : b.barberName}</p>
//                       <p>{b.timeJoinedQ}</p>
//                       <p>{b?.qgCode}</p>
//                       <p>{b?.customerEWT === 0 ? "-" : b?.customerEWT + "mins"}</p>
//                       <div>
//                         {
//                           b.serviceType === "VIP" ? <CrownIcon /> : "-"
//                         }
//                       </div>
//                       <div><button onClick={() => selectHandler(b)} disabled={adminServeQueueLoading}>Serve</button></div>
//                       <div><button onClick={() => cancelQHandler(b)} disabled={adminCancelQueueLoading}>Cancel</button></div>
//                     </div>
//                   ))}
//                 </div>
//               </> :
//               <div className={`${style.admin_queue_content_body_error} ${darkmodeOn && style.dark}`}>
//                 <p>Queue not available</p>
//               </div>
//         }
//       </div>

//       <Modal
//         open={choosebarbermodalopen.open}
//         onClose={() => setChoosebarbermodalopen({
//           open: false,
//           data: {}
//         })}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
//           <div>
//             <p>Choose Barber</p>
//             <button onClick={() => setChoosebarbermodalopen({
//               open: false,
//               data: {}
//             })}><CloseIcon /></button>
//           </div>

//           <div className={`${style.modal_content_container} ${darkmodeOn && style.dark}`}>
//             <input type="text" value={choosebarber} placeholder='Choose Barber' readOnly />

//             {
//               getAdminBarberListLoading ? (<div className={style.barber_dropdown_loading}>
//                 <Skeleton count={3} height={"6rem"} style={{ marginBottom: "1rem" }}
//                   baseColor={darkmodeOn ? "var(--dark-loader-bg-color)" : "var(--light-loader-bg-color)"}
//                   highlightColor={darkmodeOn ? "var(--dark-loader-highlight-color)" : "var(--light-loader-highlight-color)"}
//                 />
//               </div>) :
//                 getAdminBarberListResolve && copybarberlistdata?.length > 0 ?
//                   (<div className={style.barber_dropdown}>
//                     {
//                       copybarberlistdata?.map((b) => {
//                         return (
//                           <div
//                             className={`${style.choose_barber_dropdown_item} ${choosebarberemail === b?.email && style.barber_select} ${darkmodeOn && style.dark}`}
//                             key={b._id}
//                             onClick={() => {
//                               setChoosebarberemail(b?.email)
//                               setChoosebarber(b?.name)
//                             }}
//                             style={{
//                               borderLeft: b.isOnline ? "0.5rem solid limegreen" : "0.5rem solid red",
//                             }}
//                           >
//                             <div>
//                               <img src={b?.profile?.[0]?.url} alt="img" />
//                               <div className={style.barber_online_dot}
//                                 style={{
//                                   backgroundColor: b.isOnline ? "limegreen" : "red"
//                                 }}
//                               ></div>
//                             </div>
//                             <div>
//                               <p>{b.name}</p>
//                               <p>Queue Count : {b.queueCount}</p>
//                               <p>EWT : {b.barberEWT} mins</p>
//                             </div>
//                           </div>
//                         )
//                       })
//                     }
//                   </div>) :
//                   (<div className={style.barber_dropdown_error}>
//                     <p>No barbers available</p>
//                   </div>)
//             }

//           </div>

//           {
//             adminServeQueueLoading ? <button style={{
//               display: "grid",
//               placeItems: "center"
//             }}><ButtonLoader /></button> : <button onClick={serveQHandler}>Serve</button>
//           }

//         </div>
//       </Modal>
//     </div>
//   )
// }

// export default Queue

import React, { useEffect, useRef, useState } from 'react'
import style from "./Queue.module.css"

import { useNavigate } from 'react-router-dom'
import { CloseIcon, CrownIcon, DeleteIcon, SearchIcon, ServeIcon } from '../../icons'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { getAllQueueListAction } from '../../Redux/Admin/Actions/DashboardAction'
import { adminCancelQueueAction, adminServeQueueAction } from '../../Redux/Admin/Actions/QueueAction'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import toast from 'react-hot-toast'
import { ClickAwayListener, Modal, Pagination } from '@mui/material'
import { getAdminBarberListAction } from '../../Redux/Admin/Actions/BarberAction'
import ButtonLoader from '../../components/ButtonLoader/ButtonLoader'
import { DropdownIcon } from '../../newicons'
import { useSocket } from '../../context/SocketContext'
import { formatMinutesToHrMin } from '../../../utils/formatMinutesToHrMin'

const Queue = () => {

  // const { socket } = useSocket()

  // console.log("The socket value is ", socket)

  const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)
  const adminEmail = useSelector(state => state.AdminLoggedInMiddleware.adminEmail)

  const dispatch = useDispatch()

  const queuelistcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    queuelistcontrollerRef.current = controller;

    dispatch(getAllQueueListAction(salonId, controller.signal));

    return () => {
      if (queuelistcontrollerRef.current) {
        queuelistcontrollerRef.current.abort();
      }
    };
  }, [salonId, dispatch]);

  const getAllQueueList = useSelector(state => state.getAllQueueList)

  const {
    loading: getAllQueueListLoading,
    resolve: getAllQueueListResolve,
    queueList: queuelist
  } = getAllQueueList


  // console.log("queuelist ", queuelist)


  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  const [queueItem, setQueueItem] = useState({})

  const selectHandler = (b) => {
    // if (!mobileWidth && b.qPosition !== 1) {
    //   return toast.error("Queue position is not 1", {
    //     duration: 3000,
    //     style: {
    //       fontSize: "var(--font-size-2)",
    //       borderRadius: '0.3rem',
    //       background: '#333',
    //       color: '#fff',
    //     },
    //   });
    // }

    // const confirm = window.confirm("Are you Sure ?")

    const queueData = {
      adminEmail,
      barberId: b.barberId,
      salonId,
      services: b.services,
      _id: b._id
    }

    setQueueItem(queueData)

    // if (confirm) {
      setChoosebarber(b?.barberName)
      setChoosebarberemail(b?.barberEmail)
      setChoosebarbermodalopen({
        open: true,
        data: queueData
      })
    // }
  }


  const cancelQHandler = (b) => {
    const confirm = window.confirm("Are you Sure ?")

    const queueData = {
      adminEmail,
      barberId: b.barberId,
      salonId,
      _id: b._id
    }

    if (confirm) {
      // console.log(queueData)
      dispatch(adminCancelQueueAction(queueData, salonId, setChoosebarbermodalopen, setQueueItem, setChoosebarber, setChoosebarberemail))
    }

  }

  const adminServeQueue = useSelector(state => state.adminServeQueue)

  const {
    loading: adminServeQueueLoading
  } = adminServeQueue

  const adminCancelQueue = useSelector(state => state.adminCancelQueue)

  const {
    loading: adminCancelQueueLoading
  } = adminCancelQueue

  const [choosebarbermodalopen, setChoosebarbermodalopen] = useState({
    open: false,
    data: {}
  })

  const [choosebarber, setChoosebarber] = useState("")
  const [choosebarberemail, setChoosebarberemail] = useState("")

  const BarberListcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    BarberListcontrollerRef.current = controller;

    dispatch(getAdminBarberListAction(salonId, controller.signal));

    return () => {
      if (BarberListcontrollerRef.current) {
        BarberListcontrollerRef.current.abort();
      }
    };
  }, [salonId, dispatch]);

  const getAdminBarberList = useSelector(state => state.getAdminBarberList)

  const {
    loading: getAdminBarberListLoading,
    resolve: getAdminBarberListResolve,
    getAllBarbers: BarberList
  } = getAdminBarberList


  const [copybarberlistdata, setCopybarberlistdata] = useState([])

  useEffect(() => {
    if (BarberList) {
      const clockedinbarbers = BarberList?.filter((b) => {
        return b.isClockedIn
      })
      setCopybarberlistdata(clockedinbarbers)
    }
  }, [BarberList])

  const serveQHandler = () => {

    const queuedata = {
      ...choosebarbermodalopen.data,
      servedByEmail: choosebarberemail
    }

    dispatch(adminServeQueueAction(queuedata, salonId, setChoosebarbermodalopen))
  }


  // ========================================================

  const headRows = [
    { id: 1, heading: "#", key: "qpos" },
    { id: 2, heading: "Name", key: "customerName" },
    { id: 3, heading: "Barber Name", key: "barberName" },
    { id: 4, heading: "Time Joined", key: "timejoined" },
    { id: 5, heading: "Qg Code", key: "qgcode" },
    { id: 6, heading: "Type", key: "type" },
    { id: 7, heading: "Est. Time", key: "estimatedtime" },
    { id: 8, heading: "", key: "serve" },
    { id: 9, heading: "", key: "cancel" },
  ];

  const [queuelistDataCopy, setQueuelistDataCopy] = useState([])

  const [queuelistData, setQueuelistData] = useState([])
  const [mobileQueueList, setMobileQueueList] = useState([])

  useEffect(() => {
    if (getAllQueueListResolve && queuelist?.length > 0) {
      setQueuelistData(queuelist)
      setQueuelistDataCopy(queuelist)
      setMobileQueueList(queuelist)
    }

  }, [queuelist])

  const [settingsIndex, setSettingsIndex] = useState("")

  const [rowsPerPage, SetRowsPerPage] = useState(10)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowsPerPage)
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortColumn, setSortColumn] = useState("")
  const [query, setQuery] = useState("")

  const [queuePaginationData, setQueuePaginationData] = useState([])

  useEffect(() => {
    if (queuelistData?.length > 0) {
      setQueuePaginationData(queuelistData?.slice(startIndex, endIndex))
    }
  }, [queuelistData])

  useEffect(() => {
    const totalPages = Math.ceil(queuelistData?.length / rowsPerPage); // Calculate based on filtered data
    setTotalPages(totalPages);

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, queuelistData?.length);

    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setQueuePaginationData(queuelistData.slice(startIndex, endIndex));
  }, [queuelistData, page, rowsPerPage]);


  const handleChange = (event, value) => {
    setPage(value);
  }


  useEffect(() => {

    if (mobileWidth) {
      let filteredData = queuelistDataCopy;

      if (query.trim() !== '') {
        filteredData = queuelistDataCopy?.filter((item) =>
          item.customerName.toLowerCase().trim().includes(query.toLowerCase())
        );
      }

      setMobileQueueList(filteredData)

    } else {
      let filteredData = queuelistDataCopy;

      if (query.trim() !== '') {
        filteredData = queuelistDataCopy?.filter((item) =>
          item.customerName.toLowerCase().trim().includes(query.toLowerCase())
        );
      }

      setQueuelistData(filteredData);
      setPage(1);
    }

  }, [query]);

  const [selectOpen, setSelectOpen] = useState(false)

  const navigate = useNavigate()

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



  return (
    <section className={`${style.section}`}>
      <div>
        <h2>Queue List</h2>
        <div>

          <input
            type='text'
            placeholder='Search Customer'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={`${style.list_container}`}>

        {
          getAllQueueListLoading ? (
            <div className={`${style.list_body_container_loader}`}>
              <Skeleton
                count={6}
                height={"6.5rem"}
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
                style={{ marginBottom: "1rem" }} />
            </div>
          ) : getAllQueueListResolve && queuelist?.length > 0 ? (
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
                queuePaginationData?.map((item, index) => {
                  return (
                    <div key={item._id} style={{ borderBottom: (index === endIndex - 1) || (index === queuePaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                      <div><p>{item.qPosition === 1 ? "Next" : item.qPosition}</p></div>
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
                      <div><p>{item.serviceType}</p></div>
                      <div><p>{item?.customerEWT === 0 ? "-" : formatMinutesToHrMin(item?.customerEWT)}</p></div>
                      <div><button onClick={() => selectHandler(item)} disabled={adminServeQueueLoading}>Serve</button></div>
                      <div><button onClick={() => cancelQHandler(item)} disabled={adminCancelQueueLoading}>Cancel</button></div>
                    </div>
                  )
                })
              }
            </div>
          ) : (
            <div className={`${style.list_body_container_error}`}>
              <p>No queuelist available</p>
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
        getAllQueueListLoading ? (
          <div className={style.list_container_mobile_loader}>
            <Skeleton
              count={6}
              height={"8rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }} />
          </div>
        ) : getAllQueueListResolve && mobileQueueList?.length > 0 ? (
          <div className={style.list_container_mobile}>

            {
              mobileQueueList?.map((item, index) => {
                return (
                  <div
                    onClick={() => selectHandler(item)}
                    disabled={adminServeQueueLoading}
                    className={style.list_mobile_item}
                    key={item._id}>
                    <div>
                      <img src={item?.customerProfile?.[0]?.url} alt="" />
                      <div>
                        <p>{item.customerName}</p>
                        <p>{item.barberName}</p>
                      </div>
                    </div>

                    <div>
                      <p>{item.qPosition === 1 ? "Next" : item.qPosition}</p>
                      <p>{item?.customerEWT === 0 ? "-" : "Ewt : " + formatMinutesToHrMin(item?.customerEWT)}</p>
                    </div>
                  </div>
                )
              })
            }

          </div>
        ) : (
          <div className={style.list_container_mobile_error}>
            <p>No queuelist available</p>
          </div>
        )
      }

      <Modal
        open={choosebarbermodalopen.open}
        onClose={() => setChoosebarbermodalopen({
          open: false,
          data: {}
        })}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
          <div>
            <p>Choose Barber</p>
            <button onClick={() => setChoosebarbermodalopen({
              open: false,
              data: {}
            })}><CloseIcon /></button>
          </div>

          <div className={`${style.modal_content_container} ${darkmodeOn && style.dark}`}>
            <input type="text" value={choosebarber} placeholder='Choose Barber' readOnly />

            {
              getAdminBarberListLoading ? (<div className={style.barber_dropdown_loading}>
                <Skeleton count={3} height={"6rem"} style={{ marginBottom: "1rem" }}
                  baseColor={"var(--loader-bg-color)"}
                  highlightColor={"var(--loader-highlight-color)"}
                />
              </div>) :
                getAdminBarberListResolve && copybarberlistdata?.length > 0 ?
                  (<div className={style.barber_dropdown}>
                    {
                      copybarberlistdata?.map((b) => {
                        return (
                          <div
                            className={`${style.choose_barber_dropdown_item} ${choosebarberemail === b?.email && style.barber_select} ${darkmodeOn && style.dark}`}
                            key={b._id}
                            onClick={() => {
                              setChoosebarberemail(b?.email)
                              setChoosebarber(b?.name)
                            }}
                            style={{
                              borderLeft: b.isOnline ? "0.5rem solid #00A36C" : "0.5rem solid rgb(244, 67, 54)",
                            }}
                          >
                            <div>
                              <img src={b?.profile?.[0]?.url} alt="img" />
                              <div className={style.barber_online_dot}
                                style={{
                                  backgroundColor: b.isOnline ? "#00A36C" : "rgb(244, 67, 54)"
                                }}
                              ></div>
                            </div>
                            <div>
                              <div>
                                <p>{b.name}</p>
                                <p>Queue Count : {b.queueCount}</p>
                              </div>
                              <div>
                                <p>EWT</p>
                                <p>{b.barberEWT} mins</p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>) :
                  (<div className={style.barber_dropdown_error}>
                    <p>No barbers available</p>
                  </div>)
            }

          </div>

          {
            mobileWidth ? (
              <div>
                {
                  adminServeQueueLoading ? <button style={{
                    display: "grid",
                    placeItems: "center",
                  }}><ButtonLoader /></button> : <button
                    style={{
                      background: "#0285c7",
                      color: "#fff"
                    }}
                    onClick={serveQHandler}>Serve</button>
                }

                {
                  adminCancelQueueLoading ? <button style={{
                    display: "grid",
                    placeItems: "center",
                  }}><ButtonLoader /></button> : <button
                    style={{
                      background: "#450a0a",
                      color: "#fff"
                    }}
                    onClick={() => cancelQHandler(queueItem)}
                    disabled={adminCancelQueueLoading}
                  >Cancel</button>
                }

              </div>
            ) : (

              adminServeQueueLoading ? <button style={{
                display: "grid",
                placeItems: "center"
              }}><ButtonLoader /></button> : <button onClick={serveQHandler}>Serve</button>

            )
          }



        </div>
      </Modal>

    </section >
  )
}

export default Queue

