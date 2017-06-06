import * as chalk from 'chalk'
import * as figures from './figures'

export const timestamp = () => {
  const timestamp = new Date().toLocaleDateString(undefined, {
    year   : '2-digit',
    month  : '2-digit',
    day    : '2-digit',
    hour   : '2-digit',
    minute : '2-digit',
    second : '2-digit',
  }).split(', ')[1]
  return `[${timestamp}]`
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
