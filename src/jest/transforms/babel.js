
const babelJest = require('babel-jest')
const { resolveGenesisDependency } = require('../../utils/fs')
const config = require('../../babel/create-config')()

config.babelrc = false
config.plugins.push(resolveGenesisDependency('babel-transform-es2015-modules-commonjs'))

module.exports = babelJest.createTransformer(config)
