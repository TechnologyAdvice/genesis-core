import * as chalk from 'chalk'
import * as figures from './figures'

export const timestamp = () => {
  return `[${new Date().toLocaleTimeString(undefined, { hour12: false })}]`
}

export const log = (...messages: Array<any>) => {
  console.log.apply(console, [' ', ...messages])
}

export const info = (...messages: Array<any>) => {
  console.info(chalk.cyan(figures.info, timestamp(), ...messages))
}

export const success = (...messages: Array<any>) => {
  console.log(chalk.green(figures.tick, timestamp(), ...messages))
}

export const warn = (...messages: Array<any>) => {
  console.warn(chalk.yellow(figures.warning, timestamp(), ...messages))
}

export const error = (...messages: Array<any>) => {
  console.warn(chalk.red(figures.cross, timestamp(), ...messages))
}
