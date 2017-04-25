import { resolveLocalDependencyPath } from '../utils/paths'
import createDebugger from '../utils/create-debugger'
const debug = createDebugger('configs:babel')

export default function createBabelConfig (opts?: Object) {
  debug('Creating configuration...')

  const config = {
    plugins: [
      resolveLocalDependencyPath('babel-plugin-transform-runtime'),
    ],
    presets: [
      resolveLocalDependencyPath('babel-preset-react'),
      resolveLocalDependencyPath('babel-preset-es2015'),
      resolveLocalDependencyPath('babel-preset-stage-1'),
    ]
  }
  return Object.assign(config, opts)
}
