import * as path from 'path'

export const resolveGenesisPath = (target: string): string =>
  path.resolve(__dirname, '../../' + target)

export const resolveGenesisDependency = (target: string): string =>
  require.resolve(target)
