export type Environment = 'development' | 'staging' | 'test' | 'production'

export interface ICompilerConfig {
  /** The environment to use when compiling the project */
  env          : Environment,
  /** The full path to the project's root directory */
  basePath     : string,
  /** The name of the directory containing the project's source code */
  srcDir       : string,
  /** The name of the directory in which to emit compiled code */
  outDir       : string
  /** The file name of the project's main entry point (defaults to main.js) */
  main         : string,
  /** The full path to the HTML template to use with the project */
  templatePath : string | null,
  /** The base path for all projects assets (relative to the root) */
  publicPath   : string,
  /** A hash map of keys that the compiler should treat as external to the project */
  externals    : Object,
  /** A hash map of variables and their values to expose globally */
  globals      : Object,
  /** The list of modules to compile separately from the core project code */
  vendors      : Array<string>,
  /** Whether to run the compiler with verbose logging */
  verbose      : boolean,
  /** Whether to minify the emitted code */
  minify       : boolean,
  /** Whether to generate sourcemaps */
  sourcemaps   : boolean,
  /** TypeScript configuration */
  typescript   : {
    /** The full path to the tsconfig.json file to use */
    configPath : string | null,
  }
}
export interface ICompiler {
  config: ICompilerConfig

  compile (opts?): Promise<any>
  run (opts?): Promise<any>
  test (opts?): Promise<any>
}

abstract class Compiler implements ICompiler {
  public config: ICompilerConfig

  constructor (config: ICompilerConfig) {
    this.config = config
  }

  abstract compile (opts?): Promise<any>
  abstract run (opts?): Promise<any>
  abstract test (opts?): Promise<any>
}

export default Compiler
