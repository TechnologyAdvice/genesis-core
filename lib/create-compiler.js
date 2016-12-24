const webpack = require('webpack')
const debug = require('debug')('genesis:core:create-compiler')

// createDevServer : GenesisConfig -> () -> Promise<Object>
const createCompiler = (opts) => {
  debug('Creating compiler...')

  const webpackConfig = require('../configs/create-webpack-config')(opts)
  const compiler = webpack(webpackConfig)
  return function compile() {
    return new Promise((resolve, reject) => {
      debug('Starting compiler...')
      compiler.run((err, stats) => {
        if (err) return reject(err)
        resolve(stats)
      })
    })
  }
}

module.exports = createCompiler