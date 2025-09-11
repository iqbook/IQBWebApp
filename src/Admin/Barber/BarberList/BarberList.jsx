import React, { useEffect, useState, useRef } from 'react'
import style from "./BarberList.module.css"
import { BarberClockIn, BarberClockOut, CheckAllIcon, CheckIcon, CloseIcon, DropdownIcon, EmailIcon, MessageIcon, OfflineIcon, OnlineIcon, SalonThreeDotsIcon, SortDownIcon, SortUpDownArrowIcon, SortUpIcon } from '../../../newicons';
import { ClickAwayListener, FormControl, MenuItem, Modal, Pagination, Select } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { adminApproveBarberAction, adminDeleteBarberAction, adminSendBarberEmailAction, adminSendBarberMessageAction, changeAdminBarberClockStatusAction, changeAdminBarberOnlineStatusAction, getAdminBarberListAction } from '../../../Redux/Admin/Actions/BarberAction'
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer'
import { useSelector, useDispatch } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import ButtonLoader from '../../../components/ButtonLoader/ButtonLoader'
import { ClockIcon } from '../../../icons';

const BarberList = () => {

  const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

  const getAdminBarberList = useSelector(state => state.getAdminBarberList)

  const {
    loading: getAdminBarberListLoading,
    resolve: getAdminBarberListResolve,
    getAllBarbers: BarberList
  } = getAdminBarberList

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createbarberClicked = () => {
    navigate("/admin-barber/createbarber")
  }

  const editButtonClicked = (barber) => {
    navigate(`/admin-barber/editbarber/${barber.salonId}`, { state: barber })
  }

  const deleteButtonClicked = (barber) => {
    const confirm = window.confirm("Are you sure ?")
    if (confirm) {
      dispatch(adminDeleteBarberAction(barber.salonId, barber.email, barber))
    }
  }

  useEffect(() => {
    if (BarberList && BarberList.length > 0) {
      const initialCheckMap = new Map();
      BarberList.forEach(barber => {
        const key = `${barber.salonId}-${barber.barberId}`;
        initialCheckMap.set(key, barber.isOnline || false);
      });
      setCheckMap(initialCheckMap);

      const initialCheckMapClock = new Map();
      BarberList.forEach(barber => {
        const key = `${barber.salonId}-${barber.barberId}`;
        initialCheckMapClock.set(key, barber.isClockedIn || false);
      });
      setCheckMapClock(initialCheckMapClock);
    }
  }, [BarberList]);

  const [checkMap, setCheckMap] = useState(new Map());

  const toggleHandler = (b) => {
    setCheckMap(prevCheckMap => {
      const newCheckMap = new Map(prevCheckMap);
      const key = `${b.salonId}-${b.barberId}`;
      const newIsOnline = !newCheckMap.get(key) || false; // Toggle the value
      newCheckMap.set(key, newIsOnline);
      return newCheckMap;
    });

    const barberOnlineData = {
      barberId: b.barberId,
      salonId: b.salonId,
      isOnline: !checkMap?.get(`${b.salonId}-${b.barberId}`) || false
    };

    dispatch(changeAdminBarberOnlineStatusAction(barberOnlineData, setCheckMap, b, checkMap?.get(`${b.salonId}-${b.barberId}`)));
  }

  const [checkMapClock, setCheckMapClock] = useState(new Map())

  const toggleClockHandler = (b) => {
    setCheckMapClock(prevCheckMapClock => {
      const newCheckMapClock = new Map(prevCheckMapClock);
      const key = `${b.salonId}-${b.barberId}`;
      const newIsClock = !newCheckMapClock.get(key) || false; // Toggle the value
      newCheckMapClock.set(key, newIsClock);
      return newCheckMapClock;
    });

    const barberClockData = {
      barberId: b.barberId,
      salonId: b.salonId,
      isClockedIn: !checkMapClock?.get(`${b.salonId}-${b.barberId}`) || false
    };

    dispatch(changeAdminBarberClockStatusAction(barberClockData, setCheckMapClock, b, checkMapClock?.get(`${b.salonId}-${b.barberId}`), setCheckMap));
  }


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



  const [approveBarberMap, setApproveBarberMap] = useState(new Map());

  useEffect(() => {
    if (BarberList) {
      const initialCheckMap = new Map();
      BarberList.forEach(barber => {
        const key = `${barber.salonId}-${barber.email}`;
        initialCheckMap.set(key, barber.isApproved || false);
      });
      setApproveBarberMap(initialCheckMap);
    }
  }, [BarberList]);

  const approveHandler = (b) => {

    setApproveBarberMap((prevCheckMap) => {
      const newCheckMap = new Map(prevCheckMap);
      const key = `${b.salonId}-${b.email}`;
      const newIsApprove = !newCheckMap.get(key) || false; // Toggle the value
      newCheckMap.set(key, newIsApprove);
      return newCheckMap;
    });

    const approvedata = {
      salonId: b.salonId,
      email: b.email,
      isApproved: !approveBarberMap?.get(`${b.salonId}-${b.email}`) || false
    };

    dispatch(adminApproveBarberAction(approvedata, setApproveBarberMap, b, approveBarberMap?.get(`${b.salonId}-${b.email}`), setCheckMap, setCheckMapClock))
  }

  const adminApproveBarber = useSelector(state => state.adminApproveBarber)

  const {
    loading: adminApproveBarberLoading,
    resolve: adminApproveBarberResolve,
    response: approvebarber
  } = adminApproveBarber

  const [allCheckbox, setAllCheckbox] = useState(false)

  const selectAllBarbers = () => {
    setAllCheckbox((prev) => {
      const newCheckboxState = !prev;

      if (newCheckboxState) {
        setSelectedAllBarberNotification(BarberList.map((b) => b.email));
      } else {
        setSelectedAllBarberNotification([]);
      }

      return newCheckboxState;
    });
  };

  const darkMode = useSelector(darkmodeSelector)

  const darkmodeOn = darkMode === "On"

  const [checkAllBarbers, setCheckAllBarbers] = useState(false)
  const [checkedBarbers, setCheckedBarbers] = useState({});
  const [checkedEmails, setCheckedEmails] = useState([]);
  const [checkMobileNumbers, setCheckMobileNumber] = useState([])
  const [checkBarberNames, setCheckBarberNames] = useState([])

  const barberEmailCheckedHandler = (barber) => {
    const isChecked = !checkedBarbers[barber._id];
    setCheckedBarbers(prevState => ({
      ...prevState,
      [barber._id]: isChecked,
    }));

    if (isChecked) {
      setCheckedEmails(prevEmails => [...prevEmails, barber.email]);
      setCheckMobileNumber(prevMobileNumbers => [...prevMobileNumbers, Number(`${barber?.mobileCountryCode}${barber?.mobileNumber}`)]);
      setCheckBarberNames(prevNames => [...prevNames, barber.name])
      setCheckAllBarbers(false)
    } else {
      setCheckedEmails(prevEmails => prevEmails.filter(email => email !== barber.email));
      setCheckMobileNumber(prevMobileNumbers => prevMobileNumbers.filter(mobileNumber => mobileNumber !== Number(`${barber?.mobileCountryCode}${barber?.mobileNumber}`)));
      setCheckBarberNames(prevNames => prevNames.filter(name => name !== barber.name))
      setCheckAllBarbers(false)
    }
  };

  const checkAllBarbersHandler = (e) => {
    setCheckAllBarbers((prev) => {
      if (!prev) {
        const barberEmails = BarberList.map((b) => b.email)
        const barberMobileNumbers = BarberList.map((b) => Number(`${b?.mobileCountryCode}${b?.mobileNumber}`));
        const barberNames = BarberList.map((b) => b.name)
        const allCheckedBarbers = BarberList.reduce((acc, barber) => {
          acc[barber._id] = true;
          return acc;
        }, {});
        setCheckedEmails(barberEmails)
        setCheckMobileNumber(barberMobileNumbers)
        setCheckBarberNames(barberNames)
        setCheckedBarbers(allCheckedBarbers);
      } else {
        setCheckedEmails([])
        setCheckMobileNumber([])
        setCheckBarberNames([])
        setCheckedBarbers({});
      }

      return !prev
    })
  }

  // console.log(checkedEmails)
  // console.log(checkMobileNumbers)


  const [openBarberEmail, setOpenBarberEmail] = useState(false)

  const sendEmailNavigate = () => {
    if (checkedEmails.length > 0) {

      setOpenBarberEmail(true)
    } else {
      toast.error("Please select a barber", {
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

  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const sendMailHandler = () => {
    const maildata = {
      subject,
      message,
      role: "Barber",
      recipientEmails: checkedEmails,
      salonId
    }
    dispatch(adminSendBarberEmailAction(maildata, setSubject, setMessage, setOpenBarberEmail))

  }

  const handleKeyPressMail = (e) => {
    if (e.key === "Enter") {
      sendMailHandler();
    }
  };

  const adminSendBarberEmail = useSelector(state => state.adminSendBarberEmail)

  const {
    loading: adminSendBarberEmailLoading
  } = adminSendBarberEmail

  const [openBarberMessage, setOpenBarberMessage] = useState(false)
  const [barberMessage, setBarberMessage] = useState("")

  const sendMessageNavigate = () => {
    if (checkMobileNumbers.length > 0) {
      setOpenBarberMessage(true)
    } else {
      toast.error("Please select a barber", {
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

  const sendMessageHandler = () => {
    const smsdata = {
      smsBody: barberMessage,
      numbers: checkMobileNumbers
    }
    dispatch(adminSendBarberMessageAction(smsdata, setMessage, setOpenBarberMessage))
  }

  const handleKeyPressMessage = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };

  const adminSendBarberMessage = useSelector(state => state.adminSendBarberMessage)

  const {
    loading: adminSendBarberMessageLoading
  } = adminSendBarberMessage

  // console.log(BarberList)

  // ================================

  const headRows = [
    { id: 1, heading: "", key: "" },
    { id: 2, heading: "Name", key: "name" },
    { id: 3, heading: "Email", key: "email" },
    { id: 4, heading: "isOnline", key: "isOnline" },
    { id: 5, heading: "isClockin", key: "isClockedIn" },
    { id: 6, heading: "isApprove", key: "isApproved" },
    { id: 7, heading: "", key: "" },
  ];


  const [barberlistData, setBarberlistData] = useState([])

  useEffect(() => {
    if (getAdminBarberListResolve && BarberList.length > 0) {
      setBarberlistData(BarberList)
    }

  }, [BarberList])


  const [settingsIndex, setSettingsIndex] = useState("")

  const [rowsPerPage, SetRowsPerPage] = useState(10)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowsPerPage)
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortColumn, setSortColumn] = useState("")

  const [barberPaginationData, setBarberPaginationData] = useState([])

  useEffect(() => {
    if (barberlistData.length > 0) {
      setBarberPaginationData(barberlistData.slice(startIndex, endIndex))
    }
  }, [barberlistData, startIndex, endIndex])

  useEffect(() => {
    const totalPages = Math.ceil(barberlistData.length / rowsPerPage)
    setTotalPages(totalPages)
    setStartIndex((page - 1) * rowsPerPage)
    setEndIndex(page * rowsPerPage)
  }, [rowsPerPage, page, barberlistData])

  useEffect(() => {
    setBarberPaginationData(barberlistData.slice(startIndex, endIndex))
  }, [barberlistData])


  const handleChange = (event, value) => {
    setPage(value);
  }

  const sortFunction = (columnKey) => {
    setSortOrder((prev) => (sortColumn === columnKey && prev === 'asc' ? 'desc' : 'asc'));
    setSortColumn(columnKey);
  };

  useEffect(() => {
    if (!sortColumn) return;

    const sortedList = [...barberlistData].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    setBarberlistData(sortedList);
    // setPage(1); 
  }, [sortColumn, sortOrder]);

  const [selectOpen, setSelectOpen] = useState(false)

  const [mobileSettingIndex, setMobileSettingIndex] = useState("")

  const queuehistoryhandler = (item) => {
    localStorage.setItem("QueueHistoryBarber", JSON.stringify({ ...item, barber: true }))
    navigate("/admin-quehistory")
  }

  const appointmenthistoryhandler = (item) => {
    localStorage.setItem("AppointmentHistoryBarber", JSON.stringify({ ...item, barber: true }))
    navigate("/admin-appointmenthistory")
  }

  return (
    <section className={`${style.section}`}>
      <div>
        <h2>Barber List</h2>
        <div>

          <button
            className={`${style.barber_send_btn} ${darkmodeOn && style.dark}`}
            onClick={checkAllBarbersHandler}
            title='Select all barbers'
          ><CheckAllIcon /></button>

          <button
            onClick={sendEmailNavigate}
            title='Email'
            disabled={salonId === 0}
            style={{
              cursor: salonId === 0 ? "not-allowed" : "cursor"
            }}
          ><EmailIcon /></button>


          <Modal
            open={openBarberEmail}
            onClose={() => setOpenBarberEmail(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
              <div>
                <p>Send Email</p>
                <button onClick={() => setOpenBarberEmail(false)}><CloseIcon /></button>
              </div>

              <div className={style.modal_content_container}>
                <div>
                  <p>From</p>
                  <input
                    type="text"
                    value={"support@iqbook.io"}
                    readOnly
                    onKeyDown={handleKeyPressMail}
                  />
                </div>

                <div>
                  <p>To</p>
                  <input type="text" value={
                    checkedEmails?.map((e) => " " + e)
                  }
                    onKeyDown={handleKeyPressMail}
                  />
                </div>

                <div>
                  <p>Subject</p>
                  <input
                    type="text"
                    placeholder='Enter Subject'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onKeyDown={handleKeyPressMail}
                  />
                </div>


                <div>
                  <p>Message</p>
                  <textarea
                    type="text"
                    placeholder='Enter Message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPressMail}
                  ></textarea>
                </div>

                {
                  adminSendBarberEmailLoading ?
                    <button className={style.barber_send_btn}><ButtonLoader /></button> :
                    <button onClick={sendMailHandler} disabled={adminSendBarberEmailLoading} className={style.barber_send_btn}>Send</button>
                }
              </div>
            </div>
          </Modal>

          <button
            className={`${style.barber_send_btn} ${darkmodeOn && style.dark}`}
            onClick={sendMessageNavigate}
            disabled={salonId === 0}
            style={{
              cursor: salonId === 0 ? "not-allowed" : "cursor"
            }}
            title='Message'
          ><MessageIcon /></button>

          <Modal
            open={openBarberMessage}
            onClose={() => setOpenBarberMessage(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
              <div>
                <p>Send Message</p>
                <button onClick={() => setOpenBarberMessage(false)}><CloseIcon /></button>
              </div>

              <div className={style.modal_content_container}>
                <div>
                  <p>From</p>
                  <input
                    type="text"
                    value={"iqbook"}
                    readOnly
                    onKeyDown={handleKeyPressMessage}
                  />
                </div>

                <div>
                  <p>To</p>
                  <input type="text" value={
                    checkBarberNames?.map((e) => " " + e)
                  }
                    onKeyDown={handleKeyPressMessage}
                  />
                </div>

                <div>
                  <p>Message</p>
                  <textarea
                    type="text"
                    placeholder='Enter Message'
                    value={barberMessage}
                    onChange={(e) => setBarberMessage(e.target.value)}
                    onKeyDown={handleKeyPressMessage}
                  ></textarea>
                </div>

                {
                  adminSendBarberMessageLoading ?
                    <button className={style.barber_send_btn}><ButtonLoader /></button> :
                    <button onClick={sendMessageHandler} disabled={adminSendBarberMessageLoading} className={style.barber_send_btn}>Send</button>
                }
              </div>
            </div>
          </Modal>

          <button
            disabled={salonId === 0}
            style={{
              cursor: salonId === 0 ? "not-allowed" : "cursor"
            }}

            onClick={() => navigate("/admin-barber/createbarber")}>Create</button>
        </div>
      </div>

      <div className={`${style.list_container}`}>

        {
          getAdminBarberListLoading ? (
            <div className={`${style.list_body_container_loader}`}>
              <Skeleton
                count={6}
                height={"6.5rem"}
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
                style={{ marginBottom: "1rem" }} />
            </div>
          ) : getAdminBarberListResolve && BarberList.length > 0 ? (
            <div className={`${style.list_body_container}`}>

              <div className={`${style.headRow}`}>

                {
                  headRows.map((item, index) => {
                    return (
                      <div key={item.id}>
                        {
                          item.key === "" && index === 0 ? (
                            <input
                              type="checkbox"
                              onChange={checkAllBarbersHandler}
                              checked={checkAllBarbers}
                            />
                          ) : (
                            <button
                              className={`${item.key === "name" ? style.name_head_btn : ""}`}
                              onClick={() => sortFunction(item.key)}>
                              {item.key === "name" ? (
                                <>
                                  <span></span>
                                  {item.heading}
                                </>
                              ) : (
                                item.heading
                              )}

                              <span>{item.key && (sortColumn === item.key ? (sortOrder === 'asc' ? <SortUpIcon /> : <SortDownIcon />) : <SortUpDownArrowIcon />)}</span>
                            </button>
                          )
                        }

                      </div>
                    )
                  })
                }
              </div>

              {
                barberPaginationData.map((item, index) => {
                  return (
                    <div key={item._id} style={{ borderBottom: (index === endIndex - 1) || (index === barberPaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                      <div>
                        <input
                          type="checkbox"
                          checked={checkedBarbers[item._id] || false}
                          onChange={() => barberEmailCheckedHandler(item)}
                        />
                        {console.log(checkedBarbers[item._id])}
                      </div>
                      <div>
                        <div>
                          <div><img src={item.profile?.[0]?.url} alt="" /></div>
                          <p>{item.name}</p>
                        </div>
                      </div>
                      <div><p>{item.email}</p></div>

                      <div>
                        <button
                          onClick={() => toggleHandler(item)}
                          style={{
                            backgroundColor: checkMap?.get(`${item.salonId}-${item.barberId}`) ? "#052E16" : "#450a0a"
                          }}
                        >{checkMap?.get(`${item.salonId}-${item.barberId}`) ? "Online" : "Offline"}</button>
                      </div>

                      <div>
                        <button
                          onClick={() => toggleClockHandler(item)}
                          style={{
                            backgroundColor: checkMapClock?.get(`${item.salonId}-${item.barberId}`) ? "#052E16" : "#450a0a"
                          }}
                        >{checkMapClock?.get(`${item.salonId}-${item.barberId}`) ? "Clock-In" : "Clock-Out"}</button>
                      </div>

                      <div>
                        <button
                          onClick={() => approveHandler(item)}
                          disabled={adminApproveBarberLoading ? true : false}
                          style={{
                            backgroundColor: approveBarberMap?.get(`${item.salonId}-${item.email}`) ? "#052E16" : "#450a0a"
                          }}>{approveBarberMap?.get(`${item.salonId}-${item.email}`) ? "Approved" : "Approve"}
                        </button>
                      </div>
                      <div>
                        <div
                          style={{
                            position: settingsIndex === index ? "relative" : "initial",
                            backgroundColor: settingsIndex === index ? "var(--btn-primary-hover)" : null,
                            borderRadius: settingsIndex === index ? "var(--border-radius-primary)" : null,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSettingsIndex(index);
                          }}>
                          <SalonThreeDotsIcon />

                          {
                            settingsIndex === index && (
                              <ClickAwayListener onClickAway={() => setSettingsIndex(null)}>
                                <div
                                  style={{
                                    position: "absolute",
                                    zIndex: settingsIndex === index ? 9999 : -100,
                                  }}
                                  className={`${style.settings_container}`}>
                                  <button
                                    onClick={() => editButtonClicked(item)}
                                    disabled={approveBarberMap?.get(`${item.salonId}-${item.email}`) === false}
                                    style={{
                                      cursor: approveBarberMap?.get(`${item.salonId}-${item.email}`) === false ? "not-allowed" : "pointer"
                                    }}
                                  >Edit barber</button>

                                  <button onClick={() => queuehistoryhandler(item)}>Queue History</button>
                                  <button onClick={() => appointmenthistoryhandler(item)}>Appointment History</button>
                                </div>

                              </ClickAwayListener>)
                          }

                        </div>

                      </div>

                    </div>
                  )
                })
              }
            </div>
          ) : (
            <div className={`${style.list_body_container_error}`}>
              <p>No barbers available</p>
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
        getAdminBarberListLoading ? (
          <div className={style.list_container_mobile_loader}>
            <Skeleton
              count={6}
              height={"19.5rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }} />
          </div>
        ) : getAdminBarberListResolve && BarberList.length > 0 ? (
          <div className={style.list_mobile_container}>

            {
              BarberList?.map((item, index) => {
                return (
                  <div
                    style={{
                      border: checkedBarbers[item._id] ? "0.1rem solid var(--bg-secondary)" : "0.1rem solid var(--border-secondary)"
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      barberEmailCheckedHandler(item)
                    }}

                    className={style.list_mobile_item} key={item._id} >
                    <div>
                      <img src={item.profile?.[0]?.url} alt="" width={50} height={50} loading='lazy' />
                      <div>
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                        {/* <p>+{item.mobileCountryCode}{" "}{item.mobileNumber}</p> */}
                        <p>{item?.mobileCountryCode && item?.mobileNumber ? `+${item.mobileCountryCode} ${item.mobileNumber}` : "Not Provided"}</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleHandler(item)
                          }}
                        >{checkMap?.get(`${item.salonId}-${item.barberId}`) ? <OnlineIcon color={"1ADB6A"} /> : <OfflineIcon color={"FC3232"} />}</button>
                        <p>{checkMap?.get(`${item.salonId}-${item.barberId}`) ? "Online" : "Offline"}</p>
                      </div>

                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            approveHandler(item)
                          }}
                          disabled={adminApproveBarberLoading ? true : false}
                        >{approveBarberMap?.get(`${item.salonId}-${item.email}`) ? <CheckIcon color={"1ADB6A"} /> : <CloseIcon color={"FC3232"} />}</button>
                        <p>{approveBarberMap?.get(`${item.salonId}-${item.email}`) ? "Approved" : "Approve"}</p>
                      </div>

                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleClockHandler(item)
                          }}
                        >{checkMapClock?.get(`${item.salonId}-${item.barberId}`) ? <BarberClockIn color={"1ADB6A"} /> : <BarberClockOut color={"FC3232"} />}</button>
                        <p>{checkMapClock?.get(`${item.salonId}-${item.barberId}`) ? "Clock-In" : "Clock-Out"}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileSettingIndex(index)
                      }}><SalonThreeDotsIcon /></button>

                    {
                      mobileSettingIndex === index ? (
                        <ClickAwayListener onClickAway={() => setMobileSettingIndex("")}>
                          <ul>
                            <li>
                              <button
                                onClick={() => editButtonClicked(item)}
                                disabled={approveBarberMap?.get(`${item.salonId}-${item.email}`) === false}
                                style={{
                                  cursor: approveBarberMap?.get(`${item.salonId}-${item.email}`) === false ? "not-allowed" : "pointer"
                                }}
                              >Edit barber</button>
                            </li>
                            <li>
                              <button onClick={() => queuehistoryhandler(item)}>Queue History</button>
                            </li>
                            <li>
                              <button onClick={() => appointmenthistoryhandler(item)}>Appointment History</button>
                            </li>
                          </ul>
                        </ClickAwayListener>
                      ) : null
                    }

                  </div>
                )
              })
            }

          </div>
        ) : (
          <div className={style.list_container_mobile_error}>
            <p>No barber list available</p>
          </div>
        )
      }

    </section >
  )
}

export default BarberList

