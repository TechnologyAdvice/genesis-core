const debug = require('debug')('genesis:core:create-test-runner')
const karma = require('karma')
const webpack = require('webpack')
const createProjectConfig = require('../configs/create-project-config')
const createKarmaConfig = require('../configs/create-karma-config')

// createTestRunner : GenesisConfig -> () -> Promise
const createTestRunner = (opts) => {
  debug('Creating test runner...')
  opts = createProjectConfig(opts)

  const config = createKarmaConfig(opts)
  return function startTestRunner() {
    return new Promise((resolve, reject) => {
      const server = new karma.Server(config, code => {
        if (code === 0) resolve(server)
        else reject(code)
      })

      server.start()
    })
  }
}

module.exports = createTestRunner