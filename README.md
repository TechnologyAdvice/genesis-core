<div align="center">
  <h1>genesis-core</h1>
  <p>Simplified build tooling for a complicated world</p>
</div>

## Tasks

Tasks provided by genesis-core all follow the same API. They are all called with a single, optional argument: a [Genesis Config](#configuration) object. Keys passed to this configuration will override their corresponding defaults.

Each task returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which resolves if the task completes successfully, or rejects if an error occurred during its execution. For long running tasks, such as [develop](#develop), the promise resolves once the task starts successfully, it does not wait for the process to exit.

### Develop
Start a live development server.

```js
require('genesis-core').develop(/* optional config */)
```

### Compile
Compile the application to disk.

```js
require('genesis-core').compile(/* optional config */)
```

### Test
Run the test suite.

```js
require('genesis-core').test(/* optional config */)
```

## Configuration

```ts
/** The application environment, comparable to process.env.NODE_ENV */
env?                   : string,

/** The full path to the root of the project */
project_root?          : string,

/** The full path to the project's source code directory */
project_src?           : string,

/** The full path to where the compiled files will be emitted */
project_dist?          : string,

/** The full path(s) to the application entry point(s) */
compiler_main?         : string | Array<string>,

/** Variables to expose to the application's global context */
compiler_globals?      : Object,

/** The full path to the project's HTML template */
compiler_template?     : string,

/** Whether to transpile the source code to ES5 with Babel */
compiler_transpile?    : boolean,

/** Autoprefixer options for the Sass loader */
compiler_autoprefixer? : Array<string>,

/** Whether preact is being used in place of React */
compiler_preact?       : boolean,

/** Vendor dependencies to compile separately from the application */
compiler_vendors?      : Array<string>,

/** The host for the development server */
server_host?           : string,

/** The port for the development server */
server_port?           : number,

/** The protocol for the development server */
server_protocol?       : string,

/** The pattern used when locating test files */
tests_pattern?         : RegExp,

/** Whether to run the test runner in watch mode */
tests_watch?           : boolean,

/** The full path to the tests directory */
tests_root?            : string,

/** Whether to enable verbose logging */
verbose?               : boolean,
```
