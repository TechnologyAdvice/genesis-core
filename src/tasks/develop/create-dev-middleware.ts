import { GenesisCoreConfig } from '../../types'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'
import * as webpackHotMiddleware from 'webpack-hot-middleware'
import createWebpackConfig from '../../configs/create-webpack-config'
import createDebugger from '../../utils/create-debugger'
const debug = createDebugger('tasks:develop:create-dev-middleware')

export type Middleware = Object
export default function createDevServer (config: GenesisCoreConfig): Array<Middleware> {
  debug('Initializing...')

  const webpackConfig = createWebpackConfig(config)
  const compiler = webpack(webpackConfig)
  const devMiddleware = webpackDevMiddleware(compiler, {
    contentBase: config.project_src,
    hot: true,
    lazy: false,
    noInfo: false,
    progress: config.verbose,
    publicPath: webpackConfig.output.publicPath,
    stats: !config.verbose ? 'errors-only' : {
      assets: true,
      chunks: false,
      colors: true,
    },
  })
  const hotMiddleware = webpackHotMiddleware(compiler)

  return [devMiddleware, hotMiddleware]
}

