import { GenesisCoreOptions, GenesisCoreConfig } from '../types'
import createDebugger from '../utils/create-debugger'
import * as path from 'path'
const debug = createDebugger('configs:genesis')

export default function createGenesisConfig (opts: GenesisCoreOptions = {}): GenesisCoreConfig {
  debug('Resolving configuration...')

  // Apply static defaults to options not supplied by the user.
  const DYNAMIC_DEFAULT: any = null
  const config: GenesisCoreConfig = Object.assign({
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
    server_host           : 'localhost',
    server_port           : 3000,
    server_protocol       : 'http',
    tests_pattern         : /\.(spec|test)\.(js|ts|tsx)$/,
    tests_preload         : [],
    tests_watch           : false,
    tests_root            : DYNAMIC_DEFAULT,
    verbose               : false,
  }, opts)

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
  return config
}
