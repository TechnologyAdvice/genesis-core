const { concat, isEmpty, map, merge, pipe, prepend } = require('redash')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolveLocalPath, resolveLocalDependencyPath } = require('../utils/paths.util')
const debug = require('debug')('genesis:core:create-webpack-config')

// createWebpackConfig : GenesisConfig -> WebpackConfig
const createWebpackConfig = (opts) => {
  debug('Creating configuration...')

  const { env } = opts
  debug(`Using "${env}" as the node environment.`)

  const resolveProjectPath = p => path.resolve(opts.root, p)
  const __DEV__ = env === 'development'
  const __TEST__ = env === 'test'
  const __PROD__ = env === 'production'

  const config = {
    entry: {
      main: opts.main,
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
          exclude: /node_modules/,
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
          test: /\.(sass|scss)$/,
          include: map(resolveProjectPath, ['src']),
          use: concat(map(resolveLocalDependencyPath, ['style-loader', 'css-loader?sourceMap']),
                      [{
                        loader: resolveLocalDependencyPath('sass-loader?sourceMap'),
                        query: {
                          includePaths: map(resolveProjectPath, ['src/styles']),
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
      new webpack.DefinePlugin(opts.compiler_globals),
    ],
  }

  // modify webpack config to support HMR
  if (__DEV__) {
    config.output.publicPath = `${opts.server_protocol}://${opts.server_host}:${opts.server_port}/`
    config.entry.main.push(
      resolveLocalDependencyPath('webpack-hot-middleware/client') +
      `?path=${config.output.publicPath}__webpack_hmr`
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