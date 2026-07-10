import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./"
});

const config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  collectCoverageFrom: ["services/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"]
};

export default createJestConfig(config);
