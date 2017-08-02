import './utils/bail-on-rejected-promise'
import { ICompiler, ICompilerConfig } from './types'
import WebAppCompiler from './compilers/web-app'

const COMPILER_DEFAULTS: ICompilerConfig = {
  basePath     : process.cwd(),
  entry        : 'src/main',
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
  return new WebAppCompiler(config)
}
