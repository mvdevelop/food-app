import { CATEGORIES, offers, sides, toppings } from "@/constants";

/**
 * Security Test: Input Validation & Data Sanitization
 * ====================================================
 * Even though this is a static-data app, this test suite validates
 * that data is properly structured and does not contain injection
 * vectors (XSS payloads, path traversal, command injection patterns).
 *
 * Maps to OWASP API Security #3: Excessive Injection / Injection
 * and OWASP ASVS V5.1.3: Input Validation
 */

describe("Security: Input Validation & Sanitization", () => {
  describe("Data does not contain XSS vectors", () => {
    const XSS_PATTERNS = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // onload=, onerror=, onclick=, etc.
      /<iframe/i,
      /<object[^>]*>/i,
      /<embed[^>]*>/i,
      /<svg[^>]*on\w+=/i,
      /data:text\/html/i,
      /vbscript:/i,
    ];

    const ALL_DATA = [
      ...CATEGORIES.map((c) => JSON.stringify(c)),
      ...offers.map((o) => JSON.stringify(o)),
      ...sides.map((s) => JSON.stringify(s)),
      ...toppings.map((t) => JSON.stringify(t)),
    ];

    ALL_DATA.forEach((json, idx) => {
      XSS_PATTERNS.forEach((pattern, pidx) => {
        it(`data item #${idx} should not contain XSS pattern #${pidx}`, () => {
          expect(json.match(pattern)).toBeNull();
        });
      });
    });
  });

  describe("Data does not contain command injection vectors", () => {
    const SHELL_INJECTION_PATTERNS = [
      /[;&|`$\n\r]/, // Command chaining chars
      /\$\([^)]+\)/, // Command substitution $(...)
      /&&|\|\|/, // Logical operators in shell context
      /rm\s+-rf/i,
      /wget\s+https?:\/\//i,
      /curl\s+https?:\/\//i,
      /nc\s+-[elp]/i, // Netcat
    ];

    const ALL_STRINGS = [
      ...CATEGORIES.map((c) => c.name),
      ...offers.map((o) => o.title),
      ...sides.map((s) => s.name),
      ...toppings.map((t) => t.name),
    ];

    ALL_STRINGS.forEach((str, idx) => {
      SHELL_INJECTION_PATTERNS.forEach((pattern, pidx) => {
        it(`string #${idx} should not contain shell injection pattern #${pidx}`, () => {
          expect(str.match(pattern)).toBeNull();
        });
      });
    });
  });

  describe("Color values are safe hex codes", () => {
    // Prevent CSS injection through color values
    it("offer colors match strict hex format", () => {
      offers.forEach((offer) => {
        expect(offer.color).toMatch(/^#([A-Fa-f0-9]{6})$/);
        // Ensure no function calls or expressions
        expect(offer.color).not.toMatch(/[^#A-Fa-f0-9]/);
      });
    });
  });

  describe("Numeric values are safe", () => {
    const ALL_PRICES = [...sides.map((s) => s.price), ...toppings.map((t) => t.price)];

    ALL_PRICES.forEach((price, idx) => {
      it(`price #${idx} should be a safe finite number`, () => {
        expect(Number.isFinite(price)).toBe(true);
        expect(price).toBeGreaterThan(0);
        expect(price).toBeLessThan(10000); // Arbitrary sanity limit
      });
    });
  });
});
