import React, { useMemo, useState } from "react";
import style from "./ReportList.module.css";
import { BarIcon } from "../../../icons";
import { useNavigate } from "react-router-dom";
import { CustomerIcon } from "../../../newicons";

const TABS = ["All Reports", "Queue", "Appointment", "Staff", "Others"];

const REPORT_ITEMS = [
  {
    id: 1,
    title: "Performance dashboard appt.",
    subTitle: "Daily total payment received by each barber.",
    tag: "Others",
    icon: <BarIcon color="var(--btn-text-color)" />,
  },
  {
    id: 2,
    title: "Online Presence Dashboard",
    subTitle: "Amount of busy time per day (service time)",
    tag: "Others",
    icon: <BarIcon color="var(--btn-text-color)" />,
  },
  {
    id: 3,
    title: "Queue serve",
    subTitle:
      "General overview of queue trends and patterns, including cancellations and no-shows.",
    tag: "Queue",
    icon: <BarIcon color="var(--btn-text-color)" />,
  },
  {
    id: 4,
    title: "Queue cancellations & no-show summary",
    subTitle: "Insight into queue cancellations and no-shows.",
    tag: "Queue",
    icon: <BarIcon color="var(--btn-text-color)" />,
  },
  {
    id: 5,
    title: "Appointments serve",
    subTitle:
      "General overview of appointment trends and patterns, including cancellations and no-shows.",
    tag: "Appointment",
    icon: <BarIcon color="var(--btn-text-color)" />,
  },
  {
    id: 6,
    title: "Appointments cancellations & no-show summary",
    subTitle: "Insight into appointment cancellations and no-shows.",
    tag: "Appointment",
    icon: <BarIcon color="var(--btn-text-color)" />,
  },
  {
    id: 7,
    title: "Attendance summary",
    subTitle:
      "Overview of team members' punctuality and attendance for their shifts",
    tag: "Staff",
    icon: <CustomerIcon color="var(--btn-text-color)" />,
  },
  {
    id: 8,
    title: "Working hours queue",
    subTitle: "Overview of operational hours and productivity",
    tag: "Staff",
    icon: <CustomerIcon color="var(--btn-text-color)" />,
  },
  {
    id: 9,
    title: "Working hours appointment",
    subTitle: "Overview of operational hours and productivity",
    tag: "Staff",
    icon: <CustomerIcon color="var(--btn-text-color)" />,
  },
  {
    id: 10,
    title: "Performance dashboard Queue",
    subTitle: "Daily total payment received by each barber.",
    tag: "Others",
    icon: <BarIcon color="var(--btn-text-color)" />,
  },
];

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
                onClick={() => navigate("/admin-reportchart")}
                className={style.report_section_item}
              >
                <div>{item?.icon}</div>

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
