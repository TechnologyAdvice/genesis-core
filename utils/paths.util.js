const path = require('path')

const resolveLocalDependencyPath = (dependency) =>
  path.resolve(__dirname, '../node_modules/' + dependency)

exports.resolveLocalDependencyPath = resolveLocalDependencyPath