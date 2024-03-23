// components/Calendar.js

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyCalendar = ({ handleDate, date }) => {
    
    return (
        <Calendar
            onChange={handleDate}
            value={date}
        />
    );
};

export default MyCalendar;
