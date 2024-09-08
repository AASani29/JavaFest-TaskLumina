import React, { useEffect, useState } from 'react';
import '../CSS Files/MiniCalendar.css';

const MiniCalendar = () => {
  const [dateInfo, setDateInfo] = useState({
    month: '',
    weekday: '',
    date: '',
    year: ''
  });

  useEffect(() => {
    const date = new Date();
    setDateInfo({
      month: date.toLocaleString("en", { month: "long" }),
      weekday: date.toLocaleString('en', { weekday: 'long' }),
      date: date.getDate(),
      year: date.getFullYear()
    });
  }, []);

  return (
    <div id="calendar">
      <h2 id="month">{dateInfo.month}</h2>
      
      <p id="date">{dateInfo.date}</p>
      <p id="weekday">{dateInfo.weekday}</p>
    </div>
  );
};

export default MiniCalendar;
