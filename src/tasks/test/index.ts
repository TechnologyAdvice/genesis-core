import { GenesisCoreConfig, GenesisTask } from '../../types'
import * as karma from 'karma'
import createDebugger from '../../utils/create-debugger'
import createKarmaConfig from './karma/create-config'
const debug = createDebugger('tasks:test')

export type TestTask = GenesisTask & {
  start: () => Promise<Object>,
}
export default function test (config: GenesisCoreConfig): TestTask {
  debug('Initializing...')

  function start () {
    debug('Starting test runner...')
    return new Promise((resolve, reject) => {
      const server = new karma.Server(createKarmaConfig(config), code => {
        if (code !== 0) {
          debug('Test runner failed to start.')
          reject(code)
          return
        }
        debug('Test runner started successfully.')
        resolve(server)
      })
      server.start()
    })
  }
  return { start }
}
