<div align="center">
  <h1>genesis-core</h1>
  <p>Simplified build tooling for a complicated world</p>
</div>

A simplified interface over advanced build tooling that allows you to take advantage of the modern JavaScript ecosystem without any of the headache. The interface, configuration, and usage of genesis-core remains the same no matter what type of project you are developing, including Single Page Applications and distributable NPM libraries.

## Table of Contents
1. [Features](#features)
1. [Installation](#installation)
1. [Usage](#usage)
1. [Configuration](#configuration)

## Features

* [TypeScript]
* [Live Development]
* [Browser Testing]
* [Transpilation]
* [Production Optimizations]

## Installation

```bash
# For Yarn users (recommended)
yarn add @technologyadvice/genesis-core

# For NPM users
npm install --save @technologyadvice/genesis-core
```

## Usage

## Configuration

```js
{
  /** The environment to use when compiling the project */
  env          : Environment,
  /** The full path to the project's root directory */
  basePath     : string,
  /** The name of the directory containing the project's source code */
  srcDir       : string,
  /** The name of the directory in which to emit compiled code */
  outDir       : string
  /** The file name of the project's main entry point (defaults to main.js) */
  main         : string,
  /** The full path to the HTML template to use with the project */
  templatePath : string | null,
  /** The base path for all projects assets (relative to the root) */
  publicPath   : string,
  /** A hash map of keys that the compiler should treat as external to the project */
  externals    : Object,
  /** A hash map of variables and their values to expose globally */
  globals      : Object,
  /** The list of modules to compile separately from the core project code */
  vendors      : Array<string>,
  /** Whether to run the compiler with verbose logging */
  verbose      : boolean,
  /** Whether to minify the emitted code */
  minify       : boolean,
  /** Whether to generate sourcemaps */
  sourcemaps   : boolean,
  /** TypeScript configuration */
  typescript   : {
    /** The full path to the tsconfig.json file to use */
    configPath : string | null,
  }
}
```