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
    console.log('* generating page for ', page.frontmatter.code);

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
