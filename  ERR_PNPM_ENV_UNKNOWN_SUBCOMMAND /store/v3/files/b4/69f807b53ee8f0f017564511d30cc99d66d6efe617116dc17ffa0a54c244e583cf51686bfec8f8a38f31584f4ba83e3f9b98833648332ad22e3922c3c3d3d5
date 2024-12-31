/* tslint:disable */
const fs = require("fs");
const path = require("path");
const schema = require("./styleguide/schema.json");

module.exports = {
  components: "src/**/*.tsx",
  propsParser: require("react-docgen-typescript").parse,
  require: [
    path.join(__dirname, "../styles/build/prima.css"),
    path.join(__dirname, "styleguide/globals.js")
  ],
  title: "Prima Pattern Library",
  webpackConfig: require("react-scripts-ts/config/webpack.config.dev"),
  skipComponentsWithoutExample: true
};
