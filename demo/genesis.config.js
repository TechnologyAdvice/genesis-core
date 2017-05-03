const path = require('path')
const GenesisCore = require('../dist').default

exports.default = GenesisCore({
  basePath: __dirname,
  verbose: true,
  typescript: {
    configPath: path.resolve(__dirname, 'tsconfig.json'),
  },
})
