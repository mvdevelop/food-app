// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// Security: detect potential vulnerabilities in code
const securityRules = {
  // Prevent eval and similar dangerous functions
  'no-eval': 'error',
  'no-new-func': 'error',
  'no-script-url': 'error',
  // Prevent prototype pollution
  'no-prototype-builtins': 'error',
  // Prevent assignment to native objects
  'no-extend-native': 'error',
  // Prevent use of debugger in production
  'no-debugger': 'warn',
  // Enforce consistent return behavior (prevents undefined leaks)
  'consistent-return': 'error',
  // Enforce curly braces
  'curly': ['error', 'all'],
};

module.exports = defineConfig([
  expoConfig,
  {
    rules: securityRules,
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'web-build/*'],
  },
]);
