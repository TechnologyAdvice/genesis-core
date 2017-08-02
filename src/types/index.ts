export interface ICompilerConfig {
  /** The full path to the project's root directory */
  basePath     : string,
  /** The file name of the project's main entry point (defaults to main.js) */
  entry        : string | Array<string>,
  /** The full path to the HTML file to use as the project template */
  templatePath : string | null,
  /** The base path for all projects assets (relative to the root) */
  publicPath   : string,
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
