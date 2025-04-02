/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Для ESM убираем .js в импортах
  },
  transform: {
    '^.+\\.ts$': 'ts-jest', // Обработка TypeScript
  },
  testMatch: ['**/?(*.)+(spec|test).ts'], // Поиск файлов .spec.ts или .test.ts
};
