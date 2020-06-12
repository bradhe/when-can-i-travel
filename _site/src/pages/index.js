import React from "react"
import { navigate } from "gatsby"

import Layout from "../components/layout"
import PageTitle from "../components/PageTitle"
import WorldMap from "../components/WorldMap"
import Image from "../components/image"
import SEO from "../components/seo"

const onMapClick = (page) => {
  const { frontmatter } = page;
  const url = "/to/" + frontmatter.slug;
  navigate(url);
};

const IndexPage = () => (
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
  </Layout>
)

export default IndexPage
