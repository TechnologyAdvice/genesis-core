import { default as createLogger } from 'debug'

type DebugLogger = (...messages: Array<any>) => void

export default function debug (namespace: string) {
  return createLogger(`genesis-core:${namespace}`) as DebugLogger
}
