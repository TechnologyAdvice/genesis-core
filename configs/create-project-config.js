const { merge } = require('redash')
const path = require('path')
const { resolveLocalPath } = require('../utils/paths.util')
const debug = require('debug')('genesis:core:create-project-config')

// createProjectConfig : GenesisConfig -> GenesisConfig
const createProjectConfig = (opts = {}) => {
  debug('Creating configuration...')

  // Apply default values to undefined properties in user options
  const config = merge({
    env                   : process.env.NODE_ENV || 'development',
    root                  : process.cwd(),
    compiler_autoprefixer : ['last 2 versions'],
    compiler_vendors      : [],
    server_host           : 'localhost',
    server_port           : 3000,
    server_protocol       : 'http',
    tests_pattern         : /\.(spec|test)\.js$/,
    tests_preload         : [],
    tests_watch           : false,
    verbose               : false,
  }, opts)

  // TODO: assert main exists
  // TODO: default main?
  config.main = Array.isArray(config.main) ? config.main : [config.main]

  // This is not currently able to be overriden
  config.tests_entry = resolveLocalPath('lib/test-runner-entry.js')

  // TODO: assert that tests directory exists
  config.tests_root = opts.tests_root || path.resolve(config.root, 'test')

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
