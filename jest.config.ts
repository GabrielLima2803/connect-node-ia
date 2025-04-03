import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/__tests__/**/*.spec.(ts|js)', '**/?(*.)+(spec|test).(ts|js)'],
};

export default config;
