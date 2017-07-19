import './jsdom-suite'
import './mocha-suite'

const testsContext = require.context(__TESTS_ROOT__, true, /\.(spec|test)\.(js|ts|tsx)/)
testsContext.keys().forEach(testsContext)
