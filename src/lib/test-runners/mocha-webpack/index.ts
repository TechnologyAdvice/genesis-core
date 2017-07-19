import * as webpack from 'webpack'
import * as path from 'path'
import { resolveGenesisPath } from '../../../utils/paths'

export default function createMochaWebpackTestRunner (opts: any, webpackConfig: any) {
  opts = {
    reporter: 'spec',
    ui: 'bdd',
    ...opts,
  }

  webpackConfig.output = {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  }
  webpackConfig.target = 'node'
  webpackConfig.devtool = 'inline-cheap-module-source-map'
  webpackConfig.externals = [
    require('webpack-node-externals')(),
    {
      cheerio: 'window',
      'react/addons': 'react',
      'react/lib/ExecutionEnvironment': 'react',
      'react/lib/ReactContext': 'react',
      'react-addons-test-utils': 'react-dom',
    },
  ]
  webpackConfig.plugins = webpackConfig.plugins || []
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      __TESTS_ROOT__: JSON.stringify(path.resolve(opts.basePath, 'test')),
    })
  )

  const mochaWebpack = require('mocha-webpack/lib/createMochaWebpack')()
  mochaWebpack.webpackConfig(webpackConfig)
  mochaWebpack.addEntry(resolveGenesisPath('src/lib/test-suites/mocha-webpack-suite.js'))
  mochaWebpack.ui(opts.ui)
  mochaWebpack.reporter(opts.reporter)
  mochaWebpack.fullStackTrace()
  return {
    start: () => mochaWebpack.run(),
    watch: () => mochaWebpack.watch(),
  }
}
