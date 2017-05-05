require('../genesis.config').default.compile()
  .then(stats => {
    console.log(stats.toString({
      colors: true,
      chunks: false,
    }))
  })
