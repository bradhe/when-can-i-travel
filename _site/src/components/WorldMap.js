import React from "react";
import { StaticQuery } from "gatsby";
import {
  Graticule,
  Sphere,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const defaultStyle = {
  default: {
    fill: '#9998A3',
    stroke: '#333'
  },
  hover: {
    fill: '#ff9f00',
    stroke: '#333'
  }
};

const geoUrl = '/topojson-world-110m.json';

const renderGeography = (onClick) => {
  return (geo) => {
    let style = defaultStyle;

    return (
      <Geography
        onClick={() => onClick(geo)}
        key={geo.rsmKey}
        geography={geo}
        style={style} />
    );
  };
};

const findCountry = (data, code) => {
  const countries = data.allCountriesYaml.nodes;
  const filtered = countries.filter((country) => {
    return country.code === code;
  });

  return filtered.length ? filtered[0] : null;
}

const renderMap = ({ onCountryClick }) => {
  return (data) => {
    const projectionConfig = {
      scale: 147,
    };

    const onCountryClickWrapper = (geo) => {
      if (onCountryClick) {
        onCountryClick(findCountry(data, geo.properties.ISO_A2));
      }
    };

    return (
      <ComposableMap projectionConfig={projectionConfig}>
        <Sphere />
        <Graticule />

        <Geographies geography={geoUrl}>
          { ({ geographies }) => geographies.map(renderGeography(onCountryClickWrapper)) }
        </Geographies>
      </ComposableMap>
    );
  };
};

const WorldMap = ({ onCountryClick, ...props }) => {
  return <StaticQuery
    query={graphql`
      query GetCountryPages {
        allMarkdownRemark {
          nodes {
            frontmatter {
              code
            }
          }
        }
        allCountriesYaml {
          nodes {
            name
            code
            slug
          }
        }
      }
    `}
    render={renderMap({ onCountryClick })} />
};

export default WorldMap;
