import './utils/bail-on-rejected-promise'
import { ICompiler, ICompilerConfig } from './types'
import WebAppCompiler from './compilers/web-app'

const COMPILER_DEFAULTS: ICompilerConfig = {
  env          : process.env.NODE_ENV,
  main         : 'main',
  basePath     : process.cwd(),
  srcDir       : 'src',
  outDir       : 'dist',
  publicPath   : '/',
  templatePath : null,
  globals      : {},
  sourcemaps   : true,
  vendors      : [],
  verbose      : false,
}

export const createCompilerConfig = (overrides: Partial<ICompilerConfig>) => ({
  ...COMPILER_DEFAULTS,
  ...overrides,
})

export default (opts: Partial<ICompilerConfig>): ICompiler => {
  const config = createCompilerConfig(opts)
  config.env = config.env || 'development'
  return new WebAppCompiler(config)
}
