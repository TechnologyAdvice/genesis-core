import * as webpack from 'webpack'
import Compiler from '../../lib/compiler'
import createWebpackConfig from './create-webpack-config'
import WebpackDevServer from './dev-server'

class WebpackCompiler extends Compiler {
  private _getWebpackConfig () {
    return createWebpackConfig(this.config)
  }

  run () {
    return webpack(this._getWebpackConfig())
  }

  dev (opts = {}) {
    return new WebpackDevServer(this.config, opts).start()
  }
}

export default WebpackCompiler
