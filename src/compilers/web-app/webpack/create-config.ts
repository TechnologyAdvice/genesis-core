import { ICompilerConfig } from '../../../types'
import * as path from 'path'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import { fileExists, resolveGenesisDependency } from '../../../utils/paths'
const WebpackManifestPlugin = require('webpack-manifest-plugin')

export type WebpackConfigOpts = {
  optimize: boolean,
}
export default function createWebpackConfig (config: ICompilerConfig, opts?: Partial<WebpackConfigOpts>): webpack.Configuration {
  opts = {
    optimize: false,
    ...opts,
  }

  const inProject = (...paths: Array<string>) => path.resolve(config.basePath, ...paths)
  const inProjectSrc = (file: string) => inProject(config.srcDir, file)

  const webpackConfig = {
    entry: {
      main: [inProjectSrc(config.main)],
    } as any,
    target: 'web',
    performance: {
      hints: false,
    },
    output: {
      path: inProject(config.outDir),
      filename: opts.optimize ? '[name].[chunkhash].js' : '[name].js',
      publicPath: config.publicPath,
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: {
        '~': inProject(config.srcDir),
      },
    },
    externals: config.externals,
    module: {
      rules: [] as Array<any>,
    },
    plugins: [
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
      new webpack.DefinePlugin(Object.assign({
        'process.env': { NODE_ENV: JSON.stringify(config.env) },
      }, config.globals)),
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
              inProjectSrc('styles'),
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
  if (!config.templatePath) {
    const defaultTemplatePath = inProjectSrc('index.html')
    if (fileExists(defaultTemplatePath)) {
      config.templatePath = defaultTemplatePath
    }
  }

  const htmlWebpackPluginOpts = {
    title: 'Genesis Application',
    inject: true,
    chunksSortMode: 'dependency' as any,
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
  return webpackConfig as any
}
