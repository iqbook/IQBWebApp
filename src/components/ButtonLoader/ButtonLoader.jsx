import React from "react";
import style from "./ButtonLoader.module.css";

const ButtonLoader = ({ color = "var(--btn-text-color)" }) => {
  return (
    <div
      className={style.btn_loader}
      style={{ border: `2px solid ${color}` }}
    ></div>
  );
};

export default ButtonLoader;
