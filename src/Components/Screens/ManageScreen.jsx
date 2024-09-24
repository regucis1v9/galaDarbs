import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ManageScreens() {
  const months = [
    { name: 'Janvāris', days: 31 },
    { name: 'Februāris', days: 28 }, // Default days for February
    { name: 'Marts', days: 31 },
    { name: 'Aprīlis', days: 30 },
    { name: 'Maijs', days: 31 },
    { name: 'Jūnijs', days: 30 },
    { name: 'Jūlijs', days: 31 },
    { name: 'Augusts', days: 31 },
    { name: 'Septembris', days: 30 },
    { name: 'Oktobris', days: 31 },
    { name: 'Novembris', days: 30 },
    { name: 'Decembris', days: 31 },
  ];

  const isLeapYear = (year) => {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  };

  const currentMonthIndex = new Date().getMonth();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
  const [currentYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState(months[currentMonthIndex].days);
  const [selectedDay, setSelectedDay] = useState(null); // Track the selected day
  const [selectImages, setSelectImages] = useState(false)

  useEffect(() => {
    const updatedDays = isLeapYear(currentYear) && selectedMonthIndex === 1 ? 29 : months[selectedMonthIndex].days;
    setDaysInMonth(updatedDays);
  }, [selectedMonthIndex, currentYear]);

  const handleMonthChange = (event) => {
    setSelectedMonthIndex(Number(event.target.value));
    setSelectedDay(null); // Reset selected day when month changes
  };

  const handleDayClick = (index) => {
    // Toggle the selected day
    setSelectedDay(selectedDay === index ? null : index);
  };
  const openModal= () =>{
    setSelectImages(true);
  }
  const closeModal =() =>{
    setSelectImages(false)
  }
  return (
    <div className="home-content">
      <h1>Calendar</h1>
      <select className='month-selector' value={selectedMonthIndex} onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month.name}
          </option>
        ))}
      </select>
      <div className="calendar">
        {Array.from({ length: daysInMonth }, (_, index) => (
          <div key={index} className="day-wrapper">
            <div className="day" onClick={() => handleDayClick(index)}>
              {index + 1}, 0 files
              <FontAwesomeIcon
                className={`day-icon ${selectedDay === index ? 'rotated' : ''}`}
                icon={faArrowRight}
              />
            </div>
            <div className={`extended-day ${selectedDay === index ? 'height100px' : ''}`}>
                <div className={`extended-day-content ${selectedDay === index ? 'flex' : ''}`}>
                    <button className={`extended-day-button ${selectedDay === index ? 'opacity-full' : ''}`} onClick={openModal}>Pievienot attēlus</button>
                </div>
            </div>
          </div>
        ))}
      </div>
      <div className={`modal ${selectImages === true ? '' : 'none'}`} onClick={closeModal}>
          <div className='image-selector'>
            <h1>Izvēlies attēlus ko pievienot "datums".</h1>
          </div>
      </div>
    </div>
  );
}
