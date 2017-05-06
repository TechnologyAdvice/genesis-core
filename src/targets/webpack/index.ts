import * as Karma from 'karma'
import * as webpack from 'webpack'
import Compiler from '../../lib/compiler'
import createWebpackConfig from './create-webpack-config'
import createKarmaConfig from './karma'
import WebpackDevServer, { DevServerOpts } from './dev-server'

class WebpackCompiler extends Compiler {
  compile () {
    return Promise.resolve()
      .then(() => {
        const compiler = webpack(createWebpackConfig(this.config))
        return new Promise((resolve, reject) => {
          compiler.run((err, stats) => {
            if (err) reject(err)
            else resolve(stats)
          })
        })
      })
  }

  run (opts?: Partial<DevServerOpts>) {
    return Promise.resolve()
      .then(() => new WebpackDevServer(this.config, opts).start())
  }

  test (opts?: Partial<{ watch: boolean }>) {
    return new Promise((resolve, reject) => {
      const config = Object.assign({}, this.config, { env: 'test' })
      const webpackConfig = createWebpackConfig(config)
      const karmaConfig = createKarmaConfig(webpackConfig, {
        basePath: this.config.basePath,
        enzyme: true,
        watch: opts && opts.watch,
      })

      new Karma.Server(karmaConfig, status => {
        if (status !== 0) {
          const error = new Error('Karma exited with a non-zero status code: ' + status)
          reject(error)
          return
        }
        resolve()
      }).start()
    })
  }
}

export default WebpackCompiler
