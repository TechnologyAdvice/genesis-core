const fs = require('fs')
const path = require('path')

exports.resolveGenesisFile = (target) =>
  path.resolve(__dirname, '../../' + target)

exports.resolveGenesisDependency = (target) =>
  require.resolve(target)

exports.fileExists = (target) => {
  try {
    fs.statSync(target).isFile()
    return true
  } catch (e) {
    return false
  }
}
