module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    '../CLAUDE.md'
  ],
  verbose: true,
  bail: false,
  testTimeout: 10000
};