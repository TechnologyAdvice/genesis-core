<div align="center">
  <h1>Genesis Core</h1>
  <p>Simplified build tooling for a <a href="https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md">complected</a> world</p>
</div>

Take advantage of the modern JavaScript ecosystem without any of the headache. Genesis Core provides a consistent, simplified interface over powerful build tooling. [Configure](#configuration) it once and get to work; you'll enjoy the same experience whether you're building a [Single Page Application](#web-app) or [distributable NPM package](#npm-package).

## Table of Contents
1. [Features](#features)
1. [Installation](#installation)
1. [Targets](#usage)
1. [Configuration](#configuration)

## Installation

```bash
$ npm install --save-dev @technologyadvice/genesis-core
```

## Targets
* [Web App](#web-app)
* [NPM Package](#npm-package)

### Web App

This compiler is still in progress.

### NPM Package

This compiler is still in progress.

## Configuration

```js
{
  /** The environment to use when compiling the project */
  env          : Environment,
  /** The full path to the project's root directory */
  basePath     : string,
  /** The name of the project's source code directory */
  srcDir       : string,
  /** The name of the directory in which to emit compiled code */
  outDir       : string
  /** The file name of the project's main entry point. Defaults to main.{js,ts} */
  main         : string,
  /** The full path to the HTML template to use with the project */
  templatePath : string | null,
  /** The base path for all projects assets (relative to the document root) */
  publicPath   : string,
  /** A hash map of modules to replace with external global references */
  externals    : { [key: string]: string },
  /** A hash map of variables and their values to expose globally */
  globals      : { [key: string]: any },
  /** The list of modules to compile separately from the core project code */
  vendors      : Array<string>,
  /** Whether to run the compiler with verbose logging */
  verbose      : boolean,
  /** Whether to generate sourcemaps */
  sourcemaps   : boolean,
  /** TypeScript-specific configuration */
  typescript   : {
    /** The full path to the tsconfig.json file to use */
    configPath : string | null,
  }
}
```