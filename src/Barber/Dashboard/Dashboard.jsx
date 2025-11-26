import React, { useCallback, useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import style from "./Dashboard.module.css";
import { Carousel } from "react-responsive-carousel";
import {
  AddIcon,
  ChartIcon1,
  ChartIcon2,
  ChartIcon3,
  CheckIcon,
  ClockIcon,
  CrownIcon,
  DeleteIcon,
  ShowSalonInfo,
} from "../../icons";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts";

import ButtonLoader from "../../components/ButtonLoader/ButtonLoader";
import { useDispatch, useSelector } from "react-redux";
import { darkmodeSelector } from "../../Redux/Admin/Reducers/AdminHeaderReducer";
import {
  barberConnectSalonAction,
  barberDashboardSalonInfoAction,
  barberSalonStatusAction,
  connectSalonListAction,
} from "../../Redux/Barber/Actions/DashboardAction";
import { getBarberQueueListAction } from "../../Redux/Barber/Actions/BarberQueueAction";
import { getAdminSalonImagesAction } from "../../Redux/Admin/Actions/SalonAction";
import toast from "react-hot-toast";
import {
  AddressIcon,
  AppointmentIcon,
  ContactTel,
  SalonType,
} from "../../newicons";
import api from "../../Redux/api/Api";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { Box, Modal } from "@mui/material";

// created in arghyas account

const firebaseConfig = {
  apiKey: "AIzaSyBYCyrNZll9oeGKfILz_S5avzOQJ0xlCkw",
  authDomain: "iqbook-web.firebaseapp.com",
  projectId: "iqbook-web",
  storageBucket: "iqbook-web.firebasestorage.app",
  messagingSenderId: "889322044641",
  appId: "1:889322044641:web:d902ace026f28a67064ba0",
  measurementId: "G-2NZVFQJTYS",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// export const requestForToken = async () => {
//   try {
//     // Check if the browser supports notifications
//     if ('Notification' in window) {
//       const permission = await Notification.requestPermission();

//       if (permission === 'granted') {
//         console.log('Notification permission granted.');

//         const fcmToken = await getToken(messaging, {
//           vapidKey: "BMb-Y9gWXHSvgsOqipUxEpzriS32OyvkeP3I4N8aVkF0A8XPuI-o7LKA8SvM9Bx1GQGpOIH6C8C5PzBJXxPp1zc" // <-- REQUIRED: Your VAPID Key from Firebase
//         });

//         if (fcmToken) {
//           // 💡 Action: Send this token to your backend for sending notifications.
//           // Example: await yourApiCall.sendTokenToBackend(fcmToken);
//           return fcmToken;
//         } else {
//           console.warn('No registration token available. Check if your Firebase setup or VAPID key is correct.');
//         }
//       } else {
//         console.warn('Notification permission denied by the user.');
//       }
//     } else {
//       console.error('Notifications are not supported by this browser.');
//     }
//   } catch (err) {
//     console.error('An error occurred while retrieving token:', err);
//   }
// };

export const requestForToken = async () => {
  try {
    if (!("Notification" in window)) {
      console.error("Notifications not supported");
      return null;
    }

    // If already granted, skip the prompt
    if (Notification.permission === "granted") {
      return await getFCMToken();
    }

    // If default, ask for permission
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        return await getFCMToken();
      } else {
        console.warn("Notification permission denied");
        return null;
      }
    }

    // Denied
    console.warn("Notification permission previously denied");
    return null;
  } catch (err) {
    console.error("Error retrieving token:", err);
    return null;
  }
};

const getFCMToken = async () => {
  try {
    const fcmToken = await getToken(messaging, {
      vapidKey:
        "BMb-Y9gWXHSvgsOqipUxEpzriS32OyvkeP3I4N8aVkF0A8XPuI-o7LKA8SvM9Bx1GQGpOIH6C8C5PzBJXxPp1zc",
    });
    return fcmToken;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      // You can implement custom UI logic here (e.g., show a toast/in-app notification)
      console.log("Message received while foregrounded:", payload);
      resolve(payload);
    });
  });

