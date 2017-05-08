import * as Karma from 'karma'

export default function createKarmaServer (config: Object): Promise<any> {
  return new Promise((resolve, reject) => {
    new Karma.Server(config, status => {
      if (status !== 0) {
        const error = new Error('Karma exited with a non-zero status code: ' + status)
        return reject(error)
      }
      resolve()
    }).start()
  })
}
