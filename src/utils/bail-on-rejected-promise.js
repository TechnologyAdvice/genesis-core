const log = require('./log')

process.on('unhandledRejection', (err) => {
  log.error('Unhandled Promise rejection.')
  throw err
})
