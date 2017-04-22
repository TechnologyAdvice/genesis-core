const fs = require('fs')
const path = require('path')

// pathExists : String -> Boolean
const pathExists = target => {
  try {
    fs.accessSync(target)
    return true
  } catch (e) {
    return false
  }
}

// resolveLocalPath : String -> String
const resolveLocalPath = target =>
  path.resolve(__dirname, '../' + target)

// resolveLocalDependencyPath : String -> String
// TODO: this is too naive
const resolveLocalDependencyPath = target => {
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

exports.resolveLocalPath = resolveLocalPath
exports.resolveLocalDependencyPath = resolveLocalDependencyPath
