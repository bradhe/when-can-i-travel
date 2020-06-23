import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

const renderFooter = ({ children }) => {
  return (data) => (
    <footer className="container">
      <div className="row">
        <div className="col">
          {children}
        </div>

        <div className="col text-right">
          Current as of {data.currentBuildDate.currentDate}
        </div>
      </div>
    </footer>
  );
};

export default (props) => {
  return (
    <StaticQuery
      query={graphql`
        query {
          currentBuildDate {
            currentDate
          }
        }
      `}
      render={renderFooter(props)} />
  );
};
