const config = require('../genesis.config')
const genesis = require('@technologyadvice/genesis-core').default(config)

genesis.build()
  .then(stats => {
    console.log(stats.toString({
      colors: true,
      chunks: false,
    }))
  })
