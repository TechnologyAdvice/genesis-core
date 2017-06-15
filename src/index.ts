import { ICompiler, ICompilerConfig } from './types'
import WebAppCompiler from './compilers/web-app'
import * as logger from './utils/logger'

const COMPILER_DEFAULTS: ICompilerConfig = {
  env          : process.env.NODE_ENV,
  projectType  : 'web-app',
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
  sourcemaps   : true,
  typescript   : {
    configPath : null,
  }
}

export default (opts: Partial<ICompilerConfig>): ICompiler => {
  const config: ICompilerConfig = {
    ...COMPILER_DEFAULTS,
    ...opts,
    typescript: {
      ...COMPILER_DEFAULTS.typescript,
      ...(opts && opts.typescript),
    }
  }

  if (!config.env) {
    config.env = 'development'
    logger.warn(
      'No environment detected; using "development" as the default environment.\n  ' +
      'Set process.env.NODE_ENV or the "env" property in your genesis configuration.'
    )
  }
  switch (config.projectType) {
    case 'web-app':
      return new WebAppCompiler(config)
    case 'library':
      throw new Error('Library project type not yet implemented.')
    default:
      throw new Error('Unrecognized project type.')
  }
}
