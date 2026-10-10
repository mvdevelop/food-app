# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our application seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please report security vulnerabilities through one of these channels:

1. **GitHub Security Advisories** (Preferred): Use the [GitHub Security Advisory "Report a Vulnerability"](https://github.com/mvdevelop/food-app/security/advisories/new) tab.
2. **Email**: Send details to `security@viniciusdilly.dev` (if applicable).

### What to Include

When reporting a vulnerability, please include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes or mitigations
- Your contact information (for follow-up questions)

### Response Timeline

- **Initial response**: Within 48 hours
- **Acknowledgment**: Within 5 business days
- **Patch development**: Depends on severity
  - **Critical (CVSS 9.0+)**: Patch within 7 days
  - **High (CVSS 7.0-8.9)**: Patch within 30 days
  - **Medium/Low (CVSS < 7.0)**: Patch within 60 days

### Out of Scope

The following are generally not considered security vulnerabilities:

- Vulnerabilities that require physical access to the device
- Vulnerabilities in dependencies (report upstream)
- Vulnerabilities requiring already-compromised credentials

### Recognition

We appreciate security researchers who responsibly disclose vulnerabilities. Contributors who report valid security issues may be acknowledged in our changelog (with their permission).

---

## Security Measures in This Project

This project implements the following security measures:

- ✅ Secrets scanning in CI/CD pipeline
- ✅ Dependency vulnerability scanning (audit-ci + npm audit)
- ✅ ESLint security rules
- ✅ Pre-commit hooks with lint-staged
- ✅ TypeScript strict mode
- ✅ No hardcoded credentials
- ✅ Secure `.gitignore` configuration

---

## 📊 Vulnerability Management

### Current State (as of 2026-10-10)

The project undergoes automated dependency scanning via **audit-ci** in CI. The following
table documents known vulnerabilities and their remediation path:

| Vulnerability                       | Severity | Affected Module           | Root Cause         | Remediation           | Status         |
| ----------------------------------- | -------- | ------------------------- | ------------------ | --------------------- | -------------- |
| XML Injection (13 CVEs)             | High     | `@xmldom/xmldom`          | 0.8.11 (pre-fix)   | Updated to 0.8.15     | ✅ **FIXED**   |
| DoS via `ws`                        | High     | `ws`                      | 7.5.10 (pre-fix)   | Updated to 7.5.13     | ✅ **FIXED**   |
| DoS via `brace-expansion`           | High     | `brace-expansion`         | 2.0.2 (pre-fix)    | Updated to 5.0.12     | ✅ **FIXED**   |
| ReDoS via `ajv`                     | Moderate | `ajv`                     | 6.12.6 (pre-fix)   | Updated to 6.15.0     | ✅ **FIXED**   |
| XML Injection / Prototype Pollution | Moderate | `js-yaml`                 | 4.1.0 (pre-fix)    | Updated to 4.3.2      | ✅ **FIXED**   |
| DoS via `node-forge`                | High     | `node-forge` (transitive) | Via `@expo/config` | Requires Expo SDK 55+ | ⚠️ **TRACKED** |
| Prototype Pollution                 | Moderate | `xml2js` (transitive)     | Via `xcode`        | Requires Expo SDK 55+ | ⚠️ **TRACKED** |

### Known Transitive Vulnerabilities (Tracked)

The 81 remaining vulnerabilities are **transitive dependencies** within the Expo SDK 54
toolchain (`@expo/cli`, `@expo/config`, `expo-dev-client`, `expo-dev-launcher`,
`expo-manifests`). These can only be resolved by upgrading to Expo SDK 55+, which
requires a major React Native upgrade (0.81 → 0.87) and is tracked as a future
breaking change.

**Risk mitigation:**

- These vulnerabilities are in **dev tooling only** (EAS Build, Expo CLI dev server) —
  they do NOT ship to the production mobile app binary
- Source code scanning (audit-ci) runs on every CI build
- Dependabot monitors for updates weekly
- All allowlisted vulnerabilities are documented in `.audit-ci.json` with justification

### Dependency Update Policy

| Type                        | Policy                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------- |
| Security (npm audit)        | `npm audit fix` runs on every install; non-breaking fixes applied automatically    |
| Transitive (Expo toolchain) | Tracked in `.audit-ci.json`; requires major SDK upgrade — planned for next release |
| GitHub Actions versions     | Dependabot updates weekly                                                          |
| Code dependencies           | Dependabot updates weekly; minor/patch auto-grouped; major requires manual review  |

See [.audit-ci.json](./.audit-ci.json) for allowlist configuration.
