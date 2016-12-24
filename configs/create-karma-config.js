const { concat, map, merge, pipe, prepend } = require('redash')
const path = require('path')
const webpack = require('webpack')
const { cleanStackTrace } = require('../utils/formatters.util')
const debug = require('debug')('genesis:core:create-karma-config')

// createKarmaConfig : GenesisConfig -> KarmaConfig
const createKarmaConfig = (opts) => {
  debug('Creating configuration...')

  const files = concat(opts.tests_preload || [], opts.tests_entry)
  const config = {
    basePath: opts.root,
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
    preprocessors: reduce((acc, file) => ({
      ...acc,
      [file]: ['webpack'],
    }), {}, files),
    singleRun: !opts.tests_watch,
    webpack: require('./create-webpack-config')(opts),
    webpackMiddleware: {
      stats: opts.compiler_stats,
      noInfo: true,
    },
  }

  return config
}

module.exports = createKarmaConfig