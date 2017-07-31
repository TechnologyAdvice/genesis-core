import * as logger from './logger'

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise rejection.')
  throw err
})
