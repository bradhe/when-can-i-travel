import React from "react"
import { Link, graphql, navigate } from "gatsby"

import Layout from "../components/layout"
import PageTitle from "../components/PageTitle"
import WorldMap from "../components/WorldMap"
import Image from "../components/image"
import SEO from "../components/seo"

export const query = graphql`
query {
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
      slug
      continent
      code
    }
  }
}
`;

const onMapClick = (country) => navigate(makePath(country));

const makePath = (country) => `/to/${country.slug}`;

const findCountry = (countries, code) => countries.filter((c) => c.code === code)[0];

const renderCountryList = (pages, countries) => {
  const children = pages.map((page) => {
    const country = findCountry(countries, page.frontmatter.code);

    return (
      <li key={country.slug}>
        <Link to={makePath(country)}>{country.name}</Link>
      </li>
    );
  });

  return <ol>{children}</ol>;
};

const IndexPage = ({ data }) => (
  <Layout>
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
