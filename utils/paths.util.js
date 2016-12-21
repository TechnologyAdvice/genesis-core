const path = require('path')

// resolveLocalPath : String -> String
const resolveLocalPath = target =>
  path.resolve(__dirname, '../' + target)

// resolveLocalDependencyPath : String -> String
const resolveLocalDependencyPath = target =>
  resolveLocalPath('node_modules/' + target)

exports.resolveLocalPath = resolveLocalPath
exports.resolveLocalDependencyPath = resolveLocalDependencyPath