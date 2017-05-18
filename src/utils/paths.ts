import * as path from 'path'

export const findGenesisFile = (target: string): string =>
  path.resolve(__dirname, '../../' + target)

export const findGenesisDependency = (target: string): string | never => {
  const [filepath, query = ''] = target.split('?')
  return require.resolve(filepath) + (query ? '?query' : '')
}
