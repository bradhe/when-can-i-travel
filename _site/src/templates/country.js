import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby";

import CountryMap from "../components/CountryMap";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Timeline from "../components/Timeline";
import TravelSuggestion from "../components/TravelSuggestion";

export const query = graphql`
query GetCountryData($countryCode: String) {
  allCountriesYaml(filter: {code: { eq: $countryCode }}) {
    nodes {
      code
      name
      slug
      origin {
        lat
        lon
      }
    }
  }
  allMarkdownRemark(filter: {frontmatter: {code: {eq: $countryCode }}}){
    nodes {
      frontmatter {
        code
        status
        timeline {
          borders_closed_at
          borders_opened_at
        }
      }
      html
    }
  }
}
`;

const assertOneNode = (data) => {
  if (!data.nodes) {
    throw new Error("expected nodes to be present");
  }

  if (data.nodes.length !== 1) {
    throw new Error(`expected nodes length to be 1, was ${data.nodes.length}`);
  }
};

const CountryPage = ({ pageContext, data }) => {
  // there should be only one node here. If there isn't then something went
  // wrong and we should abort the build.
  assertOneNode(data.allCountriesYaml);
  assertOneNode(data.allMarkdownRemark);

  const country = data.allCountriesYaml.nodes[0];

  const { origin } = country;
  const { lat, lon } = origin;

  const page = data.allMarkdownRemark.nodes[0];
  const { timeline } = page.frontmatter;

  const dates = {
    closed: timeline.borders_closed_at,
    opened: timeline.borders_opened_at,
  };

  const footer = <Footer githubLink="https://github.com/bradhe/when-can-i-travel/" />

  return (
    <Layout footer={footer}>
      <div className="row">
        <div className="col">
          <PageTitle>When can I travel to {country.name}?</PageTitle>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <TravelSuggestion status={page.frontmatter.status} />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="wcit-country-visualizations">
            <CountryMap countryCode={pageContext.countryCode} lat={lat} lon={lon} />
            <Timeline dates={dates}/>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <article className="wcit-article" dangerouslySetInnerHTML={{ __html: page.html }} />
        </div>
      </div>
    </Layout>
  )
};

export default CountryPage;
