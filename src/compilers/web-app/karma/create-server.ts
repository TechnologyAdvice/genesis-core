import * as Karma from 'karma'

export interface KarmaServer {
  start: () => Promise<any>
}
export default function createKarmaServer (config: Object): KarmaServer {
  const start = () => new Promise((resolve, reject) => {
    const server = new Karma.Server(config, status => {
      if (status !== 0) {
        const error = new Error('Karma exited with a non-zero status code: ' + status)
        reject(error)
        return
      }
      resolve()
    })
    server.start()
  })
  return { start }
}
