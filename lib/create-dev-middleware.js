const { merge } = require('redash')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const debug = require('../utils/debug.util')('genesis:core:create-dev-middleware')

// createDevServer : GenesisConfig -> Array<ExpressMiddleware>
const createDevServer = (opts) => {
  const resolveProjectPath = p => path.resolve(opts.dir_root, p)

  const webpackConfig = require('../configs/create-webpack-config')(opts)
  const compiler = webpack(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    contentBase: opts.dir_src,
    hot: true,
    lazy: false,
    noInfo: !opts.verbose,
    progress: opts.verbose,
    publicPath: webpackConfig.output.publicPath,
    stats: opts.verbose ? opts.compiler_stats : 'none',
    quiet: !opts.verbose,
  })
  const hotMiddleware = require('webpack-hot-middleware')(compiler)

  return [devMiddleware, hotMiddleware]
}

module.exports = createDevServer