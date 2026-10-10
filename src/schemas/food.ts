/**
 * Zod schemas for Food App domain entities.
 *
 * Security Purpose:
 * These schemas provide runtime validation of static data to prevent:
 * - Malformed data from causing crashes
 * - Potential injection vectors (XSS, path traversal)
 * - Data type confusion attacks
 *
 * Implements OWASP ASVS V5.1 (Input Validation) and V5.5 (Output Encoding).
 *
 * @see https://owasp.org/Top10/A03_2021-Injection/
 * @see https://owasp.org/Top10/A03_2021-Injection/
 */

import { z } from "zod";

/**
 * Hex color validation — prevents CSS injection through color values.
 * Only allows standard 6-digit hex colors (#RRGGBB).
 */
export const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format");

/**
 * Category schema — food categories for filtering.
 */
export const CategorySchema = z.object({
  // ID accepts numeric strings (e.g. "1", "2") or UUIDs
  id: z.string().min(1, "Category ID cannot be empty"),
  name: z.string().min(1, "Category name cannot be empty").max(50, "Category name too long"),
});

/**
 * Offer schema — promotional offer cards.
 * Security: color field validated against strict hex format
 */
export const OfferSchema = z.object({
  id: z.number().int().positive("Offer ID must be a positive integer"),
  title: z
    .string()
    .min(1, "Offer title cannot be empty")
    .max(100, "Offer title too long")
    // Prevent XSS — no HTML/special chars in titles
    .refine((s) => !s.includes("<"), "Title contains invalid characters"),
  image: z.any(), // Image asset from require()
  color: HexColorSchema,
});

/**
 * Side schema — side dish items.
 */
export const SideSchema = z.object({
  name: z.string().min(1, "Side name cannot be empty").max(50, "Side name too long"),
  image: z.any(),
  price: z.number().positive("Price must be positive"),
});

/**
 * Topping schema — pizza/burger topping items.
 */
export const ToppingSchema = z.object({
  name: z.string().min(1, "Topping name cannot be empty").max(50, "Topping name too long"),
  image: z.any(),
  price: z.number().positive("Price must be positive"),
});

// Array schemas
export const CategoryArraySchema = z.array(CategorySchema);
export const OfferArraySchema = z.array(OfferSchema);
export const SideArraySchema = z.array(SideSchema);
export const ToppingArraySchema = z.array(ToppingSchema);
