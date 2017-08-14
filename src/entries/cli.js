require('../utils/bail-on-rejected-promise')
require('redash/installer')(global)
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const log = require('../utils/log')
const { fileExists } = require('../utils/fs')
const createCompiler = require('../create-compiler')

const mapDeep = curry((xform, functor) => map(cond([
  [isType('Object'), mapDeep(xform)],
  [isType('Array'), mapDeep(xform)],
  [T, xform]
]), functor))

/**
 * Replaces occurrences of ${ENV_VAR} templates with the value of $ENV_VAR.
 * Allows defaults with ${ENV_VAR,defaultValue} syntax.
 */
const interpolateEnvVar = curry((env, str) =>
  replace(/\$\{([^}]+)\}/g, (i, match) => {
    const [envVar, defaultValue] = match.split(',')
    return env[envVar] || defaultValue || ''
  }, str))

/** Loads the local genesis configuration from disk. */
const loadConfig = () => {
  const configPath = path.resolve(process.cwd(), 'genesis.yml')
  if (!fileExists(configPath)) {
    log.info('No `genesis.yml` file detected. The default configuration will be used.')
    return {}
  }
  return yaml.safeLoad(fs.readFileSync(configPath, 'utf8'))
}

/** Applies transformations to clean up a static genesis configuration. */
const processConfig = curry((env, config) => pipe([
  mapDeep(when(isType('String'), interpolateEnvVar(env)))
])(config))

/** Primary CLI entry point. */
const cli = (env, task, opts) => Promise.resolve()
  .then(loadConfig)
  .then(processConfig(env))
  .then(createCompiler)
  .then((compiler) => compiler[task](opts))

module.exports = cli
