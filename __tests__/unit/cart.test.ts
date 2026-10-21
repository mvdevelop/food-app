import { cartReducer, type CartState } from "@/src/state/cart";
import type { MenuItem } from "@/src/types/food";

const item: MenuItem = {
  id: "dish-1",
  restaurantId: "restaurant-1",
  name: "Classic Burger",
  description: "Burger",
  image: "burger",
  price: 25,
};

const state: CartState = { lines: [] };

describe("cartReducer", () => {
  it("adds a new item with quantity one and extras", () => {
    const result = cartReducer(state, {
      type: "add",
      item,
      extras: [{ name: "Cheese", price: 3 }],
    });

    expect(result.lines).toEqual([{ item, quantity: 1, extras: [{ name: "Cheese", price: 3 }] }]);
  });

  it("increments an existing item", () => {
    const current: CartState = { lines: [{ item, quantity: 1 }] };

    expect(cartReducer(current, { type: "add", item }).lines[0]?.quantity).toBe(2);
  });

  it("decrements and removes items", () => {
    const current: CartState = { lines: [{ item, quantity: 2 }] };

    const decremented = cartReducer(current, { type: "remove", id: item.id });
    expect(decremented.lines[0]?.quantity).toBe(1);
    expect(cartReducer(decremented, { type: "remove", id: item.id }).lines).toEqual([]);
  });

  it("ignores removal of an unknown item and clears the cart", () => {
    const current: CartState = { lines: [{ item, quantity: 1 }] };

    expect(cartReducer(current, { type: "remove", id: "missing" })).toBe(current);
    expect(cartReducer(current, { type: "clear" })).toEqual({ lines: [] });
  });
});
