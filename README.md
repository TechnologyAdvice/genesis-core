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
  /** The full path to the project's source directory */
  srcPath      : string,
  /** A hash map of variables and their values to expose globally */
  globals      : { [key: string]: any },
  /** The list of modules to compile separately from the core project code */
  vendors      : Array<string>,
  /** Whether to run the compiler with verbose logging */
  verbose      : boolean,
  /** Whether to generate sourcemaps */
  sourcemaps   : boolean
}
```
