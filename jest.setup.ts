// Jest Setup — Security & Test Utilities
// =========================================
// This file runs before each test suite.

// It mocks browser-native APIs that don't exist in the Node.js test environment
// and sets up security-focused test utilities.

// React Native requires __DEV__ global — set it for test environment
(globalThis as typeof globalThis & { __DEV__: boolean }).__DEV__ = true;

// Mock expo-router in Jest's Node environment; navigation is covered by Expo runtime.
jest.mock("expo-router", () => {
  const mockReact = require("react") as typeof import("react");
  const mockStack = ({ children }: { children?: import("react").ReactNode }) =>
    mockReact.createElement(mockReact.Fragment, null, children);
  const MockScreen = (): null => null;
  MockScreen.displayName = "MockScreen";
  mockStack.Screen = MockScreen;
  return {
    Stack: mockStack,
    Tabs: mockStack,
    router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
    useLocalSearchParams: () => ({}),
    SplashScreen: { hideAsync: jest.fn().mockResolvedValue(true), preventAutoHideAsync: jest.fn() },
  };
});

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

if (typeof window !== "undefined") {
  window.matchMedia =
    window.matchMedia ||
    (() =>
      ({
        matches: false,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        onchange: null,
        dispatchEvent: () => false,
        media: "",
      }) as MediaQueryList);
}

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
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    get length(): number {
      return Object.keys(store).length;
    },
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      if (key && (key.toLowerCase().includes("token") || key.toLowerCase().includes("secret"))) {
        throw new Error(`Security: Attempted to store sensitive key "${key}" in localStorage mock`);
      }
      store[key] = String(value);
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    key: (index: number): string | null => Object.keys(store)[index] ?? null,
  };
})();

if (typeof global !== "undefined" && !global.localStorage) {
  global.localStorage = localStorageMock;
}

const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args: unknown[]): void => {
  const allowedWarnings = ["Animated: `useNativeDriver`", "VirtualizedLists"];
  if (allowedWarnings.some((warning) => args.join(" ").includes(warning))) {
    return;
  }
  originalWarn(...args);
};

console.error = (...args: unknown[]): void => {
  if (["deprecated"].some((message) => args.join(" ").includes(message))) {
    return;
  }
  originalError(...args);
};

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
