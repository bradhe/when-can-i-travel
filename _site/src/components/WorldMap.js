import React from "react";
import { StaticQuery, graphql } from "gatsby";
import { pathSatisfies, prop, equals, find } from 'ramda';
import {
  Graticule,
  Sphere,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const geoUrl = '/topojson-world-110m.json';

const renderGeography = (onClick) => {
  return (geo, color) => {
    return (
      <Geography
        onClick={() => onClick(geo)}
        key={geo.rsmKey}
        className={`wcit-country-travel-status-${color}`}
        geography={geo} />
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

const findPage = (data, code) => {
  const pages = data.allMarkdownRemark.nodes;
  const filtered = pages.filter((page) => {
    return page.frontmatter.code === code;
  });

  return filtered.length ? filtered[0] : null;
};

const findStatusData = (status, states) => find(pathSatisfies(equals(status), ['code']))(states);

const findStatusLabel = (status, states) => prop('label', findStatusData(status, states));

const findStatusColor = (status, states) => prop('color', findStatusData(status, states));

const findStatusColorForPage = (data, page) => findStatusColor(page.frontmatter.status, data.allCountryStatusYaml.nodes);

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
            { ({ geographies }) => geographies.map(geo => {
              const page = findPage(data, geo.properties.ISO_A2);

              if (page) {
                const color = findStatusColorForPage(data, page);
                return renderGeography(onCountryClickWrapper)(geo, color);
              } else {
                return null
              }
            })}
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
              status
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
        allCountryStatusYaml {
          nodes {
            code
            color
          }
        }
      }
    `}
    render={renderMap({ onCountryClick })} />
};

export default WorldMap;
