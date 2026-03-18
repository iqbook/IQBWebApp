import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./PaymentStatus.module.css";
import {
  DropdownIcon,
  SalonThreeDotsIcon,
  SortDownIcon,
  SortUpDownArrowIcon,
  SortUpIcon,
} from "../../../newicons";
import {
  ClickAwayListener,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../Redux/api/Api";
import { useSelector } from "react-redux";
import { darkmodeSelector } from "../../../Redux/Admin/Reducers/AdminHeaderReducer";
import Skeleton from "react-loading-skeleton";
import ButtonLoader from "../../../components/ButtonLoader/ButtonLoader";
import ClipLoader from "react-spinners/ClipLoader";

const PaymentStatus = () => {
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

  const [paymentStatusdata, setPaymentStatusdata] = useState([]);
  const [PaginationObject, setPaginationObject] = useState({});
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(false);

  const salonId = useSelector(
    (state) => state.AdminLoggedInMiddleware.adminSalonId,
  );

  const adminGetDefaultSalon = useSelector(
    (state) => state.adminGetDefaultSalon,
  );

  const {
    loading: adminGetDefaultSalonLoading,
    resolve: adminGetDefaultSalonResolve,
    response: adminGetDefaultSalonResponse,
  } = adminGetDefaultSalon;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, SetRowsPerPage] = useState(10);

  const PaymentistControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (salonId !== 0) {
      try {
        if (mobileWidth) return;

        const controller = new AbortController();
        PaymentistControllerRef.current = controller;

        const fetchpayments = async () => {
          setPaymentStatusLoading(true);
          const { data } = await api.post(
            "/api/salonPayments/getSalonPaymentHistoryBySalonId",
            {
              salonId,
              page,
              limit: rowsPerPage,
            },
            { signal: controller.signal },
          );

          setPaymentStatusdata(data.response);
          setPaginationObject(data?.pagination);
          setPage(data?.pagination?.page);
          setPaymentStatusLoading(false);
        };

        fetchpayments();
      } catch (error) {
        setPaymentStatusLoading(false);
      }
    }

    return () => {
      if (PaymentistControllerRef.current) {
        PaymentistControllerRef.current.abort();
      }
    };
  }, [salonId, page, rowsPerPage, mobileWidth]);

  // console.log(paymentStatusdata)

  const darkMode = useSelector(darkmodeSelector);

  const darkmodeOn = darkMode === "On";

  // =======================================

  const headRows = [
    { id: 1, heading: "Invoice No.", key: "" },
    { id: 2, heading: "Product", key: "product" },
    { id: 3, heading: "Purchased", key: "purchased" },
    { id: 4, heading: "Expired", key: "expired" },
    { id: 5, heading: "Price", key: "price" },
    { id: 6, heading: "Transaction ID", key: "transactionid" },
    { id: 7, heading: "Time Period", key: "timeperiod" },
  ];

  const handleChange = (event, value) => {
    setPage(value);
  };

  const [selectOpen, setSelectOpen] = useState(false);

  const navigate = useNavigate();

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
    if (salonId !== 0) {
      setLoading(true);
      try {
        const { data } = await api.post(
          "/api/salonPayments/getSalonPaymentHistoryBySalonId",
          {
            salonId,
            page,
            limit: rowsPerPage,
          },
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
  }, [page, mobileWidth]);

  return mobileWidth ? (
    <>
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
                      <p>{item.products?.[0]?.productName}</p>
                      <p>
                        <span>Transaction ID :</span>&nbsp;
                        {item.paymentIntentId}
                      </p>
                    </div>

                    <div>
                      <div>
                        <div>
                          <p>Invoice No.</p>
                          <p>{item.invoiceNumber}</p>
                        </div>

                        <div>
                          <p>Validity</p>
                          <p>
                            {item.purchaseDate} - {item.paymentExpiryDate}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div>
                          <p>Plan</p>
                          <p>{item?.timePeriod} Days</p>
                        </div>

                        <div>
                          <p>Price</p>
                          <p>
                            {adminGetDefaultSalon?.response?.currency}{" "}
                            {item.products?.[0]?.productPrice}
                          </p>
                        </div>
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
        <h2>Payment History</h2>
      </div>

      <div className={`${style.list_container}`}>
        {paymentStatusLoading ? (
          <div className={`${style.list_body_container_loader}`}>
            <Skeleton
              count={6}
              height={"6.5rem"}
              baseColor={"var(--loader-bg-color)"}
              highlightColor={"var(--loader-highlight-color)"}
              style={{ marginBottom: "1rem" }}
            />
          </div>
        ) : paymentStatusdata?.length > 0 ? (
          <div className={`${style.list_body_container}`}>
            <div className={`${style.headRow}`}>
              {headRows.map((item, index) => {
                return (
                  <div key={item.id}>
                    <button>{item.heading}</button>
                  </div>
                );
              })}
            </div>
            {paymentStatusdata?.map((item, index) => {
              return (
                <div
                  key={item._id}
                  style={{
                    borderBottom:
                      // index === endIndex - 1 ||
                      index === paymentStatusdata.length - 1
                        ? null
                        : "0.1rem solid var(--border-secondary)",
                  }}
                >
                  <div>
                    <p>{item.invoiceNumber}</p>
                  </div>
                  <div>
                    <p>{item.products?.[0]?.productName}</p>
                  </div>
                  <div>
                    <p>{item.purchaseDate}</p>
                  </div>
                  <div>
                    <p>{item.paymentExpiryDate}</p>
                  </div>
                  <div>
                    <p>
                      {adminGetDefaultSalon?.response?.currency}{" "}
                      {item.products?.[0]?.productPrice}
                    </p>
                  </div>
                  <div>
                    <p>{item.paymentIntentId}</p>
                  </div>
                  <div>
                    <p>{item?.timePeriod}days</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`${style.list_body_container_error}`}>
            <p>No payment history available</p>
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
    </section>
  );
};

export default PaymentStatus;
