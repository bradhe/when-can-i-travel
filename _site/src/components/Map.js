import React from "react";
import {
  Graticule,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const highlightedStyle = {
  default: {
    fill: '#ff9f00'
  },
  hover: {
    fill: '#ff9f00'
  }
};

const defaultStyle = {
  default: {
    fill: '#9998A3',
    stroke: '#333'
  },
  hover: {
    fill: '#9998A3',
    stroke: '#333'
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
    <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-lon, -lat, 0], scale: 700 }}>
      <Graticule />
      <Geographies geography={geoUrl}>
        { ({ geographies }) => geographies.map(renderGeography(countryCode)) }
      </Geographies>
    </ComposableMap>
  );
};

export default Map;
