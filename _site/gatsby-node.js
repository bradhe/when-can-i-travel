/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

const findCountry = (data, code) => data.filter((row) => row.code === code)[0];

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query GetCountryPages {
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
          code
        }
      }
    }
  `);

  const pages = result.data.allMarkdownRemark.nodes;

  const countries = result.data.allCountriesYaml.nodes;

  pages.forEach((page) => {
    const country = findCountry(countries, page.frontmatter.code);

    createPage({
      path: '/to/' + country.slug,
      component: path.resolve(`./src/templates/country.js`),
      context: {
        slug: country.slug,
        countryName: country.name,
        countryCode: country.code,
      },
    });
  });
};

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
      type MarkdownRemarkFrontmatterTimeline implements Node @dontInfer {
        borders_closed_at: Date
        borders_opened_at: Date
      }
      type MarkdownRemarkFrontmatter implements Node @dontInfer {
        code: String
        status: String
        timeline: MarkdownRemarkFrontmatterTimeline
      }
    `
    createTypes(typeDefs)
}
