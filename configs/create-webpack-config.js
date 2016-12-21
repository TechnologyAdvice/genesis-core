const { concat, isEmpty, map, merge, pipe, prepend } = require('redash')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolveLocalPath, resolveLocalDependencyPath } = require('../utils/paths.util')
const debug = require('debug')('genesis:core:create-webpack-config')

// createWebpackConfig : GenesisConfig -> WebpackConfig
const createWebpackConfig = (opts) => {
  debug('Creating configuration...')

  const NODE_ENV = opts.compiler_env
  debug(`Using "${NODE_ENV}" as the active environment.`)

  const resolveProjectPath = p => path.resolve(opts.project_root, p)
  const __DEV__ = NODE_ENV === 'development'
  const __TEST__ = NODE_ENV === 'test'
  const __PROD__ = NODE_ENV === 'production'

  const config = {
    entry: {
      app: [resolveProjectPath('src/main.js')],
    },
    devtool: 'source-map',
    output: {
      path: resolveProjectPath('dist'),
      filename: '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: concat(map(resolveProjectPath, ['src', 'test']),
                          map(resolveLocalPath, ['lib'])),
          use: [{
            loader: resolveLocalDependencyPath('babel-loader'),
            query: {
              cacheDirectory: true,
              plugins: map(pipe(prepend('babel-plugin-'), resolveLocalDependencyPath),
                           ['transform-runtime']),
              presets: map(pipe(prepend('babel-preset-'), resolveLocalDependencyPath),
                           ['react', 'es2015', 'stage-1']),
            },
          }],
        },
        // TODO(zuko): extract to file during static compilation
        {
          test: /\.scss$/,
          include: map(resolveProjectPath, ['src']),
          use: concat(map(resolveLocalDependencyPath, ['style-loader', 'css-loader?sourceMap']),
                      [{
                        loader: resolveLocalDependencyPath('sass-loader?sourceMap'),
                        query: {
                          includePaths: map(resolveLocalDependencyPath, ['src/styles']),
                        },
                      }]),
        },
        {
          test: /\.(eot|gif|jpg|jpeg|png|svg|ttf|woff|woff2)$/,
          use: map(resolveLocalDependencyPath, ['file-loader']),
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolveProjectPath('src/index.html'),
        inject: true,
        minify: {
          collapseWhitespace: true,
        },
      }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) },
        __DEV__,
        __TEST__,
        __PROD__,
        __TESTS_ROOT__: JSON.stringify(opts.tests_root),
        __TESTS_PATTERN__: JSON.stringify(opts.tests_pattern),
      }),
    ],
  }

  // modify webpack config to support HMR
  if (__DEV__) {
    const publicPath = `${opts.server_protocol}://${opts.server_host}:${opts.server_port}/`
    config.output.publicPath = publicPath
    config.entry.app.push(
      `webpack-hot-middleware/client?path=${publicPath}__webpack_hmr`
    )
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    )
  }

  // Only split bundles outside of development and testing
  if (!__TEST__ && opts.compiler_vendors && !isEmpty(opts.compiler_vendors)) {
    debug('Enable bundle splitting (CommonsChunkPlugin).')
    config.entry.vendor = opts.compiler_vendors
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor'],
      })
    )
  }

  // Production-only optimizations
  if (__PROD__) {
    config.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
      })
    )
  }
  return config
}

module.exports = createWebpackConfig