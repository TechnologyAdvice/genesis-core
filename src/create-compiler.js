const path = require('path')
const log = require('./utils/log')
const createConfig = require('./create-config')

const createCompiler = (overrides) => {
  const config = createConfig(overrides)

  return {
    build (opts = {}) {
      opts = Object.assign({
        out: path.resolve(process.cwd(), 'dist'),
      }, opts)
      opts.optimize = true

      const webpackCompiler = require('./webpack/create-compiler')(config, opts)
      return webpackCompiler.start()
    },

    start (opts = {}) {
      log.clear()
      const server = require('./webpack/create-dev-server')(config, opts)
      return server.start()
    },

    test (opts = {}) {
      const jest = require('./jest/create-runner')(config)
      return opts.watch ? jest.watch() : jest.start()
    }
  }
}

module.exports = createCompiler
