/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx,js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx,js,jsx}'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'lucide-react': '<rootDir>/__mocks__/lucide-react.js',
    // CSS and style imports
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    // Asset imports  
    '\\.(jpg|jpeg|png|gif|svg|ico|webp)$': '<rootDir>/__mocks__/file-mock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lucide-react|@lucide)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/app/**', // Exclude Next.js app directory
  ],
  testTimeout: 15000,
  verbose: false,
  silent: false,
  // Performance optimizations
  maxWorkers: '50%',
  cacheDirectory: '<rootDir>/.next/cache/jest',
  watchman: true,
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/out/'
  ],
  // Fast mode optimizations
  bail: false,
  clearMocks: true,
  restoreMocks: true,
  detectOpenHandles: false,
  detectLeaks: false
};

module.exports = config;
