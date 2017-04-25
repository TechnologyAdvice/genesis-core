const webpack = require('webpack')
const debug = require('../utils/debug.util')('genesis:core:create-compiler')

// createDevServer : GenesisConfig -> Object
const createCompiler = (opts) => {
  const webpackConfig = require('../configs/create-webpack-config')(opts)
  const compiler = webpack(webpackConfig)
  debug('Initialized compiler.')

  const compile = () => {
    return new Promise((resolve, reject) => {
      debug('Starting compiler...')
      compiler.run((err, stats) => {
        if (err) {
          debug('Compilation failed.')
          reject(err)
          return
        }
        debug('Compilation complete.')
        resolve(stats)
      })
    })
  }
  return { start: compile }
}

module.exports = createCompiler
