import React from 'react'
import classnames from 'classnames';

const getMessage = (status) => {
  switch (status) {
  case "unknown":
      return (<p><strong>Travel status is unknown.</strong> It's unclear if it's a good idea to travel to this country or not yet.</p>);
  case "do_not_travel":
      return (<p><strong>Do not attempt travel to this country yet.</strong> It's probably not a good idea to try to travel to this country yet. Give it some more time.</p>);
  };
};

const getAlertColor = (status) => {
  switch (status) {
  case "unknown":
      return "alert-secondary";
  case "do_not_travel":
      return "alert-warning";
  };

  // This is the default alert I guess.
  return "alert-secondary";
};

const TravelSuggestion = ({ status }) => {
  const className = classnames("alert", getAlertColor(status));  

  return (
    <div className="wcit-travel-suggestion">
      <div className={className}>
        {getMessage(status)}
      </div>
    </div>
  );
};

export default TravelSuggestion;
