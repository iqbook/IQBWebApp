import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./CustomerList.module.css";
import Skeleton from "react-loading-skeleton";
import {
  adminGetAllCustomerListAction,
  adminSendCustomerNotificationAction,
} from "../../Redux/Admin/Actions/CustomerAction";
import { useDispatch, useSelector } from "react-redux";
import { darkmodeSelector } from "../../Redux/Admin/Reducers/AdminHeaderReducer";
import api from "../../Redux/api/Api";
import {
  GET_ALL_CUSTOMERLIST_REQ,
  GET_ALL_CUSTOMERLIST_SUCCESS,
} from "../../Redux/Admin/Constants/constants";
import toast from "react-hot-toast";
import Modal from "@mui/material/Modal";
import {
  adminSendBarberEmailAction,
  adminSendBarberMessageAction,
} from "../../Redux/Admin/Actions/BarberAction";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import {
  CheckAllIcon,
  CheckIcon,
  CloseIcon,
  DropdownIcon,
  EmailIcon,
  MessageIcon,
  ResetIcon,
  SalonThreeDotsIcon,
  SearchIcon,
  SortDownIcon,
  SortUpDownArrowIcon,
  SortUpIcon,
} from "../../newicons";
import { ClickAwayListener, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ddmmformatDate } from "../../../utils/ddmmformatDate";
import { Notificationicon } from "../../icons";
import ClipLoader from "react-spinners/ClipLoader";

