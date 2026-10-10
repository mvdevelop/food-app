import { CATEGORIES, offers, sides, toppings, images } from "@/constants";

describe("Constants — Data Integrity & Security", () => {
  describe("CATEGORIES", () => {
    it("should have exactly 5 categories", () => {
      expect(CATEGORIES).toHaveLength(5);
    });

    it("should contain 'All' as the first category", () => {
      const firstCat = CATEGORIES[0];
      expect(firstCat).toBeDefined();
      expect(firstCat?.name).toBe("All");
    });

    it("should have unique IDs", () => {
      const ids = CATEGORIES.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have non-empty names", () => {
      CATEGORIES.forEach((cat) => {
        expect(cat.name).toBeTruthy();
        expect(typeof cat.name).toBe("string");
        expect(cat.name.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe("offers", () => {
    it("should have exactly 4 offers", () => {
      expect(offers).toHaveLength(4);
    });

    it("should have valid color values (hex)", () => {
      offers.forEach((offer) => {
        expect(offer.color).toMatch(/^#([A-Fa-f0-9]{6})$/);
      });
    });

    it("should have unique IDs", () => {
      const ids = offers.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have non-empty titles", () => {
      offers.forEach((offer) => {
        expect(offer.title).toBeTruthy();
        expect(offer.title.trim().length).toBeGreaterThan(0);
      });
    });

    // Security: Ensure no sensitive data leaks through offer objects
    it("should NOT contain API keys, tokens, or credentials", () => {
      offers.forEach((offer) => {
        const json = JSON.stringify(offer);
        expect(json).not.toMatch(/sk-[a-zA-Z0-9]{20}/); // OpenAI key pattern
        expect(json).not.toMatch(/AKIA[A-Z0-9]{16}/); // AWS key pattern
        expect(json).not.toMatch(/ghp_[a-zA-Z0-9]{36}/); // GitHub token
      });
    });
  });

  describe("sides", () => {
    it("should have exactly 5 sides", () => {
      expect(sides).toHaveLength(5);
    });

    it("should have valid prices (positive numbers)", () => {
      sides.forEach((side) => {
        expect(side.price).toBeGreaterThan(0);
        expect(Number.isFinite(side.price)).toBe(true);
      });
    });

    it("should have non-empty names", () => {
      sides.forEach((side) => {
        expect(side.name).toBeTruthy();
      });
    });
  });

  describe("toppings", () => {
    it("should have exactly 7 toppings", () => {
      expect(toppings).toHaveLength(7);
    });

    it("should have valid prices (positive numbers)", () => {
      toppings.forEach((topping) => {
        expect(topping.price).toBeGreaterThan(0);
      });
    });
  });

  describe("images asset map", () => {
    it("should contain all expected icon keys", () => {
      const expectedIcons = [
        "arrowBack",
        "arrowDown",
        "arrowRight",
        "bag",
        "check",
        "clock",
        "dollar",
        "envelope",
        "home",
        "location",
        "logout",
        "minus",
        "pencil",
        "person",
        "phone",
        "plus",
        "search",
        "star",
        "trash",
        "user",
      ];
      expectedIcons.forEach((icon) => {
        expect(images).toHaveProperty(icon);
      });
    });

    it("should contain all expected image keys", () => {
      const expectedImages = [
        "avatar",
        "avocado",
        "bacon",
        "burgerOne",
        "burgerTwo",
        "buritto",
        "cheese",
        "coleslaw",
        "cucumber",
        "emptyState",
        "fries",
        "loginGraphic",
        "logo",
        "mozarellaSticks",
        "mushrooms",
        "onionRings",
        "onions",
        "pizzaOne",
        "salad",
        "success",
        "tomatoes",
      ];
      expectedImages.forEach((img) => {
        expect(images).toHaveProperty(img);
      });
    });
  });
});
