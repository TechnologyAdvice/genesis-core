const debug = require('../utils/debug.util')('genesis:core:create-test-runner')
const karma = require('karma')
const webpack = require('webpack')
const createKarmaConfig = require('../configs/create-karma-config')

// createTestRunner : GenesisConfig -> Object
const createTestRunner = (opts) => {
  debug('Creating test runner...')

  const config = createKarmaConfig(opts)
  function startTestRunner() {
    debug('Starting test runner...')
    return new Promise((resolve, reject) => {
      const server = new karma.Server(config, code => {
        if (code !== 0) {
          debug('Test runner initialization failed.')
          reject(code)
          return
        }
        debug('Test runner started successfully.')
        resolve(server)
      })

      server.start()
    })
  }
  return { start: startTestRunner }
}

module.exports = createTestRunner
