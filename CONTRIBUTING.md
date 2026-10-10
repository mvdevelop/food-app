# Contributing to Food App

Thank you for your interest in contributing to Food App! This document outlines the process for contributing.

---

## 🎯 Development Setup

### Prerequisites

- **Node.js** >= 20.x (see `.nvmrc`)
- **npm** >= 10.x
- **Expo CLI** global install recommended: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/mvdevelop/food-app.git
cd food-app

# Install dependencies
npm ci

# Copy environment variables
cp .env.example .env.local

# Start the development server
npm start
```

---

## 🧪 Testing

This project has a comprehensive testing strategy:

```bash
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:security      # Security tests (secret scanning, input validation)
npm test                    # All tests
npm run test:coverage      # Tests with coverage report
npm run test:watch         # Watch mode
```

### Test Structure

```
__tests__/
├── unit/                    # Unit tests (individual functions, pure logic)
│   └── constants.test.ts
├── integration/             # Integration tests (component rendering, flows)
│   ├── app-render.test.tsx
│   └── layout.test.tsx
└── security/                # Security tests (OWASP ASVS, secret scanning)
    ├── secret-scan.test.ts
    └── input-validation.test.ts
```

### Writing Tests

- All new features should include tests
- Security-sensitive code must have security tests
- Maintain coverage threshold (80% minimum)
- Use `@testing-library/react-native` for UI tests
- Use `jest-mock` for mocking native modules

---

## 🔒 Security Guidelines

Before submitting code, ensure you follow these security practices:

1. **Never commit secrets** — Use `.env.local` for local secrets
2. **Never commit credentials** — No passwords, tokens, or keys in source
3. **Validate all inputs** — Even static data should be sanitized
4. **Run security tests** — `npm run test:security` must pass
5. **Update dependencies** — Run `npm audit` and address vulnerabilities

See [SECURITY.md](./SECURITY.md) for responsible disclosure.

---

## 🧹 Code Quality

### Linting & Formatting

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
npm run type-check    # TypeScript type checking
```

### Pre-commit Hook

A pre-commit hook runs automatically:

- `lint-staged` formats staged files
- Security audit checks for high+ vulnerabilities

To bypass (emergency only): `git commit --no-verify`

---

## 🔄 Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Write tests for your changes
4. Ensure all checks pass: `npm test && npm run audit:ci`
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add login screen with biometric auth
   fix: resolve splash screen race condition
   test: add security test for XSS prevention
   ```
6. Push and open a PR
7. Fill the PR template

---

## 📦 Release Process

Releases are handled via **Expo Application Services (EAS)**:

- Production builds auto-increment version codes via `eas.json`
- CI/CD pipeline runs on every push to `main`
- See `.github/workflows/ci.yml` for build details
