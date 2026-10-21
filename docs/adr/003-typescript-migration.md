# ADR 003: TypeScript as the Application Language

- Status: Accepted
- Date: 2026-10-21

## Context

The application source, tests, schemas, services, and state management are written in TypeScript, but generated Expo output and legacy JavaScript support files were still tracked in the repository. This caused GitHub's language statistics to report JavaScript as the dominant language and made the repository documentation inaccurate.

## Decision

TypeScript is the required language for application code, tests, mocks, schemas, services, and state management. Generated Expo exports must not be committed and are ignored through `.gitignore`.

Tool configuration files remain JavaScript only where the relevant tool requires or most reliably supports CommonJS loading. These files are infrastructure configuration, not application source. Each conversion must be validated independently before changing its extension.

## Consequences

- New application and test files must use `.ts` or `.tsx`.
- TypeScript strict checks remain mandatory in the pre-commit workflow.
- Generated directories such as `.expo-export-check` must be removed before commits.
- GitHub language statistics may still include a small amount of JavaScript from tool configuration, but JavaScript will no longer represent application code.
- Documentation and test counts must be updated when the suite changes.
