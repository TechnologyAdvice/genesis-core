#!/usr/bin/env node
const { omit } = require('redash')
const { argv } = require('yargs')

require('../src//entries/cli')(process.env, argv._, omit(['_', '$0'], argv))
