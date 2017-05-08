// We use a Webpack global here as it is replaced with a string during compile.
// Using a regular JS variable is not statically analyzable so webpack will throw warnings.
const testsContext = require.context(__TESTS_ROOT__, true, __TESTS_PATTERN__)

// When a test file changes, only rerun that spec file. If something outside of a
// test file changed, rerun all tests.
// https://www.npmjs.com/package/karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = []
const allTests = testsContext.keys()
const changedTests = allTests.filter(path => {
  return __karmaWebpackManifest__.indexOf(path) !== -1
})

;(changedTests.length ? changedTests : allTests).forEach(testsContext)
