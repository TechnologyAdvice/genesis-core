const webpack = require('webpack')
const debug = require('debug')('genesis:core:create-compiler')
const createProjectConfig = require('../configs/create-project-config')

// createDevServer : GenesisConfig -> () -> Promise<Object>
const createCompiler = (opts) => {
  debug('Creating compiler...')
  opts = createProjectConfig(opts)

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