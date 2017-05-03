import { assoc, reduce } from 'halcyon'
import { GenesisCoreConfig } from '../../../types'
import * as path from 'path'
import * as webpack from 'webpack'
import createWebpackConfig from '../../../configs/create-webpack-config'
import createDebugger from '../../../utils/create-debugger'
import { resolveLocalPath } from '../../../utils/paths'
// import cleanStackTrace from './clean-stack-trace'
const debug = createDebugger('tasks:test:karma:create-config')

export default function createKarmaConfig (config: GenesisCoreConfig): Object {
  debug('Creating configuration...')

  const webpackConfig = createWebpackConfig(config)
  const files: Array<string> = []
  files.push(resolveLocalPath('src/tasks/test/plugins/mocha'))
  if (config.test.enzyme) {
    files.push(resolveLocalPath('src/tasks/test/plugins/enzyme'))
  }
  files.push(resolveLocalPath('src/tasks/test/plugins/dirty-chai'))
  files.push(resolveLocalPath('src/tasks/test/plugins/test-importer'))

  const karmaConfig = {
    basePath: config.project.base_path,
    browsers: ['PhantomJS'],
    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
      ],
    },
    files,
    // formatError: cleanStackTrace,
    frameworks: ['mocha'],
    reporters: ['mocha'],
    logLevel: 'WARN',
    preprocessors: reduce((acc, file) => assoc(file, ['webpack'], acc), {}, files),
    singleRun: !config.test.watch,
    webpack: {
      entry: files,
      devtool: 'source-map',
      module: webpackConfig.module,
      plugins: webpackConfig.plugins.concat([
        new webpack.DefinePlugin({
          __TESTS_ROOT__: JSON.stringify(path.resolve(config.project.base_path, config.test.dir)),
          __TESTS_PATTERN__: config.test.pattern,
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
      stats: 'errors-only',
      noInfo: true,
    },
  }

  return karmaConfig
}
