import * as path from 'path'
import * as webpack from 'webpack'
import { findGenesisFile } from '../../../utils/paths'

export interface KarmaOptions {
  basePath: string,
  react?: boolean,
  watch?: boolean,
}
export default function createKarmaConfig (webpackConfig: any, opts: KarmaOptions) {
  const files: Array<string> = []
  files.push(findGenesisFile('src/compilers/web-app/karma/plugins/mocha.js'))
  files.push(findGenesisFile('src/compilers/web-app/karma/plugins/test-importer.js'))

  const karmaConfig = {
    basePath: opts.basePath,
    browsers: ['PhantomJS'],
    singleRun: !opts.watch,
    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
      ],
    },
    files,
    frameworks: ['mocha'],
    reporters: ['mocha'],
    preprocessors: files.reduce((acc, file) => ({
      ...acc,
      [file]: ['webpack'],
    }), {}),
    logLevel: 'WARN',
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
          __REACT__: !!opts.react,
        })
      ]),
      resolve: webpackConfig.resolve,
      externals: {},
    },
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true,
    },
  }
  if (opts.react) {
    karmaConfig.webpack.externals = {
      'react/addons': 'react',
      'react/lib/ExecutionEnvironment': 'react',
      'react/lib/ReactContext': 'react',
    }
  }

  return karmaConfig
}
