const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackManifestPlugin = require('webpack-manifest-plugin')
const { fileExists, resolveGenesisDependency } = require('../utils/fs')

/**
 * Ensure globals are correctly stringified before being injected by webpack.

 * Given:
 * globals: { APP_ENV: 'development' }
 *
 * APP_ENV would become development, !!without quotes!!, which is unparseable.
 * What we really want is the string literal "development" to be injected, so
 * we have to ensure global strings are stringified accordingly.
 *
 * Requiring them to be correctly escaped when configured is a leaky abstraction
 * that is painful for the majority use case.
 */
const webpackifyGlobal = when(isType('string'), (value) => {
  try {
    JSON.parse(value)
    return value
  } catch (e) {
    return JSON.stringify(value)
  }
})

const inProject = (target) => path.resolve(process.cwd(), target)

const createWebpackConfig = (config, opts) => {
  opts = Object.assign({ optimize: false }, opts)

  const webpackConfig = {
    entry: {
      main: map((entry) => {
        return path.isAbsolute(entry) ? entry : inProject(entry)
      }, config.entry),
    },
    target: 'web',
    performance: {
      hints: false,
    },
    output: {
      path: opts.out,
      filename: opts.optimize ? '[name].[chunkhash].js' : '[name].js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: Object.assign({
        '~': path.resolve(process.cwd(), 'src'),
      }, config.alias),
    },
    module: {
      rules: [],
    },
    plugins: [
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
      new webpack.DefinePlugin(Object.assign({
        'process.env': {
          NODE_ENV: JSON.stringify(opts.optimize ? 'production' : process.env.NODE_ENV || 'development'),
        },
      }, map(webpackifyGlobal, config.globals))),
    ],
  }

  // JavaScript
  // ------------------------------------
  webpackConfig.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [{
      loader: resolveGenesisDependency('awesome-typescript-loader'),
      query: {
        useCache: true,
        transpileOnly: false,
        useBabel: false,
        silent: true,
      },
    }],
  })

  // Styles
  // ------------------------------------
  const cssLoader = {
    loader: resolveGenesisDependency('css-loader'),
    options: {
      sourceMap: config.sourcemaps,
      minimize: {
        autoprefixer: {
          add: true,
          remove: true,
          browsers: ['last 2 versions'],
        },
        discardComments: {
          removeAll: true,
        },
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true,
        sourcemap: config.sourcemaps,
      },
    },
  }

  const extractStyles = new ExtractTextPlugin({
    filename: 'styles/[name].[contenthash].css',
    allChunks: true,
    disable: !opts.optimize,
  })

  webpackConfig.module.rules.push({
    test: /\.(css)$/,
    loader: extractStyles.extract({
      fallback: resolveGenesisDependency('style-loader'),
      use: [
        cssLoader,
      ],
    })
  })

  webpackConfig.module.rules.push({
    test: /\.(sass|scss)$/,
    loader: extractStyles.extract({
      fallback: resolveGenesisDependency('style-loader'),
      use: [
        cssLoader,
        {
          loader: resolveGenesisDependency('sass-loader'),
          options: {
            sourceMap: config.sourcemaps,
            includePaths: [
              inProject('src/styles'),
            ],
          },
        }
      ],
    })
  })
  webpackConfig.plugins.push(extractStyles)

  // Images
  // ------------------------------------
  webpackConfig.module.rules.push({
    test    : /\.(png|jpg|gif)$/,
    loader  : 'url-loader',
    options : {
      limit : 8192,
    },
  })

  // Fonts
  // ------------------------------------
  const FONT_TYPES = new Map([
    ['woff',  'application/font-woff'],
    ['woff2', 'application/font-woff2'],
    ['otf',   'font/opentype'],
    ['ttf',   'application/octet-stream'],
    ['eot',   'application/vnd.ms-fontobject'],
    ['svg',   'image/svg+xml'],
  ])
  for (let [extension, mimetype] of FONT_TYPES) {
    webpackConfig.module.rules.push({
      test    : new RegExp(`\\.${extension}$`),
      loader  : 'url-loader',
      options : {
        name  : 'fonts/[name].[ext]',
        limit : 10000,
        mimetype,
      },
    })
  }

  // HTML Template
  // ------------------------------------
  const htmlWebpackPluginOpts = {
    title: 'Genesis Application',
    inject: true,
    chunksSortMode: 'dependency',
    template: config.templatePath || undefined,
    minify: {
      collapseWhitespace: true,
    },
  }
  // HtmlWebpackPlugin doesn't work if `template` is undefined or null, so
  // we have to explicitly delete the key when it's not defined.
  if (!htmlWebpackPluginOpts.template) {
    delete htmlWebpackPluginOpts.template
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginOpts))

  // Bundle Splitting
  // ------------------------------------
  const bundles = ['manifest']

  if (config.vendors && config.vendors.length) {
    bundles.unshift('vendor')
    webpackConfig.entry.vendor = config.vendors
  }
  webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: bundles }))

  // Build Optimizations
  // ------------------------------------
  if (opts.optimize) {
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

    webpackConfig.plugins.push(
      // TODO(zuko): consider applying this plugin all the time so that bundles
      // are more consistent between development and production. There are
      // currently slowdowns caused by the early webpack@^3.0.0 release which make
      // this unsuitable for watch mode.
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new UglifyJsPlugin({
        sourceMap: config.sourcemaps,
        comments: false,
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
      })
    )
  }
  return webpackConfig
}

module.exports = createWebpackConfig
