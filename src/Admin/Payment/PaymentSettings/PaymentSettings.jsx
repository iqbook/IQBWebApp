import React, { useEffect, useState } from "react";
import style from "./PaymentSettings.module.css";
import { useSelector } from "react-redux";
import api from "../../../Redux/api/Api";

const PERCENTAGE_OPTIONS = [10, 20, 30, 50, 100];

const PaymentSettings = () => {
  const salonId = useSelector(
    (state) => state.AdminLoggedInMiddleware.adminSalonId
  );

  const [queueEnabled, setQueueEnabled] = useState(false);
  const [appointmentEnabled, setAppointmentEnabled] = useState(false);

  const [queueAdvance, setQueueAdvance] = useState(20);
  const [appointmentAdvance, setAppointmentAdvance] = useState(30);

  const [fetchPaymentLoading, setFetchPaymentLoading] = useState(false);

  const fetchPaymentSettings = async () => {
    try {
      setFetchPaymentLoading(true);
      const res = await api.get(
        `/api/salon/getPaymentSettings?salonId=${salonId}`
      );

      const settings = res?.data?.response || [];

      settings.forEach((item) => {
        if (item.type === "queue") {
          setQueueEnabled(item.enabled);
          setQueueAdvance(item.advancePaymentPercent);
        }

        if (item.type === "appointment") {
          setAppointmentEnabled(item.enabled);
          setAppointmentAdvance(item.advancePaymentPercent);
        }
      });
    } catch (error) {
      console.error("Failed to fetch payment settings", error);
    } finally {
      setFetchPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (!salonId) return;

    fetchPaymentSettings();
  }, [salonId]);

  const updatePaymentSettings = async ({
    isEnabled,
    type,
    advancePaymentPercent,
  }) => {
    try {
      await api.post("/api/salon/updatePaymentSettings", {
        salonId,
        isEnabled,
        type,
        advancePaymentPercent,
      });

      if (!isEnabled) {
        fetchPaymentSettings();
      }
    } catch (error) {
      console.error("Payment settings update failed", error);
    }
  };

  const handleToggle = async (type, enabled) => {
    if (type === "queue") {
      setQueueEnabled(enabled);
      updatePaymentSettings({
        isEnabled: enabled,
        type,
        advancePaymentPercent: queueAdvance,
      });
    } else {
      setAppointmentEnabled(enabled);
      updatePaymentSettings({
        isEnabled: enabled,
        type,
        advancePaymentPercent: appointmentAdvance,
      });
    }
  };

  const handlePercentageSelect = (type, percent) => {
    if (type === "queue") {
      setQueueAdvance(percent);
      updatePaymentSettings({
        isEnabled: queueEnabled,
        type,
        advancePaymentPercent: percent,
      });
    } else {
      setAppointmentAdvance(percent);
      updatePaymentSettings({
        isEnabled: appointmentEnabled,
        type,
        advancePaymentPercent: percent,
      });
    }
  };

  const renderPercentageList = (type, selected) => (
    <div className={style.percentageList}>
      {PERCENTAGE_OPTIONS.map((percent) => (
        <button
          key={percent}
          className={`${style.percentBtn} ${
            selected === percent ? style.active : ""
          }`}
          onClick={() => handlePercentageSelect(type, percent)}
        >
          {percent}%
        </button>
      ))}
    </div>
  );

  return (
    <div className={style.container}>
      {/* Header */}
      <div className={style.header}>
        <h2>Payment Settings</h2>
        <p>Manage advance payment options for queue and appointments</p>
      </div>

      {/* Queue Payment */}
      <div className={style.card}>
        <div className={style.cardHeader}>
          <div>
            <h3>Queue Payment</h3>
            <p>Collect advance payment for walk-in queue bookings</p>
          </div>

          <label className={style.switch}>
            <input
              type="checkbox"
              checked={queueEnabled}
              onChange={(e) => handleToggle("queue", e.target.checked)}
            />
            <span className={style.slider}></span>
          </label>
        </div>

        {queueEnabled && (
          <div className={style.cardBody}>
            <label>Advance Payment</label>
            {renderPercentageList("queue", queueAdvance)}
          </div>
        )}
      </div>

      {/* Appointment Payment */}
      <div className={style.card}>
        <div className={style.cardHeader}>
          <div>
            <h3>Appointment Payment</h3>
            <p>Collect advance payment for scheduled appointments</p>
          </div>

          <label className={style.switch}>
            <input
              type="checkbox"
              checked={appointmentEnabled}
              onChange={(e) => handleToggle("appointment", e.target.checked)}
            />
            <span className={style.slider}></span>
          </label>
        </div>

        {appointmentEnabled && (
          <div className={style.cardBody}>
            <label>Advance Payment</label>
            {renderPercentageList("appointment", appointmentAdvance)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSettings;
