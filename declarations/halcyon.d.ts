declare namespace H {
  type KeyValuePair = [string, any]

  interface API {
    isEmpty (x: any): boolean
    keys (obj: Object): Array<string>
    toPairs (obj: Object): Array<KeyValuePair>
  }
}

declare module 'halcyon' {
  var halcyon: H.API
  export = halcyon
}
