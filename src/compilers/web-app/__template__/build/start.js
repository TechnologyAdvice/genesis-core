const config = require('../genesis.config')
const genesis = require('@technologyadvice/genesis-core').default(config)

genesis.start({
  host: 'localhost',
  port: 3000,
})
