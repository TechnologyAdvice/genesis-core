const path = require('path')

const DEFAULT_CONFIG = {
  srcPath    : path.resolve(process.cwd(), 'src'),
  globals    : {},
  sourcemaps : true,
  vendors    : [],
  verbose    : false,
}

const createConfig = merge(DEFAULT_CONFIG)

module.exports = createConfig
