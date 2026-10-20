import "./globals.css";

import React from "react";
import { SplashScreen, Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { CartProvider } from "@/src/state/cart";
import { useFonts } from "expo-font";

// ──────────────────────────────────────────────────────────────
// SafeErrorBoundary — Fail-Safe Design (OWASP ASVS V7.1)
// ──────────────────────────────────────────────────────────────
// Prevents unhandled render errors from crashing the app without a
// user-facing fallback UI. Sanitizes error logs to avoid leaking
// stack traces or internal implementation details (CWE-209).
//
// Reference: https://owasp.org/www-project-application-security-verification-standard/
// Related:   https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SafeErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Security: Log error details only in development.
    // In production, log a sanitized generic message to avoid leaking
    // internal paths, file names, or stack trace structure (CWE-209).
    if (__DEV__) {
      console.error("[ErrorBoundary] Unhandled render error:", error.message);
      console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    } else {
      console.error("[ErrorBoundary] An unexpected error occurred. Rendering fallback UI.");
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Fallback UI — safe, minimal, no stack trace exposure
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            The app encountered an unexpected error. Please restart the application.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
  },
});

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  // Security: Fail fast on critical startup errors (font loading).
  // This is intentional — missing fonts break the user experience permanently
  // and should surface immediately rather than degrading silently.
  React.useEffect(() => {
    if (error) {
      throw error;
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Security: SafeErrorBoundary wraps the entire app to prevent unhandled
  // exceptions from exposing stack traces (CWE-209: Information Exposure).
  return (
    <SafeErrorBoundary>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </SafeErrorBoundary>
  );
}
