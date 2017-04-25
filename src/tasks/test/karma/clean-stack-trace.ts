import { contains, flatMap, join, pipe, prepend, reject, split, test, when } from 'halcyon'

export default function cleanStackTrace (stackTrace: string): string {
  let hasSeenStack = false
  return pipe([
    split('\n'),
    reject(test(/~/)), // exclude files from ~/node_modules
    flatMap(pipe([
      prepend('  '), // indent all lines
      when(contains('webpack:///'), line => {
        if (!hasSeenStack) {
          hasSeenStack = true
          const indent = line.slice(0, line.search(/\S/))
          line = `\n${indent}Stack:\n${line}`
        }
        line = line.replace('webpack:///', '')
        return line.slice(0, line.indexOf(' <- '))
      })
    ])),
    join('\n')
  ])(stackTrace)
}
