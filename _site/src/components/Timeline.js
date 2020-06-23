import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { filter, reduce, minBy } from 'ramda';
import * as d3 from 'd3';

const addNowMarker = (vis, date, scale, width, height, rectHeight) => {
  var now = moment(date).toDate();

  vis.append("line").
    attr('class', 'timeline-date-marker timeline-date-marker-now').
    attr("x1", scale(now)).
    attr("x2", scale(now)).
    attr("y1", 0).
    attr("y2", height);
}

const addMonthMarker = (vis, date, scale, width, height, rectHeight) => {
  var padding = 0;

  var start = moment(date).toDate();
  var end = moment(date).add(1, 'month').subtract(1, 'second').toDate();

  vis.append("line").
    attr('class', 'timeline-date-marker').
    attr("x1", scale(start)).
    attr("x2", scale(start)).
    attr("y1", 0).
    attr("y2", height);

  vis.append('text').
    attr('x', scale(start) + ((scale(end) - scale(start)) / 2)).
    attr('y', (height / 2) + 5).
    attr('class', 'timeline-date-label').
    text(moment(date).format('MMMM'));
}

const addArea = (vis, start, end, scale, width, height, rectHeight, className) => {
  var x = scale(moment(start).toDate());
  var dx = scale(moment(end).toDate());

  vis.append('rect').
    attr('class', 'timeline-date-line ' + className).
    attr('x', x).
    attr('y', (height / 2) - (rectHeight / 2)).
    attr('width', dx - x).
    attr('height', rectHeight);
}

const renderTimeline = (elem, dates) => {
  var width = elem.offsetWidth,
      height = elem.offsetHeight;

  var rectHeight = 35;
  var padding = 0;

  var vis = d3.select(elem).
    append('svg:svg').
    attr('width', width).
    attr('height', height);

  var defs = vis.append('defs');

  defs.append('pattern').
    attr('id', 'pattern-stripe').
    attr('width', 4).
    attr('height', 4).
    attr('patternUnits', 'userSpaceOnUse').
    attr('patternTransform', 'rotate(45)').
      append('rect').
      attr('width', 2).
      attr('height', 4).
      attr('transform', 'translate(0, 0)').
      attr('fill', 'white');

  defs.append('mask').
    attr('id', 'mask-stripe').
    append('rect').
      attr('x', 0).
      attr('y', 0).
      attr('width', '100%').
      attr('height', '100%').
      attr('fill', 'url(#pattern-stripe)');

  var xScale = d3.scaleTime().
    domain([moment('2020-01-01').toDate(), moment('2020-12-31').toDate()]).
    range([1, width]);

  var timeline = vis.append('g');
  addArea(timeline, "2020-01-01", dates.closed, xScale, width, height, rectHeight);

  var now = moment();

  if (dates.opened) {
    var opened = moment(dates.opened);

    if (opened.isBefore(now)) {
      addArea(timeline, dates.closed, opened, xScale, width, height, rectHeight, 'timeline-date-line-is-closed');
      addArea(timeline, opened, '2020-12-31T00:00:00Z', xScale, width, height, rectHeight, 'timeline-date-line-opened');
    } else {
      addArea(timeline, dates.closed, now, xScale, width, height, rectHeight, 'timeline-date-line-is-closed');
      addArea(timeline, now, opened, xScale, width, height, rectHeight, 'timeline-date-line-projected-to-open');
      addArea(timeline, opened, '2020-12-31T00:00:00Z', xScale, width, height, rectHeight, 'timeline-date-line-projected-opened');
    }

  } else {
    addArea(timeline, dates.closed, now, xScale, width, height, rectHeight, 'timeline-date-line-is-closed');
    addArea(timeline, now, '2020-12-31T23:59:59Z', xScale, width, height, rectHeight, 'timeline-date-line-projected-closed');
  }

  var markers = vis.append('g');

  addNowMarker(markers, now, xScale, width, height, rectHeight);

  for (var i = 1; i <= 12; i++) {
    addMonthMarker(markers, "2020-"+i+"-01", xScale, width, height, rectHeight);
  }
};

const formatDate = (d) => moment(d).utc().format("MMMM Do");

const parseDate = (d) => d && d !== '0001-01-01T00:00:00Z' && moment(d);

const getDescription = (dates) => {
  const closed = parseDate(dates.closed);
  const opened = parseDate(dates.opened);

  // If all we know is that they are closed...
  if (!closed && !opened) {
    return <p className="wcit-timeline-description-text">Actually, we have no idea what's going on in this country.</p>
  } else if (closed && !opened) {
    return <p className="wcit-timeline-description-text">As of {formatDate(closed)} borders are closed to tourists. It is not known when they will open again.</p>;
  } else {
    if (opened.isBefore(moment())) {
      return <p className="wcit-timeline-description-text">Borders closed on {formatDate(closed)} but have reopened as of {formatDate(opened)}.</p>;
    } else {
      return <p className="wcit-timeline-description-text">Borders closed on {formatDate(closed)} and are projected to reopen on {formatDate(opened)}.</p>;
    }
  }
};

class Timeline extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { container } = this.refs;
    const { dates } = this.props;

    this.renderFunc = () => {
      container.innerHTML = '';
      renderTimeline(container, dates);
    };

    window.addEventListener("resize", this.renderFunc);

    this.renderFunc();
  }

  componentWillUnmount() {
    if (this.renderFunc) {
      window.removeEventListener("resize", this.renderFunc);
    }
  }

  render() {
    return (
      <div className="wcit-timeline-container">
        <div className="wcit-timeline" ref="container" />
        <div className="wcit-timeline-description">
          {getDescription(this.props.dates)}
        </div>
      </div>
    );
  }
};

export default Timeline;
