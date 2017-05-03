import { ICompiler, ICompilerConfig } from './lib/compiler'
import WebpackCompiler from './targets/webpack'

const COMPILER_DEFAULTS: ICompilerConfig = {
  env          : process.env.NODE_ENV,
  main         : 'main',
  basePath     : process.cwd(),
  srcDir       : 'src',
  outDir       : 'dist',
  publicPath   : '/',
  templatePath : null,
  externals    : {},
  globals      : {},
  vendors      : [],
  verbose      : false,
  minify       : false,
  typescript   : {
    configPath : null,
  }
}

export default (opts: Partial<ICompilerConfig>): ICompiler | any => {
  const config = Object.assign({}, COMPILER_DEFAULTS, opts)

  if (!config.env) {
    config.env = 'development'
    console.warn(
      '\n!!! [ WARNING ] !!!\n' +
      'No environment detected; using "development" as the default environment.\n' +
      'Set process.env.NODE_ENV or the "env" property in your genesis configuration.' +
      '\n'
    )
  }

  return new WebpackCompiler(config)
}
