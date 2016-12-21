import { contains, filter } from 'redash'

// We use a Webpack global here as it is replaced with a string during compile.
// Using a regular JS variable is not statically analyzable so webpack will throw warnings.
const testsContext = require.context(__TESTS_ROOT__, true, __TESTS_PATTERN__)

// Only re-run tests that changed, or all if none did.
// https://www.npmjs.com/package/karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = []
const allFiles = testsContext.keys()
const runnable = filter(path => contains(path, __karmaWebpackManifest__), allFiles)

;(runnable.length ? runnable : allFiles).forEach(testsContext)