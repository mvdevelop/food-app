import type { MenuItem, Restaurant } from "@/src/types/food";

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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
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
    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  signIn: (email: string, password: string) =>
    request(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),
  restaurants: () => request<Restaurant[]>("/restaurants"),
  restaurant: (id: string) => request<Restaurant>(`/restaurants/${encodeURIComponent(id)}`),
  dishes: (restaurantId?: string) =>
    request<MenuItem[]>(
      restaurantId ? `/dishes?restaurantId=${encodeURIComponent(restaurantId)}` : "/dishes",
    ),
  reviews: (restaurantId: string) =>
    request(`/reviews?restaurantId=${encodeURIComponent(restaurantId)}`),
  orders: (userId: string) => request(`/orders?userId=${encodeURIComponent(userId)}`),
  createOrder: (order: Record<string, unknown>) =>
    request("/orders", { method: "POST", body: JSON.stringify(order) }),
  order: (id: string) => request(`/orders/${encodeURIComponent(id)}`),
  addresses: (userId: string) => request(`/addresses?userId=${encodeURIComponent(userId)}`),
};
