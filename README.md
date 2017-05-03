<div align="center">
  <h1>genesis-core</h1>
  <p>Simplified build tooling for a complicated world</p>
</div>

## Tasks

Each task returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which resolves if the task completes successfully, or rejects if an error occurred during its execution. For long running tasks, such as [develop](#develop), the promise resolves once the task starts successfully, it does not wait for the process to exit.

### Develop
Start a live development server.

```js
require('genesis-core').develop()
```

### Compile
Compile the application to disk.

```js
require('genesis-core').compile()
```

### Test
Run the test suite.

```js
require('genesis-core').test()
```

### Sandbox
Run select application modules in a sandbox environment.

```js
require('genesis-core').sandbox()
```

## Configuration

## TODO
* [ ] Separate task-specific configuration from global config
* [ ] Clean up webpack configuration
* [ ] Enable test mocking