# ADR-002: Error Boundary & Safe Failure Strategy

- **Status:** 🟢 Accepted
- **Date:** 2026-10-10
- **Author:** Marco Vinicius Dilly
- **Tags:** security, ui-architecture, error-handling, CWE-209

## Context

The original `app/_layout.tsx` had no Error Boundary. If any component in the React tree
threw during render, the entire app would:

1. **Crash silently** — displaying a blank white screen to the user
2. **Expose stack traces** — React Native's default red-box in dev, or native crash logs
3. **Leak implementation details** — file paths, internal module structure, dependency names

This violates:
- **CWE-209**: Information Exposure Through an Error Message
- **OWASP ASVS V7.1**: Verify application error handling does not reflect sensitive information
- **NIST CSF PR.IP-6**: Predictable failure mode for error handling

Additionally, `app/index.tsx` had a bare `console.log("Offer pressed:", item.title)` that
would execute in production builds, violating:
- **CWE-532**: Insertion of Sensitive Information into Log File
- **OWASP ASVS V7.4**: Verify that debug output is not visible in production

## Decision

Implement a **multi-layer error handling strategy**:

### Layer 1: Application-Level Error Boundary

A custom `SafeErrorBoundary` React class component wrapping the entire app root:

```typescript
class SafeErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (__DEV__) {
      console.error("[ErrorBoundary] Unhandled render error:", error.message);
    } else {
      console.error("[ErrorBoundary] An unexpected error occurred.");
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View testID="error-fallback">
          <Text>Something went wrong</Text>
          <Text>The app encountered an unexpected error. Please restart.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
```

**Security properties:**
- ✅ Fallback UI contains **no stack traces** (CWE-209 mitigation)
- ✅ Console logs are **sanitized in production** (`__DEV__` guard)
- ✅ User gets a **graceful degradation** instead of a blank screen

### Layer 2: Fail-Fast on Critical Startup Errors

Font loading errors still throw immediately because:
- Missing fonts permanently break the UI (all text rendering fails)
- The splash screen would remain visible indefinitely
- Silent degradation is worse than a restart prompt

**Trade-off:** Startup crash on font failure vs. degraded UX without fonts.

### Layer 3: Secure Logging Pattern

All `console.log`/`console.error` calls in production code are guarded:

```typescript
// ❌ Before — logs to production
console.log("Offer pressed:", item.title);

// ✅ After — development-only
if (__DEV__) {
  console.log("Offer pressed:", item.title);
}
```

**Trade-off:** Slightly more verbose code vs. preventing PII/debug leakage.

## Testing Strategy

| Test | What it verifies | File |
|---|---|---|
| Error boundary renders children | Normal path unaffected | `error-boundary.test.tsx` |
| Error boundary shows fallback | Crash → UI recovery | `error-boundary.test.tsx` |
| No stack traces in fallback | CWE-209 mitigation | `error-boundary.test.tsx` |
| Dev-only logging | CWE-532 mitigation | `error-boundary.test.tsx` |
| Schema validation rejects XSS | ASVS V5.1 enforcement | `schema-validation.test.ts` |
| Schema validation rejects invalid color | CSS injection prevention | `schema-validation.test.ts` |

## Consequences

- ✅ App never shows blank screen on render errors
- ✅ Stack traces never reach end users
- ✅ Debug logs never leak to production builds
- ✅ Comprehensive test coverage of error paths
- ⚠️ Error boundary adds ~70 lines of boilerplate (justified by ASVS compliance)

## References

- [React Error Boundaries documentation](https://react.dev/warnings/react-error-boundary-warnings)
- [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
- [CWE-209: Information Exposure Through Error Message](https://cwe.mitre.org/data/definitions/209.html)
- [CWE-532: Insertion of Sensitive Info into Log File](https://cwe.mitre.org/data/definitions/532.html)
