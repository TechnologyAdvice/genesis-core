import { ICompilerConfig } from '../../../types'
import * as path from 'path'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
// TODO: make tsified
const WebpackManifestPlugin = require('webpack-manifest-plugin')
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import { resolveGenesisDependency } from '../../../utils/paths'

export default function createWebpackConfig (opts: ICompilerConfig) {
  const inProject = (...paths: Array<string>) => path.resolve(opts.basePath, ...paths)
  const inProjectSrc = (file: string) => inProject(opts.srcDir, file)

  const __DEV__  = opts.env === 'development'
  const __TEST__ = opts.env === 'test'
  const __PROD__ = opts.env === 'production'

  const config = {
    entry: {
      main: [
        inProjectSrc(opts.main),
      ],
    } as any,
    target: 'web',
    devtool: opts.sourcemaps ? 'source-map' : false,
    performance: {
      hints: false,
    },
    output: {
      path: inProject(opts.outDir),
      filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
      publicPath: opts.publicPath,
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    externals: opts.externals,
    module: {
      rules: [] as Array<any>,
    },
    plugins: [
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
      new webpack.DefinePlugin(Object.assign({
        'process.env': { NODE_ENV: JSON.stringify(opts.env) },
        __DEV__,
        __TEST__,
        __PROD__,
      }, opts.globals)),
    ],
  }

  // JavaScript
  // ------------------------------------
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules\/(?!@technologyadvice\/genesis-core\/src)/,
    use: [{
      loader: resolveGenesisDependency('babel-loader'),
      query: {
        cacheDirectory: true,
        plugins: [
          resolveGenesisDependency('babel-plugin-transform-class-properties'),
          resolveGenesisDependency('babel-plugin-syntax-dynamic-import'),
          [
            resolveGenesisDependency('babel-plugin-transform-runtime'),
            {
              helpers: true,
              polyfill: false,
              regenerator: true,
            },
          ],
          [
            resolveGenesisDependency('babel-plugin-transform-object-rest-spread'),
            {
              usBuiltIns: true,
            },
          ]
        ],
        presets: [
          resolveGenesisDependency('babel-preset-react'),
          [resolveGenesisDependency('babel-preset-env'), {
            targets: {
              ie9: true,
              uglify: true,
              modules: false,
            },
          }],
        ]
      },
    }],
  })

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: [{
      loader: resolveGenesisDependency('awesome-typescript-loader'),
      query: {
        useCache: true,
        configFileName: opts.typescript.configPath,
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
      sourceMap: opts.sourcemaps,
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
        sourcemap: opts.sourcemaps,
      },
    },
  }

  const extractStyles = new ExtractTextPlugin({
    filename: 'styles/[name].[contenthash].css',
    allChunks: true,
    disable: __DEV__,
  })

  config.module.rules.push({
    test: /\.(css)$/,
    loader: extractStyles.extract({
      fallback: resolveGenesisDependency('style-loader'),
      use: [
        cssLoader,
      ],
    })
  })

  config.module.rules.push({
    test: /\.(sass|scss)$/,
    loader: extractStyles.extract({
      fallback: resolveGenesisDependency('style-loader'),
      use: [
        cssLoader,
        {
          loader: resolveGenesisDependency('sass-loader'),
          options: {
            sourceMap: opts.sourcemaps,
            includePaths: [
              inProjectSrc('styles'),
            ],
          },
        }
      ],
    })
  })
  config.plugins.push(extractStyles)

  // Images
  // ------------------------------------
  config.module.rules.push({
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
    config.module.rules.push({
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
    chunksSortMode: 'dependency' as any,
    template: opts.templatePath || undefined,
    minify: {
      collapseWhitespace: true,
    },
  }
  // HtmlWebpackPlugin doesn't work if `template` is undefined or null, so
  // we have to explicitly delete the key when it's not defined.
  if (!htmlWebpackPluginOpts.template) {
    delete htmlWebpackPluginOpts.template
  }
  config.plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginOpts))

  // Bundle Splitting
  // ------------------------------------
  if (!__TEST__) {
    const bundles = ['manifest']

    if (opts.vendors && opts.vendors.length) {
      bundles.unshift('vendor')
      config.entry.vendor = opts.vendors
    }
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: bundles }))
  }

  // Production Optimizations
  // ------------------------------------
  if (__PROD__) {
    config.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: !!config.devtool,
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
  return config
}
