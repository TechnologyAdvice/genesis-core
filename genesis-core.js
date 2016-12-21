exports.createCompiler = (...args) =>
  require('./lib/create-compiler')(...args)

exports.createDevServer = (...args) =>
  require('./lib/create-dev-server')(...args)

exports.createTestRunner = (...args) =>
  require('./lib/create-test-runner')(...args)
