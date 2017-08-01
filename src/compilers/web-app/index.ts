import * as webpack from 'webpack'
import { ICompiler, ICompilerConfig } from '../../types'
import createWebpackConfig from './webpack/create-config'
import DevServer, { DevServerOpts } from './webpack/create-dev-server'
import * as logger from '../../utils/logger'

export type Mocks = { [key: string]: string }

class WebAppCompiler implements ICompiler {
  private config: ICompilerConfig

  constructor (config: ICompilerConfig) {
    this.config = config
  }

  /**
   * Builds the application to disk.
   */
  async build (opts = {}) {
    const compile = () => new Promise((resolve, reject) => {
      const compiler = webpack(createWebpackConfig(this.config, {
        splitBundles: true,
        ...opts,
      }) as any)
      compiler.run((err, stats) => {
        if (err) return reject(err)

        const jsonStats = stats.toJson()
        if (jsonStats.errors.length) {
          jsonStats.errors.forEach(logger.error)
          return reject(new Error('Compiler encountered build errors'))
        }
        else resolve(stats)
      })
    })
    const stats = await compile()
    logger.log((stats as any).toString({
      colors: true,
      chunks: false,
    }))
    return stats
  }

  /**
   * Starts the development server for the web application.
   */
  async start (opts?: Partial<DevServerOpts>): Promise<DevServer> {
    const server = new DevServer(this.config, opts)

    await server.start()
    return server
  }

  /**
   * Starts the test runner. Can be run in watch mode to automatically
   * rerun tests when changes are detected.
   */
  async test (opts: Partial<{ watch: boolean }>) {
    opts = { watch: false, ...opts }
    const createJestSuite = require('../../test-runners/jest').default
    const testRunner = createJestSuite(this.config, opts)

    logger.info('Starting test runner...')
    await (opts.watch ? testRunner.watch() : testRunner.start())
  }
}

export default WebAppCompiler
