const path = require('path')
const express = require('express')
const webpack = require('webpack')

const startDevServer = (opts = {}) => {
  const host = opts.server_host || 'localhost'
  const port = opts.server_port || 3000

  const webpackConfig = require('../configs/webpack.config')(opts)

  // modify webpack config to support HMR
  const publicPath = `http://${host}:${port}/`
  webpackConfig.output.publicPath = publicPath
  webpackConfig.entry.app.push(
    `webpack-hot-middleware/client?path=${publicPath}__webpack_hmr`
  )
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
  const compiler = webpack(webpackConfig)

  // Create server
  const app = express()
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: publicPath,
    contentBase: path.resolve(__dirname, '../client/src'),
    hot: true,
    quiet: true,
    noInfo: true,
    lazy: false
  }))
  app.use(require('webpack-hot-middleware')(compiler))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since the contents of directory will be copied
  // into ~/dist when the application is compiled.
  app.use(express.static(path.resolve(__dirname, '../client/public')))
  return new Promise((resolve, reject) => {
    app.listen(port, () => resolve(app))
  })
}

module.exports = startDevServer