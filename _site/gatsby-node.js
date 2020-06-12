/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allCountriesYaml {
        nodes {
          code
        }
      }
    }
  `);

  result.data.allCountriesYaml.nodes.forEach((data) => {
    createPage({
      path: '/to/' + data.code,
      component: path.resolve(`./src/templates/country.js`),
      context: {
        countryCode: data.code,
      },
    });
  });
};
