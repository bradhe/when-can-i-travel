import React from "react"
import Layout from "../components/layout"
import { useStaticQuery, graphql } from "gatsby";
import Map from "../components/Map"

export const query = graphql`
query GetCountryData($countryCode: String) {
  allCountriesYaml(filter: {code: { eq: $countryCode }}) {
    nodes {
      code
      name
      origin {
        lat
        lon
      }
    }
  }
}
`;

const assertOneNode = (data) => {
  if (!data.nodes) {
    throw "expected nodes to be present";
  }

  if (data.nodes.length != 1) {
    throw `expected nodes length to be 1, was ${data.nodes.length} `;
  }
};

const Country = ({ pageContext, data }) => {
  // there should be only one node here. If there isn't then something went
  // wrong and we should abort the build.
  assertOneNode(data.allCountriesYaml);

  const country = data.allCountriesYaml.nodes[0];

  const { origin } = country;
  const { lat, lon } = origin;

  return (
    <Layout>
      <div>
        <Map countryCode={pageContext.countryCode} lat={lat} lon={lon} />
      </div>
    </Layout>
  )
};

export default Country;
