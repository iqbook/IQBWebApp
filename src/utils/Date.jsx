import React from "react";

// Utility function to get today's date
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Rename the component to avoid conflicts
const DateComponent = () => {
  return <div>Current Date: {getCurrentDate()}</div>;
};

export { getCurrentDate }; // Export the utility function
export default DateComponent;
