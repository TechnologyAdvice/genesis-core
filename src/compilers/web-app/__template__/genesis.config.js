const path = require('path')

module.exports = {
  /** The environment to use when building the project */
  env          : process.env.NODE_ENV || 'development',
  /** The full path to the project's root directory */
  basePath     : __dirname,
  /** The name of the directory containing the project's source code */
  srcDir       : 'src',
  /** The name of the directory in which to emit compiled code */
  outDir       : 'dist',
  /** The file name of the project's main entry point (defaults to main.js) */
  main         : 'main',
  /** The full path to the HTML file to use as the project template */
  templatePath : path.resolve(__dirname, 'src/index.html'),
  /** The base path for all projects assets (relative to the root) */
  publicPath   : '/',
  /** A hash map of keys that the compiler should treat as external to the project */
  externals    : {},
  /** A hash map of identifiers and their values to expose as global variables */
  globals      : {},
  /** The list of modules to compile separately from the core project code */
  vendors      : [
    'react',
    'react-dom',
  ],
  /** Whether to enable verbose logging */
  verbose      : false,
  /** Whether to generate sourcemaps */
  sourcemaps   : true,
  /** TypeScript-specific configuration */
  typescript   : {
    /** The full path to the tsconfig.json file to use */
    configPath : path.resolve(__dirname, 'tsconfig.json'),
  }
}
