export type NODE_ENV =
  'development'
| 'staging'
| 'production'
| 'test'

export interface GenesisCoreConfig {
  /** The application environment, comparable to process.env.NODE_ENV */
  env                   : NODE_ENV,
  /** The full path to the root of the project */
  project_root          : string,
  /** The full path to the project's source code directory */
  project_src           : string,
  /** The full path to where the compiled files will be emitted */
  project_dist          : string,
  /** The full path(s) to the application entry point(s) */
  compiler_main         : string | Array<string>,
  /** Variables to expose to the application's global context */
  compiler_globals      : {
    __DEV__     : boolean,
    __STAGING__ : boolean,
    __TEST__    : boolean,
    __PROD__    : boolean,
  },
  // TODO(zuko): consider moving to project_template
  /** The full path to the project's HTML template */
  compiler_template     : string,
  // TODO(zuko): consider refactoring to compiler_target
  /** Whether to transpile the source code to ES5 with Babel */
  compiler_transpile    : boolean,
  /** Autoprefixer options for the Sass loader */
  compiler_autoprefixer : Array<string>,
  /** Whether preact is being used in place of React */
  compiler_preact       : boolean,
  /** Vendor dependencies to compile separately from the application */
  compiler_vendors      : Array<string>,
  /** The host for the development server */
  server_host           : string,
  /** The port for the development server */
  server_port           : number,
  /** The protocol for the development server */
  server_protocol       : string,
  /** The pattern used when locating test files */
  tests_pattern         : RegExp,
  /** Whether to run the test runner in watch mode */
  tests_watch           : boolean,
  /** The full path to the tests directory */
  tests_root            : string,
  /** Whether to enable verbose logging */
  verbose               : boolean,
}

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
  server_host?           : string,
  server_port?           : number,
  server_protocol?       : string,
  tests_pattern?         : RegExp,
  tests_watch?           : boolean,
  tests_root?            : string,
  verbose?               : boolean,
}

export interface GenesisTask {
  start: Function
}
