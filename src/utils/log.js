const chalk = require('chalk')
const figures = require('figures')

// HACK(zuko): silence ugly deprecation warnings from dependencies
const consoleError = console.error
console.error = (...messages) => {
  if (/Chunk\.modules is deprecated/.test(messages[0])) return
  return consoleError.apply(console, messages)
}

const logger = (level, color, symbol) => (...messages) =>
 (console[level] || console.log)(color(symbol, ...messages))

exports.info    = logger('info',    chalk.cyan,   figures.info)
exports.success = logger('success', chalk.green,  figures.tick)
exports.warn    = logger('warn',    chalk.yellow, figures.warning)
exports.error   = logger('error',   chalk.red,    figures.cross)

exports.clear = (() =>
  process.platform === 'win32'
    ? () => console.log('\x1Bc')
    : () => console.log('\x1B[2J\x1B[3J\x1B[H')
)()
