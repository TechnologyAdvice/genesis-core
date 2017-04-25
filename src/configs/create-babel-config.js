const { map, pipe, prepend } = require('halcyon')
const { resolveLocalDependencyPath } = require('../utils/paths.util')

function createBabelConfig (opts) {
  const config = Object.assign({
    plugins: map(pipe([prepend('babel-plugin-'), resolveLocalDependencyPath]),
                 ['transform-runtime']),
    presets: map(pipe([prepend('babel-preset-'), resolveLocalDependencyPath]),
                 ['react', 'es2015', 'stage-1']),
  }, opts)
  return config
}

module.exports = createBabelConfig
