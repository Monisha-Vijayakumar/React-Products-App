// jest.config.js
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|scss)$': 'jest-css-modules',
      },
  };
  