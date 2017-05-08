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
  /** A hash map of variables and their values to expose globally */
  globals      : Object,
  // TODO(zuko): figure out a better name
  /** The list of modules to compile separately from the core project code */
  vendors      : Array<string>,
  /** Whether to run the compiler with verbose logging */
  verbose      : boolean,
  /** Whether to minify the emitted code */
  minify       : boolean,
  /** Whether to generate sourcemaps */
  sourcemaps   : boolean,
  /** TypeScript-specific configuration */
  typescript   : {
    /** The full path to the tsconfig.json file to use */
    configPath : string | null,
  }
}

export interface ICompiler {
  compile (opts?: any): Promise<any>
  run (opts?: any): Promise<any>
  test (opts?: any): Promise<any>
}
