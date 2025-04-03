import { Config } from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // ✅ Use Babel for JSX support
  },
};

export default config;
