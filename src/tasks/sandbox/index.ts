import { GenesisCoreConfig, GenesisTask } from '../../types'
import * as path from 'path'
import createDebugger from '../../utils/create-debugger'
import createDevServer, { DevServer } from '../../utils/create-dev-server'
const debug = createDebugger('tasks:sandbox')

export type SandboxTask = GenesisTask & {
  start: () => Promise<DevServer>
}
export default function sandbox (config: GenesisCoreConfig, componentPath: string): SandboxTask {
  debug('Creating sandbox...')
  if (!componentPath) {
    throw new Error('Component path is required')
  }

  return createDevServer({
    ...config,
    env: 'development',
    compiler: {
      ...config.compiler,
      main: path.resolve(__dirname, '../../templates/sandbox.js'),
      vendors: [],
      globals: {
        __DEV__: true,
        __COMPONENT_PATH__: JSON.stringify(componentPath),
      } as any,
    }
  })
}
