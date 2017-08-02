export type Environment =
  'development'
| 'staging'
| 'test'
| 'production'

export interface ICompilerConfig {
  /** The environment to use when building the project */
  env          : Environment,
  /** The full path to the project's root directory */
  basePath     : string,
  /** The name of the directory containing the project's source code */
  srcDir       : string,
  /** The name of the directory in which to emit compiled code */
  outDir       : string
  /** The file name of the project's main entry point (defaults to main.js) */
  main         : string,
  /** The full path to the HTML file to use as the project template */
  templatePath : string | null,
  /** The base path for all projects assets (relative to the root) */
  publicPath   : string,
  /** A hash map of keys that the compiler should treat as external to the project */
  externals    : {
    [key: string] : string,
  },
  /** A hash map of identifiers and their values to expose as global variables */
  globals      : Object,
  // TODO(zuko): figure out a better name
  /** The list of modules to compile separately from the core project code */
  vendors      : Array<string>,
  /** Whether to enable verbose logging */
  verbose      : boolean,
  /** Whether to generate sourcemaps */
  sourcemaps   : boolean,
}

export interface ICompiler {
  build (opts?: any): Promise<any>
  start (opts?: any): Promise<any>
  test (opts?: any): Promise<any>
}
