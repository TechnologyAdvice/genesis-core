import { cond, identity, map, isType } from 'redash'
import * as fs from 'fs'
import * as path from 'path'
import createCompiler from '../index'
const yaml = require('js-yaml')
const argv = require('yargs').argv

const inProject = (pathname: string): string =>
  path.resolve(process.cwd(), pathname)

export const interpolateEnvVar = (str: string) => {
  if (!/\$\{([^}]+)\}/.test(str)) return str

  const interpolated = str.replace(/\$\{([^}]+)\}/g, (i, match) => {
    const [envVar, defaultValue] = match.split(',')
    return process.env[envVar] || defaultValue || ''
  })
  return interpolated
}

export const normalizeConfig = (config: any): any =>
  map(cond([
    [isType('String'), interpolateEnvVar],
    [isType('Object'), normalizeConfig],
    [isType('Array'), normalizeConfig],
    [() => true, identity],
  ]), config)

export default async function genesis () {
  const rawConfig = yaml.safeLoad(fs.readFileSync(inProject('genesis.yml'), 'utf8'))
  const { tasks = {} as any, ...config } = normalizeConfig(rawConfig)
  if (config.globals) config.globals = map(JSON.stringify, config.globals)

  const opts = { ...argv }
  const task = argv._
  delete opts._
  delete opts['$0']
  const compiler = createCompiler(config) as any
  await compiler[task]({
    ...tasks[task],
    ...opts,
  })
}
