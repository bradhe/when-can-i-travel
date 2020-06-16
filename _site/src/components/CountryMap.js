import React from "react";
import {
  Graticule,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const highlightedStyle = {
  default: {
    fill: '#6C9CB4',
    stroke: '#517c91',
    strokeWidth: 2,
  },
  hover: {
    fill: '#6C9CB4',
    stroke: '#517c91',
    strokeWidth: 2,
  },
  pressed: {
    fill: '#6C9CB4',
    stroke: '#517c91',
    strokeWidth: 2,
  }
};

const defaultStyle = {
  default: {
    fill: '#E2E1E2',
    stroke: '#bfbfbf',
    strokeWidth: 2,
  },
  hover: {
    fill: '#E2E1E2',
    stroke: '#bfbfbf',
    strokeWidth: 2,
  },
  pressed: {
    fill: '#E2E1E2',
    stroke: '#bfbfbf',
    strokeWidth: 2,
  }
};

const geoUrl = '/topojson-world-110m.json';

const renderGeography = (countryCode) => {
  return (geo) => {
    let style = null;

    if (countryCode === geo.properties.ISO_A2) {
      style = highlightedStyle;
    } else {
      style = defaultStyle;
    };

    return (
      <Geography
        key={geo.rsmKey}
        geography={geo}
        style={style} />
    );
  };
};

const Map = ({ countryCode, lat, lon, ...props }) => {
  return (
    <div className="wcit-country-map">
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-lon, -lat, 0], scale: 700 }} width="1100" height="250">
        <Graticule stroke="#E2E1E2" />
        <Geographies geography={geoUrl}>
          { ({ geographies }) => geographies.map(renderGeography(countryCode)) }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default Map;
