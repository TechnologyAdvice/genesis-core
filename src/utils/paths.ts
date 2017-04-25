import * as fs from 'fs'
import * as path from 'path'

const pathExists = (target: string): boolean => {
  try {
    fs.accessSync(target)
    return true
  } catch (e) {
    return false
  }
}

// Finds a file from the genesis-core package
export const resolveLocalPath = (target: string): string =>
  path.resolve(__dirname, '../../' + target)

// Finds a dependency from the genesis-core package
// TODO: this is too naive
export const resolveLocalDependencyPath = (target: string): string | never => {
  const [filepath, query = ''] = target.split('?')
  const localNodeModulePath = resolveLocalPath('node_modules/' + filepath)
  if (pathExists(localNodeModulePath)) {
    return localNodeModulePath + (query ? `?${query}`: '')
  }
  let currentPath = resolveLocalPath('..')
  do {
    const filePath = path.resolve(currentPath + '/' + filepath)
    if (pathExists(filePath)) {
      return filePath + (query ? `?${query}`: '')
    }
    currentPath = path.resolve(currentPath, '..')
  } while (currentPath.split(path.sep).length > 2)
  throw new Error(
    'Could not locate following dependency in the file system: ' +
    target
  )
}
