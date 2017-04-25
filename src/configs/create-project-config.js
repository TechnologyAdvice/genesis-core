const { merge } = require('halcyon')
const path = require('path')
const { resolveLocalPath } = require('../utils/paths.util')
const debug = require('../utils/debug.util')('genesis:core:create-project-config')

// createProjectConfig : GenesisConfig -> GenesisConfig
const createProjectConfig = (opts = {}) => {
  debug('Creating configuration...')

  // Apply static defaults to options not supplied by the user.
  const config = merge({
    env                   : process.env.NODE_ENV,
    dir_root              : process.cwd(),
    compiler_template     : null,
    compiler_transpile    : true,
    compiler_autoprefixer : ['last 2 versions'],
    compiler_preact       : false,
    compiler_vendors      : [],
    server_host           : 'localhost',
    server_port           : 3000,
    server_protocol       : 'http',
    tests_pattern         : /\.(spec|test)\.(js|ts|tsx)$/,
    tests_preload         : [],
    tests_watch           : false,
    verbose               : false,
  }, opts)

  // Dynamic configurations
  config.env = config.env || 'development'
  config.dir_src = config.dir_src || path.resolve(config.dir_root, 'src')
  config.dir_dist = config.dir_dist || path.resolve(config.dir_root, 'dist')
  config.main = config.main || [path.resolve(config.dir_src, 'main')]

  config.tests_root = opts.tests_root || path.resolve(config.dir_root, 'test')
  config.tests_entry = resolveLocalPath('src/lib/test-runner-entry.js')

  // Merge user globals with defaults
  config.compiler_globals = Object.assign({
    'process.env': { NODE_ENV: JSON.stringify(config.env) },
    __DEV__: config.env === 'development',
    __STAGING__: config.env === 'staging',
    __TEST__: config.env === 'test',
    __PROD__: config.env === 'production',
    __TESTS_ROOT__: JSON.stringify(config.tests_root),
    __TESTS_PATTERN__: config.tests_pattern,
  }, opts.compiler_globals)

  // TODO: modify based on `config.verbose`
  config.compiler_stats = {
    assets       : true,   // assets info
    assetsSort   : '',     // (string) sort the assets by that field
    cached       : false,  // also info about cached (not built) modules
    chunks       : true,   // chunk info
    chunkModules : false,  // built modules info to chunk info
    chunkOrigins : false,  // the origins of chunks and chunk merging info
    chunksSort   : '',     // (string) sort the chunks by that field
    colors       : true,   // with console colors
    errorDetails : true,   // details to errors (like resolving log)
    hash         : false,  // the hash of the compilation
    modules      : false,  // built modules info
    modulesSort  : '',     // (string) sort the modules by that field
    reasons      : false,  // info about the reasons modules are included
    source       : false,  // the source code of modules
    timings      : true,   // timing info
    version      : false,  // webpack version info
  }
  return config
}

module.exports = createProjectConfig