const Dashboard = () => {
  const salonId = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberSalonId
  );
  const email = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberEmail
  );
  const barberName = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberName
  );

  // console.log(salonId, email, barberName)

  // useEffect(() => {

  //   if (email && salonId) {
  //     const getToken = async () => {
  //       const token = await requestForToken();
  //       if (token) {
  //         // console.log("Device Token:", token);

  //         const { data } = await axios.post("https://iqb-final.onrender.com/api/webNotifications/save-device-token",
  //           {
  //             salonId: salonId,
  //             name: barberName,
  //             email: email,
  //             deviceToken: token,
  //             type: "barber"
  //           })

  //       }
  //     };

  //     getToken();
  //   }

  // }, []);

  useEffect(() => {
    if (!email || !salonId) return;

    const saveToken = async () => {
      const token = await requestForToken();
      if (token) {
        try {
          await axios.post(
            "https://iqb-final.onrender.com/api/webNotifications/save-device-token",
            {
              salonId,
              name: barberName,
              email,
              deviceToken: token,
              type: "barber",
            }
          );
          // console.log('Device token saved successfully', token);
        } catch (err) {
          console.error("Error saving device token:", err);
        }
      }
    };

    saveToken();
  }, [email, salonId]);

  const dispatch = useDispatch();

  const barberId = useSelector(
    (state) => state.BarberLoggedInMiddleware?.barberId
  );

  const barberProfile = useSelector(
    (state) => state.BarberLoggedInMiddleware?.entiredata
  );

  // useEffect(() => {
  //   if (barberProfile?.user[0]?.isApproved == false) {
  //     dispatch(connectSalonListAction());
  //   }
  // }, [barberProfile]);

  const truncateText = (text, charecterLimit) => {
    if (text?.length <= charecterLimit) {
      return text;
    }

    let truncatedText = text?.slice(0, charecterLimit);

    return truncatedText + "...";
  };

  const darkMode = useSelector(darkmodeSelector);

  const darkmodeOn = darkMode === "On";

  const connectSalonList = useSelector((state) => state.connectSalonList);

  const {
    loading: connectSalonListLoading,
    resolve: connectSalonListResolve,
    response: connectSalonListResponse,
  } = connectSalonList;

  const [selectedSalonId, setSelectedSalonId] = useState("");

  const [currentSelectedSalon, setCurrentSelectedSalon] = useState({});

  useEffect(() => {
    if (selectedSalonId) {
      const currentSalon = connectSalonListResponse?.find(
        (s) => s.salonId === selectedSalonId
      );
      setCurrentSelectedSalon(currentSalon);
    }
  }, [selectedSalonId]);

  const [selectedServiceList, setSelectedServiceList] = useState([]);
  const [oldSalonServicelist, setOldSalonServiceList] = useState([]);

  useEffect(() => {
    if (selectedSalonId) {
      const selectedSalonServices = connectSalonListResponse.find(
        (s) => s.salonId === selectedSalonId
      )?.services;

      setSelectedServiceList(selectedSalonServices);
      setOldSalonServiceList(selectedSalonServices);
      setBarberSelectedServices([]);
      set_search_salon_query("");
      set_search_salon_drop(false);
    }
  }, [selectedSalonId]);

  const [barberSelectedServices, setBarberSelectedServices] = useState([]);

  const selectServiceHandler = (ser) => {
    setBarberSelectedServices([
      ...barberSelectedServices,
      {
        ...ser,
        barberServiceEWT: Number(ser.serviceEWT),
        serviceEWT: Number(ser.serviceEWT),
      },
    ]);
  };

  // const deleteServiceHandler = (ser) => {

  //   setSelectedServiceList((prev) => {
  //     const updatedArray = oldSalonServicelist.map((service) => {
  //       return service.serviceId === ser.serviceId ? { ...service, serviceEWT: service.serviceEWT } : service
  //     })
  //     return updatedArray
  //   })
  //   setBarberSelectedServices((services) => services.filter((s) => s._id !== ser._id))
  // }

  const deleteServiceHandler = (ser) => {
    setSelectedServiceList((prev) => {
      const updatedArray = prev.map((service) => {
        // Only reset the serviceEWT of the service being deleted
        if (service.serviceId === ser.serviceId) {
          const originalService = oldSalonServicelist.find(
            (oldService) => oldService.serviceId === service.serviceId
          );
          return {
            ...service,
            serviceEWT: originalService?.serviceEWT || service.serviceEWT,
          };
        }
        return service;
      });
      return updatedArray;
    });

    setBarberSelectedServices((services) =>
      services.filter((s) => s._id !== ser._id)
    );
  };

  const handleBarberEwt = (serId, value) => {
    const newValue = value.replace(/[^0-9]/g, "");

    setSelectedServiceList((prev) => {
      const updatedArray = prev.map((service) => {
        return service.serviceId === serId
          ? { ...service, serviceEWT: Number(newValue) }
          : service;
      });
      return updatedArray;
    });

    setBarberSelectedServices((prev) => {
      const updatedArray = prev.map((service) => {
        return service.serviceId === serId
          ? {
              ...service,
              barberServiceEWT: Number(newValue),
              serviceEWT: Number(newValue),
            }
          : service;
      });
      return updatedArray;
    });
  };

  const connectSalonClicked = () => {
    // if (barberSelectedServices.length === 0) {
    //   return toast.error("Please provide a service", {
    //     duration: 3000,
    //     style: {
    //       fontSize: "var(--font-size-2)",
    //       borderRadius: '0.3rem',
    //       background: '#333',
    //       color: '#fff',
    //     },
    //   });
    // }

    const connectSalondata = {
      barberServices: barberSelectedServices,
      email,
      salonId: selectedSalonId,
    };

    dispatch(barberConnectSalonAction(connectSalondata));
  };

  const barberConnectSalon = useSelector((state) => state.barberConnectSalon);

  const {
    loading: barberConnectSalonLoading,
    resolve: barberConnectSalonResolve,
    message: barberConnectSalonMessage,
  } = barberConnectSalon;

  const queuelistcontrollerRef = useRef(new AbortController());

  useEffect(() => {
    if (barberProfile?.user[0]?.isApproved) {
      const controller = new AbortController();
      queuelistcontrollerRef.current = controller;

      dispatch(getBarberQueueListAction(salonId, barberId, controller.signal));

      return () => {
        if (queuelistcontrollerRef.current) {
          queuelistcontrollerRef.current.abort();
        }
      };
    }
  }, [salonId, dispatch]);

  const getBarberQueueList = useSelector((state) => state.getBarberQueueList);

  const {
    loading: getBarberQueueListLoading,
    resolve: getBarberQueueListResolve,
    queueList: BarberQueueList,
  } = getBarberQueueList;

  const [currentDate, setCurrentDate] = useState(new Date());

  const barberDashboardSalonInfoRef = useRef(new AbortController());

  useEffect(() => {
    if (barberProfile?.user[0]?.isApproved && salonId != 0) {
      const controller = new AbortController();
      barberDashboardSalonInfoRef.current = controller;

      dispatch(barberDashboardSalonInfoAction(salonId, controller.signal));

      return () => {
        if (barberDashboardSalonInfoRef.current) {
          barberDashboardSalonInfoRef.current.abort();
        }
      };
    }
  }, [salonId, dispatch, barberProfile]);

  const barberDashboardSalonInfo = useSelector(
    (state) => state.barberDashboardSalonInfo
  );

  const {
    loading: barberDashboardSalonInfoLoading,
    resolve: barberDashboardSalonInfoResolve,
    response: barberDashboardSalonInfoResponse,
  } = barberDashboardSalonInfo;

  //Salon Images

  useEffect(() => {
    if (barberProfile?.user[0]?.isApproved && salonId != 0) {
      dispatch(getAdminSalonImagesAction(salonId));
    }
  }, [salonId, barberProfile]);

  const getAdminSalonImages = useSelector((state) => state.getAdminSalonImages);

  const {
    loading: getAdminSalonImagesLoading,
    resolve: getAdminSalonImagesResolve,
    response: AdminSalonImages,
  } = getAdminSalonImages;

  const [openModal, setOpenModal] = useState(false);

  // console.log(barberConnectSalonMessage)

  const [reportData, setReportData] = useState([]);
  const [todaysAppLoading, setTodaysAppLoading] = useState(false);
  const [todaysApp, setTodaysApp] = useState([]);

  useEffect(() => {
    if (!salonId || !barberId) return; // Ensure salonId and barberId exist before fetching data

    const getAllReports = async () => {
      try {
        const { data } = await api.post(
          "/api/reports/getnewbarberdashboardReports",
          {
            salonId,
            barberId,
          }
        );
        setReportData(data.response);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    const getTodaysAppointment = async () => {
      try {
        setTodaysAppLoading(true);
        const { data } = await api.post(
          "/api/appointments/getAllAppointmentsByBarberForToday",
          {
            salonId,
            barberId,
          }
        );
        setTodaysAppLoading(false);
        setTodaysApp(data.response);
      } catch (error) {
        setTodaysAppLoading(false);
        console.error("Error fetching today's appointments:", error);
      }
    };

    getAllReports();
    getTodaysAppointment();
  }, [salonId, barberId]);

  const adminGetDefaultSalon = useSelector(
    (state) => state.adminGetDefaultSalon
  );

  const {
    loading: adminGetDefaultSalonLoading,
    resolve: adminGetDefaultSalonResolve,
    response: adminGetDefaultSalonResponse,
  } = adminGetDefaultSalon;

  const appointmentReportList = [
    {
      heading: "Total Appointments",
      value: reportData?.appointment?.totalAppointmentHistoryCount,
      percent: reportData?.appointment?.totalAppointmentHistoryPercentage,
    },
    {
      heading: "Served Appointments",
      value: reportData?.appointment?.servedAppointmenthistoryCount,
      percent: reportData?.appointment?.servedAppointmentHistoryPercentage,
    },
    {
      heading: "Canceled Appointments",
      value: reportData?.appointment?.cancelledAppointmentHistoryCount,
      percent: reportData?.appointment?.cancelledAppointmentHistoryPercentage,
    },
  ];

  // React Map logic

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  const [center, setCenter] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  useEffect(() => {
    if (Object.keys(currentSelectedSalon).length > 0) {
      const newCenter = {
        lat: currentSelectedSalon?.location?.coordinates?.latitude,
        lng: currentSelectedSalon?.location?.coordinates?.longitude,
      };

      setCenter(newCenter);
      setMarkerPosition(newCenter);

      if (map) {
        map.panTo(newCenter);
        map.setZoom(17);
      }
    }
  }, [currentSelectedSalon, map]);

  const onLoad = useCallback(
    function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);

      setMap(map);
    },
    [center]
  );

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // // Set marker position to clicked location
    // setMarkerPosition({ lat, lng });
    // setLatitude(lat);
    // setLongitude(lng);
  };

  const [search_salon_query, set_search_salon_query] = useState("");
  const [search_salon_drop, set_search_salon_drop] = useState(false);
  const timeRef = useRef(null);

  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }

    timeRef.current = setTimeout(() => {
      if (barberProfile?.user[0]?.isApproved == false) {
        if (!search_salon_query) return;
        dispatch(connectSalonListAction(search_salon_query));
      }
    }, 2000);

    return () => {
      clearTimeout(timeRef.current);
    };
  }, [search_salon_query, barberProfile]);

  const query_onchange_handler = (e) => {
    set_search_salon_query(e.target.value);
  };

  const remove_query_handler = async () => {
    set_search_salon_query("");
    set_search_salon_drop(false);
    dispatch({ type: "CONNECT_SALON_LIST_RESET" });
    setCurrentSelectedSalon({});
    setSelectedServiceList([]);
    setMarkerPosition(null);
    setOpenMobileModal(false)
  };

  useEffect(() => {
    if (search_salon_query) {
      set_search_salon_drop(true);
    } else {
      set_search_salon_drop(false);
    }
  }, [search_salon_query]);

  const modal_style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "45rem",
    width: "95%",
    maxHeight: "90vh", // ⬅️ required for scroll
    overflow: "scroll", // ⬅️ enable internal scroll
    bgcolor: "var(--bg-primary)",
    border: "0.1rem solid var(--border-primary)",
    boxShadow: 24,
    p: 2,
    overflow: "auto",
  };

  const [openMobileModal, setOpenMobileModal] = useState(false);

  return barberProfile?.user[0]?.isApproved ? (
    <>
      <section className={`${style.dashboard_container}`}>
        <div>
          <div>
            <div>
              <div>
                <p>Today's Appointments</p>
                <p>Total {todaysApp?.totalCount} appointments are available</p>
              </div>

              {todaysAppLoading ? (
                <div className={`${style.barber_loading}`}>
                  <Skeleton
                    count={3}
                    width={"100%"}
                    height={"4rem"}
                    baseColor={"var(--loader-bg-color)"}
                    highlightColor={"var(--loader-highlight-color)"}
                    style={{ marginBottom: "1rem" }}
                  />
                </div>
              ) : todaysApp?.appointments?.length > 0 ? (
                <div>
                  {todaysApp?.appointments?.map((item, index) => {
                    return (
                      <div
                        className={`${style.barber_list_item}`}
                        key={item._id}
                      >
                        <div>
                          <img src={item?.customerProfile?.[0]?.url} alt="" />
                          <div>
                            <p>{item?.customerName ?? ""}</p>
                            <p>{item?.barberName ?? ""}</p>
                          </div>
                        </div>
                        <div>
                          <h4>{item.appointmentDate}</h4>
                          <p>{item.timeSlots}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`${style.barber_error}`}>
                  <p>No appointments available</p>
                </div>
              )}
            </div>

            <div>
              <div>
                <p>Queue Reports</p>
                <p>Queue count of last 7 days</p>
                <h2>{reportData?.queue?.last7daysTotalQueueCount}</h2>
              </div>

              <div className={`${style.queue_report_container}`}>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart
                    width={500}
                    height={300}
                    data={reportData?.queue?.last7daysCount}
                  >
                    <Line
                      type="monotone"
                      dataKey="TotalQueue"
                      stroke="var(--bg-secondary)"
                      strokeWidth={2}
                      dot={{
                        fill: "#fff",
                        stroke: "var(--bg-secondary)",
                        strokeWidth: 2,
                        r: 4,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div>
                <p>Queue History</p>
                <p>
                  <span
                    style={{
                      color:
                        reportData?.queue?.queueTrend === "Rise"
                          ? "#00A36C"
                          : reportData?.queue?.queueTrend === "Fall"
                          ? "rgb(244, 67, 54)"
                          : "",
                    }}
                  >
                    {reportData?.queue?.queueTrend === "Rise"
                      ? "+"
                      : reportData?.queue?.queueTrend === "Fall"
                      ? "-"
                      : ""}
                    {reportData?.queue?.percentageChangelast30Days}%
                  </span>{" "}
                  from last 30 days
                </p>
                <h2>{reportData?.queue?.totalQueueHistoryCount}</h2>
              </div>

              <div className={`${style.queue_history_container}`}>
                <div>
                  <div>
                    <span style={{ background: "#00A36C" }}>
                      {reportData?.queue?.servedHistoryPercentage &&
                        `${reportData?.queue?.servedHistoryPercentage}%`}
                    </span>
                    <p>Served</p>
                  </div>

                  <div>
                    <span style={{ background: "rgb(244, 67, 54)" }}>
                      {reportData?.queue?.cancelledHistoryPercentage &&
                        `${reportData?.queue?.cancelledHistoryPercentage}%`}
                    </span>
                    <p>Canceled</p>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      width: `${reportData?.queue?.servedHistoryPercentage}%`,
                      borderRadius:
                        reportData?.queue?.servedHistoryPercentage === 100 &&
                        "2rem",
                    }}
                  ></div>
                  <div
                    style={{
                      width: `${reportData?.queue?.cancelledHistoryPercentage}%`,
                      borderRadius:
                        reportData?.queue?.cancelledHistoryPercentage === 100 &&
                        "2rem",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <p>Appointments Weekly Reports</p>
                    <p>Last 7 days overview</p>
                  </div>

                  <div>
                    <h1>{reportData?.appointment?.dateFormat}</h1>
                    <p>
                      <span
                        style={{
                          color:
                            reportData?.appointment?.appointmentTrend === "Fall"
                              ? "#f44336"
                              : reportData?.appointment?.appointmentTrend ===
                                "Rise"
                              ? "#00A36C"
                              : "",
                        }}
                      >
                        {reportData?.appointment?.appointmentTrend === "Fall"
                          ? "-"
                          : reportData?.appointment?.appointmentTrend === "Rise"
                          ? "+"
                          : ""}
                        {reportData?.appointment?.percentageChangeLastWeek}%
                      </span>{" "}
                      from last 7 days
                    </p>
                  </div>
                </div>

                <div>
                  {reportData?.appointment?.last7daysCount.length > 0 ? (
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart
                        width={150}
                        height={40}
                        data={reportData?.appointment?.last7daysCount}
                      >
                        <Bar
                          dataKey="TotalAppoinment"
                          fill="var(--bg-secondary)"
                          radius={[3, 3, 3, 3]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p
                      style={{
                        color: "var(--text-primary)",
                        fontSize: "1.6rem",
                        fontFamily: "AirbnbCereal_Medium",
                      }}
                    >
                      No report data available
                    </p>
                  )}
                </div>
              </div>

              <div>
                {appointmentReportList.map((item) => {
                  return (
                    <div
                      key={item.heading}
                      className={`${style.appoint_report_item}`}
                    >
                      <div>
                        <div>
                          <AppointmentIcon />
                        </div>
                        <p>{item.heading}</p>
                      </div>

                      <h2>{item.value}</h2>

                      <div>
                        <div style={{ width: `${item.percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div>
                <p>Queue List</p>
                <p>
                  The current total queue count is {BarberQueueList?.length}
                </p>
              </div>

              {getBarberQueueListLoading ? (
                <div className={`${style.queuelist_loading}`}>
                  <Skeleton
                    count={6}
                    width={"100%"}
                    height={"6rem"}
                    baseColor={"var(--loader-bg-color)"}
                    highlightColor={"var(--loader-highlight-color)"}
                    style={{ marginBottom: "1rem" }}
                  />
                </div>
              ) : getBarberQueueListResolve && BarberQueueList?.length > 0 ? (
                <div>
                  {BarberQueueList?.map((item, index) => {
                    return (
                      <div
                        className={`${style.queue_list_item}`}
                        key={item._id}
                      >
                        <div>
                          <div>
                            <img src={item.customerProfile?.[0]?.url} alt="" />
                          </div>
                          <div>
                            <p>{item.customerName}</p>
                            <p>{item.barberName}</p>
                          </div>
                        </div>

                        <div>
                          <h2>
                            {item?.qPosition === 1 ? "Next" : item?.qPosition}
                          </h2>
                          <p>
                            Est. Time -{" "}
                            {item.customerEWT === 0 ? "" : item.customerEWT}{" "}
                            mins
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`${style.queuelist_error}`}>
                  <p>No queue available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  ) : (
    // <>
    // <div className={`${style.section}`}>
    //   <div>
    //     <h2>Connect to your salon</h2>
    //   </div>

    // {barberProfile?.user[0]?.approvePendingMessage ? (
    //   <div className={`${style.approve_container}`}>
    //     <div>
    //       <p>{barberProfile?.user[0]?.approvePendingMessage}</p>
    //       <button onClick={() => window.location.reload()}>Reload</button>
    //     </div>
    //   </div>
    // ) : (
    //       <div className={`${style.connect_container}`}>
    //         <div>
    //           {connectSalonListLoading ? (
    //             <div>
    //               <Skeleton
    //                 count={4}
    //                 height={"7rem"}
    //                 style={{ marginBottom: "1rem" }}
    //                 baseColor={"var(--loader-bg-color)"}
    //                 highlightColor={"var(--loader-highlight-color)"}
    //               />
    //             </div>
    //           ) : connectSalonListResolve &&
    //             connectSalonListResponse?.length > 0 ? (
    //             <div>
    //               {connectSalonListResponse.map((item) => (
    //                 <div className={`${style.salon_item}`} key={item.salonId}>
    //                   <img src={item?.salonLogo?.[0]?.url} alt={""} />
    //                   <div>
    //                     <p>{item.salonName}</p>
    //                     <p>{item.city}</p>
    //                   </div>

    //                   {selectedSalonId == item.salonId ? (
    //                     <button style={{ background: "green" }}>
    //                       <CheckIcon />
    //                     </button>
    //                   ) : (
    //                     <button
    //                       onClick={() => setSelectedSalonId(item.salonId)}
    //                     >
    //                       +
    //                     </button>
    //                   )}
    //                 </div>
    //               ))}
    //             </div>
    //           ) : (
    //             <div
    //               className={`${style.salon_content_body_error} ${
    //                 darkmodeOn && style.dark
    //               }`}
    //             >
    //               <p>No salons available</p>
    //             </div>
    //           )}

    //           <div
    //             style={{
    //               display: selectedServiceList?.length === 0 ? "none" : "block",
    //               padding: selectedServiceList?.length === 0 ? "0rem" : "1rem",
    //             }}
    //           >
    // {selectedServiceList.map((service) => (
    //   <div key={service.serviceId} className={style.service_item}>
    //     <div>
    //       <div>
    //         <div>
    //           <img src={service?.serviceIcon?.url} alt={""} />
    //         </div>
    //         <div>
    //           <p>{service.serviceName}</p>
    //           <p>{service.vipService ? "VIP" : "Regular"}</p>
    //           <p>{service.serviceDesc}</p>
    //         </div>
    //       </div>
    //       {barberSelectedServices.some(
    //         (b) => b._id === service?._id
    //       ) ? (
    //         <button
    //           style={{
    //             background: "#450a0a",
    //           }}
    //           onClick={() => deleteServiceHandler(service)}
    //         >
    //           Delete
    //         </button>
    //       ) : (
    //         <button
    //           style={{
    //             background: "#052e16",
    //           }}
    //           onClick={() => selectServiceHandler(service)}
    //         >
    //           Add
    //         </button>
    //       )}
    //     </div>
    //     <div>
    //       <div>
    //         <p>Price</p>
    //         <p>
    //           {currentSelectedSalon?.currency}
    //           {service?.servicePrice}
    //         </p>
    //       </div>
    //       <div>
    //         <p>Estimated Time</p>
    //         <div>
    //           <input
    //             type="text"
    //             value={service?.serviceEWT}
    //             onChange={(e) =>
    //               handleBarberEwt(
    //                 service?.serviceId,
    //                 e.target.value
    //               )
    //             }
    //             maxLength={3}
    //           />
    //           <p>mins</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // ))}

    //             {selectedServiceList?.map((service, index) => {
    //               return (
    //                 <div
    //                   className={style.mobile_service_item}
    //                   key={service.serviceId}
    //                 >
    //                   <div>
    //                     <div>
    //                       <div>
    //                         <img src={service?.serviceIcon?.url} alt="" />

    //                         {service.vipService ? (
    //                           <span>
    //                             <CrownIcon />
    //                           </span>
    //                         ) : null}
    //                       </div>

    //                       <p>{service.serviceName}</p>
    //                       <p>{service.serviceDesc}</p>
    //                     </div>

    //                     {barberSelectedServices.some(
    //                       (b) => b._id === service?._id
    //                     ) ? (
    //                       <button
    //                         style={{
    //                           background: "#450a0a",
    //                         }}
    //                         onClick={() => deleteServiceHandler(service)}
    //                       >
    //                         Delete
    //                       </button>
    //                     ) : (
    //                       <button
    //                         style={{
    //                           background: "#052e16",
    //                         }}
    //                         onClick={() => selectServiceHandler(service)}
    //                       >
    //                         Add
    //                       </button>
    //                     )}
    //                   </div>
    //                   <div>
    //                     <div>
    //                       <p>Price</p>
    //                       <p>
    //                         {currentSelectedSalon?.currency}
    //                         {service?.servicePrice}
    //                       </p>
    //                     </div>

    //                     <div>
    //                       <p>Estimated Time</p>
    //                       <div>
    //                         <input
    //                           type="text"
    //                           value={service?.serviceEWT}
    //                           onChange={(e) =>
    //                             handleBarberEwt(
    //                               service?.serviceId,
    //                               e.target.value
    //                             )
    //                           }
    //                           maxLength={3}
    //                         />
    //                         <p>mins</p>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         </div>

    // {barberConnectSalonLoading ? (
    //   <button
    //     style={{
    //       display: "grid",
    //       placeItems: "center",
    //     }}
    //   >
    //     <ButtonLoader />
    //   </button>
    // ) : (
    //   <button onClick={connectSalonClicked}>Connect Salon</button>
    // )}
    //       </div>
    //     )}
    //   </div>
    // </>

    <>
      {barberProfile?.user[0]?.approvePendingMessage ? (
        <div className={`${style.section}`}>
          <div>
            <h2>Connect to your salon</h2>
          </div>
          <div className={`${style.approve_container}`}>
            <div>
              <p>{barberProfile?.user[0]?.approvePendingMessage}</p>
              <button onClick={() => window.location.reload()}>Reload</button>
            </div>
          </div>
        </div>
      ) : (
        <div className={style.map_wrapper_container}>
          <div className={style.map_search_wrapper_container}>
            <div className={style.map_search_container}>
              <div className={style.search_bar}>
                <span className={style.search_icon}>🔍</span>

                <input
                  type="text"
                  placeholder="Search your salon name"
                  className={style.search_input}
                  value={search_salon_query}
                  onChange={(e) => query_onchange_handler(e)}
                />

                <button
                  className={style.clear_btn}
                  onClick={remove_query_handler}
                >
                  ✕
                </button>
              </div>

              {search_salon_drop && (
                <div className={style.map_search_drop_container}>
                  {connectSalonListLoading ? (
                    [0, 1, 2, 3].map((item, index) => {
                      return (
                        <Skeleton
                          key={index}
                          count={1}
                          style={{ width: "100%", height: "4rem" }}
                          baseColor={"var(--loader-bg-color)"}
                          highlightColor={"var(--loader-highlight-color)"}
                        />
                      );
                    })
                  ) : connectSalonListResponse?.length > 0 ? (
                    connectSalonListResponse.map((item) => {
                      return (
                        <div
                          onClick={() => {
                            setSelectedSalonId(item.salonId)
                            setOpenMobileModal(false)
                          }}
                          key={item.salonId}
                          className={style.drop_item}
                        >
                          <img src={item?.salonLogo?.[0]?.url} alt="" />
                          <p>{item?.salonName}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className={style.error_drop_mssg}>No salon available</p>
                  )}
                </div>
              )}
            </div>

            <div className={style.map_data_container}>
              {Object.keys(currentSelectedSalon)?.length > 0 && (
                <div className={style.salon_card}>
                  <div>
                    <div>
                      <p>{currentSelectedSalon?.salonName}</p>
                      <p>{currentSelectedSalon?.salonEmail}</p>
                    </div>

                    <div>
                      <img
                        src={currentSelectedSalon?.salonLogo?.[0]?.url}
                        alt=""
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <div>
                        <SalonType color="var(--text-primary)" />
                      </div>
                      <p>{currentSelectedSalon?.salonType}</p>
                    </div>

                    <div>
                      <div>
                        <AddressIcon color="var(--text-primary)" />
                      </div>
                      <p>
                        {`${currentSelectedSalon?.address}, ${currentSelectedSalon?.city}, ${currentSelectedSalon?.country}`}
                      </p>
                    </div>

                    {currentSelectedSalon?.contactTel && (
                      <div>
                        <div>
                          <ContactTel color="var(--text-primary)" />
                        </div>
                        <a
                          href={`tel:+${
                            currentSelectedSalon?.mobileCountryCode ?? ""
                          }${currentSelectedSalon?.contactTel ?? ""}`}
                          style={{
                            color: "var(--text-primary)",
                            textDecoration: "underline",
                          }}
                        >
                          +{currentSelectedSalon?.mobileCountryCode ?? ""}
                          {currentSelectedSalon?.contactTel ?? ""}
                        </a>
                      </div>
                    )}
                  </div>

                  {barberConnectSalonLoading ? (
                    <button
                      style={{
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <ButtonLoader />
                    </button>
                  ) : (
                    <button onClick={connectSalonClicked}>Connect Salon</button>
                  )}
                </div>
              )}

              {selectedServiceList.map((service) => (
                <div key={service.serviceId} className={style.service_item}>
                  <div>
                    <div>
                      <div>
                        <img src={service?.serviceIcon?.url} alt={""} />
                      </div>
                      <div>
                        <p>{service.serviceName}</p>
                        <p>{service.vipService ? "VIP" : "Regular"}</p>
                        <p>{service.serviceDesc}</p>
                      </div>
                    </div>
                    {barberSelectedServices.some(
                      (b) => b._id === service?._id
                    ) ? (
                      <button
                        style={{
                          background: "#450a0a",
                        }}
                        onClick={() => deleteServiceHandler(service)}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        style={{
                          background: "#052e16",
                        }}
                        onClick={() => selectServiceHandler(service)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                  <div>
                    <div>
                      <p>Price</p>
                      <p>
                        {currentSelectedSalon?.currency}
                        {service?.servicePrice}
                      </p>
                    </div>
                    <div>
                      <p>Estimated Time</p>
                      <div>
                        <input
                          type="text"
                          value={service?.serviceEWT}
                          onChange={(e) =>
                            handleBarberEwt(service?.serviceId, e.target.value)
                          }
                          maxLength={3}
                        />
                        <p>mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {Object.keys(currentSelectedSalon)?.length === 0 && (
                <div className={style.empty_salon_container}>
                  <div>
                    <ShowSalonInfo />
                  </div>
                  <p>Locate your barbershop to join their team</p>
                </div>
              )}
            </div>

            <Modal
              open={openMobileModal}
              onClose={() => setOpenMobileModal(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modal_style} className={style.modal_container}>
                <div className={style.map_data_mobile_container}>
                  {Object.keys(currentSelectedSalon)?.length > 0 && (
                    <div className={style.salon_card}>
                      <div>
                        <div>
                          <p>{currentSelectedSalon?.salonName}</p>
                          <p>{currentSelectedSalon?.salonEmail}</p>
                        </div>

                        <div>
                          <img
                            src={currentSelectedSalon?.salonLogo?.[0]?.url}
                            alt=""
                          />
                        </div>
                      </div>

                      <div>
                        <div>
                          <div>
                            <SalonType color="var(--text-primary)" />
                          </div>
                          <p>{currentSelectedSalon?.salonType}</p>
                        </div>

                        <div>
                          <div>
                            <AddressIcon color="var(--text-primary)" />
                          </div>
                          <p>
                            {`${currentSelectedSalon?.address}, ${currentSelectedSalon?.city}, ${currentSelectedSalon?.country}`}
                          </p>
                        </div>

                        {currentSelectedSalon?.contactTel && (
                          <div>
                            <div>
                              <ContactTel color="var(--text-primary)" />
                            </div>
                            <a
                              href={`tel:+${
                                currentSelectedSalon?.mobileCountryCode ?? ""
                              }${currentSelectedSalon?.contactTel ?? ""}`}
                              style={{
                                color: "var(--text-primary)",
                                textDecoration: "underline",
                              }}
                            >
                              +{currentSelectedSalon?.mobileCountryCode ?? ""}
                              {currentSelectedSalon?.contactTel ?? ""}
                            </a>
                          </div>
                        )}
                      </div>

                      {barberConnectSalonLoading ? (
                        <button
                          style={{
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <ButtonLoader />
                        </button>
                      ) : (
                        <button onClick={connectSalonClicked}>
                          Connect Salon
                        </button>
                      )}
                    </div>
                  )}

                  {selectedServiceList.map((service) => (
                    <div key={service.serviceId} className={style.service_item}>
                      <div>
                        <div>
                          <div>
                            <img src={service?.serviceIcon?.url} alt={""} />
                          </div>
                          <div>
                            <p>{service.serviceName}</p>
                            <p>{service.vipService ? "VIP" : "Regular"}</p>
                            <p>{service.serviceDesc}</p>
                          </div>
                        </div>
                        {barberSelectedServices.some(
                          (b) => b._id === service?._id
                        ) ? (
                          <button
                            style={{
                              background: "#450a0a",
                            }}
                            onClick={() => deleteServiceHandler(service)}
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            style={{
                              background: "#052e16",
                            }}
                            onClick={() => selectServiceHandler(service)}
                          >
                            Add
                          </button>
                        )}
                      </div>
                      <div>
                        <div>
                          <p>Price</p>
                          <p>
                            {currentSelectedSalon?.currency}
                            {service?.servicePrice}
                          </p>
                        </div>
                        <div>
                          <p>Estimated Time</p>
                          <div>
                            <input
                              type="text"
                              value={service?.serviceEWT}
                              onChange={(e) =>
                                handleBarberEwt(
                                  service?.serviceId,
                                  e.target.value
                                )
                              }
                              maxLength={3}
                            />
                            <p>mins</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {Object.keys(currentSelectedSalon)?.length === 0 && (
                    <div className={style.empty_salon_container}>
                      <div>
                        <ShowSalonInfo />
                      </div>
                      <p>Locate your barbershop to join their team</p>
                    </div>
                  )}
                </div>
              </Box>
            </Modal>
          </div>
          <div className={style.map_container}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                }}
                center={center}
                zoom={17}
                onLoad={onLoad}
                onUnmount={onUnmount}
                // onClick={handleMapClick}
                options={{
                  disableDefaultUI: false, // Keep basic controls like zoom
                  streetViewControl: false, // 🚫 Remove Pegman / Street View
                  mapTypeControl: false, // 🚫 Remove Satellite / Terrain switcher
                  fullscreenControl: true, // ✅ Keep fullscreen option if needed
                  zoomControl: true, // ✅ Keep zoom buttons
                }}
              >
                {markerPosition && (
                  <OverlayView
                    position={markerPosition}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transform: "translate(-50%, -100%)",
                      }}
                    >
                      <div
                        style={{
                          width: "5rem",
                          height: "5rem",
                          borderRadius: "0.6rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src="/mapPointer.png"
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: "0.8rem",
                          backgroundColor: "#fff",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "0.4rem",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          fontSize: "1.4rem",
                          fontWeight: "bold",
                          color: "#333",
                          whiteSpace: "nowrap",
                          border: "0.1rem solid #ccc",
                        }}
                      >
                        {currentSelectedSalon?.salonName}
                      </div>
                    </div>
                  </OverlayView>
                )}
              </GoogleMap>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
