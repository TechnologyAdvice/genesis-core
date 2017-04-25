import { GenesisCoreConfig, GenesisTask } from '../../types'
import * as path from 'path'
import * as express from 'express'
import createDebugger from '../../utils/create-debugger'
import createDevMiddleware from './create-dev-middleware'
const debug = createDebugger('tasks:develop')

export type DevelopTask = GenesisTask & {
  start: () => Promise<Object>
}
export default function develop (config: GenesisCoreConfig): DevelopTask {
  debug('Creating server...')

  const app = express()
  app.use(require('connect-history-api-fallback')())
  app.use(createDevMiddleware(config))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since the contents of directory will be copied
  // into ~/dist when the application is compiled.
  app.use(express.static(path.resolve(config.project_root, 'public')))
  app.start = () => new Promise((resolve) => {
    app.listen(config.server_port, () => {
      debug(`Listening at http://localhost:${config.server_port}.`)
      resolve(app)
    })
  })

  return app
}
