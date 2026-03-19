import React, { useEffect, useState, useRef, useCallback } from "react";
import style from "./QueHistory.module.css";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { darkmodeSelector } from "../../Redux/Admin/Reducers/AdminHeaderReducer";
import { CrownIcon } from "../../icons";
import { getBarberQueueListHistoryAction } from "../../Redux/Barber/Actions/BarberQueueAction";

import {
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
import { ClickAwayListener, Pagination } from "@mui/material";
import { formatMinutesToHrMin } from "../../../utils/formatMinutesToHrMin";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import ClipLoader from "react-spinners/ClipLoader";
import api from "../../Redux/api/Api";

const QueHistory = () => {
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

  const darkMode = useSelector(darkmodeSelector);

  const darkmodeOn = darkMode === "On";
  const salonId = useSelector(
    (state) => state.BarberLoggedInMiddleware.barberSalonId,
  );
  const barberId = useSelector(
    (state) => state.BarberLoggedInMiddleware.barberId,
  );

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [rowsPerPage, SetRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const queuelistcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    if (mobileWidth) return;

    const controller = new AbortController();
    queuelistcontrollerRef.current = controller;

    dispatch(
      getBarberQueueListHistoryAction(
        salonId,
        barberId,
        rowsPerPage,
        page,
        query,
        controller.signal,
      ),
    );

    return () => {
      if (queuelistcontrollerRef.current) {
        queuelistcontrollerRef.current.abort();
      }
    };
  }, [salonId, barberId, dispatch, rowsPerPage, page, query, mobileWidth]);

  const getBarberQueueListHistory = useSelector(
    (state) => state.getBarberQueueListHistory,
  );

  const {
    loading: getBarberQueueListHistoryLoading,
    resolve: getBarberQueueListHistoryResolve,
    response: BarberQueueListHistory,
    pagination: PaginationObject,
  } = getBarberQueueListHistory;

  const barberProfile = useSelector(
    (state) => state.BarberLoggedInMiddleware?.entiredata?.user?.[0],
  );

  // ================================

  const headRows = [
    { id: 1, heading: "Barber ID", key: "qpos" },
    { id: 2, heading: "Name", key: "customerName" },
    {
      id: 3,
      heading: `${barberProfile?.salonType === "Barber Shop" ? "Barber Name" : "Stylis tName"}`,
      key: "barberName",
    },
    { id: 4, heading: "Time Joined", key: "timejoined" },
    { id: 5, heading: "Qg Code", key: "qgcode" },
    { id: 6, heading: "Price", key: "price" },
    { id: 7, heading: "Type", key: "type" },
    { id: 8, heading: "Est. Time", key: "estimatedtime" },
    { id: 9, heading: "Status", key: "status" },
  ];

  const handleChange = (event, value) => {
    setPage(value);
  };

  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");

  const [selectOpen, setSelectOpen] = useState(false);

  const resetHandler = () => {
    if (page !== 1) {
      setMobileQueueList([]);
      SetRowsPerPage(10);
      setQuery("");
      setPage(1);
    }
  };

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Mobile View

  const [mobileListItems, setMobileListItems] = useState([]);
  const [mobilePaginationObject, setMobilePaginationObject] = useState({});
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
      const { data } = await api.post(
        "/api/queueHistory/getQueueHistoryBySalonIdBarberId",
        {
          salonId,
          barberId,
          page,
          limit: rowsPerPage,
          search: query,
        },
        { signal },
      );

      setMobileListItems((prev) => [...prev, ...data?.response]);
      setMobilePaginationObject(data?.pagination);
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
                  if (page !== 1) {
                    setMobileListItems([]);
                    setPage(1);
                  }
                }}
              >
                <ResetIcon />
              </button>

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
                        {barberProfile?.currency}{" "}
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
        <h2>Queue History</h2>
        <div>
          <button onClick={resetHandler}>
            <ResetIcon />
          </button>
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
        {getBarberQueueListHistoryLoading ? (
          <div className={`${style.list_body_container_loader}`}>
            <Skeleton
              count={6}
              height={"6.5rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }}
            />
          </div>
        ) : getBarberQueueListHistoryResolve &&
          BarberQueueListHistory?.length > 0 ? (
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

            {BarberQueueListHistory?.map((item, index) => {
              return (
                <div
                  key={item._id}
                  style={{
                    borderBottom:
                      index === endIndex - 1 ||
                      index === BarberQueueListHistory.length - 1
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
                        <img src={item.customerProfile?.[0]?.url} alt="" />
                      </div>
                      <p>{item.customerName}</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <img src={item.barberProfile?.[0]?.url} alt="" />
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
                  <div>
                    <p>
                      {barberProfile?.currency}{" "}
                      {item?.services.reduce(
                        (sum, service) => sum + service.servicePrice,
                        0,
                      )}
                    </p>
                  </div>
                  <div>
                    <p>{item.serviceType}</p>
                  </div>
                  <div>
                    <p>{formatMinutesToHrMin(item.serviceEWT)}</p>
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
