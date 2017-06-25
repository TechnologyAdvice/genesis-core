import * as webpack from 'webpack'
import * as chalk from 'chalk'
import * as path from 'path'
import { ICompiler, ICompilerConfig } from '../../types'
import createWebpackConfig from './webpack/create-config'
import DevServer, { DevServerOpts } from './webpack/create-dev-server'
import createKarmaConfig from './karma/create-config'
import createKarmaServer from './karma/create-server'
import * as logger from '../../utils/logger'
import { bullet, arrowRight } from '../../utils/figures'
import { isEmpty } from 'redash'

export type Mocks = { [key: string]: string }

class WebAppCompiler implements ICompiler {
  private config: ICompilerConfig

  constructor (config: ICompilerConfig) {
    this.config = config
  }

  /**
   * Initializes a new application in the current directory.
   */
  async init (): Promise<void> {
    const ncp = require('ncp').ncp
    const template = path.resolve(__dirname, '../../../src/compilers/web-app/__template__')
    const dest = process.cwd()
    const opts = { clobber: false }

    const task = new Promise((resolve, reject) => {
      ncp(template, dest, opts, (err: Error) => {
        err ? reject(err) : resolve()
      })
    }) as Promise<void>
    return await task
  }

  /**
   * Builds the application to disk.
   */
  async build () {
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
   * Starts the development server for the web application.
   */
  async start (opts?: Partial<DevServerOpts>): Promise<DevServer> {
    const server = new DevServer(this.config, opts)

    await server.start()
    return server
  }

  /**
   * Pretty prints the set of modules that are mocked during testing,
   * displaying the module name and the path to its corresponding mock.
   */
  private _printMockedModules (mocks: Mocks) {
    logger.info('Enabling mocks for the following modules:\n')
    Object.keys(mocks).sort().forEach((mod: string) => {
      const mockPath = mocks[mod].replace(this.config.basePath, '.')

      // ● module → ./path/to/mock
      logger.log(`${bullet} ${mod} ${arrowRight} ${chalk.dim(mockPath)}`)
    })
    logger.log() // symmetrical padding
  }

  /**
   * Starts the test runner. Can be run in watch mode to automatically
   * rerun tests when changes are detected.
   */
  async test (
    opts: Partial<{
      mocks: Mocks,
      react: boolean,
      watch: boolean,
    }>
  ) {
    opts = {
      mocks: {},
      react: true,
      watch: false,
      ...opts,
    }
    const config: ICompilerConfig = {
      ...this.config,
      env: 'test',
    }
    const webpackConfig = createWebpackConfig(config)

    if (!isEmpty(opts.mocks)) {
      this._printMockedModules(opts.mocks!)
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        alias: {
          ...webpackConfig.resolve.alias,
          ...opts.mocks,
        }
      }
    }
    const karmaConfig = createKarmaConfig(webpackConfig, {
      basePath: this.config.basePath,
      react: opts.react,
      watch: !!opts.watch,
    })
    logger.info('Starting test runner...')
    return await createKarmaServer(karmaConfig).start()
  }
}

export default WebAppCompiler
