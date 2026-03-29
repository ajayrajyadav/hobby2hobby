module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/apps"],
  moduleNameMapper: {
    "^@hobby2hobby/contracts$": "<rootDir>/packages/contracts/src",
    "^@hobby2hobby/nest-tools$": "<rootDir>/packages/nest-tools/src",
    "^@hobby2hobby/postgres$": "<rootDir>/packages/postgres/src"
  },
  moduleFileExtensions: ["ts", "js", "json"],
  testTimeout: 180000,
  testMatch: ["**/*.spec.ts"],
  collectCoverageFrom: [
    "apps/**/*.ts",
    "!apps/**/main.ts"
  ]
};
