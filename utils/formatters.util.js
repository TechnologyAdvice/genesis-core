const { chain, contains, join, pipe, prepend, reject, split, test, when } = require('redash')

// cleanStackTrace : String -> String
const cleanStackTrace = (stackTrace) => {
  let hasSeenStack = false
  return pipe(
    split('\n'),
    reject(test(/~/)), // exclude files from ~/node_modules
    chain(pipe(
      // prepend('  '), // indent all lines
      when(contains('webpack:///'), (line) => {
        if (!hasSeenStack) {
          hasSeenStack = true
          const indent = line.slice(0, line.search(/\S/))
          line = `\n${indent}Stack:\n${line}`
        }
        line = line.replace('webpack:///', '')
        return line.slice(0, line.indexOf(' <- '))
      })
    )),
    join('\n')
  )(stackTrace)
}

exports.cleanStackTrace = cleanStackTrace