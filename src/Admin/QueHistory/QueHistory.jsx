import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./QueHistory.module.css";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { darkmodeSelector } from "../../Redux/Admin/Reducers/AdminHeaderReducer";
import {
  AppointmentIcon,
  CheckIcon,
  CloseIcon,
  CustomerIcon,
  DropdownIcon,
  GroupJoinIcon,
  KioskIcon,
  MobileIcon,
  ResetIcon,
  SearchIcon,
} from "../../newicons";
import { getAdminQueueListHistoryAction } from "../../Redux/Admin/Actions/QueueAction";
import { ClickAwayListener, Pagination } from "@mui/material";
import { Calendar } from "react-multi-date-picker";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { formatMinutesToHrMin } from "../../../utils/formatMinutesToHrMin";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import api from "../../Redux/api/Api";
import ClipLoader from "react-spinners/ClipLoader";

const QueHistory = () => {
  const location = useLocation();
  const barberId = location.state?.barberId;

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

  const [barberData, setBarberData] = useState({
    barberName: "",
    barberEmail: "",
    barberId: "",
    barber: false,
  });

  const [customerData, setCustomerData] = useState({
    customerName: "",
    customerEmail: "",
    customer: false,
  });

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
        barber: QueueHistoryBarber?.barber,
      });
    }

    if (QueueHistoryCustomer) {
      setCustomerData({
        customerName: QueueHistoryCustomer?.name,
        customerEmail: QueueHistoryCustomer?.email,
        customer: QueueHistoryCustomer?.customer,
      });
    }

    return () => {
      localStorage.removeItem("QueueHistoryBarber");
      localStorage.removeItem("QueueHistoryCustomer");
    };
  }, []);

  const darkMode = useSelector(darkmodeSelector);

  const darkmodeOn = darkMode === "On";

  const salonId = useSelector(
    (state) => state.AdminLoggedInMiddleware.adminSalonId,
  );

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [rowsPerPage, SetRowsPerPage] = useState(10);

  const dispatch = useDispatch();

  const queuelistcontrollerRef = useRef(new AbortController());

  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    if (mobileWidth) return;

    const controller = new AbortController();
    queuelistcontrollerRef.current = controller;

    const abortIfPending = () => {
      if (queuelistcontrollerRef.current) {
        queuelistcontrollerRef.current.abort();
      }
    };

    const getTotalDays = (start, end) => {
      const utcStart = Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
      );
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
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        dispatch(
          getAdminQueueListHistoryAction(
            salonId,
            startDate,
            endDate,
            rowsPerPage,
            page,
            query,
            controller.signal,
          ),
        );
      }
    } else if (selectedDates.length === 0) {
      dispatch(
        getAdminQueueListHistoryAction(
          salonId,
          "",
          "",
          rowsPerPage,
          page,
          query,
          controller.signal,
        ),
      );
    }

    return abortIfPending;
  }, [salonId, dispatch, selectedDates, rowsPerPage, page, query, mobileWidth]);

  const getAdminQueueListHistory = useSelector(
    (state) => state.getAdminQueueListHistory,
  );

  const {
    loading: getAdminQueueListHistoryLoading,
    resolve: getAdminQueueListHistoryResolve,
    response: AdminQueueListHistory,
    pagination: PaginationObject,
  } = getAdminQueueListHistory;

  const adminGetDefaultSalon = useSelector(
    (state) => state.adminGetDefaultSalon,
  );

  const { response: adminGetDefaultSalonResponse } = adminGetDefaultSalon;

  const currentSalonType = localStorage.getItem("CurrentSalonType");

  // ==========================================================

  const headRows = [
    { id: 1, heading: "QPos", key: "qpos" },
    { id: 2, heading: "Name", key: "customerName" },
    {
      id: 3,
      heading: `${currentSalonType === "Barber Shop" ? "Barber Name" : currentSalonType === "Hair Dresser" ? "Stylist Name" : "BarberName"}`,
      key: "barberName",
    },
    { id: 4, heading: "Time Joined", key: "timejoined" },
    { id: 5, heading: "Qg Code", key: "qgcode" },
    { id: 6, heading: "Price", key: "price" },
    { id: 7, heading: "Type", key: "type" },
    { id: 8, heading: "Est. Time", key: "estimatedtime" },
    { id: 9, heading: "isAdmin", key: "isAdmin" },
    { id: 10, heading: "Status", key: "status" },
  ];

  const handleChange = (event, value) => {
    setPage(value);
  };

  const [selectOpen, setSelectOpen] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const handleDateChange = (dates) => {
    setPage(1);
    const formatedDates = dates.map((date) => date.format("YYYY-MM-DD"));
    setSelectedDates(formatedDates);
  };

  const resetHandler = () => {
    setSelectedDates([]);
    SetRowsPerPage(10);
    setQuery("");
    setPage(1);

    localStorage.removeItem("QueueHistoryBarber");
    localStorage.removeItem("QueueHistoryCustomer");

    setBarberData({
      barberName: "",
      barberEmail: "",
      barberId: "",
      barber: false,
    });

    setCustomerData({
      customerName: "",
      customerEmail: "",
      customer: false,
    });
  };

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
      let startDate = "";
      let endDate = "";

      // ❌ STOP if only one date selected
      if (selectedDates.length === 1) {
        setLoading(false);
        return;
      }

      // ✅ If 2 dates → validate like desktop
      if (selectedDates.length === 2) {
        const start = new Date(selectedDates[0]);
        const end = new Date(selectedDates[1]);

        const totalDays =
          (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
            Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
            (1000 * 60 * 60 * 24) +
          1;

        if (totalDays > 30) {
          setSelectedDates([]);
          toast.error("Date range cannot exceed 30 days");
          setLoading(false);
          return;
        }

        startDate = selectedDates[0];
        endDate = selectedDates[1];
      }

      // ✅ API CALL only for 0 or 2 dates
      const { data } = await api.post(
        `/api/queueHistory/getQueueHistoryBySalonId`,
        {
          salonId,
          barberId,
          from: startDate,
          to: endDate,
          page,
          limit: rowsPerPage,
          search: query,
        },
        { signal },
      );

      setMobileListItems((prev) =>
        page === 1 ? data?.response : [...prev, ...data?.response],
      );

      setHasMore(data?.response?.length > 0);
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") return;

      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mobileWidth) return;

    // ❌ stop if only 1 date selected
    if (selectedDates.length === 1) return;

    if (mobileControllerRef.current) {
      mobileControllerRef.current.abort();
    }

    const controller = new AbortController();
    mobileControllerRef.current = controller;

    fetchData(controller.signal);

    return () => controller.abort();
  }, [page, query, selectedDates, rowsPerPage, salonId, mobileWidth, barberId]);

  return mobileWidth ? (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <div className={`${style.mobile_header}`}>
        <h2>Queue History</h2>
        <div>
          {mobileSearchOpen ? (
            <ClickAwayListener onClickAway={() => setMobileSearchOpen(false)}>
              <div className={`${style.input_type_2}`}>
                <input
                  type="text"
                  placeholder="Search"
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
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setMobileListItems([]);
                  setSelectedDates([]);
                  SetRowsPerPage(10);
                  setQuery("");
                  setPage(1);
                }}
              >
                <ResetIcon />
              </button>

              <button
                title="Calender"
                onClick={() => setMobileCalendarOpen(!mobileCalendarOpen)}
              >
                <AppointmentIcon />
              </button>

              {mobileCalendarOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "4.5rem",
                    right: "0rem",
                    zIndex: 10,
                  }}
                >
                  <ClickAwayListener
                    onClickAway={() => setMobileCalendarOpen(false)}
                  >
                    <Calendar
                      numberOfMonths={1}
                      value={selectedDates}
                      onChange={handleDateChange}
                      range
                      placeholder="yyyy-mm-dd - yyyy-mm-dd"
                      // onChange={handleDateChange}
                      maxDate={new Date()}
                      dateSeparator={" - "}
                      calendarPosition={"bottom-right"}
                      className={true ? "dark-theme" : "light-theme"}
                      style={
                        {
                          // background: true ? "#222" : "#fff"
                        }
                      }
                    />
                  </ClickAwayListener>
                </div>
              )}

              <button onClick={() => setMobileSearchOpen(true)}>
                <SearchIcon />
              </button>
            </div>
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
                <div
                  ref={isLast ? lastItemElementRef : null}
                  className={style.list_mobile_item}
                  key={item._id}
                >
                  <div>
                    <div>
                      <img
                        src={item?.customerProfile?.[0]?.url}
                        alt=""
                        width={50}
                        height={50}
                      />
                      <div>
                        <p>{item.customerName}</p>
                        <p>{item.barberName}</p>
                        <p>
                          {item?.services
                            ?.map((item) => item.serviceName)
                            .join(", ")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p>
                        {adminGetDefaultSalon?.response?.currency}{" "}
                        {Array.isArray(item?.services)
                          ? item.services.reduce(
                              (sum, service) =>
                                sum + (service.servicePrice || 0),
                              0,
                            )
                          : 0}
                      </p>
                      <p>{item.timeJoinedQ}</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        {item.methodUsed === "App" ? (
                          <MobileIcon color={"#1ADB6A"} />
                        ) : (
                          <KioskIcon color={"#1ADB6A"} />
                        )}
                      </div>
                      <p>Mode</p>
                    </div>

                    <div>
                      <div>
                        {item.joinedQType === "Single-Join" ? (
                          <CustomerIcon color={"#1ADB6A"} />
                        ) : (
                          <GroupJoinIcon color={"#1ADB6A"} />
                        )}
                      </div>
                      <p>Type</p>
                    </div>

                    <div>
                      <div>
                        {item.status === "served" ? (
                          <CheckIcon color={"#1ADB6A"} />
                        ) : (
                          <CloseIcon color={"#FC3232"} />
                        )}
                      </div>
                      <p>
                        {" "}
                        {item.status === "served" ? "Served" : "Cancelled"}
                      </p>
                    </div>
                  </div>
                </div>
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
            <p>No queue history available</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <section className={`${style.section}`}>
      <div>
        <h2>Queue History </h2>
        <div>
          <button onClick={resetHandler}>
            <ResetIcon />
          </button>

          <div>
            <button
              title="Calender"
              onClick={() => setCalendarOpen(!calendarOpen)}
            >
              <AppointmentIcon />
            </button>

            {calendarOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "4rem",
                  right: "0rem",
                  zIndex: 200,
                }}
              >
                <ClickAwayListener onClickAway={() => setCalendarOpen(false)}>
                  <Calendar
                    numberOfMonths={2}
                    value={selectedDates}
                    onChange={handleDateChange}
                    range
                    placeholder="yyyy-mm-dd - yyyy-mm-dd"
                    dateSeparator={" - "}
                    calendarPosition={"bottom-right"}
                    className={true ? "dark-theme" : "light-theme"}
                    maxDate={new Date()}
                    style={
                      {
                        // background: true ? "#222" : "#fff"
                      }
                    }
                  />
                </ClickAwayListener>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
          />
        </div>
      </div>

      <div className={`${style.list_container}`}>
        {getAdminQueueListHistoryLoading ? (
          <div className={`${style.list_body_container_loader}`}>
            <Skeleton
              count={6}
              height={"6.5rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }}
            />
          </div>
        ) : getAdminQueueListHistoryResolve &&
          AdminQueueListHistory.length > 0 ? (
          <div className={`${style.list_body_container}`}>
            <div className={`${style.headRow}`}>
              {headRows.map((item, index) => {
                return (
                  <div key={item.id}>
                    <button
                      className={`${item.key === "customerName" || item.key === "barberName" ? style.name_head_btn : ""}`}
                      // onClick={() => sortFunction(item.key)}
                    >
                      {item.key === "customerName" ||
                      item.key === "barberName" ? (
                        <>
                          <span></span>
                          {item.heading}
                        </>
                      ) : (
                        item.heading
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {AdminQueueListHistory.map((item, index) => {
              return (
                <div
                  key={item._id}
                  style={{
                    borderBottom:
                      //   index === endIndex - 1 ||
                      index === AdminQueueListHistory.length - 1
                        ? null
                        : "0.1rem solid var(--border-secondary)",
                  }}
                >
                  <div>
                    <p>{item.qPosition}</p>
                  </div>
                  <div>
                    <div>
                      <div>
                        <img src={item?.customerProfile?.[0]?.url} alt="" />
                      </div>
                      <p>{item.customerName}</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <img src={item?.barberProfile?.[0]?.url} alt="" />
                      </div>
                      <p>{item.barberName}</p>
                    </div>
                  </div>
                  <div>
                    <p>{item.timeJoinedQ}</p>
                  </div>
                  <div>
                    <p>{item.qgCode}</p>
                  </div>
                  {/* <div><p>{adminGetDefaultSalon?.response?.currency}{" "}{item?.services.reduce((sum, service) => sum + service?.servicePrice, 0)}</p></div> */}
                  <div>
                    <p>
                      {adminGetDefaultSalon?.response?.currency}{" "}
                      {Array.isArray(item?.services)
                        ? item.services.reduce(
                            (sum, service) => sum + (service.servicePrice || 0),
                            0,
                          )
                        : 0}
                    </p>
                  </div>
                  <div>
                    <p>{item.serviceType}</p>
                  </div>
                  <div>
                    <p>{formatMinutesToHrMin(item.serviceEWT)}</p>
                  </div>
                  <div>
                    <span>
                      {item?.isAdmin ? (
                        <CheckIcon color={"green"} />
                      ) : (
                        <CloseIcon color={"var(--bg-secondary)"} />
                      )}
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        color: item.status === "served" ? "green" : "red",
                      }}
                    >
                      {item.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`${style.list_body_container_error}`}>
            <p>No queue history available</p>
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
                {PaginationObject?.pageDataCount} of {PaginationObject?.total}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueHistory;
