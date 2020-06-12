/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query GetCountryPages {
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
  `);

  const pages = result.data.allMarkdownRemark.nodes;

  pages.forEach((page) => {
    const { frontmatter } = page;

    createPage({
      path: '/to/' + frontmatter.slug,
      component: path.resolve(`./src/templates/country.js`),
      context: {
        slug: frontmatter.slug,
        countryName: frontmatter.name,
        countryCode: frontmatter.code,
      },
    });
  });
};
