const jest = require('jest')
import { resolveGenesisDependency } from '../utils/paths'
import { ICompilerConfig } from '../types'

export default function createJestTestRunner (config: ICompilerConfig, opts: any) {
  const jestConfig = {
    rootDir: config.basePath,
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    setupFiles: [],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.(spec|test).(js|jsx|ts|tsx)',
      '<rootDir>/test/**/*.(spec|test).(js|jsx|ts|tsx)',
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.tsx?$': resolveGenesisDependency('ts-jest/preprocessor.js'),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleNameMapper: {
      '~(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  }
  return {
    start: () => jest.run(['--config', JSON.stringify(jestConfig)]),
    watch: () => jest.run(['--config', JSON.stringify(jestConfig), '--watch']),
  }
}
