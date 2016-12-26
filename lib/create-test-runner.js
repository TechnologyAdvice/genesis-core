const debug = require('debug')('genesis:core:create-test-runner')
const karma = require('karma')
const webpack = require('webpack')
const createKarmaConfig = require('../configs/create-karma-config')

// createTestRunner : GenesisConfig -> () -> Promise
const createTestRunner = (opts) => {
  debug('Creating test runner...')

  const config = createKarmaConfig(opts)
  function startTestRunner() {
    return new Promise((resolve, reject) => {
      const server = new karma.Server(config, code => {
        if (code === 0) resolve(server)
        else reject(code)
      })

      server.start()
    })
  }
  return { start: startTestRunner }
}

module.exports = createTestRunner