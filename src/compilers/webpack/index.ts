import * as Karma from 'karma'
import * as webpack from 'webpack'
import { ICompiler, ICompilerConfig } from '../../lib/compiler'
import createWebpackConfig from './create-webpack-config'
import createKarmaConfig from './karma'
import WebpackDevServer, { DevServerOpts } from './dev-server'

class WebpackCompiler implements ICompiler {
  public config: ICompilerConfig

  constructor (config: ICompilerConfig) {
    this.config = config
  }

  compile () {
    return Promise.resolve()
      .then(() => {
        const compiler = webpack(createWebpackConfig(this.config) as any)
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
      const config: ICompilerConfig = { ...this.config, env: 'test' }
      const webpackConfig = createWebpackConfig(config)
      const karmaConfig = createKarmaConfig(webpackConfig, {
        basePath: this.config.basePath,
        react: true,
        watch: opts && opts.watch,
      })

      new Karma.Server(karmaConfig, status => {
        if (status !== 0) {
          const error = new Error('Karma exited with a non-zero status code: ' + status)
          return reject(error)
        }
        resolve()
      }).start()
    })
  }
}

export default WebpackCompiler
