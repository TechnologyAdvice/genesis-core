<div align="center">
  <h1>Genesis Core</h1>
  <p>Simplified build tooling for a <a href="https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md">complected</a> world</p>
</div>

Take advantage of the modern JavaScript ecosystem without any of the headache. Genesis Core provides a consistent, simplified interface over powerful build tooling. [Configure](#configuration) it once and get to work; you'll enjoy the same experience whether you're building a [Single Page Application](#web-app) or [distributable NPM package](#npm-package).

## Table of Contents
1. [Features](#features)
1. [Installation](#installation)
1. [Usage](#usage)

## Installation

It's recommended to install Genesis Core as a project-level dependency, and not a global depdendency. This will give you the freedom to run multiple projects independently and will provide more fine-grained control over upgrades.

```bash
# Yarn (recommended)
yarn add --dev @technologyadvice/genesis-core

# NPM
npm install --save-dev @technologyadvice/genesis-core
```

## Targets
* [Web App](#web-app)
* [NPM Package](#npm-package)

### Web App

This compiler is still in progress.

### NPM Package

This compiler is still in progress.

## Usage

Genesis is configured with the same options no matter which API is used.

### Configuration

```js
{
  entry        : string | Array<string>,      // path(s) to your application entry point(s)
  templatePath : string,                      // path to your main index.html file
  vendors      : Array<string>,               // package names to bundle separately
  alias        : { [key: string]: string },   // module resolution aliases
  globals      : { [key: string]: any },      // variables to expose globally
  sourcemaps   : boolean,                     // generate sourcemaps?
  verbose      : boolean,                     // enable more verbose output?
  transpile    : boolean | 'typescript',      // transpile? `true` defaults to babel
}
```

### Command Line Interface

After [installing](#installation) Genesis Core in your project, you can use the `gen` binary to run tasks. To do this, configure your `package.json` scripts to run `gen` commands.

```json
{
  "scripts": {
    "start": "gen start",
    "build": "gen build",
    "test": "gen test"
  }
}
```

Once this is done, you can run these just like any other npm command. Note that you can also pass options to the genesis task:

```sh
npm start -- --port 3000
```

### Node API

```js
const genesis = require('@technologyadvice/genesis-core')

const compiler = genesis({
  // your genesis configuration
})

// Each task returns a promise:
compiler.build()
  .then(() => { /* app has been built! */ })

// You can pass task-specific option:
compiler.start({ host: 'localhost', port: 3000 })
compiler.test({ watch: true })
```
