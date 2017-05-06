import { ICompilerConfig } from '../../lib/compiler'
import * as path from 'path'
import * as express from 'express'
import * as webpack from 'webpack'
import * as chalk from 'chalk'
import * as webpackDevMiddleware from 'webpack-dev-middleware'
import * as webpackHotMiddleware from 'webpack-hot-middleware'
import createWebpackConfig from './create-webpack-config'
import { findGenesisDependency } from '../../utils/paths'
import * as logger from '../../utils/logger'

const onCompilerRestart = () => {
  logger.info('Change detected, starting compiler...')
}
const onCompilerDone = (stats) => {
  const hasErrors = stats.hasErrors()
  const hasWarnings = stats.hasWarnings()

  if (hasErrors) {
    logger.error(stats.toString('errors-only'))
    logger.error('Compilation failed, see errors above.')
  } else if (hasWarnings) {
    logger.warn(stats.toString('errors-only'))
    logger.warn('Compilation finished with warnings, see above.')
  } else {
    const buildTime = (stats.endTime - stats.startTime)
    logger.success(`Compilation succeeded in ${buildTime}ms`)
  }
}

export type Middleware = any
export type CreateDevMiddlewareOpts = {
  protocol: string,
  host: string,
  port: number,
  contentBase: string,
  onCompile: (stats: any) => any,
}
export const createDevMiddleware = (webpackConfig, opts: CreateDevMiddlewareOpts): Array<Middleware> => {
  webpackConfig.output.publicPath = `${opts.protocol}://${opts.host}:${opts.port}/`
    webpackConfig.entry.main.push(
      findGenesisDependency('webpack-hot-middleware/client.js') +
      `?path=${webpackConfig.output.publicPath}__webpack_hmr`
    )
    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    )

  const webpackCompiler = webpack(webpackConfig)
  const devMiddleware = webpackDevMiddleware(webpackCompiler, {
    contentBase: opts.contentBase,
    hot: true,
    lazy: false,
    noInfo: true,
    progress: false,
    timings: false,
    publicPath: webpackConfig.output.publicPath,
    stats: 'none',
  })
  const hotMiddleware = webpackHotMiddleware(webpackCompiler, {
    log: null,
  })

  const middleware = [devMiddleware, hotMiddleware]
  webpackCompiler.plugin('done', onCompilerDone)
  webpackCompiler.plugin('compile', onCompilerRestart)
  return middleware
}

export interface DevServerOpts {
  protocol: string,
  host: string,
  port: number,
}
class DevServer {
  _server: any

  constructor (config: ICompilerConfig, overrides?: Partial<DevServerOpts>) {
    const opts = Object.assign({
      protocol: 'http',
      host: 'localhost',
      port: 3000,
      contentBase: path.resolve(config.basePath, config.srcDir),
    }, overrides)

    this._server = express()
    this._server.use(require('connect-history-api-fallback')())
    this._server.use(createDevMiddleware(createWebpackConfig(config), {
      ...opts,
      onCompile: (stats) => {
        const hasErrors = stats.hasErrors()
        const hasWarnings = stats.hasWarnings()

        if (hasErrors) {
          logger.error(stats.toString('errors-only'))
          logger.error('Compilation failed, see errors above.')
        } else if (hasWarnings) {
          logger.warn(stats.toString('errors-only'))
          logger.warn('Compilation finished with warnings, see above.')
        } else {
          const buildTime = (stats.endTime - stats.startTime)
          logger.success(`Compilation succeeded in ${buildTime}ms`)
        }
      }
    }))
    this._server.use(express.static(path.resolve(config.basePath, 'public')))
    this._server.start = () => new Promise(resolve => {
      this._server.listen(opts.port, () => {
        logger.info(chalk.bold(`Development server running at http://localhost:${opts.port}.`))
        resolve()
      })
    })
  }

  start () {
    return this._server.start()
  }
}

export default DevServer
