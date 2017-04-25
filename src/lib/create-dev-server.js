const { merge } = require('halcyon')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const debug = require('../utils/debug.util')('genesis:core:create-dev-server')

// createDevServer : GenesisConfig -> Server
const createDevServer = (opts) => {
  debug('Creating development server...')

  const app = express()
  app.use(require('connect-history-api-fallback')({ verbose: false }))
  app.use(require('./create-dev-middleware')(opts))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since the contents of directory will be copied
  // into ~/dist when the application is compiled.
  app.use(express.static(path.resolve(opts.dir_root, 'public')))
  app.start = () => new Promise((resolve, reject) => {
    app.listen(opts.server_port, () => {
      debug(`Listening at http://localhost:${opts.server_port}.`)
      resolve(app)
    })
  })
  return app
}

module.exports = createDevServer
