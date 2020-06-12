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
        name
        slug
      }
    }
  }
}
`;

const onMapClick = (page) => {
  const { frontmatter } = page;
  const url = `/to/${frontmatter.slug}`;

  navigate(url);
};

const makePath = (page) => `/to/${page.frontmatter.slug}`;

const renderCountryList = (pages) => {
  const children = pages.map((page) => (
    <li key={page.frontmatter.slug}>
      <Link to={makePath(page)}>{page.frontmatter.name}</Link>
    </li>
  ));

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
        {renderCountryList(data.allMarkdownRemark.nodes)}
      </div>
    </div>
  </Layout>
);

export default IndexPage;
