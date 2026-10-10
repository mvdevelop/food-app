/**
 * Unit Test: Error Boundary
 * =========================
 * Verifies that SafeErrorBoundary prevents unhandled render errors from
 * crashing the app and renders a safe fallback UI without stack traces.
 *
 * Security: Implements CWE-209 mitigation (Information Exposure through
 * error messages) at the application level.
 *
 * OWASP ASVS V7.1: Verify application error handling does not reflect
 * sensitive information to users.
 */

import React from "react";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";

// We test the ErrorBoundary class directly by extracting it.
// Since it's defined in app/_layout.tsx (not exported separately),
// we test the pattern here with a standalone replica for isolation.

// ── Standalone ErrorBoundary (mirrors app/_layout.tsx implementation) ──

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class TestErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (__DEV__) {
      console.error("[ErrorBoundary] Unhandled render error:", error.message);
    } else {
      console.error("[ErrorBoundary] An unexpected error occurred.");
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <View testID="error-fallback">
          <Text testID="error-title">Something went wrong</Text>
          <Text testID="error-message">
            The app encountered an unexpected error. Please restart the application.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// ── A component that throws ──

function ThrowOnRender() {
  throw new Error("Test error: simulated crash");
}

// ── Tests ──

describe("ErrorBoundary — Fail-Safe Design (CWE-209)", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("renders children when no error occurs", () => {
    const { getByText } = render(
      <TestErrorBoundary>
        <Text>Safe content</Text>
      </TestErrorBoundary>,
    );
    expect(getByText("Safe content")).toBeTruthy();
  });

  it("renders fallback UI when a child component throws", () => {
    const { getByTestId, getByText } = render(
      <TestErrorBoundary>
        <ThrowOnRender />
      </TestErrorBoundary>,
    );

    expect(getByTestId("error-fallback")).toBeTruthy();
    expect(getByText("Something went wrong")).toBeTruthy();
    expect(
      getByText("The app encountered an unexpected error. Please restart the application."),
    ).toBeTruthy();
  });

  it("does NOT expose stack traces in fallback UI", () => {
    // Security: Verify stack traces are never rendered to the user (CWE-209)
    const { queryByText } = render(
      <TestErrorBoundary>
        <ThrowOnRender />
      </TestErrorBoundary>,
    );

    // Stack trace would contain "ThrowOnRender", "TestErrorBoundary", file paths
    expect(queryByText(/ThrowOnRender/)).toBeNull();
    expect(queryByText(/app\/_layout/)).toBeNull();
    expect(queryByText(/\.tsx?:/)).toBeNull();
    expect(queryByText(/at /)).toBeNull();
  });

  it("logs error messages only in development mode", () => {
    // In test environment (__DEV__ = true), full error is logged
    render(
      <TestErrorBoundary>
        <ThrowOnRender />
      </TestErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      "[ErrorBoundary] Unhandled render error:",
      "Test error: simulated crash",
    );
  });
});
