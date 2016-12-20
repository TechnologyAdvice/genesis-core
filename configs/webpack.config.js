const { map, pipe, prepend } = require('redash')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolveLocalDependencyPath } = require('../utils/paths.util')

const makeWebpackConfig = (opts = {}) => {
  const projectRoot = opts.root || process.cwd()
  const resolveProjectPath = p => path.resolve(projectRoot, p)

  const NODE_ENV = opts.env || 'development'
  const __DEV__ = NODE_ENV === 'development'
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
          include: map(resolveProjectPath, ['src']),
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
          use: map(resolveLocalDependencyPath, ['style-loader', 'css-loader', 'sass-loader']),
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
        __PROD__,
      }),
    ],
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

module.exports = makeWebpackConfig