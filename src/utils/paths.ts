import * as fs from 'fs'
import * as path from 'path'

export const resolveGenesisPath = (target: string): string =>
  path.resolve(__dirname, '../../' + target)

export const resolveGenesisDependency = (target: string): string =>
  require.resolve(target)

export const fileExists = (target: string): boolean => {
  try {
    fs.statSync(target).isFile()
    return true
  } catch (e) {
    return false
  }
}
