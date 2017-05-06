import * as figures from 'figures'
import * as chalk from 'chalk'

// HACK: disable annoying loaderUtils warning
;(() => {
  const reportError = console.error.bind(console)
  const ignore = /https\:\/\/github\.com\/webpack\/loader-utils\/issues\/56/
  console.error = (...args: Array<any>) => {
    if (ignore.test(args[0])) return
    return reportError(...args)
  }
})()

export const info = (...messages: Array<any>) => {
  console.info(chalk.cyan(figures.info, ...messages))
}

export const success = (...messages: Array<any>) => {
  console.log(chalk.green(figures.tick, ...messages))
}

export const warn = (...messages: Array<any>) => {
  console.warn(chalk.yellow(figures.warning, ...messages))
}

export const error = (...messages: Array<any>) => {
  console.warn(chalk.red(figures.cross, ...messages))
}

