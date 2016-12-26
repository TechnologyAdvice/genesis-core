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
    return localNodeModulePath + query
  }
  const parentNodeModulePath = resolveLocalPath('../' + filepath)
  if (pathExists(parentNodeModulePath)) {
    return parentNodeModulePath + query
  }
  throw new Error(
    'Could not locate following dependency in the file system: ' +
    target
  )
}

exports.resolveLocalPath = resolveLocalPath
exports.resolveLocalDependencyPath = resolveLocalDependencyPath