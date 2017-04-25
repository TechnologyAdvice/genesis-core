import { GenesisCoreOptions, GenesisCoreConfig } from '../types'
import createDebugger from '../utils/create-debugger'
import * as path from 'path'
const debug = createDebugger('configs:genesis')

export default function createGenesisConfig (opts: GenesisCoreOptions = {}): GenesisCoreConfig {
  debug('Resolving configuration...')

  // Apply static defaults to options not supplied by the user.
  const DYNAMIC_DEFAULT: any = null
  const config = Object.assign({
    env                   : process.env.NODE_ENV,
    project_root          : process.cwd(),
    project_src           : DYNAMIC_DEFAULT,
    project_dist          : DYNAMIC_DEFAULT,
    compiler_main         : DYNAMIC_DEFAULT,
    compiler_template     : DYNAMIC_DEFAULT,
    compiler_globals      : DYNAMIC_DEFAULT,
    compiler_transpile    : true,
    compiler_autoprefixer : ['last 2 versions'],
    compiler_preact       : false,
    compiler_vendors      : [],
    compiler_stats        : DYNAMIC_DEFAULT,
    server_host           : 'localhost',
    server_port           : 3000,
    server_protocol       : 'http',
    tests_pattern         : /\.(spec|test)\.(js|ts|tsx)$/,
    tests_preload         : [],
    tests_watch           : false,
    tests_root            : DYNAMIC_DEFAULT,
    verbose               : false,
  } as GenesisCoreConfig, opts)

  // Dynamic configurations
  config.env = config.env || 'development'
  config.project_src = config.project_src || path.resolve(config.project_root, 'src')
  config.project_dist = config.project_dist || path.resolve(config.project_root, 'dist')
  config.compiler_main = config.compiler_main || [path.resolve(config.project_src, 'main')]
  config.tests_root = opts.tests_root || path.resolve(config.project_root, 'test')

  // Merge user globals with defaults
  config.compiler_globals = Object.assign({
    'process.env': { NODE_ENV: JSON.stringify(config.env) },
    __DEV__: config.env === 'development',
    __STAGING__: config.env === 'staging',
    __TEST__: config.env === 'test',
    __PROD__: config.env === 'production',
  }, opts.compiler_globals)

  // TODO: modify based on `config.verbose`
  config.compiler_stats = {
    assets       : false,   // assets info
    assetsSort   : '',     // (string) sort the assets by that field
    cached       : false,  // also info about cached (not built) modules
    chunks       : false,   // chunk info
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
  config.compiler_stats = 'minimal'
  return config
}
