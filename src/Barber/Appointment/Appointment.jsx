import React, { useEffect, useState } from "react";
import style from "./Appointment.module.css";
import { useSelector } from "react-redux";
import { darkmodeSelector } from "../../Redux/Admin/Reducers/AdminHeaderReducer";
import api from "../../Redux/api/Api";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import { AddIcon, LeftArrow, RightArrow } from "../../icons";
import moment from "moment";
import { DeleteIcon, DropdownIcon, LeftIcon, RightIcon } from "../../newicons";
import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import Skeleton from "react-loading-skeleton";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Appointment = () => {
  const barberProfile = useSelector(
    (state) => state.BarberLoggedInMiddleware?.entiredata?.user[0]
  );

  const salonId = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberSalonId
  );
  const barberId = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberId
  );

  const [getSalonoffDays, setGetSalonoffDays] = useState([]);

  const fetchSalonOffDaysHandler = async () => {
    try {
      const { data } = await api.post("/api/salonSettings/getSalonoffDays", {
        salonId,
      });
      setGetSalonoffDays(data?.response);
    } catch (error) {
      toast.error(error?.response?.data?.message, {
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

  useEffect(() => {
    if (salonId !== 0) {
      fetchSalonOffDaysHandler();
    }
  }, [salonId]);

  const darkMode = useSelector(darkmodeSelector);

  const darkmodeOn = darkMode === "On";

  const days = [
    {
      id: 1,
      day: "Sunday",
    },
    {
      id: 2,
      day: "Monday",
    },
    {
      id: 3,
      day: "Tuesday",
    },
    {
      id: 4,
      day: "Wednesday",
    },
    {
      id: 5,
      day: "Thursday",
    },
    {
      id: 6,
      day: "Friday",
    },
    {
      id: 7,
      day: "Saturday",
    },
  ];

  const [appointmentdates, setAppointmentDates] = useState(true);
  const [barberOffdates, setBarberOffdates] = useState(false);

  const [selectedDays, setSelectedDays] = useState([]);

  const checkdayHandler = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day.day)) {
        return prev.filter((d) => d !== day.day);
      } else {
        return [...prev, day.day];
      }
    });
  };

  const submitHandler = async () => {
    try {
      const appdata = {
        salonId,
        barberId,
        appointmentDays: selectedDays,
      };

      const { data } = await api.post(
        "/api/barberAppointmentDays/addBarberAppointmentDays",
        appdata
      );

      toast.success(data?.message, {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      getAppointdays();

      // const { data: appointmentDaysData } = await api.post(
      //   "/api/barberAppointmentDays/getBarberAppointmentDays",
      //   {
      //     salonId,
      //     barberId,
      //   }
      // );

      // setGetBarberApptdates(appointmentDaysData.response.appointmentDays);
      // setSelectedDays(appointmentDaysData.response.appointmentDays);
    } catch (error) {
      toast.error(error?.response?.data?.message, {
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

  const [getBarberApptdates, setGetBarberApptdates] = useState([]);
  const [getBarberAppointmentHours, setGetBarberAppointmentHours] = useState(
    []
  );
  const [
    getBarberAppointmentIntervalTime,
    setGetBarberAppointmentIntervalTime,
  ] = useState("");

  const getAppointdays = async () => {
    const { data } = await api.post(
      "/api/barberAppointmentDays/getBarberAppointmentDays",
      {
        salonId,
        barberId,
      }
    );

    setGetBarberApptdates(data.response.appointmentDays);
    setGetBarberAppointmentHours(data.appointmentHours);
    setGetBarberAppointmentIntervalTime(data.intervalTime);
    setSelectedDays(data.response.appointmentDays);
  };

  useEffect(() => {
    getAppointdays();
  }, []);

  //   console.log("Appointment Hours ", getBarberAppointmentHours);
  //   console.log("Appointment Interval ", getBarberAppointmentIntervalTime);

  const [selectedDates, setSelectedDates] = useState([]);

  const onClickDay = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA");

    setSelectedDates((prevDates) =>
      prevDates.includes(formattedDate)
        ? prevDates.filter((d) => d !== formattedDate)
        : [...prevDates, formattedDate]
    );
  };

  const isSelected = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    return selectedDates?.includes(formattedDate);
  };

  const getBarberLeaveDaysFunc = async () => {
    const { data } = await api.post("/api/barberDayOff/getBarberDayOffs", {
      salonId,
      barberId,
    });

    setBarberLeaveDaysdata(data.response);
  };

  const offDayHandler = async (selectedDates) => {
    const { data } = await api.post("/api/barberDayOff/addBarberDayOffs", {
      salonId,
      barberId,
      barberDayOffs: selectedDates,
    });

    toast.success(data?.message, {
      duration: 3000,
      style: {
        fontSize: "var(--font-size-2)",
        borderRadius: "0.3rem",
        background: "#333",
        color: "#fff",
      },
    });

    setSelectedDates([]);
    getBarberLeaveDaysFunc();
  };

  const [barberLeaveDaysdata, setBarberLeaveDaysdata] = useState([]);

  useEffect(() => {
    getBarberLeaveDaysFunc();
  }, []);

  const isDisabled = (date) => {
    const formattedDate = date.toLocaleDateString("en-CA").split("T")[0];
    return barberLeaveDaysdata?.includes(formattedDate);
  };

  // console.log("getBarberApptdates ", getBarberApptdates)
  // console.log("getSalonoffDays ", getSalonoffDays)

  // Barber Day off new calendar logic

  const [currentMonth, setCurrentMonth] = useState(moment());
  const [offDays, setOffDays] = useState([]); // add if not defined

  const today = moment().startOf("day");
  const tomorrow = today.clone().add("day");

  const startOfMonth = currentMonth.clone().startOf("month");
  const endOfMonth = currentMonth.clone().endOf("month");
  const daysInMonth = currentMonth.daysInMonth();

  // Generate all days for the current month
  const allDays = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.clone().add(i, "days")
  );

  // 2. Filter only future dates (tomorrow onward)
  const futureDays = allDays.filter((day) =>
    day.isSameOrAfter(tomorrow, "day")
  );
  const firstDayWeekday = startOfMonth.weekday();
  const leadingBlanks = Array.from({ length: firstDayWeekday }, (_, i) => ({
    type: "blank",
    key: `blank-${i}`,
  }));

  // Generate the days for the calendar grid
  const calendarDays = allDays.map((day) => ({
    type: "date",
    day: day,
    isFuture: day.isSameOrAfter(tomorrow, "day"),
  }));

  // Combine blanks and day objects
  const daysForDisplay = [...leadingBlanks, ...calendarDays];

  // Filter only future dates (tomorrow onward)
  const visibleDays = allDays.filter((day) =>
    day.isSameOrAfter(tomorrow, "day")
  );

  // Prevent navigating to past months
  const handlePrevMonth = () => {
    const prevMonth = currentMonth.clone().subtract(1, "month");
    if (prevMonth.isBefore(today, "month")) return;
    setCurrentMonth(prevMonth);
  };

  // Navigate forward
  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };

  const isPrevDisabled = currentMonth.isSameOrBefore(moment(), "month");
  const isNextDisabled = false;

  const onMobileClickDay = (day) => {
    const formattedDate = day.format("YYYY-MM-DD");

    setSelectedDates((prevDates) =>
      prevDates.includes(formattedDate)
        ? prevDates.filter((d) => d !== formattedDate)
        : [...prevDates, formattedDate]
    );
  };

  const handle_delete_barber_offdays = async (day) => {
    try {
      const formattedDate = day.format("YYYY-MM-DD");
      const confirm = window.confirm(
        `Are you sure you want to delete ${formattedDate}`
      );

      if (confirm) {
        const delete_offday_data = {
          salonId,
          barberId,
          dates: [formattedDate],
        };

        const { data } = await api.post(
          `/api/barberDayOff/deleteBarberDayOffs`,
          delete_offday_data
        );

        fetchSalonOffDaysHandler();
        getBarberLeaveDaysFunc();
      }
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error("Something went wrong !", {
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

      toast.error(error?.response?.data?.message, {
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

  // console.log("getBarberApptdates ", getBarberApptdates)

  const isMobileSelected = (day) => {
    const formattedDate = day.format("YYYY-MM-DD");
    return selectedDates?.includes(formattedDate);
  };

  const isMobileDisabled = (day) => {
    const formattedDate = day.format("YYYY-MM-DD");
    return barberLeaveDaysdata?.includes(formattedDate);
  };

  // const isDayMobileDisabled = (day) => {
  //     const weekday = day.format("dddd"); // Gives full name e.g. "Monday"
  //     return (
  //         getSalonoffDays.includes(weekday) ||
  //         getBarberApptdates.includes(weekday)
  //     );
  // };

  const isDayMobileDisabled = (day) => {
    const weekday = day.format("dddd");
    // Day should be unavailable if it's not in getBarberApptdates,
    // OR if it's in salon off days
    return (
      !getBarberApptdates.includes(weekday) || getSalonoffDays.includes(weekday)
    );
  };

  const isBarberApptDayDisabled = (day) => {
    const weekday = day.format("dddd"); // Gives full name e.g. "Monday"
    return getBarberApptdates.includes(weekday);
  };

  const [selected_drop_day, set_selected_drop_day] = useState({
    open: false,
    item: null,
  });

  const [generatedTimeslots, setGeneratedTimeslots] = useState([]);

  const time_slot_calculation = (intervalTime, setTimeSlot) => {
    let hour = 24;
    let mins = 60;

    const generated_timeslot = [];

    for (let i = 0; i < hour; i++) {
      for (let j = 0; j < mins; j = j + intervalTime) {
        let time_slot;
        time_slot = `${i < 10 ? `0${i}` : i}:${j < 10 ? `0${j}` : j}`;
        generated_timeslot.push(time_slot);
      }
    }

    setTimeSlot(generated_timeslot);
  };

  useEffect(() => {
    if (getBarberAppointmentIntervalTime) {
      time_slot_calculation(
        getBarberAppointmentIntervalTime,
        setGeneratedTimeslots
      );
    }
  }, [getBarberAppointmentIntervalTime]);

  const [appointmentStartTimeDrop, setAppointmentStartTimeDrop] = useState({
    open: false,
    value: null,
  });
  const [appointmentEndTimeDrop, setAppointmentEndTimeDrop] = useState({
    open: false,
    value: null,
  });

  const [appointmentBreakStartTimeDrop, setAppointmentBreakStartTimeDrop] =
    useState({
      open: false,
      value: null,
    });

  const [appointmentBreakEndTimeDrop, setAppointmentBreakEndTimeDrop] =
    useState({
      open: false,
      value: null,
    });

  const [appointmentStartTimeSelected, setAppointmentStartTimeSelected] =
    useState("");
  const [appointmentEndTimeSelected, setAppointmentEndTimeSelected] =
    useState("");

  const [
    appointmentBreakStartTimeSelected,
    setAppointmentBreakStartTimeSelected,
  ] = useState("");
  const [appointmentBreakEndTimeSelected, setAppointmentBreakEndTimeSelected] =
    useState("");

  const [barberIntervalTime, setBarberIntervalTime] = useState({
    open: true,
    value: null,
  });

  useEffect(() => {
    // console.log(getBarberAppointmentHours)
    const appointment_time = getBarberAppointmentHours?.find(
      (item) => item.day === selected_drop_day?.item?.day
    );

    setBarberIntervalTime({
      open: false,
      value: appointment_time?.barberIntervalTime,
    });

    setAppointmentEndTimeSelected(appointment_time?.endTime);
    setAppointmentStartTimeSelected(appointment_time?.startTime);
  }, [selected_drop_day?.item?.day]);

  const [barberIntervalTimeGap, setBarberIntervalTimeGap] = useState([]);

  const generateBarberTimeIntervalInMinutes = () => {
    const options = [];
    for (let i = 5; i <= 60; i = i + 5) {
      options.push(i);
    }

    setBarberIntervalTimeGap(options);
  };

  useEffect(() => {
    generateBarberTimeIntervalInMinutes();
  }, []);

  const [apply_appointment_loading, set_apply_appointment_loading] =
    useState(false);

  const apply_timeslot_handler = async () => {
    if (!appointmentStartTimeSelected) {
      toast.error("Appointment start time not selected", {
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

    if (!appointmentEndTimeSelected) {
      toast.error("Appointment end time not selected", {
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

    const appointment_time_data = {
      salonId,
      barberId,
      appointmentTimes: [
        {
          day: selected_drop_day?.item?.day,
          startTime: appointmentStartTimeSelected,
          endTime: appointmentEndTimeSelected,
          barberIntervalTime: barberIntervalTime?.value,
        },
      ],
    };

    try {
      set_apply_appointment_loading(true);
      const { data } = await api.post(
        `/api/barberAppointmentTimes/addBarberAppointmentTime`,
        appointment_time_data
      );

      toast.success(data?.message, {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      fetchBreakTimes(selected_drop_day?.item?.day);
      set_open_break_time(false);
      setAppointmentBreakStartTimeSelected("");
      setAppointmentBreakEndTimeSelected("");
      getAppointdays();
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } finally {
      set_apply_appointment_loading(false);
    }
  };

  const [break_time_loading, set_break_time_loading] = useState(false);
  const [get_break_time, set_get_break_time] = useState([]);

  const fetchBreakTimes = async (break_day) => {
    try {
      set_break_time_loading(true);
      const { data } = await api.post(
        "/api/barberBreakTimes/getBarberBreakTimes",
        {
          salonId,
          barberId,
          day: break_day,
        }
      );

      set_get_break_time(data?.response);
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } finally {
      set_break_time_loading(false);
    }
  };

  useEffect(() => {
    if (selected_drop_day?.item?.day) {
      fetchBreakTimes(selected_drop_day?.item?.day);
    }
  }, [selected_drop_day?.item?.day]);

  const [break_time_delete_loading, set_break_time_delete_loading] = useState({
    loading: false,
    item: null,
  });
  const delete_break_time_handler = async (deleteItem) => {
    try {
      set_break_time_delete_loading({
        loading: true,
        item: deleteItem, // <<< IMPORTANT FIX
      });
      const { data } = await api.post(
        "/api/barberBreakTimes/deleteBarberbreakTime",
        {
          salonId,
          barberId,
          day: selected_drop_day?.item?.day,
          slotIds: [deleteItem["_id"]],
        }
      );

      toast.success(data?.message, {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      fetchBreakTimes(selected_drop_day?.item?.day);
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } finally {
      set_break_time_delete_loading((prev) => {
        return {
          loading: false,
          item: null,
        };
      });
    }
  };

  const [generatedBreakTimeslots, setGeneratedBreakTimeslots] = useState([]);
  const [break_time_range_loading, set_break_time_range_loading] = useState([]);
  const [open_break_time, set_open_break_time] = useState(false);

  const fetch_break_time_range = async () => {
    try {
      set_break_time_range_loading(true);
      const { data } = await api.post(
        `/api/barberBreakTimes/getBarberBreakTimeRange`,
        {
          salonId,
          barberId,
          day: selected_drop_day?.item?.day,
        }
      );

      console.log(data);
      setGeneratedBreakTimeslots(data?.response);
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error("Something went wrong !", {
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

      toast.error(error?.response?.data?.message, {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      set_break_time_range_loading(false);
    }
  };

  useEffect(() => {
    // time_slot_calculation(5, setGeneratedBreakTimeslots);
    //
    if (open_break_time) {
      fetch_break_time_range();
    }
  }, [open_break_time]);

  const [break_time_add_loading, set_break_time_add_loading] = useState(false);
  const add_break_time_handler = async () => {
    if (!appointmentBreakStartTimeSelected) {
      toast.error("Start time is not selected", {
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

    if (!appointmentBreakEndTimeSelected) {
      toast.error("End time is not selected", {
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

    const add_break_data = {
      salonId,
      barberId,
      day: selected_drop_day?.item?.day,
      breakTimes: [
        {
          startTime: appointmentBreakStartTimeSelected,
          endTime: appointmentBreakEndTimeSelected,
        },
      ],
    };

    try {
      set_break_time_add_loading(true);

      const { data } = await api.post(
        "/api/barberBreakTimes/addBarberBreakTimes",
        add_break_data
      );

      toast.success(data?.message, {
        duration: 3000,
        style: {
          fontSize: "var(--font-size-2)",
          borderRadius: "0.3rem",
          background: "#333",
          color: "#fff",
        },
      });

      setAppointmentBreakStartTimeSelected("");
      setAppointmentBreakEndTimeSelected("");
      fetchBreakTimes(selected_drop_day?.item?.day);
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error("Something went wrong !", {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          style: {
            fontSize: "var(--font-size-2)",
            borderRadius: "0.3rem",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } finally {
      set_break_time_add_loading(false);
    }
  };

  const modal_style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "45rem",
    maxHeight: "85vh", // ⬅️ required for scroll
    overflow: "scroll", // ⬅️ enable internal scroll
    bgcolor: "var(--bg-primary)",
    border: "0.1rem solid var(--border-primary)",
    boxShadow: 24,
    p: 4,
  };

  const [modalSelectedItem, setModalSelectedItem] = useState({
    isChecked: false,
    item: null,
  });

  useEffect(() => {
    if (modalSelectedItem?.item?.day) {
      if (modalSelectedItem?.isChecked) {
        set_selected_drop_day((prev) => ({
          open:
            prev.item?.day === modalSelectedItem?.item?.day ? !prev.open : true,
          item: modalSelectedItem?.item,
        }));
      }
    }
  }, [modalSelectedItem?.item?.day]);

  const close_modal = () => {
    set_selected_drop_day((prev) => ({
      open: false,
      item: null,
    }));
    setAppointmentBreakStartTimeDrop((prev) => {
      return {
        open: false,
        value: null,
      };
    });
    setAppointmentBreakEndTimeDrop((prev) => {
      return {
        open: false,
        value: null,
      };
    });
    setAppointmentStartTimeDrop((prev) => {
      return {
        open: false,
        value: null,
      };
    });
    setAppointmentEndTimeDrop((prev) => {
      return {
        open: false,
        value: null,
      };
    });
    setBarberIntervalTime((prev) => {
      return {
        open: false,
        value: null,
      };
    });
    set_open_break_time(false);
    setAppointmentBreakStartTimeSelected("");
    setAppointmentBreakEndTimeSelected("");
    setModalSelectedItem({
      isChecked: false,
      item: null,
    });
  };

  return (
    <div className={`${style.section}`}>
      <div className={style.barber_appointment_content_wrapper}>
        <div className={style.barber_availability_container}>
          <div>
            <div>
              <h2>Appointment Days</h2>
              <p>
                Select the days you're <strong>available</strong> for client
                appointments.
              </p>
            </div>

            <button
              onClick={submitHandler}
              disabled={salonId === 0}
              style={{
                cursor: salonId === 0 ? "not-allowed" : "pointer",
              }}
            >
              save
            </button>
          </div>

          <div>
            {days.map((d) => {
              const isDisabled = getSalonoffDays.includes(d.day);
              const isChecked = !isDisabled && selectedDays.includes(d.day);

              return (
                // <div
                //   key={d.id}
                // className={`${style.appointmentWeekDay} ${
                //   isDisabled ? style.disabled : ""
                // } ${isChecked ? style.apptAvailSelected : ""}`}
                // style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                //   onClick={() => {
                //     if (!isDisabled) checkdayHandler(d);
                //   }}
                // >
                //   {d.day.slice(0, 3)}
                // <p>
                //   {
                //     getBarberAppointmentHours?.find(
                //       (item) => item.day === d.day
                //     )?.startTime
                //   }{" "}
                //   -{" "}
                //   {
                //     getBarberAppointmentHours?.find(
                //       (item) => item.day === d.day
                //     )?.endTime
                //   }
                // </p>
                //   <button
                //     onClick={(e) => {
                //       e.stopPropagation();
                // setModalSelectedItem({
                //   isChecked: isChecked,
                //   item: d,
                // });
                //     }}
                //   >
                //     Set Hours & Breaks
                //   </button>
                // </div>

                <button
                  key={d.id}
                  className={`${style.appointmentWeekDay} ${
                    isDisabled ? style.disabled : ""
                  } ${isChecked ? style.apptAvailSelected : ""}`}
                  style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                  onClick={() => {
                    if (!isDisabled) checkdayHandler(d);
                  }}
                >
                  {d.day.slice(0, 3)}

                  <p>
                    {
                      getBarberAppointmentHours?.find(
                        (item) => item.day === d.day
                      )?.startTime
                    }{" "}
                    -{" "}
                    {
                      getBarberAppointmentHours?.find(
                        (item) => item.day === d.day
                      )?.endTime
                    }
                  </p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        const getBarberAppointmentHoursDay =
                          getBarberAppointmentHours.map((item) => item.day);

                        if (!getBarberAppointmentHoursDay.includes(d.day)) {
                          toast.error(
                            "You can't set hours and breaks because this day isn't saved.",
                            {
                              duration: 3000,
                              style: {
                                fontSize: "var(--font-size-2)",
                                borderRadius: "0.3rem",
                                background: "#333",
                                color: "#fff",
                              },
                            }
                          );
                          return;
                        } else if (!isChecked) {
                          toast.error(
                            "Please select this day before setting its hours and breaks.",
                            {
                              duration: 3000,
                              style: {
                                fontSize: "var(--font-size-2)",
                                borderRadius: "0.3rem",
                                background: "#333",
                                color: "#fff",
                              },
                            }
                          );
                        } else if (isChecked) {
                          setModalSelectedItem({
                            isChecked: isChecked,
                            item: d,
                          });
                        }
                      }}
                    >
                      Set Hours & Breaks
                    </button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={style.barber_dayoff_container}>
          <div>
            <div>
              <h2>Day off</h2>
              <p>Select dates on the calender to mark as unavailable</p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className={style.monthSelector}>
                <button
                  onClick={handlePrevMonth}
                  className={style.iconBtn}
                  disabled={isPrevDisabled}
                  style={{
                    opacity: isPrevDisabled ? 0.4 : 1,
                    cursor: isPrevDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  <LeftArrow size={24} />
                </button>
                <p className={style.monthText}>
                  {currentMonth.format("MMMM YYYY")}
                </p>
                <button
                  onClick={handleNextMonth}
                  className={style.iconBtn}
                  disabled={isNextDisabled}
                  style={{
                    opacity: isNextDisabled ? 0.4 : 1,
                    cursor: isNextDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  <RightArrow size={24} />
                </button>
              </div>
              {/* <button
                className={style.reset_days}
                onClick={() => offDayHandler([])}
                disabled={salonId === 0}
                style={{
                  cursor: salonId === 0 ? "not-allowed" : "pointer",
                }}
              >
                Reset Off Days
              </button> */}

              <button
                className={style.reset_days}
                onClick={() => offDayHandler(selectedDates)}
                disabled={salonId === 0}
                style={{
                  cursor: salonId === 0 ? "not-allowed" : "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>

          <div className={style.calendarGrid}>
            {" "}
            {/* New: Wrapper for the grid */}
            {daysForDisplay.map((item) => {
              if (item.type === "blank") {
                return <div key={item.key} className={style.blankDay}></div>;
              }

              const day = item.day;
              const formatted = day.format("YYYY-MM-DD");

              const isLeaveDay = barberLeaveDaysdata?.includes(formatted); // actual leave date
              const isSalonOffDay = getSalonoffDays.includes(
                day.format("dddd")
              ); // salon off day (weekly)
              const isAvailableDay = getBarberApptdates.includes(
                day.format("dddd")
              ); // barber working

              const isSelected = isMobileSelected(day);

              // Only truly disabled days (not selectable)
              const isDisabled = !isAvailableDay || isLeaveDay;

              return (
                <button
                  key={formatted}
                  onClick={() => {
                    if (isSalonOffDay) {
                      return;
                    } else if (isDisabled) {
                      handle_delete_barber_offdays(day);
                    } else if (item.isFuture) {
                      onMobileClickDay(day);
                    }
                  }}
                  disabled={!item.isFuture}
                  className={`
          ${style.appointmentWeekDate}
          ${!item.isFuture ? style.pastDate : ""}
          ${isLeaveDay && !isSelected ? style.leave_dates : ""}
          ${isSalonOffDay ? style.salon_off_day : ""}
          ${isSelected ? style.highlighted_date : ""}
        `}
                  style={{
                    opacity: isLeaveDay
                      ? 1
                      : !item.isFuture || isDisabled || isSalonOffDay
                      ? 0.4
                      : 1, // leave fully visible
                    cursor:
                      !item.isFuture || isSalonOffDay
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  <div>
                    <h2>{day.format("DD")}</h2>
                    <p>{day.format("ddd")}</p>
                    <p>
                      {isLeaveDay
                        ? "Leave"
                        : isSalonOffDay
                        ? "Salon Off Day"
                        : isAvailableDay
                        ? "Available"
                        : "Unavailable"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        open={
          selected_drop_day.open &&
          selected_drop_day?.item?.id === modalSelectedItem?.item?.id
        }
        onClose={() => close_modal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal_style} className={style.modal_container}>
          <div>
            <div>
              <LeftIcon color="var(--text-primary)" size={"1.8rem"} />
            </div>
            <h2>{selected_drop_day?.item?.day}</h2>
          </div>
          <p>
            Set your business hours here. Head to your calender if you need to
            adjust hours for a single day.
          </p>

          <div className={style.set_time_modal_container}>
            <p>Appointment hours</p>
            <div>
              <div>
                <div
                  onClick={() => {
                    setAppointmentBreakStartTimeDrop((prev) => {
                      return {
                        open: false,
                        value: null,
                      };
                    });
                    setAppointmentBreakEndTimeDrop((prev) => {
                      return {
                        open: false,
                        value: null,
                      };
                    });
                    setAppointmentStartTimeDrop((prev) => {
                      return {
                        open: !prev.open,
                        value: null,
                      };
                    });

                    setBarberIntervalTime((prev) => {
                      return {
                        ...prev,
                        open: false,
                      };
                    });
                  }}
                >
                  <p>{appointmentStartTimeSelected}</p>
                  <DropdownIcon size={"1.4rem"} color="var(--text-primary)" />
                </div>

                {appointmentStartTimeDrop.open ? (
                  <div className={style.timeslot_dropdown_container}>
                    {generatedTimeslots.map((item) => {
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            setAppointmentStartTimeSelected(item);
                            setAppointmentStartTimeDrop((prev) => {
                              return {
                                open: false,
                                value: null,
                              };
                            });
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div>
                <div
                  onClick={() => {
                    setAppointmentBreakStartTimeDrop((prev) => {
                      return {
                        open: false,
                        value: null,
                      };
                    });
                    setAppointmentBreakEndTimeDrop((prev) => {
                      return {
                        open: false,
                        value: null,
                      };
                    });
                    setAppointmentEndTimeDrop((prev) => {
                      return {
                        open: !prev.open,
                        value: null,
                      };
                    });

                    setBarberIntervalTime((prev) => {
                      return {
                        ...prev,
                        open: false,
                      };
                    });
                  }}
                >
                  <p>{appointmentEndTimeSelected}</p>
                  <DropdownIcon size={"1.4rem"} color="var(--text-primary)" />
                </div>

                {appointmentEndTimeDrop.open ? (
                  <div className={style.timeslot_dropdown_container}>
                    {generatedTimeslots.map((item) => {
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            setAppointmentEndTimeSelected(item);
                            setAppointmentEndTimeDrop((prev) => {
                              return {
                                open: false,
                                value: null,
                              };
                            });
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className={style.set_time_modal_container}>
            <p>Interval time</p>
            <div>
              <div>
                <div
                  onClick={() => {
                    setAppointmentBreakStartTimeDrop((prev) => {
                      return {
                        open: false,
                        value: null,
                      };
                    });
                    setAppointmentBreakEndTimeDrop((prev) => {
                      return {
                        open: false,
                        value: null,
                      };
                    });
                    setAppointmentStartTimeDrop((prev) => {
                      return {
                        open: false,
                        value: null,
                      };
                    });
                    setAppointmentEndTimeDrop((prev) => {
                      return {
                        open: false,
                        value: null,
                      };
                    });
                    setBarberIntervalTime((prev) => {
                      return {
                        ...prev,
                        open: !prev.open,
                      };
                    });
                  }}
                >
                  <p>{barberIntervalTime?.value || 0} mins</p>
                  <DropdownIcon size={"1.4rem"} color="var(--text-primary)" />
                </div>

                {barberIntervalTime?.open ? (
                  <div className={style.timeslot_dropdown_container}>
                    {barberIntervalTimeGap?.map((item) => {
                      return (
                        <button
                          key={item}
                          style={
                            {
                              // padding: "1rem",
                              // minWidth: "10rem"
                            }
                          }
                          // onClick={() => {
                          //   setAppointmentStartTimeSelected(item);
                          //   setAppointmentStartTimeDrop((prev) => {
                          //     return {
                          //       open: false,
                          //       value: null,
                          //     };
                          //   });
                          // }}
                          onClick={() => {
                            setBarberIntervalTime((prev) => {
                              return {
                                open: false,
                                value: item,
                              };
                            });
                          }}
                        >
                          {`${item} mins`}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className={style.set_time_break_modal_container}>
            {break_time_loading ? (
              <Skeleton
                count={3}
                height={"4rem"}
                baseColor={"var(--loader-bg-color)"}
                highlightColor={"var(--loader-highlight-color)"}
                style={{ marginBottom: "1rem" }}
              />
            ) : get_break_time.length > 0 ? (
              <>
                <p>Break Duration</p>
                {get_break_time?.map((item) => {
                  return (
                    <div key={item._id}>
                      <div>
                        <div>
                          <p>{item.startTime}</p>
                          <div
                            style={{
                              width: "0rem",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div>
                          <p>{item.endTime}</p>
                          <div
                            style={{
                              width: "0rem",
                            }}
                          ></div>
                        </div>
                      </div>

                      <button
                        disabled={
                          break_time_delete_loading?.item?._id === item?._id
                        }
                        onClick={() => delete_break_time_handler(item)}
                      >
                        {break_time_delete_loading?.item?._id === item?._id &&
                        break_time_delete_loading?.loading ? (
                          <ButtonLoader />
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </div>
                  );
                })}
              </>
            ) : (
              <p
                style={{
                  lineHeight: "10rem",
                }}
              >
                No break time available
              </p>
            )}
          </div>

          <button className={style.set_time_add_break_container}>
            <p>Add Break</p>
          </button>

          <div className={style.set_time_add_timer}>
            <div>
              <div
                onClick={() => {
                  setAppointmentStartTimeDrop((prev) => {
                    return {
                      open: false,
                      value: null,
                    };
                  });
                  setAppointmentEndTimeDrop((prev) => {
                    return {
                      open: false,
                      value: null,
                    };
                  });
                  setBarberIntervalTime((prev) => {
                    return {
                      ...prev,
                      open: false,
                    };
                  });
                  set_open_break_time(true);
                  setAppointmentBreakStartTimeDrop((prev) => {
                    return {
                      open: !prev.open,
                      value: null,
                    };
                  });
                }}
              >
                <p
                  style={{
                    color: appointmentBreakStartTimeSelected
                      ? "var(--text-primary)"
                      : "gray",
                    fontWeight: 600,
                  }}
                >
                  {appointmentBreakStartTimeSelected
                    ? appointmentBreakStartTimeSelected
                    : "00:00"}
                </p>
                <DropdownIcon size={"1.4rem"} color="var(--text-primary)" />
              </div>

              {appointmentBreakStartTimeDrop.open ? (
                break_time_range_loading ? (
                  <div className={style.timeslot_dropdown_container_loading}>
                    <Skeleton
                      count={6}
                      height={"3.5rem"}
                      width={"7.8rem"}
                      baseColor={"var(--loader-bg-color)"}
                      highlightColor={"var(--loader-highlight-color)"}
                      style={{ marginBottom: "1rem" }}
                    />
                  </div>
                ) : generatedBreakTimeslots?.length > 0 ? (
                  <div className={style.timeslot_dropdown_container}>
                    {generatedBreakTimeslots.map((item) => {
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            setAppointmentBreakStartTimeSelected(item);
                            setAppointmentBreakStartTimeDrop((prev) => {
                              return {
                                open: false,
                                value: null,
                              };
                            });
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className={style.timeslot_dropdown_container_error}>
                    <p>No time present</p>
                  </div>
                )
              ) : null}
            </div>

            <div>
              <div
                onClick={() => {
                  setAppointmentStartTimeDrop((prev) => {
                    return {
                      open: false,
                      value: null,
                    };
                  });
                  setAppointmentEndTimeDrop((prev) => {
                    return {
                      open: false,
                      value: null,
                    };
                  });
                  setBarberIntervalTime((prev) => {
                    return {
                      ...prev,
                      open: false,
                    };
                  });
                  set_open_break_time(true);
                  setAppointmentBreakEndTimeDrop((prev) => {
                    return {
                      open: !prev.open,
                      value: null,
                    };
                  });
                }}
              >
                <p
                  style={{
                    color: appointmentBreakEndTimeSelected
                      ? "var(--text-primary)"
                      : "gray",
                    fontWeight: 600,
                  }}
                >
                  {appointmentBreakEndTimeSelected
                    ? appointmentBreakEndTimeSelected
                    : "00:00"}
                </p>
                <DropdownIcon size={"1.4rem"} color="var(--text-primary)" />
              </div>

              {appointmentBreakEndTimeDrop.open ? (
                break_time_range_loading ? (
                  <div className={style.timeslot_dropdown_container_loading}>
                    <Skeleton
                      count={6}
                      height={"3.5rem"}
                      width={"7.8rem"}
                      baseColor={"var(--loader-bg-color)"}
                      highlightColor={"var(--loader-highlight-color)"}
                      style={{ marginBottom: "1rem" }}
                    />
                  </div>
                ) : generatedBreakTimeslots?.length > 0 ? (
                  <div className={style.timeslot_dropdown_container}>
                    {generatedBreakTimeslots.map((item) => {
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            setAppointmentBreakEndTimeSelected(item);
                            setAppointmentBreakEndTimeDrop((prev) => {
                              return {
                                open: false,
                                value: null,
                              };
                            });
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className={style.timeslot_dropdown_container_error}>
                    <p>No time present</p>
                  </div>
                )
              ) : null}
            </div>

            <button
              disabled={break_time_add_loading}
              onClick={() => {
                add_break_time_handler();
              }}
            >
              {break_time_add_loading ? <ButtonLoader /> : "Add"}
            </button>
          </div>

          <div className={style.set_time_separator} />

          <div className={style.set_time_apply_container}>
            <div />
            <div>
              <button onClick={() => close_modal()}>Cancel</button>
              <button
                disabled={apply_appointment_loading}
                onClick={apply_timeslot_handler}
              >
                {apply_appointment_loading ? <ButtonLoader /> : "Apply"}
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Mobile design started */}
      <div
        className={`${style.barber_appointment_content_mobile_wrapper} ${
          darkmodeOn && style.dark
        }`}
      >
        <div>
          <div className={style.button_group}>
            <button
              onClick={() => {
                setBarberOffdates(false);
                setAppointmentDates(true);
              }}
            >
              Availability
            </button>
            <button
              onClick={() => {
                setBarberOffdates(true);
                setAppointmentDates(false);
              }}
            >
              Barber Off Days
            </button>
          </div>
          {appointmentdates && (
            <div className={style.value_body}>
              <div className={style.heading}>
                <p>#</p>
                <p>Days</p>
              </div>

              <div>
                {days.map((d) => {
                  const isDisabled = getSalonoffDays.includes(d.day);
                  const isChecked = !isDisabled && selectedDays.includes(d.day);

                  return (
                    <>
                      <div
                        key={d.id}
                        className={`${style.value} ${
                          isDisabled ? style.disabled : ""
                        }`}
                        style={{
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                      >
                        <div>
                          <input
                            type="checkbox"
                            style={{ accentColor: "blue" }}
                            onChange={() => checkdayHandler(d)}
                            checked={isChecked}
                            disabled={isDisabled}
                          />
                          <p>{d.day}</p>
                        </div>
                        <div>
                          <p>
                            {
                              getBarberAppointmentHours?.find(
                                (item) => item.day === d.day
                              )?.startTime
                            }{" "}
                            -{" "}
                            {
                              getBarberAppointmentHours?.find(
                                (item) => item.day === d.day
                              )?.endTime
                            }
                          </p>
                          <button
                            onClick={() => {
                              const getBarberAppointmentHoursDay =
                                getBarberAppointmentHours.map(
                                  (item) => item.day
                                );

                              if (
                                !getBarberAppointmentHoursDay.includes(d.day)
                              ) {
                                toast.error(
                                  "You can't set hours for this day because its schedule hasn't been saved yet.",
                                  {
                                    duration: 3000,
                                    style: {
                                      fontSize: "var(--font-size-2)",
                                      borderRadius: "0.3rem",
                                      background: "#333",
                                      color: "#fff",
                                    },
                                  }
                                );
                                return;
                              } else if (!isChecked) {
                                toast.error(
                                  "Please select this day before setting its hours and breaks.",
                                  {
                                    duration: 3000,
                                    style: {
                                      fontSize: "var(--font-size-2)",
                                      borderRadius: "0.3rem",
                                      background: "#333",
                                      color: "#fff",
                                    },
                                  }
                                );
                              } else if (isChecked) {
                                set_selected_drop_day((prev) => {
                                  return {
                                    open:
                                      prev.item?.day === d.day
                                        ? !prev.open
                                        : true,
                                    item: d,
                                  };
                                });
                                setAppointmentBreakStartTimeDrop((prev) => {
                                  return {
                                    open: false,
                                    value: null,
                                  };
                                });
                                setAppointmentBreakEndTimeDrop((prev) => {
                                  return {
                                    open: false,
                                    value: null,
                                  };
                                });
                                setAppointmentStartTimeDrop((prev) => {
                                  return {
                                    open: false,
                                    value: null,
                                  };
                                });
                                setAppointmentEndTimeDrop((prev) => {
                                  return {
                                    open: false,
                                    value: null,
                                  };
                                });
                                set_open_break_time(false);
                                setAppointmentBreakStartTimeSelected("");
                                setAppointmentBreakEndTimeSelected("");
                              }
                            }}
                          >
                            {selected_drop_day.open &&
                            selected_drop_day?.item?.id === d?.id ? (
                              <DropdownIcon
                                size={"1.4rem"}
                                color="var(--text-primary)"
                              />
                            ) : (
                              <RightIcon
                                size={"1.4rem"}
                                color="var(--text-primary)"
                              />
                            )}
                          </button>
                        </div>
                      </div>

                      {selected_drop_day.open &&
                      selected_drop_day?.item?.id === d.id ? (
                        <div className={style.day_off_dropdown_container}>
                          <p>
                            Set your business hours here. Head to your calender
                            if you need to adjust hours for a single day.
                          </p>

                          <div className={style.set_time_container}>
                            <p>Appointment hours</p>
                            <div>
                              <div>
                                <div
                                  onClick={() => {
                                    setAppointmentBreakStartTimeDrop((prev) => {
                                      return {
                                        open: false,
                                        value: null,
                                      };
                                    });
                                    setAppointmentBreakEndTimeDrop((prev) => {
                                      return {
                                        open: false,
                                        value: null,
                                      };
                                    });
                                    setAppointmentStartTimeDrop((prev) => {
                                      return {
                                        open: !prev.open,
                                        value: null,
                                      };
                                    });
                                  }}
                                >
                                  <p>{appointmentStartTimeSelected}</p>
                                  <DropdownIcon
                                    size={"1.4rem"}
                                    color="var(--text-primary)"
                                  />
                                </div>

                                {appointmentStartTimeDrop.open ? (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container
                                    }
                                  >
                                    {generatedTimeslots.map((item) => {
                                      return (
                                        <button
                                          key={item}
                                          onClick={() => {
                                            setAppointmentStartTimeSelected(
                                              item
                                            );
                                            setAppointmentStartTimeDrop(
                                              (prev) => {
                                                return {
                                                  open: false,
                                                  value: null,
                                                };
                                              }
                                            );
                                          }}
                                        >
                                          {item}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </div>

                              <div>
                                <div
                                  onClick={() => {
                                    setAppointmentBreakStartTimeDrop((prev) => {
                                      return {
                                        open: false,
                                        value: null,
                                      };
                                    });
                                    setAppointmentBreakEndTimeDrop((prev) => {
                                      return {
                                        open: false,
                                        value: null,
                                      };
                                    });
                                    setAppointmentEndTimeDrop((prev) => {
                                      return {
                                        open: !prev.open,
                                        value: null,
                                      };
                                    });
                                  }}
                                >
                                  <p>{appointmentEndTimeSelected}</p>
                                  <DropdownIcon
                                    size={"1.4rem"}
                                    color="var(--text-primary)"
                                  />
                                </div>

                                {appointmentEndTimeDrop.open ? (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container
                                    }
                                  >
                                    {generatedTimeslots.map((item) => {
                                      return (
                                        <button
                                          key={item}
                                          onClick={() => {
                                            setAppointmentEndTimeSelected(item);
                                            setAppointmentEndTimeDrop(
                                              (prev) => {
                                                return {
                                                  open: false,
                                                  value: null,
                                                };
                                              }
                                            );
                                          }}
                                        >
                                          {item}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBlock: "2rem"
                            }}
                            className={style.set_time_container}
                          >
                            <p>Interval time</p>
                            <div>
                              <div>
                                <div
                                  onClick={() => {
                                    setAppointmentBreakStartTimeDrop((prev) => {
                                      return {
                                        open: false,
                                        value: null,
                                      };
                                    });
                                    setAppointmentBreakEndTimeDrop((prev) => {
                                      return {
                                        open: false,
                                        value: null,
                                      };
                                    });
                                    setAppointmentStartTimeDrop((prev) => {
                                      return {
                                        open: false,
                                        value: null,
                                      };
                                    });
                                    setAppointmentEndTimeDrop((prev) => {
                                      return {
                                        open: false,
                                        value: null,
                                      };
                                    });
                                    setBarberIntervalTime((prev) => {
                                      return {
                                        ...prev,
                                        open: !prev.open,
                                      };
                                    });
                                  }}
                                >
                                  <p>{barberIntervalTime?.value || 0} mins</p>
                                  <DropdownIcon
                                    size={"1.4rem"}
                                    color="var(--text-primary)"
                                  />
                                </div>

                                {barberIntervalTime?.open ? (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container
                                    }
                                  >
                                    {barberIntervalTimeGap?.map((item) => {
                                      return (
                                        <button
                                          key={item}
                                          style={
                                            {
                                              // padding: "1rem",
                                              // minWidth: "10rem"
                                            }
                                          }
                                          // onClick={() => {
                                          //   setAppointmentStartTimeSelected(item);
                                          //   setAppointmentStartTimeDrop((prev) => {
                                          //     return {
                                          //       open: false,
                                          //       value: null,
                                          //     };
                                          //   });
                                          // }}
                                          onClick={() => {
                                            setBarberIntervalTime((prev) => {
                                              return {
                                                open: false,
                                                value: item,
                                              };
                                            });
                                          }}
                                        >
                                          {`${item} mins`}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className={style.set_time_container}>
                            {break_time_loading ? (
                              <Skeleton
                                count={3}
                                height={"4rem"}
                                baseColor={"var(--loader-bg-color)"}
                                highlightColor={"var(--loader-highlight-color)"}
                                style={{ marginBottom: "1rem" }}
                              />
                            ) : get_break_time.length > 0 ? (
                              <>
                                <p>Break Duration</p>
                                {get_break_time?.map((item) => {
                                  return (
                                    <div key={item._id}>
                                      <div>
                                        <div>
                                          <p>{item.startTime}</p>
                                          <div
                                            style={{
                                              width: "0rem",
                                            }}
                                          ></div>
                                        </div>
                                      </div>

                                      <div>
                                        <div>
                                          <p>{item.endTime}</p>
                                          <div
                                            style={{
                                              width: "0rem",
                                            }}
                                          ></div>
                                        </div>
                                      </div>

                                      <button
                                        disabled={
                                          break_time_delete_loading?.item
                                            ?._id === item?._id
                                        }
                                        onClick={() =>
                                          delete_break_time_handler(item)
                                        }
                                      >
                                        {break_time_delete_loading?.item
                                          ?._id === item?._id &&
                                        break_time_delete_loading?.loading ? (
                                          <ButtonLoader />
                                        ) : (
                                          "Remove"
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                              </>
                            ) : (
                              <p
                                style={{
                                  lineHeight: "10rem",
                                }}
                              >
                                No break time available
                              </p>
                            )}
                          </div>

                          <button
                            className={style.set_time_add_break_container}
                          >
                            {/* <AddIcon
                              size={"1.8rem"}
                              color="var(--text-primary)"
                            /> */}
                            <p>Add Break</p>
                          </button>

                          <div className={style.set_time_add_timer}>
                            <div>
                              <div
                                onClick={() => {
                                  setAppointmentStartTimeDrop((prev) => {
                                    return {
                                      open: false,
                                      value: null,
                                    };
                                  });
                                  setAppointmentEndTimeDrop((prev) => {
                                    return {
                                      open: false,
                                      value: null,
                                    };
                                  });
                                  set_open_break_time(true);
                                  setAppointmentBreakStartTimeDrop((prev) => {
                                    return {
                                      open: !prev.open,
                                      value: null,
                                    };
                                  });
                                }}
                              >
                                <p
                                  style={{
                                    color: appointmentBreakStartTimeSelected
                                      ? "var(--text-primary)"
                                      : "gray",
                                    fontWeight: 600,
                                  }}
                                >
                                  {appointmentBreakStartTimeSelected
                                    ? appointmentBreakStartTimeSelected
                                    : "00:00"}
                                </p>
                                <DropdownIcon
                                  size={"1.4rem"}
                                  color="var(--text-primary)"
                                />
                              </div>

                              {appointmentBreakStartTimeDrop.open ? (
                                break_time_range_loading ? (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container_loading
                                    }
                                  >
                                    <Skeleton
                                      count={6}
                                      height={"3.5rem"}
                                      width={"7.8rem"}
                                      baseColor={"var(--loader-bg-color)"}
                                      highlightColor={
                                        "var(--loader-highlight-color)"
                                      }
                                      style={{ marginBottom: "1rem" }}
                                    />
                                  </div>
                                ) : generatedBreakTimeslots?.length > 0 ? (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container
                                    }
                                  >
                                    {generatedBreakTimeslots.map((item) => {
                                      return (
                                        <button
                                          key={item}
                                          onClick={() => {
                                            setAppointmentBreakStartTimeSelected(
                                              item
                                            );
                                            setAppointmentBreakStartTimeDrop(
                                              (prev) => {
                                                return {
                                                  open: false,
                                                  value: null,
                                                };
                                              }
                                            );
                                          }}
                                        >
                                          {item}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container_error
                                    }
                                  >
                                    <p>No time present</p>
                                  </div>
                                )
                              ) : null}
                            </div>

                            <div>
                              <div
                                onClick={() => {
                                  setAppointmentStartTimeDrop((prev) => {
                                    return {
                                      open: false,
                                      value: null,
                                    };
                                  });
                                  setAppointmentEndTimeDrop((prev) => {
                                    return {
                                      open: false,
                                      value: null,
                                    };
                                  });
                                  set_open_break_time(true);
                                  setAppointmentBreakEndTimeDrop((prev) => {
                                    return {
                                      open: !prev.open,
                                      value: null,
                                    };
                                  });
                                }}
                              >
                                <p
                                  style={{
                                    color: appointmentBreakEndTimeSelected
                                      ? "var(--text-primary)"
                                      : "gray",
                                    fontWeight: 600,
                                  }}
                                >
                                  {appointmentBreakEndTimeSelected
                                    ? appointmentBreakEndTimeSelected
                                    : "00:00"}
                                </p>
                                <DropdownIcon
                                  size={"1.4rem"}
                                  color="var(--text-primary)"
                                />
                              </div>

                              {appointmentBreakEndTimeDrop.open ? (
                                break_time_range_loading ? (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container_loading
                                    }
                                  >
                                    <Skeleton
                                      count={6}
                                      height={"3.5rem"}
                                      width={"7.8rem"}
                                      baseColor={"var(--loader-bg-color)"}
                                      highlightColor={
                                        "var(--loader-highlight-color)"
                                      }
                                      style={{ marginBottom: "1rem" }}
                                    />
                                  </div>
                                ) : generatedBreakTimeslots?.length > 0 ? (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container
                                    }
                                  >
                                    {generatedBreakTimeslots.map((item) => {
                                      return (
                                        <button
                                          key={item}
                                          onClick={() => {
                                            setAppointmentBreakEndTimeSelected(
                                              item
                                            );
                                            setAppointmentBreakEndTimeDrop(
                                              (prev) => {
                                                return {
                                                  open: false,
                                                  value: null,
                                                };
                                              }
                                            );
                                          }}
                                        >
                                          {item}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div
                                    className={
                                      style.timeslot_dropdown_container_error
                                    }
                                  >
                                    <p>No time present</p>
                                  </div>
                                )
                              ) : null}
                            </div>

                            <button
                              disabled={break_time_add_loading}
                              onClick={() => {
                                add_break_time_handler();
                              }}
                            >
                              {break_time_add_loading ? (
                                <ButtonLoader />
                              ) : (
                                "Add"
                              )}
                            </button>
                          </div>

                          <div className={style.set_time_separator} />

                          <div className={style.set_time_apply_container}>
                            <div />
                            <div>
                              <button onClick={() => close_modal()}>
                                Cancel
                              </button>
                              <button
                                disabled={apply_appointment_loading}
                                onClick={apply_timeslot_handler}
                              >
                                {apply_appointment_loading ? (
                                  <ButtonLoader />
                                ) : (
                                  "Apply"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </>
                  );
                })}
              </div>
            </div>
          )}

          {barberOffdates && (
            <div className={style.leave_value_body}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className={style.monthSelector}>
                  <button
                    onClick={handlePrevMonth}
                    className={style.iconBtn}
                    disabled={isPrevDisabled}
                    style={{
                      opacity: isPrevDisabled ? 0.4 : 1,
                      cursor: isPrevDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <LeftArrow size={24} />
                  </button>
                  <p className={style.monthText}>
                    {currentMonth.format("MMMM YYYY")}
                  </p>
                  <button
                    onClick={handleNextMonth}
                    className={style.iconBtn}
                    disabled={isNextDisabled}
                    style={{
                      opacity: isNextDisabled ? 0.4 : 1,
                      cursor: isNextDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <RightArrow size={24} />
                  </button>
                </div>
                {/* <button
                  className={style.reset_days}
                  onClick={() => offDayHandler([])}
                  disabled={salonId === 0}
                  style={{
                    cursor: salonId === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Reset Off Days
                </button> */}
              </div>

              <div className={style.dayList}>
                {visibleDays.map((day) => {
                  const formatted = day.format("YYYY-MM-DD");

                  return (
                    <button
                      key={formatted}
                      onClick={() => {
                        if (isMobileDisabled(day)) {
                          handle_delete_barber_offdays(day);
                        } else {
                          onMobileClickDay(day);
                        }
                      }}
                      disabled={isDayMobileDisabled(day)}
                      className={`
    ${style.dayBtn}
    ${isMobileDisabled(day) && !isMobileSelected(day) ? style.leave_dates : ""}
    ${isMobileSelected(day) ? style.highlighted_date : ""}
  `}
                      style={{
                        opacity: isDayMobileDisabled(day) ? 0.4 : 1,
                        cursor: isDayMobileDisabled(day)
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {day.format("ddd DD MMM YYYY")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            className={style.submit}
            onClick={
              appointmentdates
                ? submitHandler
                : () => offDayHandler(selectedDates)
            }
            disabled={salonId === 0}
            style={{
              cursor: salonId === 0 ? "not-allowed" : "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
