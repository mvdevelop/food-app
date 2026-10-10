# ADR-001: Dependency Pinning & Security Auditing Strategy

- **Status:** 🟢 Accepted
- **Date:** 2026-10-10
- **Author:** Marco Vinicius Dilly
- **Tags:** security, ci-cd, dependencies

## Context

The project initially had 95 npm audit vulnerabilities (1 low, 22 moderate, 72 high).
The CI pipeline used `npm audit --audit-level=high` which:

- Exits 0 even when vulnerabilities are found (npm default behavior)
- Provides no allowlist mechanism for transitive vulnerabilities
- Does not differentiate between direct and transitive dependencies
- Cannot be configured with per-project risk tolerance

Additionally, `package-lock.json` was not pinned to exact versions in all cases,
leading to non-reproducible builds across environments.

## Decision

We adopt a **defense-in-depth dependency security strategy** combining three layers:

### Layer 1: Exact Version Pinning (`.npmrc`)

```ini
save-exact=true    # Always save exact versions (no ^ or ~)
audit=true         # Run npm audit on every install
audit-level=moderate
```

**Trade-off:** More verbose upgrades (no auto-patch) but fully reproducible builds.

### Layer 2: Structured Security Auditing (`audit-ci`)

Replace `npm audit` with [`audit-ci`](https://github.com/eslint/audit-ci) in CI:

- **Fails the pipeline** on high+ vulnerabilities (exit code ≠ 0)
- **Allowlist** for known transitive vulnerabilities in dev tooling
- **SARIF/JSON output** for traceability and artifact storage
- **Configurable risk tolerance** per project

### Layer 3: Automated Dependency Updates (Dependabot)

```yaml
- package-ecosystem: "npm"
  schedule:
    interval: "weekly"
    day: "monday"
  groups:
    minor-patch: { update-types: ["minor", "patch"] }
```

**Trade-off:** Groups minor/patch to reduce PR noise; majors reviewed manually.

## Known Limitations

| Vulnerability | Severity | Root Cause | Fix Available |
|---|---|---|---|
| `node-forge` (via `@expo/config`) | High | Transitive in Expo SDK 54 | Requires Expo SDK 55+ upgrade |
| `postcss` (via `@expo/metro-config`) | High | Transitive in Expo SDK 54 | Requires Expo SDK 55+ upgrade |
| `braces` (via `tailwindcss` 3.x) | High | Fixed in tailwindcss 4.x (breaking) | Requires tailwindcss 4.x upgrade |

These are documented in `.audit-ci.json` with allowlist entries.

## Consequences

- ✅ 14 vulnerabilities resolved (95 → 81) via `npm audit fix`
- ✅ CI pipeline fails on **new** high+ vulnerabilities
- ✅ Dependabot reduces manual upgrade overhead
- ✅ Full audit report available as CI artifact
- ⚠️ 81 transitive vulnerabilities remain (dev tooling only, not in production binary)

## References

- [npm audit documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [audit-ci documentation](https://github.com/eslint/audit-ci)
- [GitHub Dependabot documentation](https://docs.github.com/code-security/dependabot)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
