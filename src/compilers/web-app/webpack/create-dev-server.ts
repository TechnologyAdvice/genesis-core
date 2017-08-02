import { ICompilerConfig } from '../../../types'
import * as path from 'path'
import * as express from 'express'
import * as chalk from 'chalk'
import createWebpackConfig from './create-config'
import createDevMiddleware, { CreateDevMiddlewareOpts } from './create-dev-middleware'
import * as logger from '../../../utils/logger'

export interface DevServerOpts {
  protocol: 'http' | 'https',
  port: number,
}
class DevServer {
  private _server: any

  constructor (config: ICompilerConfig, options?: Partial<DevServerOpts>) {
    const opts: CreateDevMiddlewareOpts = {
      protocol: 'http',
      host: 'localhost',
      port: 3000,
      onCompilerFinish: this._onCompilerFinish.bind(this),
      onCompilerStart: this._onCompilerStart.bind(this),
      ...options,
    }

    this._server = express()
    this._server.use(function (req: any, res: any, next: Function) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    });
    this._server.use(require('connect-history-api-fallback')())
    this._server.use(createDevMiddleware(createWebpackConfig(config), opts))
    this._server.use(express.static(path.resolve(config.basePath, 'public')))
    this._server.start = () => new Promise(resolve => {
      this._server.listen(opts.port, () => {
        logger.info('Starting compiler...')
        logger.info(chalk.bold(`Development server running at ${opts.protocol}://${opts.host}:${opts.port}`))
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
      logger.error('Compilation encountered errors, see above.')
    } else if (hasWarnings) {
      logger.warn(stats.toString())
      logger.warn('Compilation finished with warnings, see above.')
    } else {
      const buildTime = ((stats.endTime - stats.startTime) / 1000).toFixed(2)
      logger.success(`Compilation finished ` + chalk.dim(`(${buildTime}s)`) + `.`)
    }
  }

  async start () {
    await this._server.start()
  }

  async stop () {
    this._server.close()
  }
}

export default DevServer
