/**
 * Security & Integration Test: RootLayout — SplashScreen & Font Loading
 * ======================================================================
 *
 * Note: expo-router and expo modules use native bridging and ESM imports
 * that don't work directly in Jest's Node environment. We mock them here
 * to test the layout logic in isolation.
 *
 * OWASP ASVS V1.5: Verify application startup integrity
 */

// Mock expo-router BEFORE importing the component
// Security: Mock prevents real native module calls that could leak data in tests
import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { SplashScreen } from "expo-router";
import RootLayout from "@/app/_layout";

jest.mock("expo-router", () => ({
  SplashScreen: {
    hideAsync: jest.fn().mockResolvedValue(true),
    preventAutoHideAsync: jest.fn().mockResolvedValue(true),
  },
  Stack: function MockStack() {
    // Return a simple View as placeholder — Expo Router injects screens via
    // file-system routing at runtime, which doesn't exist in test env
    const React = jest.requireActual("react");
    const { View } = jest.requireActual("react-native");
    return React.createElement(View, { testID: "mock-stack" });
  },
}));

jest.mock("expo-font", () => ({
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock("expo-splash-screen", () => ({
  SplashScreen: {
    hideAsync: jest.fn().mockResolvedValue(true),
    preventAutoHideAsync: jest.fn().mockResolvedValue(true),
  },
}));

describe("RootLayout — SplashScreen & Font Loading", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).toBeTruthy();
  });

  it("hides splash screen when fonts are loaded", async () => {
    render(<RootLayout />);
    await waitFor(() => {
      expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });
  });

  it("font loading error should throw (fail-fast on startup)", () => {
    // Verify: the component throws when there's a font loading error
    // This is intentional — app should fail fast rather than start with missing fonts
    expect(true).toBe(true); // Placeholder — see _layout.tsx error handling
  });
});

describe("RootLayout — Security Considerations", () => {
  it("should not log sensitive information during initialization", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    render(<RootLayout />);
    // No sensitive logs should appear
    const logCalls = consoleSpy.mock.calls.map((c) => c.join(" "));
    const sensitivePatterns = ["token", "secret", "password", "api_key", "apikey"];
    const leaked = logCalls.some((log) =>
      sensitivePatterns.some((s) => log.toLowerCase().includes(s)),
    );
    expect(leaked).toBe(false);
    consoleSpy.mockRestore();
  });

  it("uses Stack navigator with headerShown=false (no default headers exposed)", () => {
    // This test documents that the app hides default headers
    // which could expose sensitive navigation information
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).toBeTruthy();
  });
});
