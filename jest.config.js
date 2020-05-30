module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'packages/**/*.js',
    '!**/node_modules/**'
  ],
  testEnvironment: 'node',
  roots: ['packages'],
  testMatch: ["**/test/*.js"],
  verbose: true
};
