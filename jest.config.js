/** @type {import('jest').Config} */
module.exports = {
  // Use react-native preset for proper RN module mocking
  preset: "react-native",

  testEnvironment: "node",

  // Jest setup file — runs before each test suite
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Module path aliases + asset mocking
  moduleNameMapper: {
    // Static assets (images, fonts) — MUST be first
    "\\.(png|jpg|jpeg|gif|svg|ttf|otf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|eot)$":
      "<rootDir>/__mocks__/fileMock.js",
    // CSS modules and stylesheets
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    // Path alias from tsconfig.json
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Transform configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["babel-preset-expo"] }],
  },

  // Transform patterns for node_modules that ship untranspiled code
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|expo|@expo|expo-router|expo-font|expo-splash-screen|react-native-safe-area-context|react-native-screens|react-native-worklets|react-native-gesture-handler|react-native-reanimated|react-native-css-interop|react-native-css-interop|native-svg|clsx)/)",
  ],

  // Coverage configuration — enforce minimum coverage thresholds
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "constants/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/expo-env.d.ts",
    "!**/*.d.ts",
    "!**/jest.setup.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "text-summary"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Test file patterns
  testMatch: ["<rootDir>/__tests__/**/*.test.{ts,tsx}", "<rootDir>/__tests__/**/*.spec.{ts,tsx}"],
};
