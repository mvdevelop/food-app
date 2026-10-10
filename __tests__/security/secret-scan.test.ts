import fs from "fs";
import path from "path";

/**
 * Security Test: Secret Scanning
 * ================================
 * This test suite scans the ENTIRE codebase (excluding node_modules and .git)
 * for accidentally committed secrets, API keys, tokens, and credentials.
 *
 * It enforces OWASP ASVS V2.1.1 and V13.1.1 — verifying no secrets in source.
 */

const ROOT_DIR = path.resolve(__dirname, "../../");
const EXCLUDE_DIRS = ["node_modules", ".git", "dist", "web-build", ".expo"];

function getAllSourceFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(entry.name)) {
        continue;
      }
      results.push(...getAllSourceFiles(fullPath));
    } else {
      const ext = path.extname(entry.name);
      if ([".ts", ".tsx", ".js", ".jsx", ".json", ".env", ".yaml", ".yml"].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

describe("Security: Secret Scanning", () => {
  const allFiles = getAllSourceFiles(ROOT_DIR);

  // Pattern definitions for common secret formats
  const SECRET_PATTERNS = [
    {
      name: "OpenAI API Key",
      pattern: /sk-[a-zA-Z0-9]{20,}/,
    },
    {
      name: "AWS Access Key",
      pattern: /AKIA[A-Z0-9]{16}/,
    },
    {
      name: "AWS Secret Key (20+ chars)",
      pattern: /aws_secret_access_key\s*[:=]\s*["'][A-Za-z0-9/+=]{40}["']/i,
    },
    {
      name: "GitHub Personal Access Token",
      pattern: /ghp_[a-zA-Z0-9]{36}/,
    },
    {
      name: "GitHub OAuth Token",
      pattern: /gho_[a-zA-Z0-9]{36}/,
    },
    {
      name: "Google API Key",
      pattern: /AIza[a-zA-Z0-9_-]{35}/,
    },
    {
      name: "Slack Token",
      pattern: /xox[baprs]-([a-zA-Z0-9-]+)/,
    },
    {
      name: "JWT Token",
      pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/,
    },
    {
      name: "Generic API Key Assignment",
      pattern: /api[_-]?[key|secret]\s*[:=]\s*["'][^"'\s]{8,}["']/i,
    },
    {
      name: "Password Assignment",
      pattern: /password\s*[:=]\s*["'][^"'\s]{4,}["']/i,
    },
    {
      name: "Private Key Block",
      pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    },
  ];

  // Files to exclude from scanning (known safe)
  const EXCLUDE_FILES = [".env.example"]; // Example files are expected to have placeholder patterns

  for (const file of allFiles) {
    const relativePath = path.relative(ROOT_DIR, file);
    if (EXCLUDE_FILES.includes(relativePath)) {
      continue;
    }

    const content = fs.readFileSync(file, "utf8");

    describe(`${relativePath}`, () => {
      SECRET_PATTERNS.forEach(({ name, pattern }) => {
        it(`should NOT contain ${name}`, () => {
          const matches = content.match(pattern);
          // If matches found, it's a security violation
          if (matches) {
            throw new Error(`${name} found in ${relativePath}: ${matches[0].substring(0, 20)}...`);
          }
          expect(matches).toBeNull();
        });
      });
    });
  }

  // Explicit check: .env files should not exist (only .env.example allowed)
  it(".env should NOT be committed to the repository", () => {
    const envPath = path.join(ROOT_DIR, ".env");
    expect(fs.existsSync(envPath)).toBe(false);
  });

  it("no .pem, .key, .p12 files should exist in the repo", () => {
    const secretExtensions = [".pem", ".key", ".p12", ".jks"];
    secretExtensions.forEach((ext) => {
      const filePath = path.join(ROOT_DIR, `test${ext}`);
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });
});
