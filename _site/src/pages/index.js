import React from "react"
import { graphql, navigate } from "gatsby"

import Layout from "../components/layout"
import Footer from "../components/Footer"
import PageTitle from "../components/PageTitle"
import WorldMap from "../components/WorldMap"
import SEO from "../components/seo"
import CountryList from "../components/CountryList"

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
        <CountryList countries={data.allCountriesYaml.nodes} pages={data.allMarkdownRemark.nodes} />
      </div>
    </div>
  </Layout>
);

export default IndexPage;
