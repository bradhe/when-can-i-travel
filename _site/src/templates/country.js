import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby";

import Map from "../components/Map";
import PageTitle from "../components/PageTitle";
import Timeline from "../components/Timeline";

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
          borders_partially_opened_at
          borders_projected_opened_at
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

const Country = ({ pageContext, data }) => {
  // there should be only one node here. If there isn't then something went
  // wrong and we should abort the build.
  assertOneNode(data.allCountriesYaml);
  assertOneNode(data.allMarkdownRemark);

  const country = data.allCountriesYaml.nodes[0];

  const { origin } = country;
  const { lat, lon } = origin;

  const page = data.allMarkdownRemark.nodes[0];
  const { timeline } = page.frontmatter;

  return (
    <Layout>
      <div className="row">
        <div className="col">
          <PageTitle>When can I travel to {country.name}?</PageTitle>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Map countryCode={pageContext.countryCode} lat={lat} lon={lon} />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Timeline>
            <Timeline.Date type="closed" date={timeline.borders_closed_at} />
            <Timeline.Date type="projected-opened" date={timeline.borders_projected_opened_at} />
            <Timeline.Date type="partially-opened" date={timeline.borders_partially_opened_at} />
            <Timeline.Date type="opened" date={timeline.borders_opened_at} />
          </Timeline>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <article dangerouslySetInnerHTML={{ __html: page.html }} />
        </div>
      </div>
    </Layout>
  )
};

export default Country;
