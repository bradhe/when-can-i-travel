import React from "react"
import { Link, graphql, navigate } from "gatsby"

import Layout from "../components/layout"
import Footer from "../components/Footer"
import PageTitle from "../components/PageTitle"
import WorldMap from "../components/WorldMap"
import SEO from "../components/seo"

export const query = graphql`
query {
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
      slug
      continent
      code
    }
  }
}
`;

const onMapClick = (country) => navigate(makePath(country));

const makePath = (country) => `/to/${country.slug}/`;

const findCountry = (countries, code) => countries.filter((c) => c.code === code)[0];

const regionName = (region) => {
  switch (region) {
  case 'AS':
    return 'Asia';
  case 'AF':
    return 'Africa';
  case 'EU':
    return 'Europe';
  case 'OC':
    return 'Oceania';
  case 'NA':
    return 'North America';
  case 'SA':
    return 'South America';
  };
};

const renderCountryList = (pages, countries) => {
  const rows = pages.map((page) => {
    const country = findCountry(countries, page.frontmatter.code);

    return (
      <tr key={country.slug}>
        <td>
          <Link to={makePath(country)}>{country.name}</Link>
        </td>
        <td>
          {regionName(country.continent)}
        </td>
        <td>
          {page.frontmatter.status}
        </td>
      </tr>
    );
  });

  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th>Country</th>
          <th>Region</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};

const IndexPage = ({ data }) => (
  <Layout footer={<Footer />}>
    <SEO title="Home" />

    <div className="row">
      <div className="col">
        <PageTitle>Where would you like to go?</PageTitle>
      </div>
    </div>

    <div className="row">
      <div className="col">
        <WorldMap onCountryClick={onMapClick} />
      </div>
    </div>

    <div className="row">
      <div className="col">
        {renderCountryList(data.allMarkdownRemark.nodes, data.allCountriesYaml.nodes)}
      </div>
    </div>
  </Layout>
);

export default IndexPage;
