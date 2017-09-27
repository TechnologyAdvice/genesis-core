const log = require('./log')

let BAIL_ON_REJECTED_PROMISE = true

exports.enable = () => BAIL_ON_REJECTED_PROMISE = true
exports.disable = () => BAIL_ON_REJECTED_PROMISE = false

process.on('unhandledRejection', (err) => {
  log.error('Unhandled Promise rejection.')
  if (BAIL_ON_REJECTED_PROMISE) {
    throw err
  } else {
    if (err) log.error(err)
  }
})
