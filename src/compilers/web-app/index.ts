import * as webpack from 'webpack'
import { ICompiler, ICompilerConfig } from '../../lib/compiler'
import promisify from '../../utils/promisify'
import createWebpackConfig from './webpack/create-config'
import WebpackDevServer, { DevServerOpts } from './webpack/create-dev-server'
import createKarmaConfig from './karma/create-config'
import createKarmaServer from './karma/create-server'

class WebAppCompiler implements ICompiler {
  public config: ICompilerConfig

  constructor (config: ICompilerConfig) {
    this.config = config
  }

  /**
   * Compiles the web application by bundling assets and saving them to disk.
   */
  async compile () {
    const compiler = webpack(createWebpackConfig(this.config) as any)
    return await promisify(compiler.run)()
  }

  /**
   * Runs a development server for the web application which serves the
   * generated assets and watches for changes.
   */
  async run (opts?: Partial<DevServerOpts>) {
    return await new WebpackDevServer(this.config, opts).start()
  }

  /**
   * Starts the test runner for the web application. Can be run in watch
   * mode to rerun tests when changes are detected.
   */
  async test (opts?: Partial<{ watch: boolean }>) {
    const config: ICompilerConfig = { ...this.config, env: 'test' }
    const webpackConfig = createWebpackConfig(config)
    const karmaConfig = createKarmaConfig(webpackConfig, {
      basePath: this.config.basePath,
      react: true,
      watch: opts && opts.watch,
    })

    return await createKarmaServer(karmaConfig)
  }
}

export default WebAppCompiler
