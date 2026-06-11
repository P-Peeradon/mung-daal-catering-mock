module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^#server/(.*)\\.ts$': '<rootDir>/server/$1.ts',
    '^#server/(.*)$': '<rootDir>/server/$1',
  },
  reporters: [
    'default',
    '<rootDir>/../unit-test-utility/txt-reporter.js'
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          rootDir: '.'
        }
      }
    ]
  }
};
