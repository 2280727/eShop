/** @type {import('jest').Config} */
module.exports = {
  // Tell Jest we're using ESM
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  // Indicate which paths to transform
  transformIgnorePatterns: [
    // Transform ESM modules that don't work with Jest by default
    "node_modules/(?!(chai|sinon|@sinonjs|uuid)/)"
  ],
  // Setup test environment
  testEnvironment: "node",
  // Use .js for test files
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js$",
  // Use babel to handle imports
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
};

