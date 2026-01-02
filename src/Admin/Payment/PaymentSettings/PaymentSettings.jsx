import React, { useState } from "react";
import style from "./PaymentSettings.module.css";

const PaymentSettings = () => {
  const [queueEnabled, setQueueEnabled] = useState(true);
  const [appointmentEnabled, setAppointmentEnabled] = useState(false);

  const [queueAdvance, setQueueAdvance] = useState(20);
  const [appointmentAdvance, setAppointmentAdvance] = useState(30);

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
              onChange={() => setQueueEnabled(!queueEnabled)}
            />
            <span className={style.slider}></span>
          </label>
        </div>

        {queueEnabled && (
          <div className={style.cardBody}>
            <label>Advance Payment (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={queueAdvance}
              onChange={(e) => setQueueAdvance(e.target.value)}
            />
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
              onChange={() => setAppointmentEnabled(!appointmentEnabled)}
            />
            <span className={style.slider}></span>
          </label>
        </div>

        {appointmentEnabled && (
          <div className={style.cardBody}>
            <label>Advance Payment (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={appointmentAdvance}
              onChange={(e) => setAppointmentAdvance(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSettings;
