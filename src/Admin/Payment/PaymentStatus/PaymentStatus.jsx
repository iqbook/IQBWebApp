import React, { useEffect, useRef, useState } from "react";
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

const PaymentStatus = () => {
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
  const [rowsPerPage, SetRowsPerPage] = useState(4);

  const PaymentistControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (salonId !== 0) {
      try {
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
  }, [salonId, page, rowsPerPage]);

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

  const [mobileQueueList, setMobileQueueList] = useState([]);

  useEffect(() => {
    if (!mobileWidth) return;

    if (page === 1) {
      setMobileQueueList(paymentStatusdata);
    } else {
      setMobileQueueList((prev) => [...prev, ...paymentStatusdata]);
    }
  }, [paymentStatusdata, mobileWidth]);

  const mobileLoaderRef = useRef("");

  useEffect(() => {
    if (!mobileWidth || !mobileLoaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (
        target.isIntersecting &&
        !paymentStatusLoading &&
        page < PaginationObject?.totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    });

    const current = mobileLoaderRef.current;
    observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [
    mobileWidth,
    page,
    paymentStatusLoading,
    PaginationObject?.totalPages,
    mobileQueueList.length,
  ]);

  return (
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

      {paymentStatusLoading ? (
        <div className={style.list_container_mobile_loader}>
          <Skeleton
            count={6}
            height={"14rem"}
            baseColor={"var(--loader-bg-color)"}
            highlightColor={"var(--loader-highlight-color)"}
            style={{ marginBottom: "1rem" }}
          />
        </div>
      ) : mobileQueueList?.length > 0 ? (
        <div className={style.list_container_mobile}>
          {mobileQueueList?.map((item, index) => {
            return (
              <div className={style.list_mobile_item} key={item._id}>
                <div>
                  <p>{item.products?.[0]?.productName}</p>
                  <p>
                    <span>Transaction ID :</span>&nbsp;{item.paymentIntentId}
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
          <p>No payment history available</p>
        </div>
      )}
    </section>
  );
};

export default PaymentStatus;
