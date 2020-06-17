import React from "react";
import { StaticQuery, graphql } from "gatsby";
import {
  Graticule,
  Sphere,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const defaultStyle = {
  default: {
    fill: '#E2E1E2',
    stroke: '#bfbfbf',
  },
  hover: {
    fill: '#6C9CB4',
    stroke: '#517c91',
  },
  pressed: {
    fill: '#6C9CB4',
    stroke: '#517c91',
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
      <div className="wcit-world-map">
        <ComposableMap projectionConfig={projectionConfig} width="800" height="390">
          <Sphere />
          <Graticule stroke="#E2E1E2" />

          <Geographies geography={geoUrl}>
            { ({ geographies }) => geographies.map(renderGeography(onCountryClickWrapper)) }
          </Geographies>
        </ComposableMap>
        <p className="text-center figure-caption">Click on a country to learn more.</p>
      </div>
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
