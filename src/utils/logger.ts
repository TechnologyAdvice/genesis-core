import * as chalk from 'chalk'
import * as figures from './figures'

// HACK: disable annoying loaderUtils warning
// TODO(zuko): remove this when fixed
;(() => {
  const reportError = console.error.bind(console)
  const ignore = /https\:\/\/github\.com\/webpack\/loader-utils\/issues\/56/
  console.error = (...args: Array<any>) => {
    if (ignore.test(args[0])) return
    return reportError(...args)
  }
})()

export const log = (...messages: Array<any>) => {
  console.log.apply(console, messages)
}

export const info = (...messages: Array<any>) => {
  console.info(chalk.cyan(figures.info, ...messages))
}

export const success = (...messages: Array<any>) => {
  log(chalk.green(figures.tick, ...messages))
}

export const warn = (...messages: Array<any>) => {
  console.warn(chalk.yellow(figures.warning, ...messages))
}

export const error = (...messages: Array<any>) => {
  console.warn(chalk.red(figures.cross, ...messages))
}
