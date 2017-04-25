import { assoc, reduce } from 'halcyon'
import { GenesisCoreConfig } from '../../../types'
import webpack from 'webpack'
import createWebpackConfig from '../../../configs/create-webpack-config'
import createDebugger from '../../../utils/create-debugger'
import { resolveLocalPath } from '../../../utils/paths'
import cleanStackTrace from './clean-stack-trace'
const debug = createDebugger('tasks:test:karma:create-config')

export default function createKarmaConfig (config: GenesisCoreConfig): Object {
  debug('Creating configuration...')
  const webpackConfig = createWebpackConfig(config)
  const files = [
    resolveLocalPath('src/tasks/test/webpack/test-suite.js'),
    resolveLocalPath('src/tasks/test/webpack/import-project-tests.js'),
  ]

  const karmaConfig = {
    basePath: config.project_root,
    browsers: ['PhantomJS'],
    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
      ],
    },
    files,
    formatError: cleanStackTrace,
    frameworks: ['mocha'],
    reporters: ['mocha'],
    logLevel: 'WARN',
    preprocessors: reduce((acc, file) => assoc(file, ['webpack'], acc), {}, files),
    singleRun: !config.tests_watch,
    webpack: {
      entry: files,
      devtool: 'source-map',
      module: webpackConfig.module,
      plugins: webpackConfig.plugins.concat([
        new webpack.DefinePlugin({
          __TESTS_ROOT__: JSON.stringify(config.tests_root),
          __TESTS_PATTERN__: config.tests_pattern,
        })
      ]),
      resolve: webpackConfig.resolve,
      externals: Object.assign({}, webpackConfig.externals, {
        'react/addons': true,
        'react/lib/ReactContext': true,
        'react/lib/ExecutionEnvironment': true,
      })
    },
    webpackMiddleware: {
      stats: config.compiler_stats,
      noInfo: true,
    },
  }

  return karmaConfig
}
