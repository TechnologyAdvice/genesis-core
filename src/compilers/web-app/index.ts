import * as webpack from 'webpack'
import * as chalk from 'chalk'
import { ICompiler, ICompilerConfig } from '../../lib/compiler'
import createWebpackConfig from './webpack/create-config'
import WebpackDevServer, { DevServerOpts } from './webpack/create-dev-server'
import createKarmaConfig from './karma/create-config'
import createKarmaServer from './karma/create-server'
import { isEmpty, keys } from 'halcyon'
import * as logger from '../../utils/logger'
import { bullet, arrowRight } from '../../utils/figures'

export type Mocks = { [key: string]: string }

class WebAppCompiler implements ICompiler {
  public config: ICompilerConfig

  constructor (config: ICompilerConfig) {
    this.config = config
  }

  /**
   * Compiles the web application by bundling assets and saving them to disk.
   */
  async compile () {
    const compile = () => new Promise((resolve, reject) => {
      const compiler = webpack(createWebpackConfig(this.config) as any)
      compiler.run((err, stats) => {
        if (err) reject(err)
        else resolve(stats)
      })
    })
    return await compile()
  }

  /**
   * Runs a development server for the web application which serves the
   * generated assets and watches for changes.
   */
  async run (opts?: Partial<DevServerOpts>) {
    return await new WebpackDevServer(this.config, opts).start()
  }

  /**
   * Pretty prints the set of modules that are mocked during testing,
   * displaying the module name and the path to its corresponding mock.
   */
  _printMockedModules (mocks: Mocks) {
    logger.info('Enabling mocks for the following modules:')
    keys(mocks).sort().forEach((mod: string) => {
      const mockPath = mocks[mod].replace(this.config.basePath, '.')

      // ● module → ./path/to/mock
      logger.log(`  ${bullet} ${mod} ${arrowRight} ${chalk.dim(mockPath)}`)
    })
  }

  /**
   * Starts the test runner for. Can be run in watch mode to automatically
   * rerun tests when file changes are detected.
   */
  async test (opts: Partial<{ watch: boolean, mocks: Mocks }>) {
    const config = Object.assign({}, this.config, { env: 'test' })
    const webpackConfig = createWebpackConfig(config)

    if (opts && opts.mocks && !isEmpty(opts.mocks)) {
      this._printMockedModules(opts.mocks)
      webpackConfig.resolve = { ...webpackConfig.resolve, alias: opts.mocks }
    }
    const karmaConfig = createKarmaConfig(webpackConfig, {
      basePath: this.config.basePath,
      react: true,
      watch: opts && opts.watch,
    })
    return await createKarmaServer(karmaConfig)
  }
}

export default WebAppCompiler
