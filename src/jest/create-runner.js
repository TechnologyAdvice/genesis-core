const jest = require('jest')
const { resolveGenesisDependency, resolveGenesisFile } = require('../utils/fs')

const createJestTestRunner = (config) => {
  const jestConfig = {
    rootDir: process.cwd(),
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    setupFiles: [],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.(spec|test).(js|jsx|ts|tsx)',
      '<rootDir>/test/**/*.(spec|test).(js|jsx|ts|tsx)',
      '<rootDir>/tests/**/*.(spec|test).(js|jsx|ts|tsx)',
    ],
    globals: config.globals,
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.tsx?$': resolveGenesisDependency('ts-jest/preprocessor.js'),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': resolveGenesisFile('src/jest/mocks/file-mock.js'),
      '\\.(sass|scss|css)$': resolveGenesisFile('src/jest/mocks/style-mock.js'),
      '~(.*)$': '<rootDir>/src/$1',
    },
  }
  return {
    start: () => jest.run(['--config', JSON.stringify(jestConfig)]),
    watch: () => jest.run(['--config', JSON.stringify(jestConfig), '--watch']),
  }
}

module.exports = createJestTestRunner
