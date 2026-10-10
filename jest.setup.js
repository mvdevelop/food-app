// Jest Setup — Security & Test Utilities
// =========================================
// This file runs before each test suite.
// It mocks browser-native APIs that don't exist in the Node.js test environment
// and sets up security-focused test utilities.

// React Native requires __DEV__ global — set it for test environment
global.__DEV__ = true;

// Mock expo modules that require native linking
jest.mock("expo-font", () => ({
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock("expo-splash-screen", () => ({
  SplashScreen: {
    hideAsync: jest.fn().mockResolvedValue(true),
    preventAutoHideAsync: jest.fn().mockResolvedValue(true),
  },
}));

// Guard: Only apply window mocks if window exists (jsdom environment)
var hasWindow = typeof window !== "undefined";

if (hasWindow) {
  // Mock window.matchMedia (used by some Expo components)
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
      };
    };
}

// Mock ResizeObserver (used by some libraries)
if (typeof global !== "undefined") {
  global.ResizeObserver =
    global.ResizeObserver ||
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
}

// Security: Clear any mock localStorage to prevent test pollution
var localStorageMock = (function () {
  var store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      // Security: Prevent storing PII or secrets in tests
      if (key && (key.toLowerCase().includes("token") || key.toLowerCase().includes("secret"))) {
        throw new Error(
          'Security: Attempted to store sensitive key "' + key + '" in localStorage mock',
        );
      }
      store[key] = String(value);
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

// Only assign localStorage if the environment supports it
if (typeof global !== "undefined" && !global.localStorage) {
  global.localStorage = localStorageMock;
}

// Suppress console.warn/error in tests unless explicitly testing them
var originalWarn = console.warn;
var originalError = console.error;

console.warn = function () {
  var args = Array.prototype.slice.call(arguments);
  var allowedWarnings = ["Animated: `useNativeDriver`", "VirtualizedLists"];
  if (
    allowedWarnings.some(function (w) {
      return args.join(" ").includes(w);
    })
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

console.error = function () {
  var args = Array.prototype.slice.call(arguments);
  var suppressedErrors = ["deprecated"];
  if (
    suppressedErrors.some(function (s) {
      return args.join(" ").includes(s);
    })
  ) {
    return;
  }
  originalError.apply(console, args);
};

// After all tests, restore original console
afterAll(function () {
  console.warn = originalWarn;
  console.error = originalError;
});
