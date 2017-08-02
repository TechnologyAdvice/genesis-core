import * as webpack from 'webpack'
import { ICompiler, ICompilerConfig } from '../../types'
import createWebpackConfig from './webpack/create-config'
import DevServer, { DevServerOpts } from './webpack/create-dev-server'
import * as logger from '../../utils/logger'

class WebAppCompiler implements ICompiler {
  private config: ICompilerConfig

  constructor (config: ICompilerConfig) {
    this.config = config
  }

  /**
   * Builds the application to disk.
   */
  async build () {
    const compile = () => new Promise((resolve, reject) => {
      const compiler = webpack(createWebpackConfig(this.config))
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
    const createJestRunner = require('../../lib/jest/create-runner').default
    const jest = createJestRunner(this.config)

    logger.info('Starting test runner...')
    await (opts.watch ? jest.watch() : jest.start())
  }
}

export default WebAppCompiler
