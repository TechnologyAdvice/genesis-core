const path = require('path')
const webpack = require('webpack')
const createWebpackConfig = require('./create-config')
const log = require('../utils/log')

const createWebpackCompiler = (config, opts) => {
  const start = () => new Promise((resolve, reject) => {
    const compiler = webpack(createWebpackConfig(config, opts))
    log.info('Starting compiler...')
    compiler.run((err, stats) => {
      if (err) return reject(err)

      const jsonStats = stats.toJson()
      if (jsonStats.errors.length) {
        jsonStats.errors.forEach(log.error)
        return reject(new Error('Compiler encountered build errors'))
      }
      resolve(stats)
    })
  })
    .then(tap((stats) => {
      console.log(stats.toString({
        colors: true,
        chunks: false,
        modules: false,
      }))
      log.success(`Successfully built assets to ${path.relative(process.cwd(), opts.out)}.`)
    }))

  return { start }
}

module.exports = createWebpackCompiler
