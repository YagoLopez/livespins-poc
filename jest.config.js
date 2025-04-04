// jest.config.js
const nextJest = require("next/jest")

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: "./" })

// Any custom config you want to pass to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  coveragePathIgnorePatterns: [
    "/.next/",
    "/.swc/",
    "/node_modules/",
    "/pages/api/lib/repositories/games.repository.ts",
    "/pages/api/lib/repositories/useRepository.ts",
  ],
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig)
