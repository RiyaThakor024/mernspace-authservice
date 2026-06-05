const { createDefaultPreset } = require("ts-jest")

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {...tsJestTransformCfg},
  verbose: true,
  collectCoverage: true,
  coverageProvider: "v8",
  collectCoverageFrom: ["src/**/*.ts", "!tests/**", "!**/node_modules/**"],
};

module.exports = config;

