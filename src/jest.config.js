export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/migrations/',
    '/config/'
  ],
  collectCoverageFrom: [
    'controllers/*.js',
    'middlewares/*.js',
    'models/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  verbose: true,
  testTimeout: 10000
};
