import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./AppointmentHistory.module.css";
import {
  AppointmentIcon,
  CheckIcon,
  CloseIcon,
  DropdownIcon,
  ResetIcon,
} from "../../newicons";
import { ClickAwayListener, Pagination } from "@mui/material";
import { Calendar } from "react-multi-date-picker";
import { SearchIcon } from "../../icons";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { getBarberAppointmentHistoryAction } from "../../Redux/Barber/Actions/AppointmentAction";
import toast from "react-hot-toast";
import { ddmmformatDate } from "../../../utils/ddmmformatDate";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import ClipLoader from "react-spinners/ClipLoader";
import api from "../../Redux/api/Api";

const AppointmentHistory = () => {
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
    (state) => state.BarberLoggedInMiddleware?.barberSalonId,
  );
  const barberId = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberId,
  );

  const [query, setQuery] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const [selectedDates, setSelectedDates] = useState([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);

  const handleDateChange = (dates) => {
    const formatedDates = dates.map((date) => date.format("YYYY-MM-DD"));
    setSelectedDates(formatedDates);
  };

  const adminGetDefaultSalon = useSelector(
    (state) => state.adminGetDefaultSalon,
  );

  const { response: adminGetDefaultSalonResponse } = adminGetDefaultSalon;

  const barberProfile = useSelector(
    (state) => state.BarberLoggedInMiddleware?.entiredata?.user?.[0],
  );

  const headRows = [
    { id: 1, heading: "Name", key: "customerName" },
    {
      id: 2,
      heading: `${barberProfile?.salonType === "Barber Shop" ? "Barber Name" : "Stylist Name"}`,
      key: "barberName",
    },
    { id: 3, heading: "Start Time", key: "startTime" },
    { id: 4, heading: "End Time", key: "endTime" },
    { id: 5, heading: "Price", key: "price" },
    { id: 6, heading: "Date", key: "date" },
    { id: 7, heading: "Status", key: "status" },
  ];

  const [rowsPerPage, SetRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const queuelistcontrollerRef = useRef(new AbortController());

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
          getBarberAppointmentHistoryAction(
            salonId,
            startDate,
            endDate,
            barberId,
            page,
            rowsPerPage,
            query,
            controller.signal,
          ),
        );
      }
    } else if (selectedDates.length === 0) {
      dispatch(
        getBarberAppointmentHistoryAction(
          salonId,
          "",
          "",
          barberId,
          page,
          rowsPerPage,
          query,
          controller.signal,
        ),
      );
    }

    return abortIfPending;
  }, [dispatch, selectedDates, salonId, page, rowsPerPage, query, mobileWidth]);

  const getBarberAppointmentHistory = useSelector(
    (state) => state.getBarberAppointmentHistory,
  );

  const {
    loading: getBarberAppointmentHistoryLoading,
    resolve: getBarberAppointmentHistoryResolve,
    response: BarberAppointmentHistory,
    pagination: PaginationObject,
  } = getBarberAppointmentHistory;

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");

  const handleChange = (event, value) => {
    setPage(value);
  };

  const resetHandler = () => {
    setSelectedDates([]);
    SetRowsPerPage(10);
    setQuery("");
    setPage(1);

    // dispatch(getBarberAppointmentHistoryAction(salonId, "", "", barberId));
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
        `/api/appointmentHistory/getAppointmentHistoryByBarberIdSalonId`,
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
  }, [page, query, selectedDates, rowsPerPage, salonId, mobileWidth]);

  return mobileWidth ? (
    <>
      <div className={`${style.mobile_header}`}>
        <h2>Apointment History</h2>
        <div>
          {mobileSearchOpen ? (
            <ClickAwayListener onClickAway={() => setMobileSearchOpen(false)}>
              <div className={`${style.input_type_2}`}>
                <input
                  type="text"
                  placeholder="Search Customer"
                  value={query}
                  onChange={(e) => {
                    setPage(1);
                    setQuery(e.target.value);
                  }}
                />

                <button onClick={() => setMobileSearchOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
            </ClickAwayListener>
          ) : (
            <div style={{ position: "relative" }}>
              <button onClick={resetHandler}>
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
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
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
                        <p>{item?.appointmentDate?.split(["T"])[0]}</p>
                      </div>
                    </div>
                    <div>
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
              <p>No payments history available</p>
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
    </>
  ) : (
    <section className={`${style.section}`}>
      <div>
        <h2>Appointment History </h2>
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
            placeholder="Search Customer"
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
          />
        </div>
      </div>

      <div className={`${style.list_container}`}>
        {getBarberAppointmentHistoryLoading ? (
          <div className={`${style.list_body_container_loader}`}>
            <Skeleton
              count={6}
              height={"6.5rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }}
            />
          </div>
        ) : getBarberAppointmentHistoryResolve &&
          BarberAppointmentHistory.length > 0 ? (
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

                      {/* <span>{item.key && (sortColumn === item.key ? (sortOrder === 'asc' ? <SortUpIcon /> : <SortDownIcon />) : <SortUpDownArrowIcon />)}</span> */}
                    </button>
                  </div>
                );
              })}
            </div>

            {BarberAppointmentHistory.map((item, index) => {
              return (
                <div
                  key={item._id}
                  style={{
                    borderBottom:
                      //   index === endIndex - 1 ||
                      index === BarberAppointmentHistory.length - 1
                        ? null
                        : "0.1rem solid var(--border-secondary)",
                  }}
                >
                  {/* <div><p>{item.barberId}</p></div> */}
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
                    <p>{item.startTime}</p>
                  </div>
                  <div>
                    <p>{item.endTime}</p>
                  </div>

                  <div>
                    <p>
                      {barberProfile?.currency}{" "}
                      {Array.isArray(item?.services)
                        ? item.services.reduce(
                            (sum, service) => sum + (service.servicePrice || 0),
                            0,
                          )
                        : 0}
                    </p>
                  </div>

                  <div>
                    <p>{ddmmformatDate(item.appointmentDate?.split("T")[0])}</p>
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
            <p>No appointment history available</p>
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
                {PaginationObject?.pageDataCount} of {PaginationObject?.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* {getBarberAppointmentHistoryLoading ? (
        <div className={style.list_container_mobile_loader}>
          <Skeleton
            count={6}
            height={"19.5rem"}
            baseColor={"var(--loader-bg-color)"}
            highlightColor={"var(--loader-highlight-color)"}
            style={{ marginBottom: "1rem" }}
          />
        </div>
      ) : getBarberAppointmentHistoryResolve &&
        BarberAppointmentHistory.length > 0 ? (
        <div className={style.list_container_mobile}>
          {mobileQueueList?.map((item, index) => {
            return (
              <div className={style.list_mobile_item} key={item._id}>
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
                            (sum, service) => sum + (service.servicePrice || 0),
                            0,
                          )
                        : 0}
                    </p>
                    <p>{item?.appointmentDate?.split(["T"])[0]}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      {item.status === "served" ? (
                        <CheckIcon color={"#1ADB6A"} />
                      ) : (
                        <CloseIcon color={"#FC3232"} />
                      )}
                    </div>
                    <p> {item.status === "served" ? "Served" : "Cancelled"}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {page < PaginationObject?.totalPages && (
            <div
              ref={mobileLoaderRef}
              style={{
                marginTop: "12rem",
                display: "flex",
                justifyContent: "center",
                display: mobileWidth ? "block" : "none",
              }}
            >
              <ButtonLoader color={"var(--loader-bg-color)"} />
            </div>
          )}
        </div>
      ) : (
        <div className={style.list_container_mobile_error}>
          <p>No appointment history available</p>
        </div>
      )} */}
    </section>
  );
};

export default AppointmentHistory;
