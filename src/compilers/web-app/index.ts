import * as path from 'path'
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
  async build (opts: { outPath: string }) {
    opts = {
      outPath: path.resolve(this.config.basePath, 'dist'),
      ...opts,
    }

    const compile = () => new Promise((resolve, reject) => {
      logger.info('Enforcing process.env.NODE_ENV as "production" for an optimized build.')
      const compiler = webpack(createWebpackConfig(this.config, {
        optimize: true,
        outPath: opts.outPath,
      }))
      logger.info('Starting compiler...')
      compiler.run((err, stats) => {
        if (err) return reject(err)

        const jsonStats = stats.toJson()
        if (jsonStats.errors.length) {
          jsonStats.errors.forEach(logger.error)
          return reject(new Error('Compiler encountered build errors'))
        }
        logger.success(`Successfully built application to ${opts.outPath}.`)
        resolve(stats)
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
