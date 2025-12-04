import React from "react";
import style from "./VersionCheck.module.css";

const VersionCheck = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.card}>
        <div className={style.glow}></div>

        <div className={style.spinnerWrapper}>
          <div className={style.spinner}></div>
        </div>

        <h1 className={style.title}>Checking for Updates</h1>
        <p className={style.subtitle}>
          Ensuring you’re on the latest, fastest version…
        </p>
      </div>
    </div>
  );
};

export default VersionCheck;
