import { ICompilerConfig } from '../../../lib/compiler'
import * as path from 'path'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import { findGenesisDependency } from '../../../utils/paths'

export default function createWebpackConfig (opts: ICompilerConfig) {
  const inProject = (...paths: Array<string>) => path.resolve(opts.basePath, ...paths)
  const inProjectSrc = (file: string) => inProject(opts.srcDir, file)

  const __DEV__     = opts.env === 'development'
  const __STAGING__ = opts.env === 'staging'
  const __TEST__    = opts.env === 'test'
  const __PROD__    = opts.env === 'production'

  const config = {
    entry: {
      main: [
        inProjectSrc(opts.main),
      ],
    } as any,
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
      extensions: ['*', '.js', '.json', '.ts', '.tsx'],
    },
    externals: opts.externals,
    module: {
      rules: [
        {
          test: /\.(eot|gif|jpg|jpeg|png|svg|ttf|woff|woff2)$/,
          use: findGenesisDependency('file-loader'),
        },
      ] as Array<any>,
    },
    plugins: [
      new webpack.DefinePlugin(Object.assign({
        'process.env': { NODE_ENV: JSON.stringify(opts.env) },
        __DEV__,
        __STAGING__,
        __TEST__,
        __PROD__,
      }, opts.globals)),
    ],
  }

  // JavaScript
  // ------------------------------------
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    use: [{
      loader: findGenesisDependency('babel-loader'),
      query: {
        cacheDirectory: true,
        plugins: [
          findGenesisDependency('babel-plugin-transform-runtime'),
        ],
        presets: [
          findGenesisDependency('babel-preset-react'),
          [findGenesisDependency('babel-preset-env'), {
            targets: {
              browsers: ['last 2 versions'],
              uglify: true,
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
      loader: findGenesisDependency('awesome-typescript-loader'),
      query: {
        useCache: true,
        configFileName: opts.typescript.configPath,
        // UglifyJS does not yet support all ES6 features, so when minification
        // is enabled we need to process the TypeScript output with Babel to ensure
        // it can be understood by UglifyJS.
        useBabel: opts.minify,
        silent: true,
        babelOptions: {
          presets: [
            [findGenesisDependency('babel-preset-env'), {
              targets: {
                uglify: true,
              },
            }],
          ],
        },
      },
    }],
  })

  // Styles
  // ------------------------------------
  const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    disable: __DEV__,
  })

  config.module.rules.push({
    test: /\.(sass|scss)$/,
    exclude: /node_modules/,
    loader: extractSass.extract({
      fallback: findGenesisDependency('style-loader'),
      use: [
        findGenesisDependency('css-loader?sourceMap'),
        {
          loader: findGenesisDependency('sass-loader?sourceMap'),
          query: {
            includePaths: [
              inProjectSrc('styles'),
            ],
          },
        }
      ],
    })
  })
  config.plugins.push(extractSass)

  // HTML Template
  // ------------------------------------
  const htmlWebpackPluginOpts = {
    title: 'Genesis Application',
    inject: true,
    template: opts.templatePath || undefined,
    minify: {
      collapseWhitespace: true,
    },
  }
  // HtmlWebpackPlugin doesn't work if `template` is undefined or null, so
  // we have to explicitly delete the key when it's undefined.
  if (!htmlWebpackPluginOpts.template) {
    delete htmlWebpackPluginOpts.template
  }
  config.plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginOpts))

  if (!__TEST__) {
    const bundles = ['manifest']

    if (opts.vendors && opts.vendors.length) {
      bundles.unshift('vendor')
      config.entry.vendor = opts.vendors
    }
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: bundles }))
  }
  if (opts.minify) {
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
