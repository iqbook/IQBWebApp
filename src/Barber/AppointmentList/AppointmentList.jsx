import React, { useEffect, useState } from "react";
import style from "./AppointmentList.module.css";
import { AppointmentIcon, LeftIcon, RightIcon } from "../../newicons";
import moment from "moment";
import { RightArrow, CloseIcon } from "../../icons";
import { Modal, Skeleton } from "@mui/material";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  AppointmentAction,
  AppointmentListBarberAction,
  CancelAppointmentAction,
  ServeAppointmentAction,
} from "../../Redux/Barber/Actions/AppointmentAction";
import { darkmodeSelector } from "../../Redux/Admin/Reducers/AdminHeaderReducer";
import { ddmmformatDate } from "../../../utils/ddmmformatDate";
import { formatMinutesToHrMin } from "../../../utils/formatMinutesToHrMin";
import toast from "react-hot-toast";
import { GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_CLEAR } from "../../Redux/Barber/Constants/constants";
import api from "../../Redux/api/Api";

const AppointmentList = () => {
  const salonId = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberSalonId
  );
  const barberId = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberId
  );
  const barberProfile = useSelector(
    (state) => state.BarberLoggedInMiddleware?.entiredata?.user?.[0]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      AppointmentAction({
        salonId,
        barberId,
      })
    );
  }, [dispatch]);

  const appointmentList = useSelector((state) => state.AppointmentBarber);

  const { loading: appointmentLoading, response: appointmentResponse } =
    appointmentList;

  const [maxAppointmentDays, setMaxAppointmentDays] = useState(0);

  // Fetch the max appointment days setting for the salon
  useEffect(() => {
    const fetchSalonMaxAppointmentDays = async () => {
      try {
        const { data } = await api.post(
          "/api/salonSettings/getSalonSettingsForBarber",
          { salonId }
        );

        setMaxAppointmentDays(
          Number(data?.response?.appointmentAdvanceDays || 0)
        );
      } catch (error) {
        console.error("Failed to fetch salon settings:", error);
      }
    };
    if (salonId) {
      fetchSalonMaxAppointmentDays();
    }
  }, [salonId]);

  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    moment(moment().format("YYYY-MM"), "YYYY-MM")
  ); // Current month start
  const [selectedDay, setSelectedDay] = useState("");

  // const generateDatesForMonth = (monthMoment, maxDays) => {
  //     const today = moment().startOf('day');
  //     const tomorrow = today.clone().add(1, 'day');
  //     const endOfCurrentMonth = monthMoment.clone().endOf('month');
  //     const maxAllowedDate = today.clone().add(maxDays, 'days').startOf('day');

  //     let tempDates = [];

  //     // The loop now starts from tomorrow if the current month is the same as today's month
  //     const loopStart = monthMoment.isSame(today, 'month') ? tomorrow : monthMoment.clone().startOf('month');

  //     // Cap the loop at the maximum allowed date or the end of the month
  //     const loopEnd = moment.min(endOfCurrentMonth, maxAllowedDate);

  //     // Loop from the start date to the end date
  //     for (let day = loopStart.clone(); day.isSameOrBefore(loopEnd); day.add(1, 'day')) {
  //         tempDates.push({
  //             dayName: day.format('ddd').slice(0, 1),
  //             dayFullName: day.format('dddd'),
  //             date: day.format('DD'),
  //             month: day.format('MMM'),
  //             year: day.format('YYYY'),
  //             fullDate: day.format('YYYY-MM-DD'),
  //         });
  //     }
  //     setDates(tempDates);

  //     // Set the initial selected day to tomorrow's date if it hasn't been set yet
  //     if (!selectedDay && tempDates.length > 0) {
  //         setSelectedDay(tempDates[0]);
  //     }
  // };

  const generateDatesForMonth = (monthMoment, maxDays) => {
    const today = moment().startOf("day");
    const tomorrow = today.clone().add("day");
    const maxAllowedDate = today.clone().add(maxDays, "days").startOf("day");

    let tempDates = [];

    // start from tomorrow if current month is same as today's
    const loopStart = monthMoment.isSame(today, "month")
      ? tomorrow
      : monthMoment.clone().startOf("month");

    // loop until maxAllowedDate (not end of month)
    for (
      let day = loopStart.clone();
      day.isSameOrBefore(maxAllowedDate);
      day.add(1, "day")
    ) {
      tempDates.push({
        dayName: day.format("ddd").slice(0, 1),
        dayFullName: day.format("dddd"),
        date: day.format("DD"),
        month: day.format("MMM"),
        year: day.format("YYYY"),
        fullDate: day.format("YYYY-MM-DD"),
      });
    }

    setDates(tempDates);

    if (!selectedDay && tempDates.length > 0) {
      setSelectedDay(tempDates[0]);
    }
  };

  useEffect(() => {
    generateDatesForMonth(currentMonth, maxAppointmentDays);
  }, [currentMonth, maxAppointmentDays]);

  // Go to next month
  const nextMonthFunc = () => {
    setCurrentMonth((prev) => prev.clone().add(1, "month"));
  };

  // Go to previous month
  const prevMonthFunc = () => {
    setCurrentMonth((prev) => prev.clone().subtract(1, "month"));
  };

  // Disable the "Previous" button if the current month is the same as the present month
  const isPrevDisabled = currentMonth.isSame(moment(), "month");
  // Disable the "Next" button if the next month is beyond the allowed appointment days
  const isNextDisabled = currentMonth
    .clone()
    .add(1, "month")
    .startOf("month")
    .isAfter(moment().add(maxAppointmentDays, "days"));

  const [openMobileModal, setOpenMobileModal] = useState({
    open: false,
    data: {},
  });

  useEffect(() => {
    if (selectedDay) {
      dispatch(
        AppointmentListBarberAction({
          salonId,
          barberId,
          appointmentDate: selectedDay?.fullDate,
        })
      );
    }

    return () => {
      dispatch({
        type: GET_APPOINTMENT_LIST_BARBERID_APPOINTMENT_CLEAR,
      });
    };
  }, [selectedDay]);

  const AppointmentListBarber = useSelector(
    (state) => state.AppointmentListBarber
  );

  const {
    loading: AppointmentListBarberLoading,
    response: AppointmentListBarberResponse,
  } = AppointmentListBarber;

  const darkMode = useSelector(darkmodeSelector);
  const darkmodeOn = darkMode === "On";

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const ServeHandler = async (s) => {
    const servebody = {
      salonId: salonId,
      barberId: s?.barberId,
      _id: s?._id,
      appointmentDate: s?.appointmentDate,
    };

    const confirm = window.confirm("Are you sure ?");

    if (confirm) {
      dispatch(
        ServeAppointmentAction(
          servebody,
          {
            salonId,
            barberId,
            appointmentDate: selectedDay?.fullDate,
          },
          setOpenMobileModal
        )
      );
    }
  };

  const CancelHandler = async () => {
    if (!subject) {
      return toast.error("Please enter subject", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    }

    if (!body) {
      return toast.error("Please enter body", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    }

    const cancelbody = {
      salonId,
      barberId,
      idsToCancel: [modalData._id],
      appointmentDate: modalData.appointmentDate,
      subject,
      body,
    };

    const confirm = window.confirm("Are you sure ?");

    if (confirm) {
      dispatch(
        CancelAppointmentAction(
          cancelbody,
          setCancelAllModalOpen,
          setOpenModal,
          {
            salonId,
            barberId,
            appointmentDate: selectedDay?.fullDate,
          },
          setOpenMobileModal
        )
      );
    }
  };

  const CancelAllHandler = () => {
    if (!subject) {
      return toast.error("Please enter subject", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    }

    if (!body) {
      return toast.error("Please enter body", {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    }

    const cancelbody = {
      salonId,
      barberId,
      idsToCancel: cancelAllAppoint.appointments.map((s) => s._id),
      appointmentDate: cancelAllAppoint.appointmentDate,
      subject,
      body,
    };

    // console.log(cancelbody)

    const confirm = window.confirm("Are you sure ?");

    if (confirm) {
      dispatch(
        CancelAppointmentAction(
          cancelbody,
          setCancelAllModalOpen,
          setOpenModal,
          setOpenMobileModal
        )
      );
    }
  };

  const [cancelAllModalOpen, setCancelAllModalOpen] = useState(false);
  const [cancelAllAppoint, setCancelAllAppoint] = useState({});
  const [selectedDayAllAppointments, setSelectedDayAllAppointments] = useState(
    []
  );

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Function to check mobile width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // ✅ Attach event listeners
    window.addEventListener("resize", handleResize);

    // ✅ Initial check
    handleResize();

    // ✅ Cleanup event listeners
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className={style.appointmentSection}>
      <div className={style.calenderDayCalender}>
        <div>
          <p>{currentMonth.format("MMMM YYYY")}</p>
          <div>
            <button onClick={prevMonthFunc} disabled={isPrevDisabled}>
              <LeftIcon size={"1rem"} />
            </button>
            <button onClick={nextMonthFunc} disabled={isNextDisabled}>
              <RightIcon size={"1rem"} />
            </button>
          </div>
        </div>

        <div>
          {dates.map((item) => {
            return (
              <div key={item.fullDate} className={style.dayItem}>
                <div>
                  <p>{item.dayName}</p>
                  <button
                    onClick={() => {
                      const selectedMonthYear = moment(
                        `${item.year}-${item.month}-${item.date}`,
                        "YYYY-MMM-DD"
                      );

                      if (!selectedMonthYear.isSame(currentMonth, "month")) {
                        console.log("Next");
                        setCurrentMonth((prev) => prev.clone().add(1, "month"));
                      }

                      setSelectedDay(item);
                    }}
                    style={{
                      position: "relative",
                      color: "var(--text-primary)",
                      backgroundColor:
                        selectedDay?.fullDate === item.fullDate
                          ? "var(--input-bg-color)"
                          : undefined,
                    }}
                  >
                    {item.date}
                    {appointmentResponse?.some(
                      (appointment) =>
                        appointment.appointmentDate === item.fullDate
                    ) ? (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-0.7rem",
                          left: "50%", // ✅ Use left instead of right
                          transform: "translateX(-50%)", // ✅ This perfectly centers horizontally
                          width: "0.4rem",
                          height: "0.4rem",
                          backgroundColor: "var(--text-primary)",
                          borderRadius: "50%",
                        }}
                      ></span>
                    ) : null}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className={style.selectedDay_Container}>
          <div>
            <div>
              <b>{selectedDay?.month}</b> <b>{selectedDay?.date} ,</b>
            </div>
            <p>{selectedDay?.dayFullName}</p>
          </div>

          {AppointmentListBarberResponse?.length > 0 && (
            <button
              onClick={() => {
                setCancelAllModalOpen(true);
                setSubject("");
                setBody("");
                setCancelAllAppoint(AppointmentListBarberResponse?.[0]);
              }}
            >
              {" "}
              Cancel All
            </button>
          )}
        </div>
      )}

      {AppointmentListBarberLoading ? (
        <div className={style.appointmentList_loading}>
          {[0, 1, 2, 3, 4, 5].map((item, index) => {
            return (
              <Skeleton
                key={index}
                count={1}
                style={{ width: "100%", height: "8rem" }}
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
              />
            );
          })}
        </div>
      ) : AppointmentListBarberResponse?.[0]?.appointments?.length > 0 ? (
        <div className={style.appointmentList}>
          {AppointmentListBarberResponse?.[0]?.appointments?.map((item) => {
            return (
              <div
                key={item._id}
                className={style.appointmentItem}
                onClick={() => {
                  if (isMobile) {
                    setOpenMobileModal({
                      open: true,
                      data: item,
                    });
                  }
                }}
              >
                <div>
                  <div>
                    <div className={style.bar}></div>

                    <div>
                      <div>
                        <img src={item?.customerProfile?.[0]?.url} alt="" />
                      </div>
                      <div>
                        <p>{item?.customerName}</p>
                        <p>{item?.timeSlots}</p>
                        <p>{item?.customerEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button onClick={() => ServeHandler(item)}>Serve</button>
                    <button
                      onClick={() => {
                        setModalData(item);
                        setOpenModal(true);
                        setSubject("");
                        setBody("");
                      }}
                    >
                      Cancel
                    </button>

                    <button>
                      <RightArrow />
                    </button>
                  </div>
                </div>

                <div>
                  {item?.services?.map((service, index) => (
                    <div key={index}>
                      <p>{service.serviceName}</p>
                      <p>{`${barberProfile?.currency} ${service.servicePrice}`}</p>
                    </div>
                  ))}

                  <div
                    style={{
                      borderTop: "1px solid var(--border-secondary)",
                      paddingTop: "1rem",
                    }}
                  >
                    <p>Total</p>
                    <p>
                      {`${barberProfile?.currency} ${item?.services?.reduce(
                        (total, service) =>
                          total + Number(service.servicePrice || 0),
                        0
                      )}`}
                    </p>
                  </div>

                  <p>
                    Contact the customer at +{item?.countryCode}
                    {item?.mobileNumber}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div div className={style.empty_appointment_list}>
          <div>
            <div>
              <AppointmentIcon color={"var(--text-primary)"} />
            </div>
            <h2>No appointments available</h2>
            <p>
              There are currently no appointments scheduled. When a new
              appointment is made, it will appear here.
            </p>
          </div>
        </div>
      )}

      <Modal
        open={openMobileModal.open}
        onClose={() => {
          setOpenMobileModal({
            open: false,
            data: {},
          });
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={style.modal_container}>
          <div>
            <p>{openMobileModal?.data?.customerName}</p>
            <p>{openMobileModal?.data?.timeSlots}</p>
          </div>
          <div>
            {false ? (
              <button
                style={{
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <ButtonLoader />
              </button>
            ) : (
              <button
                style={{
                  background: "#0285c7",
                  color: "#fff",
                }}
                onClick={() => ServeHandler(openMobileModal?.data)}
              >
                Serve
              </button>
            )}

            {false ? (
              <button
                style={{
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <ButtonLoader />
              </button>
            ) : (
              <button
                style={{
                  background: "#450a0a",
                  color: "#fff",
                }}
                onClick={() => {
                  setModalData(openMobileModal?.data);
                  setOpenModal(true);
                  setSubject("");
                  setBody("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setModalData({});
          setSubject("");
          setBody("");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className={`${style.modal_cancel_container} ${
            darkmodeOn && style.dark
          }`}
        >
          <div>
            <p>Cancel Appointment</p>
            <button
              onClick={() => {
                setOpenModal(false);
                setModalData({});
                setSubject("");
                setBody("");
              }}
            >
              <CloseIcon />
            </button>
          </div>

          <div
            className={`${style.modal_content_container} ${
              darkmodeOn && style.dark
            }`}
          >
            <p>Appointment Date: {ddmmformatDate(modalData.appointmentDate)}</p>
            <p>Customer Name: {modalData.customerName}</p>
            <p>Customer Email: {modalData.customerEmail}</p>
            <p>
              Time: {modalData.startTime} - {modalData.endTime}
            </p>

            <p>Reason for cancelling appointment</p>
            <div>
              <p>Subject</p>
              <input
                type="text"
                value={subject}
                placeholder="Enter your subject"
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <p>Body</p>
              <textarea
                name=""
                id=""
                value={body}
                placeholder="Reason for cancelling appointment"
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>
            <button className={style.cancel_btn} onClick={CancelHandler}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={cancelAllModalOpen}
        onClose={() => {
          setCancelAllModalOpen(false);
          setSubject("");
          setBody("");
          setCancelAllAppoint({});
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className={`${style.modal_cancel_container} ${
            darkmodeOn && style.dark
          }`}
        >
          <div>
            <p>Cancel Appointment</p>
            <button
              onClick={() => {
                setCancelAllModalOpen(false);
                setSubject("");
                setBody("");
                setCancelAllAppoint({});
              }}
            >
              <CloseIcon />
            </button>
          </div>

          <div
            className={`${style.modal_content_container} ${
              darkmodeOn && style.dark
            }`}
          >
            <p
              style={{
                fontWeight: 600,
                marginBottom: "2rem",
              }}
            >
              All appointments scheduled for{" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "var(--bg-secondary)",
                }}
              >
                {ddmmformatDate(cancelAllAppoint.appointmentDate)}
              </span>{" "}
              have been selected for cancellation.
            </p>

            <p>Reason for cancelling appointment</p>
            <div>
              <p>Subject</p>
              <input
                type="text"
                value={subject}
                placeholder="Enter your subject"
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <p>Body</p>
              <textarea
                name=""
                id=""
                value={body}
                placeholder="Reason for cancelling appointment"
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>
            <button className={style.cancel_btn} onClick={CancelAllHandler}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default AppointmentList;
