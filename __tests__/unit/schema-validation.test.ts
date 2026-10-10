/**
 * Unit Test: Runtime Schema Validation
 * =====================================
 * Verifies that static data (offers, sides, toppings, categories) is
 * validated at module load time via Zod schemas, preventing:
 * - Malformed data from causing crashes
 * - Injection vectors (XSS, path traversal) through data fields
 * - Data type confusion attacks
 *
 * Security: Implements OWASP ASVS V5.1 (Input Validation) and V5.5 (Output Encoding)
 * as defense-in-depth, even for statically-bundled data.
 *
 * @see src/schemas/food.ts
 * @see https://owasp.org/Top10/A03_2021-Injection/
 */

import {
  validatedCategories,
  validatedOffers,
  validatedSides,
  validatedToppings,
} from "@/constants";
import {
  CategoryArraySchema,
  OfferArraySchema,
  SideArraySchema,
  ToppingArraySchema,
  HexColorSchema,
} from "@/src/schemas/food";

describe("Schema Validation — Runtime Data Integrity", () => {
  describe("validatedCategories", () => {
    it("should pass CategoryArraySchema validation", () => {
      expect(() => CategoryArraySchema.parse(validatedCategories)).not.toThrow();
    });

    it("should have 5 categories", () => {
      expect(validatedCategories).toHaveLength(5);
    });

    it("should have 'All' as the first category", () => {
      const firstCat = validatedCategories[0];
      expect(firstCat).toBeDefined();
      expect(firstCat?.name).toBe("All");
    });

    it("should have unique IDs", () => {
      const ids = validatedCategories.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("validatedOffers", () => {
    it("should pass OfferArraySchema validation", () => {
      expect(() => OfferArraySchema.parse(validatedOffers)).not.toThrow();
    });

    it("should have 4 offers", () => {
      expect(validatedOffers).toHaveLength(4);
    });

    it("should have valid hex color values (CSS injection prevention)", () => {
      validatedOffers.forEach((offer) => {
        expect(HexColorSchema.safeParse(offer.color)).toEqual({
          success: true,
          data: offer.color,
        });
      });
    });

    it("should have unique positive integer IDs", () => {
      const ids = validatedOffers.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
      ids.forEach((id) => {
        expect(Number.isInteger(id)).toBe(true);
        expect(id).toBeGreaterThan(0);
      });
    });

    // Security: Verify XSS prevention in title fields
    it("should NOT contain HTML tags in titles (XSS prevention)", () => {
      validatedOffers.forEach((offer) => {
        expect(offer.title).not.toMatch(/<[^>]+>/);
      });
    });
  });

  describe("validatedSides", () => {
    it("should pass SideArraySchema validation", () => {
      expect(() => SideArraySchema.parse(validatedSides)).not.toThrow();
    });

    it("should have 5 sides", () => {
      expect(validatedSides).toHaveLength(5);
    });

    it("should have positive finite prices", () => {
      validatedSides.forEach((side) => {
        expect(Number.isFinite(side.price)).toBe(true);
        expect(side.price).toBeGreaterThan(0);
      });
    });
  });

  describe("validatedToppings", () => {
    it("should pass ToppingArraySchema validation", () => {
      expect(() => ToppingArraySchema.parse(validatedToppings)).not.toThrow();
    });

    it("should have 7 toppings", () => {
      expect(validatedToppings).toHaveLength(7);
    });

    it("should have positive finite prices", () => {
      validatedToppings.forEach((topping) => {
        expect(Number.isFinite(topping.price)).toBe(true);
        expect(topping.price).toBeGreaterThan(0);
      });
    });

    it("should have non-empty names", () => {
      validatedToppings.forEach((topping) => {
        expect(topping.name.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe("Schema rejection — invalid data defense", () => {
    it("should reject invalid hex color (CSS injection attempt)", () => {
      const result = HexColorSchema.safeParse("red;");
      expect(result).toEqual({
        success: false,
        error: expect.any(Error),
      });
    });

    it("should reject title with HTML tags (XSS prevention)", () => {
      const result = OfferArraySchema.safeParse([
        {
          id: 1,
          title: "<script>alert('xss')</script>",
          image: {},
          color: "#D33B0D",
        },
      ]);
      expect(result.success).toBe(false);
    });

    it("should reject negative price (data integrity)", () => {
      const result = SideArraySchema.safeParse([
        {
          name: "Test",
          image: {},
          price: -5.0,
        },
      ]);
      expect(result.success).toBe(false);
    });
  });
});
