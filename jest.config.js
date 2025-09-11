// jest.config.js
module.exports = {
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(@babel|babel-jest)/)',
    '\\.pnp\\.[^/+\\+]$',
  ],
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
};
