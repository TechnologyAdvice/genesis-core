import { GenesisCoreOptions } from './types'
import createGenesisConfig from './configs/create-genesis-config'

export const compile = (opts: GenesisCoreOptions) =>
  require('./tasks/compile').default(createGenesisConfig(opts)).start()

export const develop = (opts: GenesisCoreOptions) =>
  require('./tasks/develop').default(createGenesisConfig(opts)).start()

export const test = (opts: GenesisCoreOptions) =>
  require('./tasks/test').default(createGenesisConfig(opts)).start()

export const createDevMiddleware = (opts: GenesisCoreOptions) =>
  require('./tasks/develop/create-dev-middleware').default(createGenesisConfig(opts))
