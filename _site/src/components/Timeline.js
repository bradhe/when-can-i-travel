import React from 'react';

const Timeline = ({ children }) => {
  return (
    <span>{children}</span>
  );
};

const TimelineDate = ({ title, date }) => {
  return (
    <span>{title}: {date}</span> 
  );
};

Timeline.Date = TimelineDate;

export default Timeline;
