const resolveConfig = require('./configs/create-project-config')

exports.compile = (opts) =>
  require('./lib/create-compiler')(resolveConfig(opts)).start()

exports.dev = (opts) =>
  require('./lib/create-dev-server')(resolveConfig(opts)).start()

exports.test = (opts) =>
  require('./lib/create-test-runner')(resolveConfig(opts)).start()
