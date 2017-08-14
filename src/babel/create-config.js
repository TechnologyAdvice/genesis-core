const { resolveGenesisDependency } = require('../utils/fs')

const createBabelConfig = () => ({
  plugins: [
    resolveGenesisDependency('babel-plugin-transform-class-properties'),
    resolveGenesisDependency('babel-plugin-syntax-dynamic-import'),
    [
      resolveGenesisDependency('babel-plugin-transform-runtime'),
      {
        helpers: true,
        polyfill: false,
        regenerator: true,
      },
    ],
    [
      resolveGenesisDependency('babel-plugin-transform-object-rest-spread'),
      {
        usBuiltIns: true,
      },
    ],
  ],
  presets: [
    resolveGenesisDependency('babel-preset-react'),
    [resolveGenesisDependency('babel-preset-env'), {
      modules: false,
      targets: {
        browsers: ['last 2 versions'],
        ie9: true,
        uglify: true,
      },
    }],
  ],
})

module.exports = createBabelConfig
