const { concat, isEmpty, length, map, pipe, prepend } = require('halcyon')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolveLocalPath, resolveLocalDependencyPath } = require('../utils/paths.util')
const debug = require('../utils/debug.util')('genesis:core:create-webpack-config')

// createWebpackConfig : GenesisConfig -> WebpackConfig
const createWebpackConfig = (opts) => {
  debug('Creating configuration...')

  const { env } = opts
  debug(`Using "${env}" as the node environment.`)

  const { __DEV__, __TEST__, __PROD__ } = opts.compiler_globals
  const resolveProjectSrcPath = p => path.resolve(opts.dir_src, p)

  const config = {
    entry: {
      main: opts.main,
    },
    devtool: 'source-map',
    output: {
      path: opts.dir_dist,
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
              plugins: map(pipe([prepend('babel-plugin-'), resolveLocalDependencyPath]),
                           ['transform-runtime']),
              presets: map(pipe([prepend('babel-preset-'), resolveLocalDependencyPath]),
                           ['react', 'es2015', 'stage-1']),
            },
          }],
        },
        {
          test: /\.(eot|gif|jpg|jpeg|png|svg|ttf|woff|woff2)$/,
          use: map(resolveLocalDependencyPath, ['file-loader']),
        },
      ],
    },
    plugins: [],
  }

  const htmlWebpackPluginOpts = {
    title: opts.app_title,
    inject: true,
    minify: {
      collapseWhitespace: true,
    },
  }
  if (opts.app_template) {
    htmlWebpackPluginOpts.template = opts.app
  }
  config.plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginOpts))
  config.plugins.push(new webpack.DefinePlugin(opts.compiler_globals))

  // Styles
  // ------------------------------------
  config.module.rules.push({
    test: /\.(sass|scss)$/,
    include: opts.src,
    use: concat(map(resolveLocalDependencyPath, ['style-loader', 'css-loader?sourceMap']),
                [{
                  loader: resolveLocalDependencyPath('sass-loader?sourceMap'),
                  query: {
                    includePaths: map(resolveProjectSrcPath, ['styles']),
                  },
                }]),
  })

  // Live Development
  // ------------------------------------
  // modify webpack config to support HMR
  if (__DEV__) {
    config.output.publicPath = `${opts.server_protocol}://${opts.server_host}:${opts.server_port}/`
    config.entry.main = [].concat(config.entry.main) // ensure `main` is an array
    config.entry.main.push(
      resolveLocalDependencyPath('webpack-hot-middleware/client.js') +
      `?path=${config.output.publicPath}__webpack_hmr`
    )
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    )
  }

  // Production Optimizations
  // ------------------------------------
  // Only split bundles outside of testing
  if (!__TEST__ && opts.compiler_vendors && !isEmpty(opts.compiler_vendors)) {
    debug(`Splitting ${length(opts.compiler_vendors)} vendor dependencies into separate vendor.js bundle.`)
    config.entry.vendor = opts.compiler_vendors
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor'],
      })
    )
  }

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
