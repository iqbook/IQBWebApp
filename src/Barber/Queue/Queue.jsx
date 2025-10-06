import React, { useEffect, useRef, useState } from 'react'
import style from "./Queue.module.css"
import { useNavigate } from 'react-router-dom'
import { CrownIcon, DeleteIcon, ServeIcon } from '../../icons'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { adminCancelQueueAction, adminServeQueueAction } from '../../Redux/Admin/Actions/QueueAction'
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer'
import { barberCancelQueueAction, barberServeQueueAction, getBarberQueueListAction } from '../../Redux/Barber/Actions/BarberQueueAction'
import toast from 'react-hot-toast'
import { DropdownIcon } from '../../newicons';
import { ClickAwayListener, Modal, Pagination } from '@mui/material'
import ButtonLoader from '../../components/ButtonLoader/ButtonLoader'
import { formatMinutesToHrMin } from '../../../utils/formatMinutesToHrMin'


const Queue = () => {

  const barberProfile = useSelector(state => state.BarberLoggedInMiddleware?.entiredata?.user[0])

  const salonId = useSelector(state => state.BarberLoggedInMiddleware.barberSalonId)
  const barberId = useSelector(state => state.BarberLoggedInMiddleware.barberId)
  const barberEmail = useSelector(state => state.BarberLoggedInMiddleware.barberEmail)

  const dispatch = useDispatch()

  const queuelistcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    queuelistcontrollerRef.current = controller;

    dispatch(getBarberQueueListAction(salonId, barberId, controller.signal));

    return () => {
      if (queuelistcontrollerRef.current) {
        queuelistcontrollerRef.current.abort();
      }
    };
  }, [salonId, dispatch]);

  const getBarberQueueList = useSelector(state => state.getBarberQueueList)

  const {
    loading: getBarberQueueListLoading,
    resolve: getBarberQueueListResolve,
    queueList: BarberQueueList
  } = getBarberQueueList

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  const [barberServeLoading, setBarberServeLoading] = useState(false)
  const [barberCancelLoading, setBarberCancelLoading] = useState(false)

  const serveQHandler = (b) => {
    // if (b.qPosition !== 1) {
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

    const confirm = window.confirm("Are you Sure ?")

    const queueData = {
      servedByEmail: barberEmail,
      barberEmail,
      barberId: b.barberId,
      salonId,
      services: b.services,
      _id: b._id
    }

    if (confirm) {
      dispatch(barberServeQueueAction(queueData, salonId, b.barberId, setBarberServeLoading, setOpenModal))
    }
  }

  const [queueItem, setQueueItem] = useState({})

  const [openModal, setOpenModal] = useState({
    open: false,
    data: {}
  })

  const selectHandler = (b) => {
    if (!mobileWidth && b.qPosition !== 1) {
      return toast.error("Queue position is not 1", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    }

    // const confirm = window.confirm("Are you Sure ?")

    const queueData = {
      customerName: b?.customerName,
      barber: b
    }

    setOpenModal({
      open: true,
      data: queueData
    })

    // if (confirm) {
    //   setOpenModal({
    //     open: true,
    //     data: queueData
    //   })
    // }

  }

  const cancelQHandler = (b) => {
    const confirm = window.confirm("Are you Sure ?")

    const queueData = {
      barberEmail,
      barberId: b.barberId,
      salonId,
      _id: b._id
    }

    if (confirm) {
      dispatch(barberCancelQueueAction(queueData, salonId, b.barberId, setBarberCancelLoading, setOpenModal))
    }

  }

  // const adminServeQueue = useSelector(state => state.adminServeQueue)

  // const {
  //   loading: adminServeQueueLoading
  // } = adminServeQueue

  // const adminCancelQueue = useSelector(state => state.adminCancelQueue)

  // const {
  //   loading: adminCancelQueueLoading
  // } = adminCancelQueue


  //=====================================

  const headRows = [
    { id: 1, heading: "#", key: "qpos" },
    { id: 2, heading: "Name", key: "customerName" },
    { id: 3, heading: `${barberProfile?.salonType === "Barber Shop" ? "Barber Name" : "Stylist Name"}`, key: "barberName" },
    { id: 4, heading: "Time Joined", key: "timejoined" },
    { id: 5, heading: "Qg Code", key: "qgcode" },
    { id: 6, heading: "Type", key: "type" },
    { id: 7, heading: "Est. Time", key: "estimatedtime" },
    { id: 8, heading: "", key: "serve" },
    { id: 9, heading: "", key: "cancel" },
  ];

  const [queuelistDataCopy, setQueuelistDataCopy] = useState([])

  const [queuelistData, setqueuelistData] = useState([])
  const [mobileQueueList, setMobileQueueList] = useState([])

  useEffect(() => {
    if (getBarberQueueListResolve && BarberQueueList?.length > 0) {
      setqueuelistData(BarberQueueList)
      setQueuelistDataCopy(BarberQueueList)
      setMobileQueueList(BarberQueueList)
    }

  }, [BarberQueueList])

  const [settingsIndex, setSettingsIndex] = useState("")

  const [rowsPerPage, SetRowsPerPage] = useState(10)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowsPerPage)
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortColumn, setSortColumn] = useState("")
  const [query, setQuery] = useState("")

  const [queuePaginationData, setQueuePaginationData] = useState()

  useEffect(() => {
    if (queuelistData.length > 0) {
      setQueuePaginationData(queuelistData.slice(startIndex, endIndex))
    }
  }, [queuelistData])

  useEffect(() => {
    const totalPages = Math.ceil(queuelistData.length / rowsPerPage); // Calculate based on filtered data
    setTotalPages(totalPages);

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, queuelistData.length);

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
        filteredData = queuelistDataCopy.filter((item) =>
          item.customerName.toLowerCase().trim().includes(query.toLowerCase())
        );
      }

      setMobileQueueList(filteredData)
    } else {
      let filteredData = queuelistDataCopy;

      if (query.trim() !== '') {
        filteredData = queuelistDataCopy.filter((item) =>
          item.customerName.toLowerCase().trim().includes(query.toLowerCase())
        );
      }

      setqueuelistData(filteredData);
      setPage(1); // Reset page on filter
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
          getBarberQueueListLoading ? (
            <div className={`${style.list_body_container_loader}`}>
              <Skeleton
                count={6}
                height={"6.5rem"}
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
                style={{ marginBottom: "1rem" }} />
            </div>
          ) : getBarberQueueListResolve && BarberQueueList?.length > 0 ? (
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
                    <div key={index} style={{ borderBottom: (index === endIndex - 1) || (index === queuePaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                      <div><p>{item.qPosition === 1 ? "Next" : item.qPosition}</p></div>
                      <div>
                        <div>
                          <div><img src={item.customerProfile?.[0]?.url} alt="" /></div>
                          <p>{item.name}</p>
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
                      <div><p>{item.serviceType}</p></div>
                      <div><p>{item?.customerEWT === 0 ? "-" : formatMinutesToHrMin(item?.customerEWT)}</p></div>
                      <div><button onClick={() => serveQHandler(item)} disabled={barberServeLoading}>Serve</button></div>
                      <div><button onClick={() => cancelQHandler(item)} disabled={barberCancelLoading}>Cancel</button></div>

                    </div>
                  )
                })
              }
            </div>
          ) : (<div className={`${style.list_body_container_error}`}>
            <p>No queuelist available</p>
          </div>)
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
        getBarberQueueListLoading ? (
          <div className={style.list_container_mobile_loader}>
            <Skeleton
              count={6}
              height={"8rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }} />
          </div>
        ) : getBarberQueueListResolve && BarberQueueList?.length > 0 ? (
          <div className={style.list_container_mobile}>

            {
              mobileQueueList?.map((item, index) => {
                return (
                  <div
                    onClick={() => selectHandler(item)}
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

      {
        mobileWidth ? (
          <Modal
            open={openModal.open}
            onClose={() => setOpenModal({
              open: false,
              data: {}
            })}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={style.modal_container}>
              <p>{openModal?.data?.customerName}</p>
              <div>
                {
                  barberServeLoading ? <button style={{
                    display: "grid",
                    placeItems: "center",
                  }}><ButtonLoader /></button> : <button
                    style={{
                      background: "#0285c7",
                      color: "#fff"
                    }}
                    onClick={() => serveQHandler(openModal?.data?.barber)}
                    disabled={barberServeLoading}
                  >Serve</button>
                }

                {
                  barberCancelLoading ? <button style={{
                    display: "grid",
                    placeItems: "center",
                  }}><ButtonLoader /></button> : <button
                    style={{
                      background: "#450a0a",
                      color: "#fff"
                    }}
                    onClick={() => cancelQHandler(openModal?.data?.barber)}
                    disabled={barberCancelLoading}
                  >Cancel</button>
                }


              </div>
            </div>
          </Modal>
        ) : (null)
      }


    </section>
  )
}

export default Queue

