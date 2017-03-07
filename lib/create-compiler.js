const webpack = require('webpack')
const debug = require('../utils/debug.util')('genesis:core:create-compiler')

// createDevServer : GenesisConfig -> Object
const createCompiler = (opts) => {
  debug('Creating compiler...')

  const webpackConfig = require('../configs/create-webpack-config')(opts)
  const compiler = webpack(webpackConfig)
  const compile = () => {
    return new Promise((resolve, reject) => {
      debug('Starting compiler...')
      compiler.run((err, stats) => {
        if (err) return reject(err)
        resolve(stats)
      })
    })
  }
  return { start: compile }
}

module.exports = createCompiler