import React, { useMemo, useState } from "react";
import style from "./ReportList.module.css";
import { useNavigate } from "react-router-dom";
import { BarIcon } from "../../../icons";
import { CustomerIcon } from "../../../newicons";

const TABS = ["All Reports", "Queue", "Appointment", "Staff", "Professional"];

const REPORT_ITEMS = [
  {
    id: 1,
    title: "Performance dashboard appt.",
    headerTitle: "Appointment Performance",
    subTitle: "Daily total payment received by each barber.",
    tag: "Appointment",
    iconType: "bar",
    reportType: "appointmentPerformance",
  },
  {
    id: 2,
    title: "Working Hours Dashboard",
    headerTitle: "Working Hours",
    subTitle: "Amount of busy time per day (service time)",
    tag: "Professional",
    iconType: "bar",
    reportType: "onlinePresence",
  },
  {
    id: 3,
    title: "Queue serve",
    headerTitle: "Queue Served",
    subTitle:
      "General overview of queue trends and patterns, including cancellations and no-shows.",
    tag: "Queue",
    iconType: "bar",
    reportType: "queueServed",
  },
  {
    id: 4,
    title: "Queue cancellations & no-show summary",
    headerTitle: "Queue Cancelled",
    subTitle: "Insight into queue cancellations and no-shows.",
    tag: "Queue",
    iconType: "bar",
    reportType: "queueCancelled",
  },
  {
    id: 5,
    title: "Appointments serve",
    headerTitle: "Appointment Served",
    subTitle:
      "General overview of appointment trends and patterns, including cancellations and no-shows.",
    tag: "Appointment",
    iconType: "bar",
    reportType: "appointmentServed",
  },
  {
    id: 6,
    title: "Appointments cancellations & no-show summary",
    headerTitle: "Appointment Cancelled",
    subTitle: "Insight into appointment cancellations and no-shows.",
    tag: "Appointment",
    iconType: "bar",
    reportType: "appointmentCancelled",
  },
  {
    id: 7,
    title: "Working hours queue",
    headerTitle: "Queue Working Hours",
    subTitle: "Overview of operational hours and productivity",
    tag: "Staff",
    iconType: "customer",
    reportType: "queueWorkingHours",
  },
  {
    id: 8,
    title: "Working hours appointment",
    headerTitle: "Appointment Working Hours",
    subTitle: "Overview of operational hours and productivity",
    tag: "Staff",
    iconType: "customer",
    reportType: "appointmentWorkingHours",
  },
  {
    id: 9,
    title: "Performance dashboard Queue",
    headerTitle: "Queue Performance",
    subTitle: "Daily total payment received by each barber.",
    tag: "Queue",
    iconType: "bar",
    reportType: "queuePerformance",
  },
  {
    id: 10,
    title: "Stylist attendence dashboard",
    headerTitle: "Stylist Attendence",
    subTitle: "Attendence report of stylists",
    tag: "Staff",
    iconType: "bar",
    reportType: "stylistattendence",
  },
];

const renderIcon = (type) => {
  switch (type) {
    case "bar":
      return <BarIcon color="var(--btn-text-color)" />;
    case "customer":
      return <CustomerIcon color="var(--btn-text-color)" />;
    default:
      return null;
  }
};

const ReportList = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("All Reports");

  const filteredReports = useMemo(() => {
    if (selectedTab === "All Reports") return REPORT_ITEMS;
    return REPORT_ITEMS.filter((item) => item.tag === selectedTab);
  }, [selectedTab]);

  return (
    <div className={style.report_section}>
      <div>
      
        <div className={style.report_section_header}>
          {TABS.map((tab) => {
            const isActive = selectedTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                  backgroundColor: isActive
                    ? "var(--bg-secondary)"
                    : "var(--section-bg-color)",
                  color: isActive
                    ? "var(--btn-text-color)"
                    : "var(--text-primary)",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className={style.report_section_container}>
          {filteredReports.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              No reports available
            </p>
          ) : (
            filteredReports.map((item) => (
              <button
                key={item.id}
                className={style.report_section_item}
                onClick={() =>
                  navigate("/admin-reportchart", {
                    state: {
                      reportTypeItem: item,
                      tag: item.tag,
                      upcommingAnalytics: REPORT_ITEMS.filter(
                        (d) => d.tag === item.tag
                      ), 
                    },
                  })
                }
              >
                <div>{renderIcon(item.iconType)}</div>

                <div>
                  <p>{item.title}</p>
                  <p>{item.subTitle}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportList;
