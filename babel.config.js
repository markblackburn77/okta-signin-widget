// Used by babel-jest
const presets = [
  '@babel/preset-typescript',
  '@babel/preset-env'
];
const plugins = [
  '@babel/plugin-transform-runtime',
  './packages/@okta/babel-plugin-handlebars-inline-precompile',
];

module.exports = { presets, plugins };