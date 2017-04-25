import { GenesisCoreConfig, GenesisTask } from '../../types'
import * as webpack from 'webpack'
import createDebugger from '../../utils/create-debugger'
import createWebpackConfig from '../../configs/create-webpack-config'
const debug = createDebugger('tasks:compile')

export type CompileTask = GenesisTask & {
  start: () => Promise<Object>
}
export default function compile (config: GenesisCoreConfig): CompileTask {
  debug('Initializing...')

  const compiler = webpack(createWebpackConfig(config))
  const start = () => {
    return new Promise((resolve, reject) => {
      debug('Starting compiler...')
      compiler.run((err, stats: Object) => {
        if (err) {
          debug('Compilation failed.')
          reject(err)
          return
        }
        debug('Compilation succeeded.')
        resolve(stats)
      })
    })
  }
  return { start }
}
