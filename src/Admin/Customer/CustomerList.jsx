import React, { useEffect, useRef, useState } from 'react';
import style from './CustomerList.module.css';
import Skeleton from 'react-loading-skeleton';
import { adminGetAllCustomerListAction, adminSendCustomerNotificationAction } from '../../Redux/Admin/Actions/CustomerAction';
import { useDispatch, useSelector } from 'react-redux';
import { darkmodeSelector } from '../../Redux/Admin/Reducers/AdminHeaderReducer';
import api from '../../Redux/api/Api';
import { GET_ALL_CUSTOMERLIST_REQ, GET_ALL_CUSTOMERLIST_SUCCESS } from '../../Redux/Admin/Constants/constants';
import toast from 'react-hot-toast';
import Modal from '@mui/material/Modal';
import { adminSendBarberEmailAction, adminSendBarberMessageAction } from '../../Redux/Admin/Actions/BarberAction';
import ButtonLoader from '../../components/ButtonLoader/ButtonLoader';
import { CheckAllIcon, CheckIcon, CloseIcon, DropdownIcon, EmailIcon, MessageIcon, SalonThreeDotsIcon, SearchIcon, SortDownIcon, SortUpDownArrowIcon, SortUpIcon } from '../../newicons';
import { ClickAwayListener, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ddmmformatDate } from '../../../utils/ddmmformatDate';
import { Notificationicon } from '../../icons';

