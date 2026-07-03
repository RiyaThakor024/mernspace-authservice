const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',
    transform: { ...tsJestTransformCfg },
    // ensure all spec files under tests/ are discovered
    testMatch: ['<rootDir>/tests/**/*.spec.ts'],
    verbose: true,
    testTimeout: 30000,
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.ts', '!tests/**', '!**/node_modules/**'],
};

module.exports = config;
