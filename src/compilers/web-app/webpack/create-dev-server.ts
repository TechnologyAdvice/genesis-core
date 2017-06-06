import { ICompilerConfig } from '../../../lib/compiler'
import * as path from 'path'
import * as express from 'express'
import * as chalk from 'chalk'
import createWebpackConfig from './create-config'
import createDevMiddleware, { CreateDevMiddlewareOpts } from './create-dev-middleware'
import * as logger from '../../../utils/logger'

export interface DevServerOpts {
  protocol: string,
  host: string,
  port: number,
}
class DevServer {
  _server: any

  constructor (config: ICompilerConfig, overrides?: Partial<DevServerOpts>) {
    const defaults: CreateDevMiddlewareOpts = {
      protocol: 'http',
      host: 'localhost',
      port: 3000,
      contentBase: path.resolve(config.basePath, config.srcDir),
      onCompilerFinish: this._onCompilerFinish.bind(this),
      onCompilerStart: this._onCompilerStart.bind(this),
    }
    const opts: CreateDevMiddlewareOpts = Object.assign(defaults, overrides)

    this._server = express()
    this._server.use(require('connect-history-api-fallback')())
    this._server.use(createDevMiddleware(createWebpackConfig(config), opts))
    this._server.use(express.static(path.resolve(config.basePath, 'public')))
    this._server.start = () => new Promise(resolve => {
      this._server.listen(opts.port, opts.host, () => {
        logger.info(chalk.bold(`Development server started on http://${opts.host}:${opts.port}.`))
        logger.info('Starting compiler...')
        resolve()
      })
    })
  }

  _onCompilerStart () {
    logger.info('Change detected, recompiling...')
  }

  _onCompilerFinish (stats: any) {
    const hasErrors = stats.hasErrors()
    const hasWarnings = stats.hasWarnings()

    if (hasErrors) {
      logger.error(stats.toString('errors-only'))
      logger.error('Compilation failed, see errors above.')
    } else if (hasWarnings) {
      logger.warn(stats.toString('errors-only'))
      logger.warn('Compilation finished with warnings, see above.')
    } else {
      const buildTime = ((stats.endTime - stats.startTime) / 1000).toFixed(2)
      logger.success(`Compilation finished ` + chalk.dim(`(${buildTime}s)`) + `.`)
    }
  }

  async start () {
    await this._server.start()
    return
  }

  async stop () {
    this._server.close()
  }
}

export default DevServer
