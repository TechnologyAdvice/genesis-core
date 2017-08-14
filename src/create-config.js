const path = require('path')

const DEFAULT_CONFIG = {
  entry        : path.resolve(process.cwd(), 'src/index'),
  templatePath : path.resolve(process.cwd(), 'src/index.html'),
  vendors      : [],
  alias        : {},
  globals      : {},
  sourcemaps   : true,
  verbose      : false,
  transpile    : true,
}

const normalizeConfig = (config) => {
  const normalized = Object.assign({}, config)
  normalized.entry = [].concat(config.entry)
  return normalized
}

const createConfig = pipe([
  merge(DEFAULT_CONFIG),
  normalizeConfig,
])

module.exports = createConfig
