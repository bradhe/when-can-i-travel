import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby";
import { prop } from 'ramda';

import CountryMap from "../components/CountryMap";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Timeline from "../components/Timeline";
import TravelSuggestion from "../components/TravelSuggestion";
import GithubLink from "../components/GithubLink";
import SEO from "../components/seo";

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
      fileAbsolutePath
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

const makeRepoPath = (absolutePath) => {
  const segments = absolutePath.split("/");
  return segments[segments.length - 2] + "/" + segments[segments.length - 1];
}

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
    closed: prop('borders_closed_at', timeline),
    opened: prop('borders_opened_at', timeline),
  };

  return (
    <Layout>
      <SEO
        title={`When can I travel to ${country.name}?`}
        description={`Currated, expert information information on travel and tourism to ${country.name} in age of COVID-19.`}
      />

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
      <Footer>
        <GithubLink repoPath={makeRepoPath(page.fileAbsolutePath)} />
      </Footer>
    </Layout>
  )
};

export default CountryPage;
