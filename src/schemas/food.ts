import { z } from "zod";

export const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format");
const SafeText = (max: number) =>
  z
    .string()
    .min(1)
    .max(max)
    .refine((s) => !/[<>]/.test(s), "Text contains invalid characters");

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: SafeText(50),
  emoji: z.string().max(4).optional(),
});
export const OfferSchema = z.object({
  id: z.number().int().positive(),
  title: SafeText(100),
  subtitle: SafeText(160).optional(),
  image: z.any(),
  color: HexColorSchema,
});
export const RestaurantSchema = z.object({
  id: z.string().min(1),
  name: SafeText(80),
  cuisine: SafeText(80),
  image: z.any(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().nonnegative(),
  deliveryTime: SafeText(30),
  deliveryFee: z.number().nonnegative(),
  badge: SafeText(40).optional(),
  category: SafeText(40),
});
export const MenuItemSchema = z.object({
  id: z.string().min(1),
  restaurantId: z.string().min(1),
  name: SafeText(80),
  description: SafeText(180),
  image: z.any(),
  price: z.number().positive(),
  popular: z.boolean().optional(),
});
export const SideSchema = z.object({
  name: SafeText(50),
  image: z.any(),
  price: z.number().positive(),
});
export const ToppingSchema = z.object({
  name: SafeText(50),
  image: z.any(),
  price: z.number().positive(),
});
export const CategoryArraySchema = z.array(CategorySchema);
export const OfferArraySchema = z.array(OfferSchema);
export const RestaurantArraySchema = z.array(RestaurantSchema);
export const MenuItemArraySchema = z.array(MenuItemSchema);
export const ComboSchema = z.object({
  id: z.string().min(1),
  restaurantId: z.string().min(1),
  name: SafeText(80),
  description: SafeText(180),
  price: z.number().positive(),
  discount: z.number().min(0).max(100),
  items: z.array(z.string().min(1)),
});
export const ComboArraySchema = z.array(ComboSchema);
export const SideArraySchema = z.array(SideSchema);
export const ToppingArraySchema = z.array(ToppingSchema);
