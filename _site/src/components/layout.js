/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Footer from "./Footer"

// We import this here because it has the global layout for everything.
import "../styles/site.scss"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const footer = children.filter(c => c.type === Footer);
  const notFooter = children.filter(c => c.type !== Footer);

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />

      <div className="app-root">
        <main className="container">
          {notFooter}
        </main>
      </div>

      {footer}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
