const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const createWebpackConfig = require('./create-config')
const { resolveGenesisDependency } = require('../utils/fs')
const log = require('../utils/log')

const createWebpackDevMiddleware = (webpackConfig, opts) => {
  webpackConfig.output.publicPath = `${opts.protocol}://${opts.host}:${opts.port}/`
  webpackConfig.entry.main.unshift(
    resolveGenesisDependency('webpack-hot-middleware/client.js') +
    `?path=${webpackConfig.output.publicPath}__webpack_hmr`
  )
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )

  const webpackCompiler = webpack(webpackConfig)
  const devMiddleware = webpackDevMiddleware(webpackCompiler, {
    lazy: false,
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: 'none',
    watchOptions: {
      ignored: /node_modules/,
    },
  })
  const hotMiddleware = webpackHotMiddleware(webpackCompiler, {
    log: () => {}, // disable logging
  })

  const middleware = [devMiddleware, hotMiddleware]
  if (opts.onCompilerStart) webpackCompiler.plugin('compile', opts.onCompilerStart)
  webpackCompiler.plugin('done', (stats) => {
    const hasErrors = stats.hasErrors()
    const hasWarnings = stats.hasWarnings()

    if (hasErrors) {
      log.error(stats.toString('errors-only'))
      log.error('Compilation encountered errors, see above.')
    } else if (hasWarnings) {
      log.warn(stats.toString())
      log.warn('Compilation finished with warnings, see above.')
    } else {
      const buildTime = stats.endTime - stats.startTime
      log.success(`Compilation finished successfully in ${buildTime} ms`)
    }
  })
  webpackCompiler.plugin('invalid', opts.onChange)
  return middleware
}

const createDevServer = (config, opts) => {
  opts = Object.assign({}, {
    protocol: 'http',
    host: 'localhost',
    port: opts.port || 3000,
    onChange: (file) => {
      printInteractiveMode()
      log.info(`Detected file change: ${chalk.bold(file)}`)
      log.info('Recompiling your project...')
    },
  }, opts)

  const printInteractiveMode = () => {
    log.clear()
    console.log(chalk.green(chalk.bold(
      `Development server running on ${opts.protocol}://${opts.host}:${opts.port}\n`
    )))
  }

  const server = express()
  server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
  server.use(require('connect-history-api-fallback')())
  server.use(createWebpackDevMiddleware(createWebpackConfig(config), opts))
  server.use(express.static(path.resolve(process.cwd(), 'public')))
  server.start = () => new Promise(resolve => {
    server.listen(opts.port, () => {
      printInteractiveMode()
      log.info('Waiting for initial compilation to complete...')
      resolve()
    })
  })

  return server
}

module.exports = createDevServer
