export type NODE_ENV =
  'development'
| 'staging'
| 'production'
| 'test'

export interface GenesisCoreOptions {
  env?                   : NODE_ENV,
  project_root?          : string,
  project_src?           : string,
  project_dist?          : string,
  compiler_main?         : string | Array<string>,
  compiler_globals?      : Object,
  compiler_template?     : string,
  compiler_transpile?    : boolean,
  compiler_autoprefixer? : Array<string>,
  compiler_preact?       : boolean,
  compiler_vendors?      : Array<string>,
  compiler_stats?        : Object,
  server_host?           : string,
  server_port?           : number,
  server_protocol?       : 'http' | 'https',
  tests_pattern?         : RegExp,
  tests_watch?           : boolean,
  tests_root?            : string,
  verbose?               : boolean,
}

export interface GenesisCoreConfig {
  env                   : NODE_ENV,
  project_root          : string,
  project_src           : string,
  project_dist          : string,
  compiler_main         : string | Array<string>,
  compiler_globals      : Object & {
    __DEV__     : boolean,
    __STAGING__ : boolean,
    __TEST__    : boolean,
    __PROD__    : boolean,
  },
  compiler_template     : string,
  compiler_transpile    : boolean,
  compiler_autoprefixer : Array<string>,
  compiler_preact       : boolean,
  compiler_vendors      : Array<string>,
  compiler_stats        : Object,
  server_host           : string,
  server_port           : number,
  server_protocol       : 'http' | 'https',
  tests_pattern         : RegExp,
  tests_watch           : boolean,
  tests_root            : string,
  verbose               : boolean,
}

export interface GenesisTask {
  start: Function
}
