require('../../dist').compile(require('../genesis.config'))
  .then(stats => {
    console.log(stats.toString({
      colors: true,
      chunks: false,
    }))
  })
