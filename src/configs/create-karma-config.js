const { assoc, concat, reduce } = require('halcyon')
const path = require('path')
const webpack = require('webpack')
const { cleanStackTrace } = require('../utils/formatters.util')
const { resolveLocalPath } = require('../utils/paths.util')
const debug = require('../utils/debug.util')('genesis:core:create-karma-config')

// createKarmaConfig : GenesisConfig -> KarmaConfig
const createKarmaConfig = (opts) => {
  debug('Creating configuration...')

  const webpackConfig = require('./create-webpack-config')(opts)
  const files = [].concat(opts.tests_entry)
  const config = {
    basePath: opts.dir_root,
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
    singleRun: !opts.tests_watch,
    webpack: {
      entry: files,
      devtool: 'source-map',
      module: webpackConfig.module,
      plugins: webpackConfig.plugins,
      resolve: webpackConfig.resolve,
      externals: Object.assign({}, webpackConfig.externals, {
        'react/addons': true,
        'react/lib/ReactContext': true,
        'react/lib/ExecutionEnvironment': true,
      })
    },
    webpackMiddleware: {
      stats: opts.compiler_stats,
      noInfo: true,
    },
  }

  return config
}

module.exports = createKarmaConfig
