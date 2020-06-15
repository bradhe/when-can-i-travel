import React from 'react';
import moment from 'moment';
import classnames from 'classnames';

const TIMELINE_START_DATE = moment("2020-01-01T00:00:00Z");
const TIMELINE_END_DATE = moment("2020-12-31T23:59:59Z");

const calcDateOffset = (maxOffset, startAt) => {
  const max = TIMELINE_END_DATE.diff(TIMELINE_START_DATE);
  const current = moment(startAt).diff(TIMELINE_START_DATE);

  return maxOffset * (current / max);
};

const Timeline = ({children }) => {
  const width = 100;
  const height = 13;

  const months = {
    "January": "2020-01-01T00:00:00Z",
    "Februrary": "2020-02-01T00:00:00Z",
    "March": "2020-03-01T00:00:00Z",
    "April": "2020-04-01T00:00:00Z",
    "May": "2020-05-01T00:00:00Z",
    "June": "2020-06-01T00:00:00Z",
    "July": "2020-07-01T00:00:00Z",
    "August": "2020-08-01T00:00:00Z",
    "September": "2020-09-01T00:00:00Z",
    "October": "2020-10-01T00:00:00Z",
    "November": "2020-11-01T00:00:00Z",
    "December": "2020-12-01T00:00:00Z",
  };

    const hashes = Object.keys(months).map((month) => {
      const offset = calcDateOffset(width, months[month]);

      const startAt = moment(months[month]);
      const nextOffset = calcDateOffset(width, startAt.add(1, 'month'));

      return (
        <g key={`month-${month}`} className="wcit-timeline-month-marking">
          <line x1={offset} y1={(height / 2) - 1} x2={offset} y2={(height / 2) + 1} />
          <text x={offset + ((nextOffset - offset) / 2)} y={(height / 2) + 1.5}>{month}</text>
        </g>
      );
    });

  return (
    <svg viewBox="-1 -1 101 14" className="wcit-timeline">
      <g className="wcit-timeline-line">
        <line x1={0} y1={(height / 2) - 1.5} x2={0} y2={(height / 2) + 1.5} />
        <line x1={0} y1={height / 2} x2="100" y2={height / 2} />
        <line x1={100} y1={(height / 2) - 1.5} x2={100} y2={(height / 2) + 1.5} />
      </g>

      {hashes}

      <g>
        {children}
      </g>
    </svg>
  );
};

const getTitle = (type) => {
  switch (type) {
    case "closed":
      return "Borders closed";
    case "opened":
      return "Borders opened";
    case "partially-opened":
      return "Borders partially opened";
    case "projected-opened":
      return "Borders will open";
  }
}

const TimelineDate = ({ type, date }) => {
  // This indicates that we don't want to actually draw anything.
  if (!date || date === '0001-01-01T00:00:00Z') {
    return null;
  }

  const width = 100;
  const height = 13;

  const offset = calcDateOffset(width - 2, date);

  const className = classnames('wcit-timeline-key-date', {
    'wcit-timeline-closed-date': type === 'closed',
    'wcit-timeline-opened-date': type === 'opened',
    'wcit-timeline-projected-opened-date': type === 'projected-opened',
    'wcit-timeline-partially-opened-date': type === 'partially-opened',
  });

  return (
    <g className={className}>
      <line x1={offset} y1={height / 2 - 2} x2={offset} y2={height / 2 + 2} className="wcit-timeline-date" />
      <text x={offset} y={(height / 2) - 2.5}>{getTitle(type)}</text>

    </g>
  );
};

Timeline.Date = TimelineDate;

export default Timeline;
