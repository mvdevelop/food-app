import { z } from "zod";

import type { ImageSourcePropType } from "react-native";

const ImageSourceSchema = z.custom<ImageSourcePropType>();

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
});

export const UserArraySchema = z.array(UserSchema);

export const ReviewSchema = z.object({
  id: z.string().min(1),
  restaurantId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(500),
  createdAt: z.string().min(1),
});

export const ReviewArraySchema = z.array(ReviewSchema);

export const OrderItemSchema = z.object({
  dishId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const OrderSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  restaurantId: z.string().min(1),
  status: z.string().min(1),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  estimatedDelivery: z.string().optional(),
  note: z.string().max(500).optional(),
  createdAt: z.string().min(1),
  items: z.array(OrderItemSchema),
});

export const OrderArraySchema = z.array(OrderSchema);

export const AddressSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  label: z.string().min(1),
  street: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  isDefault: z.boolean(),
});

export const AddressArraySchema = z.array(AddressSchema);

export type User = z.infer<typeof UserSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Address = z.infer<typeof AddressSchema>;

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
  image: ImageSourceSchema,
  color: HexColorSchema,
});
export const RestaurantSchema = z.object({
  id: z.string().min(1),
  name: SafeText(80),
  cuisine: SafeText(80),
  image: ImageSourceSchema.optional(),
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
  image: ImageSourceSchema,
  price: z.number().positive(),
  popular: z.boolean().optional(),
});
export const SideSchema = z.object({
  name: SafeText(50),
  image: ImageSourceSchema,
  price: z.number().positive(),
});
export const ToppingSchema = z.object({
  name: SafeText(50),
  image: ImageSourceSchema,
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
