import * as path from 'path'
import * as webpack from 'webpack'
import { resolveLocalPath } from '../../../utils/paths'

export interface KarmaOptions {
  basePath: string,
  react?: boolean,
  watch?: boolean,
}
export default function createKarmaConfig (webpackConfig: any, opts: KarmaOptions) {
  const files: Array<string> = []
  files.push(resolveLocalPath('src/targets/webpack/karma/plugins/mocha.js'))
  if (opts.react) files.push(resolveLocalPath('src/targets/webpack/karma/plugins/enzyme.js'))
  files.push(resolveLocalPath('src/targets/webpack/karma/plugins/dirty-chai.js'))
  files.push(resolveLocalPath('src/targets/webpack/karma/plugins/test-importer.js'))

  const karmaConfig = {
    basePath: opts.basePath,
    browsers: ['PhantomJS'],
    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
      ],
    },
    files,
    frameworks: ['mocha'],
    reporters: ['mocha'],
    logLevel: 'WARN',
    preprocessors: files.reduce((acc, file) => ({
      ...acc,
      [file]: ['webpack'],
    }), {}),
    singleRun: !opts.watch,
    browserConsoleLogOptions: {
      terminal: true,
      format: '%b %T: %m',
      level: '',
    },
    webpack: {
      entry: files,
      devtool: 'source-map',
      module: webpackConfig.module,
      plugins: webpackConfig.plugins.concat([
        new webpack.DefinePlugin({
          __TESTS_ROOT__: JSON.stringify(path.resolve(opts.basePath, 'test')),
          __TESTS_PATTERN__: /\.(spec|test)\.(js|ts|tsx)$/,
        })
      ]),
      resolve: webpackConfig.resolve,
      externals: webpackConfig.externals,
    },
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true,
    },
  }
  if (opts.react) {
    karmaConfig.webpack.externals = {
      ...karmaConfig.webpack.externals,
      'react/addons': true,
      'react/lib/ReactContext': true,
      'react/lib/ExecutionEnvironment': true,
    }
  }

  return karmaConfig
}
