import { startOfMonth, endOfMonth, differenceInDays, format, sub, add, setDate } from 'date-fns';
import React, { useState } from 'react';
import "./Calender.css";
import Cell from './Cell';
import { darkmodeSelector } from '../../../Redux/Admin/Reducers/AdminHeaderReducer';
import { useSelector } from 'react-redux';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calender = ({ value, setCurrentDate }) => {
  const [initialActiveDate, setInitialActiveDate] = useState(value.getDate());

  const startDate = startOfMonth(value);
  const endDate = endOfMonth(value);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  const prevMonth = () => setCurrentDate(sub(value, { months: 1 }));
  const nextMonth = () => setCurrentDate(add(value, { months: 1 }));

  const handleClickDate = (index) => {
    const date = setDate(value, index);
    setCurrentDate(date);

    // Update initial active date only if it's the first time
    if (index !== initialActiveDate) {
      setInitialActiveDate(initialActiveDate);
    }
  };

  const daysInNextMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate(); // Days in next month

  const darkMode = useSelector(darkmodeSelector);
  const darkmodeOn = darkMode === "On";

  return (
    <div className='calender-box'>
      <div className={`calender-header ${darkmodeOn && "dark"}`}>
        <Cell>{format(value, "LLLL yyyy")}</Cell>
        <Cell onClick={prevMonth}>{"<"}</Cell>
        <Cell onClick={nextMonth}>{">"}</Cell>

        {daysOfWeek.map((day) => (
          <Cell key={day}>{day}</Cell>
        ))}

        {Array.from({ length: prefixDays }).map((_, index) => (
          <Cell key={index} />
        ))}

        {Array.from({ length: numDays }).map((_, index) => {
          const date = index + 1;
          const isCurrentDate = date === value.getDate();
          const isInitialActiveDate = date === initialActiveDate;

          return (
            <Cell
              key={date}
              isActive={isCurrentDate}
              isInitialActive={isInitialActiveDate}
              onClick={() => handleClickDate(date)}
            >
              {date}
            </Cell>
          );
        })}

        {Array.from({ length: suffixDays }).map((_, index) => {
          const date = index + 1;
          return (
            <Cell
              key={date}
              className="next-month">
              {date <= daysInNextMonth ? date : ''}
            </Cell>
          );
        })}
      </div>
    </div>
  );
}

export default Calender;

