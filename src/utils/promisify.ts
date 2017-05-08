const promisify = (fn: Function) => (...args: Array<any>) => new Promise((resolve, reject) => {
  fn(...args, (err: Error, data: any) => {
    if (err) reject(err)
    else resolve(data)
  })
})

export default promisify
