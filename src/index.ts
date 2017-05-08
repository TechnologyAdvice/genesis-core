import { ICompiler, ICompilerConfig } from './lib/compiler'
import WebAppCompiler from './compilers/web-app'
import * as logger from './utils/logger'

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
  sourcemaps   : true,
  typescript   : {
    configPath : null,
  }
}

export default (opts: Partial<ICompilerConfig>): ICompiler => {
  // TODO(zuko): need to support deep merging
  const config: ICompilerConfig = Object.assign({}, COMPILER_DEFAULTS, opts)

  if (!config.env) {
    config.env = 'development'
    logger.warn(
      'No environment detected; using "development" as the default environment.\n  ' +
      'Set process.env.NODE_ENV or the "env" property in your genesis configuration.'
    )
  }
  // TODO(zuko): figure out the best place for this. Bigger question is how to best
  // organize environment-specific overrides.
  if (config.env === 'production' || config.env === 'staging') {
    config.minify = true
  }

  return new WebAppCompiler(config)
}
