import { GenesisCoreConfig } from '../types'
import { concat, isEmpty, length, map } from 'halcyon'
import * as path from 'path'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import createBabelConfig from './create-babel-config'
import { resolveLocalDependencyPath } from '../utils/paths'
import createDebugger from '../utils/create-debugger'
const debug = createDebugger('configs:webpack')

export default function createWebpackConfig (config: GenesisCoreConfig) {
  debug('Creating configuration...')

  const { env } = config
  debug(`Using "${env}" as process.env.NODE_ENV.`)

  const { __DEV__, __TEST__, __PROD__ } = config.compiler_globals
  const resolveProjectSrcPath = p => path.resolve(config.project_src, p)

  const webpackConfig = {
    entry: {
      main: config.compiler_main,
    },
    devtool: __DEV__ ? 'cheap-module-eval-source-map' : 'source-map',
    performance: {
      hints: false,
    },
    output: {
      path: config.project_dist,
      filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    externals: {},
    module: {
      rules: [
        {
          test: /\.(eot|gif|jpg|jpeg|png|svg|ttf|woff|woff2)$/,
          use: map(resolveLocalDependencyPath, ['file-loader']),
        },
      ] as Array<Object>,
    },
    plugins: [] as Array<any>
  }

  if (config.compiler_transpile) {
    webpackConfig.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: resolveLocalDependencyPath('babel-loader'),
        query: createBabelConfig({ cacheDirectory: true }),
      }],
    })
  }

  webpackConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: [{
      loader: resolveLocalDependencyPath('awesome-typescript-loader'),
      query: {
        useCache: __DEV__,
        useBabel: config.compiler_transpile,
        babelOptions: config.compiler_transpile && createBabelConfig(),
        configFileName: path.resolve(config.project_root, 'tsconfig.json'),
      },
    }],
  })

  const htmlWebpackPluginOpts: any = {
    title: 'Genesis Application',
    inject: true,
    minify: {
      collapseWhitespace: true,
    },
  }
  if (config.compiler_template) {
    htmlWebpackPluginOpts.template = config.compiler_template
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginOpts))
  webpackConfig.plugins.push(new webpack.DefinePlugin(config.compiler_globals))

  // Styles
  // ------------------------------------
  const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    disable: __DEV__,
  })

  webpackConfig.module.rules.push({
    test: /\.(sass|scss)$/,
    include: config.project_src,
    loader: extractSass.extract({
      fallback: resolveLocalDependencyPath('style-loader'),
      use: concat(map(resolveLocalDependencyPath, ['css-loader?sourceMap']),
                      [{
                        loader: resolveLocalDependencyPath('sass-loader?sourceMap'),
                        query: {
                          includePaths: map(resolveProjectSrcPath, ['styles']),
                        },
                      }]),
    })
  })
  webpackConfig.plugins.push(extractSass)

  // Live Development
  // ------------------------------------
  // modify webpack config to support HMR
  if (__DEV__) {
    webpackConfig.output.publicPath = `${config.server_protocol}://${config.server_host}:${config.server_port}/`
    webpackConfig.entry.main = [].concat(webpackConfig.entry.main as any) // ensure `main` is an array
    webpackConfig.entry.main.push(
      resolveLocalDependencyPath('webpack-hot-middleware/client.js') +
      `?path=${webpackConfig.output.publicPath}__webpack_hmr`
    )
    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    )
  }

  // Production Optimizations
  // ------------------------------------
  // Only split bundles outside of testing
  if (!__TEST__ && config.compiler_vendors && !isEmpty(config.compiler_vendors)) {
    debug(`Splitting ${length(config.compiler_vendors)} vendor dependencies into separate vendor.js bundle.`)
    webpackConfig.entry['vendor'] = config.compiler_vendors
    webpackConfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor'],
      })
    )
  }

  if (__PROD__) {
    webpackConfig.plugins.push(
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
  return webpackConfig
}