const CustomerList = () => {

  const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

  const currentsalonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId);
  const dispatch = useDispatch();
  const CustomerListControllerRef = useRef(new AbortController());

  useEffect(() => {
    const controller = new AbortController();
    CustomerListControllerRef.current = controller;

    dispatch(adminGetAllCustomerListAction(currentsalonId, controller.signal));

    return () => {
      if (CustomerListControllerRef.current) {
        CustomerListControllerRef.current.abort();
      }
    };
  }, [dispatch]);

  const adminGetAllCustomerList = useSelector(state => state.adminGetAllCustomerList);

  const {
    loading: adminGetAllCustomerListLoading,
    resolve: adminGetAllCustomerListResolve,
    getAllCustomers: AllCustomerList,
  } = adminGetAllCustomerList;

  const darkMode = useSelector(darkmodeSelector);
  const darkmodeOn = darkMode === 'On';


  const [checkAllCustomers, setCheckAllCustomers] = useState(false);
  const [checkedCustomers, setCheckedCustomers] = useState({});
  const [checkedEmails, setCheckedEmails] = useState([]);
  const [checkMobileNumbers, setCheckMobileNumber] = useState([]);
  const [checkCustomerNames, setCheckCustomerNames] = useState([]);


  const customerEmailCheckedHandler = (customer) => {
    const isChecked = !checkedCustomers[customer._id];
    setCheckedCustomers(prevState => ({
      ...prevState,
      [customer._id]: isChecked,
    }));

    if (isChecked) {
      setCheckedEmails(prevEmails => [...prevEmails, customer.email]);
      setCheckMobileNumber(prevMobileNumbers => [...prevMobileNumbers, Number(`${customer.mobileCountryCode}${customer.mobileNumber}`)]);
      setCheckCustomerNames(prevNames => [...prevNames, customer.name]);
      setCheckAllCustomers(false)
    } else {
      setCheckedEmails(prevEmails => prevEmails.filter(email => email !== customer.email));
      setCheckMobileNumber(prevMobileNumbers => prevMobileNumbers.filter(mobileNumber => mobileNumber !== Number(`${customer.mobileCountryCode}${customer.mobileNumber}`)));
      setCheckCustomerNames(prevNames => prevNames.filter(name => name !== customer.name));
      setCheckAllCustomers(false)
    }
  };

  const checkAllCustomersHandler = (e) => {
    setCheckAllCustomers((prev) => {
      if (!prev) {
        const customerEmails = AllCustomerList.map((c) => c.email);
        const customerMobileNumbers = AllCustomerList.map((c) => Number(`${c.mobileCountryCode}${c.mobileNumber}`));
        const customerNames = AllCustomerList.map((c) => c.name);
        const allCheckedCustomers = AllCustomerList.reduce((acc, customer) => {
          acc[customer._id] = true;
          return acc;
        }, {});
        setCheckedEmails(customerEmails);
        setCheckMobileNumber(customerMobileNumbers);
        setCheckCustomerNames(customerNames);
        setCheckedCustomers(allCheckedCustomers);
      } else {
        setCheckedEmails([]);
        setCheckMobileNumber([]);
        setCheckCustomerNames([]);
        setCheckedCustomers({});
      }

      return !prev;
    });
  };


  // const navigate = useNavigate();

  const [openBarberEmail, setOpenBarberEmail] = useState(false)

  const sendEmailNavigate = () => {
    if (checkedEmails.length > 0) {
      setOpenBarberEmail(true)
    } else {
      toast.error("Please select a customer", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    }

  };

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

  const adminSendBarberEmail = useSelector(state => state.adminSendBarberEmail)

  const {
    loading: adminSendBarberEmailLoading
  } = adminSendBarberEmail


  const [openBarberMessage, setOpenBarberMessage] = useState(false)
  const [barbertitle, setBarberTitle] = useState("")
  const [barberMessage, setBarberMessage] = useState("")

  const sendMessageNavigate = () => {
    if (checkMobileNumbers.length > 0) {
      setOpenBarberMessage(true)
    } else {
      toast.error("Please select a customer", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
    }

  };

  // const sendMessageHandler = () => {
  //   const smsdata = {
  //     smsBody: barberMessage,
  //     numbers: checkMobileNumbers
  //   }
  //   // console.log(smsdata)
  //   dispatch(adminSendBarberMessageAction(smsdata, setMessage, setOpenBarberMessage))
  // }

  const sendMessageHandler = () => {

    if (barbertitle.trim() === "" || barberMessage.trim() === "") {
      toast.error("Please fill in all fields", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: '0.3rem',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    const notificationData = {
      salonId,
      title: barbertitle,
      body: barberMessage,
      emails: checkedEmails,
    }

    // console.log("Notification Data:", notificationData);

    dispatch(adminSendCustomerNotificationAction(notificationData, setBarberTitle, setBarberMessage, setOpenBarberMessage))
  }

  const handleKeyPressMessage = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };

  const adminSendCustomerNotification = useSelector(state => state.adminSendCustomerNotification)

  const {
    loading: adminSendCustomerNotificationLoading
  } = adminSendCustomerNotification

  // ========================================

  const headRows = [
    { id: 1, heading: "#", key: "" },
    { id: 2, heading: "Name", key: "name" },
    { id: 3, heading: "Email", key: "email" },
    { id: 4, heading: "Gender", key: "gender" },
    { id: 5, heading: "Mobile Number", key: "mobileNumber" },
    { id: 6, heading: "Date Of Birth", key: "dateOfBirth" },
    { id: 7, heading: "", key: "" },
  ];

  const [customerlistDataCopy, setCustomerlistDataCopy] = useState([])

  const [customerlistData, setCustomerlistData] = useState([])
  const [mobileCustomerList, setMobileCustomerList] = useState([])

  useEffect(() => {
    if (adminGetAllCustomerListResolve && AllCustomerList.length > 0) {
      setCustomerlistData(AllCustomerList)
      setCustomerlistDataCopy(AllCustomerList)
      setMobileCustomerList(AllCustomerList)
    }

  }, [AllCustomerList])


  const [rowsPerPage, SetRowsPerPage] = useState(10)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(rowsPerPage)
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortColumn, setSortColumn] = useState("")
  const [query, setQuery] = useState("")

  const [customerPaginationData, setCustomerPaginationData] = useState([])

  useEffect(() => {
    if (customerlistData.length > 0) {
      setCustomerPaginationData(customerlistData.slice(startIndex, endIndex))
    }
  }, [customerlistData])

  useEffect(() => {
    const totalPages = Math.ceil(customerlistData.length / rowsPerPage);
    setTotalPages(totalPages);
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, customerlistData.length);
    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setCustomerPaginationData(customerlistData.slice(startIndex, endIndex));
  }, [customerlistData, page, rowsPerPage]);

  const handleChange = (event, value) => {
    setPage(value);
  }

  const sortFunction = (columnKey) => {
    setSortOrder((prev) => (sortColumn === columnKey && prev === 'asc' ? 'desc' : 'asc'));
    setSortColumn(columnKey);
  };

  useEffect(() => {
    if (!sortColumn) return;

    const sortedList = [...customerlistData].sort((a, b) => {
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

    setCustomerlistData(sortedList);
    // setPage(1); 
  }, [sortColumn, sortOrder]);


  useEffect(() => {
    if (mobileWidth) {
      let filteredData = customerlistDataCopy;

      if (query.trim() !== '') {
        filteredData = customerlistDataCopy.filter((item) => {
          return (
            item.name.toLowerCase().trim().includes(query.toLowerCase()) ||
            item.email.toLowerCase().trim().includes(query.toLowerCase())
          );
        });
      }

      setMobileCustomerList(filteredData)
    } else {
      let filteredData = customerlistDataCopy;

      if (query.trim() !== '') {
        filteredData = customerlistDataCopy.filter((item) => {
          return (
            item.name.toLowerCase().trim().includes(query.toLowerCase()) ||
            item.email.toLowerCase().trim().includes(query.toLowerCase())
          );
        });
      }

      setCustomerlistData(filteredData);
      setPage(1);
    }

  }, [query]);


  const [selectOpen, setSelectOpen] = useState(false)

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const [mobileSettingIndex, setMobileSettingIndex] = useState("")

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

  const navigate = useNavigate()

  const customerhistoryhandler = (item) => {
    localStorage.setItem("QueueHistoryCustomer", JSON.stringify({ ...item, customer: true }))
    navigate("/admin-quehistory")
  }

  const customerappointmenthistoryhandler = (item) => {
    localStorage.setItem("AppointmentHistoryCustomer", JSON.stringify({ ...item, customer: true }))
    navigate("/admin-appointmenthistory")
  }

  const [settingsIndex, setSettingsIndex] = useState("")

  return (
    <section className={`${style.section}`}>
      <div>
        <h2>Customer List</h2>
        <div>
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
                  />
                </div>

                <div>
                  <p>To</p>
                  <input
                    type="text"
                    value={
                      checkedEmails?.map((e) => " " + e)
                    }
                    onKeyDown={handleKeyPressMessage}
                  />
                </div>

                <div>
                  <p>Subject</p>
                  <input
                    type="text"
                    placeholder='Enter Subject'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>


                <div>
                  <p>Message</p>
                  <textarea
                    type="text"
                    placeholder='Enter Message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
            onClick={sendMessageNavigate}
            title='Message'
            disabled={salonId === 0}
            style={{
              cursor: salonId === 0 ? "not-allowed" : "cursor"
            }}
          ><Notificationicon /></button>

          <Modal
            open={openBarberMessage}
            onClose={() => setOpenBarberMessage(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
              <div>
                <p>Send Notification</p>
                <button onClick={() => setOpenBarberMessage(false)}><CloseIcon /></button>
              </div>

              <div className={style.modal_content_container}>
                <div>
                  <p>From</p>
                  <input
                    type="text"
                    value={"iqbook"}
                    readOnly
                  />
                </div>

                <div>
                  <p>To</p>
                  <input
                    type="text"
                    value={
                      checkCustomerNames?.map((e) => " " + e)
                    }
                    readOnly
                  />
                </div>

                <div>
                  <p>Title</p>
                  <input
                    type="text"
                    value={barbertitle}
                    placeholder='Enter Title'
                    onChange={(e) => setBarberTitle(e.target.value)}
                    onKeyDown={handleKeyPressMessage}
                  />
                </div>

                <div>
                  <p>Body</p>
                  <textarea
                    type="text"
                    placeholder='Enter Message'
                    value={barberMessage}
                    onChange={(e) => setBarberMessage(e.target.value)}
                  ></textarea>
                </div>

                {
                  adminSendCustomerNotificationLoading ?
                    <button className={style.barber_send_btn}><ButtonLoader /></button> :
                    <button onClick={sendMessageHandler} disabled={adminSendCustomerNotificationLoading} className={style.barber_send_btn}>Send</button>
                }
              </div>
            </div>
          </Modal>


          <input
            type='text'
            placeholder='Search Customer'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

      </div>

      <div className={`${style.mobile_header}`}>
        <h2>
          Customer List
          <span className={style.count_badge}>
            {mobileCustomerList?.length ?? 0}
          </span>
        </h2>
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
              <>
                <button
                  className={`${style.barber_send_btn} ${darkmodeOn && style.dark}`}
                  onClick={checkAllCustomersHandler}
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
                <button
                  onClick={sendMessageNavigate}
                  title='Message'
                  disabled={salonId === 0}
                  style={{
                    cursor: salonId === 0 ? "not-allowed" : "cursor"
                  }}
                ><Notificationicon /></button>
                <button onClick={() => setMobileSearchOpen(true)}><SearchIcon /></button>
              </>
            )
          }
        </div>

      </div>

      <div className={`${style.list_container}`}>

        {
          adminGetAllCustomerListLoading ? (
            <div className={`${style.list_body_container_loader}`}>
              <Skeleton
                count={6}
                height={"6.5rem"}
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
                style={{ marginBottom: "1rem" }} />
            </div>
          ) : adminGetAllCustomerListResolve && AllCustomerList.length > 0 ? (
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
                              onChange={checkAllCustomersHandler}
                              checked={checkAllCustomers}
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
                customerPaginationData.map((item, index) => {
                  return (
                    <div key={item._id} style={{ borderBottom: (index === endIndex - 1) || (index === customerPaginationData.length - 1) ? null : "0.1rem solid var(--border-secondary)" }}>
                      <div>
                        <input
                          type="checkbox"
                          checked={checkedCustomers[item._id] || false}
                          onChange={() => customerEmailCheckedHandler(item)}
                        />
                      </div>
                      <div>
                        <div>
                          <div><img src={item?.profile?.[0]?.url} alt="" /></div>
                          <p>{item?.name}</p>
                        </div>
                      </div>
                      <div><p>{item.email}</p></div>
                      <div><p>{item.gender}</p></div>
                      <div><p>+{item?.mobileCountryCode}{" "}{item?.mobileNumber}</p></div>
                      <div>
                        <p>
                          {item?.dateOfBirth
                            ? ddmmformatDate(item.dateOfBirth.split("T")[0])
                            : "-"}
                        </p>
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

                                  <button onClick={() => customerappointmenthistoryhandler(item)}>Appointment History</button>
                                  <button onClick={() => customerhistoryhandler(item)}>Queue History</button>
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
              <p>No customer available</p>
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
        adminGetAllCustomerListLoading ? (
          <div className={style.list_container_mobile_loader}>
            <Skeleton
              count={6}
              height={"10rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }} />
          </div>
        ) : adminGetAllCustomerListResolve && AllCustomerList.length > 0 ? (
          <div className={style.list_mobile_container}>

            {
              mobileCustomerList?.map((item, index) => {
                return (
                  <div
                    style={{
                      border: checkedCustomers[item._id] ? "0.1rem solid var(--bg-secondary)" : "0.1rem solid var(--border-secondary)"
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      customerEmailCheckedHandler(item)
                    }}
                    className={style.list_mobile_item} key={item._id}>
                    <div>
                      <img src={item?.profile?.[0]?.url} alt="" width={50} height={50} />
                      <div>
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                        <p>+{item?.mobileCountryCode}{" "}{item?.mobileNumber}</p>
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
                            <li onClick={() => customerappointmenthistoryhandler(item)}>Appointment History</li>
                            <li onClick={() => customerhistoryhandler(item)}>Queue History</li>
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
            <p>No customers available</p>
          </div>
        )
      }



    </section >
  )
}

export default CustomerList

