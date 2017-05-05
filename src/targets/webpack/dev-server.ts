import { ICompilerConfig } from '../../lib/compiler'
import * as path from 'path'
import * as express from 'express'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'
import * as webpackHotMiddleware from 'webpack-hot-middleware'
import createWebpackConfig from './create-webpack-config'
import { findGenesisDependency } from '../../utils/paths'

export type Middleware = Object
export type CreateDevMiddlewareOpts = {
  protocol: string,
  host: string,
  port: number,
  contentBase: string,
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
    noInfo: false,
    progress: true,
    publicPath: webpackConfig.output.publicPath,
    stats: 'minimal',
  })
  const hotMiddleware = webpackHotMiddleware(webpackCompiler)

  return [devMiddleware, hotMiddleware]
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
    this._server.use(createDevMiddleware(createWebpackConfig(config), opts))
    this._server.use(express.static(path.resolve(config.basePath, 'public')))
    this._server.start = () => new Promise(resolve => {
      this._server.listen(opts.port, () => {
        console.log(`Listening at http://localhost:${opts.port}.`)
        resolve()
      })
    })
  }

  start () {
    return this._server.start()
  }
}

export default DevServer
