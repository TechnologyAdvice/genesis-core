export type Environment = 'development' | 'staging' | 'test' | 'production'
export interface ICompilerConfig {
  env          : Environment,
  basePath     : string,
  srcDir       : string,
  outDir       : string
  publicPath   : string,
  main         : string,
  templatePath : string | null,
  externals    : Object,
  globals      : Object,
  vendors      : Array<string>,
  verbose      : boolean,
  minify       : boolean,
  typescript   : {
    configPath : string | null,
  }
}
export interface ICompiler {
  config: ICompilerConfig

  dev (opts?): Promise<any>
  run (opts?): Promise<any>
}

abstract class Compiler implements ICompiler {
  public config: ICompilerConfig

  constructor (config: ICompilerConfig) {
    this.config = config
  }

  abstract dev (opts?)
  abstract run (opts?)
}

export default Compiler
