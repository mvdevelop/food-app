import { z } from "zod";
import type { MenuItem, Restaurant } from "@/src/types/food";
import {
  AddressArraySchema,
  MenuItemArraySchema,
  OrderArraySchema,
  OrderSchema,
  RestaurantArraySchema,
  ReviewArraySchema,
  UserArraySchema,
} from "@/src/schemas/food";

const API_URL = process.env["EXPO_PUBLIC_API_URL"] ?? "http://localhost:3001";
const API_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, schema: z.ZodType<T>, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: options?.signal ?? controller.signal,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    if (!response.ok) {
      throw new ApiError(response.status, `API request failed: ${response.status}`);
    }
    return schema.parse(await response.json());
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  signIn: (email: string, password: string) =>
    request(
      `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      UserArraySchema,
    ),
  restaurants: () => request<Restaurant[]>("/restaurants", RestaurantArraySchema),
  restaurant: (id: string) =>
    request<Restaurant>(`/restaurants/${encodeURIComponent(id)}`, RestaurantArraySchema.element),
  dishes: (restaurantId?: string) =>
    request<MenuItem[]>(
      restaurantId ? `/dishes?restaurantId=${encodeURIComponent(restaurantId)}` : "/dishes",
      MenuItemArraySchema,
    ),
  reviews: (restaurantId: string) =>
    request(`/reviews?restaurantId=${encodeURIComponent(restaurantId)}`, ReviewArraySchema),
  orders: (userId: string) =>
    request(`/orders?userId=${encodeURIComponent(userId)}`, OrderArraySchema),
  createOrder: (order: Record<string, unknown>) =>
    request("/orders", OrderSchema, { method: "POST", body: JSON.stringify(order) }),
  order: (id: string) => request(`/orders/${encodeURIComponent(id)}`, OrderSchema),
  addresses: (userId: string) =>
    request(`/addresses?userId=${encodeURIComponent(userId)}`, AddressArraySchema),
};
