import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'
import * as webpackHotMiddleware from 'webpack-hot-middleware'
import { findGenesisDependency } from '../../../utils/paths'

export type Middleware = any
export type CreateDevMiddlewareOpts = {
  protocol: string,
  host: string,
  port: number,
  contentBase: string,
  onCompilerStart?: () => any,
  onCompilerFinish?: (stats: any) => any,
}
const createDevMiddleware = (webpackConfig: any, opts: CreateDevMiddlewareOpts): Array<Middleware> => {
  webpackConfig.output.publicPath = `${opts.protocol}://${opts.host}:${opts.port}/`
  webpackConfig.entry.main.unshift(
    findGenesisDependency('react-error-overlay'),
    findGenesisDependency('webpack-hot-middleware/client.js') +
    `?path=${webpackConfig.output.publicPath}__webpack_hmr`,
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
  })
  const hotMiddleware = webpackHotMiddleware(webpackCompiler, {
    log: () => {},
  })

  const middleware = [devMiddleware, hotMiddleware, require('react-error-overlay/middleware')()]
  if (opts.onCompilerStart) webpackCompiler.plugin('compile', opts.onCompilerStart)
  if (opts.onCompilerFinish) webpackCompiler.plugin('done', opts.onCompilerFinish)
  return middleware
}

export default createDevMiddleware