const CustomerList = () => {
  const [mobileWidth, setMobileWidth] = useState(
    window.innerWidth <= 430 ? true : false,
  );

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth <= 430) {
        setMobileWidth(true);
      } else {
        setMobileWidth(false);
      }
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const salonId = useSelector(
    (state) => state.AdminLoggedInMiddleware.adminSalonId,
  );

  const currentsalonId = useSelector(
    (state) => state.AdminLoggedInMiddleware.adminSalonId,
  );
  const dispatch = useDispatch();

  const adminGetAllCustomerList = useSelector(
    (state) => state.adminGetAllCustomerList,
  );

  const {
    loading: adminGetAllCustomerListLoading,
    resolve: adminGetAllCustomerListResolve,
    response: AllCustomerList,
    pagination: PaginationObject,
  } = adminGetAllCustomerList;

  const [page, setPage] = useState(1);
  const [rowsPerPage, SetRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");

  const CustomerListControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (mobileWidth) return;

    const controller = new AbortController();
    CustomerListControllerRef.current = controller;

    dispatch(
      adminGetAllCustomerListAction(
        currentsalonId,
        page,
        rowsPerPage,
        query,
        controller.signal,
      ),
    );

    return () => {
      if (CustomerListControllerRef.current) {
        CustomerListControllerRef.current.abort();
      }
    };
  }, [dispatch, page, rowsPerPage, query, mobileWidth]);

  const darkMode = useSelector(darkmodeSelector);
  const darkmodeOn = darkMode === "On";

  const [checkAllCustomers, setCheckAllCustomers] = useState(false);
  const [checkedCustomers, setCheckedCustomers] = useState({});
  const [checkedEmails, setCheckedEmails] = useState([]);
  const [checkMobileNumbers, setCheckMobileNumber] = useState([]);
  const [checkCustomerNames, setCheckCustomerNames] = useState([]);

  const customerEmailCheckedHandler = (customer) => {
    const isChecked = !checkedCustomers[customer._id];
    setCheckedCustomers((prevState) => ({
      ...prevState,
      [customer._id]: isChecked,
    }));

    if (isChecked) {
      setCheckedEmails((prevEmails) => [...prevEmails, customer.email]);
      setCheckMobileNumber((prevMobileNumbers) => [
        ...prevMobileNumbers,
        Number(`${customer.mobileCountryCode}${customer.mobileNumber}`),
      ]);
      setCheckCustomerNames((prevNames) => [...prevNames, customer.name]);
      setCheckAllCustomers(false);
    } else {
      setCheckedEmails((prevEmails) =>
        prevEmails.filter((email) => email !== customer.email),
      );
      setCheckMobileNumber((prevMobileNumbers) =>
        prevMobileNumbers.filter(
          (mobileNumber) =>
            mobileNumber !==
            Number(`${customer.mobileCountryCode}${customer.mobileNumber}`),
        ),
      );
      setCheckCustomerNames((prevNames) =>
        prevNames.filter((name) => name !== customer.name),
      );
      setCheckAllCustomers(false);
    }
  };

  const [checkAllEmail, setCheckAllEmail] = useState(false);

  const checkAllCustomersHandler = () => {
    const newValue = !checkAllEmail;

    setCheckAllEmail(newValue);

    if (!newValue) {
      setCheckedCustomers({});
      setCheckedEmails([]);
      setCheckMobileNumber([]);
      setCheckCustomerNames([]);
    }
  };

  useEffect(() => {
    if (checkAllEmail) {
      const fetchAllCustomerEmails = async () => {
        try {
          const { data } = await api.get(
            `/api/customers/selectAllCustomerEmails?salonId=${salonId}`,
          );

          const emails = data.response.map((c) => c.email);
          const names = data?.response?.map((c) => c.name);
          setCheckedEmails(emails);
          setCheckCustomerNames(names);
        } catch (error) {
          console.log("Error fetching all customer emails");
        }
      };

      fetchAllCustomerEmails();
    } else {
      setCheckedEmails([]);
    }
  }, [checkAllEmail]);

  const [openBarberEmail, setOpenBarberEmail] = useState(false);

  const sendEmailNavigate = () => {
    if (checkedEmails.length > 0) {
      setOpenBarberEmail(true);
    } else {
      toast.error("Please select a customer", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendMailHandler = () => {
    const maildata = {
      subject,
      message,
      role: "Barber",
      recipientEmails: checkedEmails,
      salonId,
    };

    dispatch(
      adminSendBarberEmailAction(
        maildata,
        setSubject,
        setMessage,
        setOpenBarberEmail,
      ),
    );
  };

  const adminSendBarberEmail = useSelector(
    (state) => state.adminSendBarberEmail,
  );

  const { loading: adminSendBarberEmailLoading } = adminSendBarberEmail;

  const [openBarberMessage, setOpenBarberMessage] = useState(false);
  const [barbertitle, setBarberTitle] = useState("");
  const [barberMessage, setBarberMessage] = useState("");

  const sendMessageNavigate = () => {
    if (checkedEmails.length > 0) {
      setOpenBarberMessage(true);
    } else {
      toast.error("Please select a customer", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const sendMessageHandler = () => {
    if (barbertitle.trim() === "" || barberMessage.trim() === "") {
      toast.error("Please fill in all fields", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const notificationData = {
      salonId,
      title: barbertitle,
      body: barberMessage,
      emails: checkedEmails,
    };

    dispatch(
      adminSendCustomerNotificationAction(
        notificationData,
        setBarberTitle,
        setBarberMessage,
        setOpenBarberMessage,
      ),
    );
  };

  const handleKeyPressMessage = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };

  const adminSendCustomerNotification = useSelector(
    (state) => state.adminSendCustomerNotification,
  );

  const { loading: adminSendCustomerNotificationLoading } =
    adminSendCustomerNotification;

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

  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");

  const handleChange = (event, value) => {
    setPage(value);
  };

  const [selectOpen, setSelectOpen] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [mobileSettingIndex, setMobileSettingIndex] = useState("");

  const navigate = useNavigate();

  const customerhistoryhandler = (item) => {
    localStorage.setItem(
      "QueueHistoryCustomer",
      JSON.stringify({ ...item, customer: true }),
    );
    navigate("/admin-quehistory");
  };

  const customerappointmenthistoryhandler = (item) => {
    localStorage.setItem(
      "AppointmentHistoryCustomer",
      JSON.stringify({ ...item, customer: true }),
    );
    navigate("/admin-appointmenthistory");
  };

  const [settingsIndex, setSettingsIndex] = useState("");

  // Mobile View

  const [mobileListItems, setMobileListItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Create a ref for the observer
  const observer = useRef();

  // The "Last Element" ref: attaches to the last item in the list
  const lastItemElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const mobileControllerRef = useRef(null);

  const fetchData = async (signal) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/api/customers/getAllCustomers?salonId=${salonId}&page=${page}&limit=${rowsPerPage}&search=${query}`,
        { signal },
      );

      setMobileListItems((prev) => [...prev, ...data?.response]);
      setHasMore(data?.response?.length > 0);
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        return;
      }
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mobileWidth) return;

    // ❌ cancel previous request
    if (mobileControllerRef.current) {
      mobileControllerRef.current.abort();
    }

    // ✅ create new controller
    const controller = new AbortController();
    mobileControllerRef.current = controller;

    fetchData(controller.signal);

    return () => {
      controller.abort(); // cleanup
    };
  }, [page, query, mobileWidth]);

  return (
    <>
      {mobileWidth ? (
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            fontFamily: "sans-serif",
          }}
        >
          <div className={`${style.mobile_header}`}>
            <h2>
              Customer List
              <span className={style.count_badge}>
                {PaginationObject?.total ?? 0}
              </span>
            </h2>
            <div>
              {mobileSearchOpen ? (
                <ClickAwayListener
                  onClickAway={() => setMobileSearchOpen(false)}
                >
                  <div className={`${style.input_type_2}`}>
                    <input
                      type="text"
                      placeholder="Search Customer"
                      value={query}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPage(1);
                        setMobileListItems([]);
                        setQuery(value);
                      }}
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
                    title="Select all barbers"
                  >
                    <CheckAllIcon />
                  </button>
                  <button
                    onClick={sendEmailNavigate}
                    title="Email"
                    disabled={salonId === 0}
                    style={{
                      cursor: salonId === 0 ? "not-allowed" : "cursor",
                    }}
                  >
                    <EmailIcon />
                  </button>
                  <button
                    onClick={sendMessageNavigate}
                    title="Message"
                    disabled={salonId === 0}
                    style={{
                      cursor: salonId === 0 ? "not-allowed" : "cursor",
                    }}
                  >
                    <Notificationicon />
                  </button>
                  <button
                    onClick={() => {
                      if (checkAllEmail) {
                        return toast.error(
                          "Please deselect all customers before performing a search.",
                          {
                            duration: 3000,
                            style: {
                              fontSize: "var(--font-size-2)",
                              borderRadius: "0.3rem",
                              background: "#333",
                              color: "#fff",
                            },
                          },
                        );
                      }
                      setMobileSearchOpen(true);
                    }}
                  >
                    <SearchIcon />
                  </button>
                  <button
                    onClick={() => {
                      setCheckedCustomers({});
                      setCheckedEmails([]);
                      setCheckMobileNumber([]);
                      setCheckCustomerNames([]);
                      setQuery("")
                      if (page !== 1) {
                        setMobileListItems([]);
                        setPage(1);
                      }
                    }}
                  >
                    <ResetIcon />
                  </button>
                </>
              )}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--section-bg-color)",
              padding: "10px",
            }}
          >
            {mobileListItems.length > 0 ? (
              <>
                {mobileListItems.map((item, index) => {
                  const isLast = mobileListItems.length === index + 1;

                  return (
                    <button
                      ref={isLast ? lastItemElementRef : null}
                      key={item._id}
                      style={{
                        width: "100%",
                        border:
                          checkAllEmail || checkedCustomers[item._id]
                            ? "0.1rem solid var(--bg-secondary)"
                            : "0.1rem solid var(--border-secondary)",
                        opacity: checkAllEmail ? 0.6 : 1,
                      }}
                      disabled={checkAllEmail}
                      onClick={(e) => {
                        e.stopPropagation();
                        customerEmailCheckedHandler(item);
                      }}
                      className={style.list_mobile_item}
                    >
                      <div>
                        <img
                          src={item?.profile?.[0]?.url}
                          alt=""
                          width={50}
                          height={50}
                        />
                        <div>
                          <p>{item.name}</p>
                          <p>{item.email}</p>
                          <p>
                            +{item?.mobileCountryCode} {item?.mobileNumber}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileSettingIndex(index);
                        }}
                      >
                        <SalonThreeDotsIcon />
                      </button>

                      {mobileSettingIndex === index && (
                        <ClickAwayListener
                          onClickAway={() => setMobileSettingIndex("")}
                        >
                          <ul>
                            <li
                              onClick={() =>
                                customerappointmenthistoryhandler(item)
                              }
                            >
                              Appointment History
                            </li>
                            <li onClick={() => customerhistoryhandler(item)}>
                              Queue History
                            </li>
                          </ul>
                        </ClickAwayListener>
                      )}
                    </button>
                  );
                })}

                {/* ✅ loader INSIDE list */}
                {loading && (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <ClipLoader size={35} color="var(--text-primary)" />
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  height: "70vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p>No customers available</p>
              </div>
            )}
          </div>

          {/* {!hasMore && (
        <div
          style={{
            backgroundColor: "var(--section-bg-color)",
          }}
        >
          <p style={{ textAlign: "center", marginBottom: "2rem" }}>
            No more customers to show.
          </p>
        </div>
      )} */}
        </div>
      ) : (
        <section className={`${style.section}`}>
          <div>
            <h2>Customer List</h2>
            <div>
              <button
                onClick={sendEmailNavigate}
                title="Email"
                disabled={salonId === 0}
                style={{
                  cursor: salonId === 0 ? "not-allowed" : "cursor",
                }}
              >
                <EmailIcon />
              </button>

              <button
                onClick={sendMessageNavigate}
                title="Message"
                disabled={salonId === 0}
                style={{
                  cursor: salonId === 0 ? "not-allowed" : "cursor",
                }}
              >
                <Notificationicon />
              </button>

              <input
                type="text"
                placeholder="Search Customer"
                value={query}
                onChange={(e) => {
                  if (checkAllEmail) {
                    return toast.error(
                      "Please deselect all customers before performing a search.",
                      {
                        duration: 3000,
                        style: {
                          fontSize: "var(--font-size-2)",
                          borderRadius: "0.3rem",
                          background: "#333",
                          color: "#fff",
                        },
                      },
                    );
                  }

                  setPage(1)
                  setQuery(e.target.value)
                }}
              />
            </div>
          </div>

          <div className={`${style.list_container}`}>
            {adminGetAllCustomerListLoading ? (
              <div className={`${style.list_body_container_loader}`}>
                <Skeleton
                  count={6}
                  height={"6.5rem"}
                  baseColor={"var(--loader-bg-color)"}
                  highlightColor={"var(--loader-highlight-color)"}
                  style={{ marginBottom: "1rem" }}
                />
              </div>
            ) : adminGetAllCustomerListResolve && AllCustomerList.length > 0 ? (
              <div className={`${style.list_body_container}`}>
                <div className={`${style.headRow}`}>
                  {headRows.map((item, index) => {
                    return (
                      <div key={item.id}>
                        {item.key === "" && index === 0 ? (
                          <input
                            type="checkbox"
                            onChange={checkAllCustomersHandler}
                            // checked={checkAllCustomers}
                            checked={checkAllEmail}
                          />
                        ) : (
                          <button
                            className={`${item.key === "name" ? style.name_head_btn : ""}`}
                            onClick={() => sortFunction(item.key)}
                          >
                            {item.key === "name" ? (
                              <>
                                <span></span>
                                {item.heading}
                              </>
                            ) : (
                              item.heading
                            )}

                            <span>
                              {item.key &&
                                (sortColumn === item.key ? (
                                  sortOrder === "asc" ? (
                                    <SortUpIcon />
                                  ) : (
                                    <SortDownIcon />
                                  )
                                ) : (
                                  <SortUpDownArrowIcon />
                                ))}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {AllCustomerList.map((item, index) => {
                  return (
                    <div
                      key={item._id}
                      style={{
                        borderBottom:
                          index === endIndex - 1 ||
                          index === AllCustomerList.length - 1
                            ? null
                            : "0.1rem solid var(--border-secondary)",
                      }}
                    >
                      <div>
                        <input
                          type="checkbox"
                          // checked={checkedCustomers[item._id] || false}
                          // checked={checkAllEmail || checkedCustomers[item._id]}
                          checked={
                            checkAllEmail ? true : !!checkedCustomers[item._id]
                          }
                          onChange={() => customerEmailCheckedHandler(item)}
                          disabled={checkAllEmail}
                        />
                      </div>
                      <div>
                        <div>
                          <div>
                            <img src={item?.profile?.[0]?.url} alt="" />
                          </div>
                          <p>{item?.name}</p>
                        </div>
                      </div>
                      <div>
                        <p>{item.email}</p>
                      </div>
                      <div>
                        <p>{item.gender}</p>
                      </div>
                      <div>
                        <p>
                          +{item?.mobileCountryCode} {item?.mobileNumber}
                        </p>
                      </div>
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
                            position:
                              settingsIndex === index ? "relative" : "initial",
                            backgroundColor:
                              settingsIndex === index
                                ? "var(--btn-primary-hover)"
                                : null,
                            borderRadius:
                              settingsIndex === index
                                ? "var(--border-radius-primary)"
                                : null,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSettingsIndex(index);
                          }}
                        >
                          <SalonThreeDotsIcon />

                          {settingsIndex === index && (
                            <ClickAwayListener
                              onClickAway={() => setSettingsIndex(null)}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  zIndex: settingsIndex === index ? 9999 : -100,
                                }}
                                className={`${style.settings_container}`}
                              >
                                <button
                                  onClick={() =>
                                    customerappointmenthistoryhandler(item)
                                  }
                                >
                                  Appointment History
                                </button>
                                <button
                                  onClick={() => customerhistoryhandler(item)}
                                >
                                  Queue History
                                </button>
                              </div>
                            </ClickAwayListener>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`${style.list_body_container_error}`}>
                <p>No customer available</p>
              </div>
            )}

            <div className={`${style.pagination_container}`}>
              <div></div>
              <div>
                <Pagination
                  count={PaginationObject?.totalPages}
                  page={page}
                  onChange={handleChange}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "var(--text-primary)",
                      fontSize: "1.4rem",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "var(--bg-secondary) !important",
                      color: "var(--btn-text-color)",
                    },
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
                        <div>
                          <DropdownIcon />
                        </div>
                      </div>

                      {selectOpen ? (
                        <ul>
                          {[10, 20, 30, 50].map((item, index) => {
                            return (
                              <li
                                key={item}
                                onClick={() => {
                                  setPage(1);
                                  SetRowsPerPage(item);
                                  setSelectOpen(false);
                                }}
                                style={{
                                  background:
                                    item === rowsPerPage
                                      ? "var(--bg-secondary)"
                                      : null,
                                  color:
                                    item === rowsPerPage
                                      ? "var(--btn-text-color)"
                                      : null,
                                  borderBottom:
                                    index === [10, 20, 30, 50].length - 1
                                      ? "none"
                                      : "0.1rem solid var(--border-secondary)",
                                }}
                              >
                                {item}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  </ClickAwayListener>
                </div>
                <div>
                  <p>
                    {/* {startIndex} - {endIndex} of {totalPages} */}
                    {PaginationObject?.pageDataCount} of{" "}
                    {PaginationObject?.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Modal
        open={openBarberEmail}
        onClose={() => setOpenBarberEmail(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
          <div>
            <p>Send Email</p>
            <button onClick={() => setOpenBarberEmail(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className={style.modal_content_container}>
            <div>
              <p>From</p>
              <input type="text" value={"support@iqbook.io"} readOnly />
            </div>

            <div>
              <p>To</p>
              <input
                type="text"
                value={checkedEmails?.map((e) => " " + e)}
                onKeyDown={handleKeyPressMessage}
              />
            </div>

            <div>
              <p>Subject</p>
              <input
                type="text"
                placeholder="Enter Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <p>Message</p>
              <textarea
                type="text"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            {adminSendBarberEmailLoading ? (
              <button className={style.barber_send_btn}>
                <ButtonLoader />
              </button>
            ) : (
              <button
                onClick={sendMailHandler}
                disabled={adminSendBarberEmailLoading}
                className={style.barber_send_btn}
              >
                Send
              </button>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={openBarberMessage}
        onClose={() => setOpenBarberMessage(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={`${style.modal_container} ${darkmodeOn && style.dark}`}>
          <div>
            <p>Send Notification</p>
            <button onClick={() => setOpenBarberMessage(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className={style.modal_content_container}>
            <div>
              <p>From</p>
              <input type="text" value={"iqbook"} readOnly />
            </div>

            <div>
              <p>To</p>
              <input
                type="text"
                value={checkCustomerNames?.map((e) => " " + e)}
                readOnly
              />
            </div>

            <div>
              <p>Title</p>
              <input
                type="text"
                value={barbertitle}
                placeholder="Enter Title"
                onChange={(e) => setBarberTitle(e.target.value)}
                onKeyDown={handleKeyPressMessage}
              />
            </div>

            <div>
              <p>Body</p>
              <textarea
                type="text"
                placeholder="Enter Message"
                value={barberMessage}
                onChange={(e) => setBarberMessage(e.target.value)}
              ></textarea>
            </div>

            {adminSendCustomerNotificationLoading ? (
              <button className={style.barber_send_btn}>
                <ButtonLoader />
              </button>
            ) : (
              <button
                onClick={sendMessageHandler}
                disabled={adminSendCustomerNotificationLoading}
                className={style.barber_send_btn}
              >
                Send
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CustomerList;

const cardStyle = {
  padding: "20px",
  margin: "10px 0",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

// import React, { useState, useEffect, useRef, useCallback } from "react";

// const CustomerList = () => {

// const [items, setItems] = useState([]);
// const [page, setPage] = useState(1);
// const [loading, setLoading] = useState(false);
// const [hasMore, setHasMore] = useState(true);

// // Create a ref for the observer
// const observer = useRef();

// // The "Last Element" ref: attaches to the last item in the list
// const lastItemElementRef = useCallback(
//   (node) => {
//     if (loading) return;
//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasMore) {
//         setPage((prevPage) => prevPage + 1);
//       }
//     });

//     if (node) observer.current.observe(node);
//   },
//   [loading, hasMore],
// );

// // Fetch data function
// const fetchData = async () => {
//   setLoading(true);
//   try {
//     // Fetching dummy posts as "customers"
//     const response = await fetch(
//       `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
//     );
//     const data = await response.json();

//     setItems((prev) => [...prev, ...data]);
//     setHasMore(data.length > 0);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   fetchData();
// }, [page]);

//   return (
// <div
//   style={{ maxWidth: "400px", margin: "0 auto", fontFamily: "sans-serif" }}
// >
//   <h2
//     style={{
//       textAlign: "center",
//       position: "sticky",
//       top: 0,
//       background: "#fff",
//       padding: "10px",
//     }}
//   >
//     Customer Directory
//   </h2>

//   <div style={{ padding: "10px" }}>
//     {items.map((item, index) => {
//       // If it's the last item, attach the special ref
//       if (items.length === index + 1) {
//         return (
//           <div ref={lastItemElementRef} key={item.id} style={cardStyle}>
//             <strong>#{item.id}</strong> {item.title.substring(0, 20)}...
//           </div>
//         );
//       } else {
//         return (
//           <div key={item.id} style={cardStyle}>
//             <strong>#{item.id}</strong> {item.title.substring(0, 20)}...
//           </div>
//         );
//       }
//     })}
//   </div>

//   {loading && (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <div className="spinner">Loading more customers...</div>
//     </div>
//   )}

//   {!hasMore && (
//     <p style={{ textAlign: "center" }}>No more customers to show.</p>
//   )}
// </div>
//   );
// };

// // Simple mobile-friendly card styling
// const cardStyle = {
//   padding: "20px",
//   margin: "10px 0",
//   border: "1px solid #ddd",
//   borderRadius: "8px",
//   backgroundColor: "#f9f9f9",
//   boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
// };

// export default CustomerList;
