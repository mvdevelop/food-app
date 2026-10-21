import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { MenuItem } from "@/src/types/food";

export type CartExtra = { name: string; price: number };
export type CartLine = { item: MenuItem; quantity: number; extras?: CartExtra[] };
export type CartState = { lines: CartLine[] };
export type CartAction =
  | { type: "add"; item: MenuItem; extras?: CartExtra[] }
  | { type: "remove"; id: string }
  | { type: "clear" };

export function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === "clear") {
    return { lines: [] };
  }
  const targetId = action.type === "add" ? action.item.id : action.id;
  const index = state.lines.findIndex((line) => line.item.id === targetId);
  if (action.type === "add") {
    if (index >= 0) {
      return {
        lines: state.lines.map((line, i) =>
          i === index ? { ...line, quantity: line.quantity + 1 } : line,
        ),
      };
    }
    return { lines: [...state.lines, { item: action.item, quantity: 1, extras: action.extras }] };
  }
  if (index < 0) {
    return state;
  }
  const current = state.lines[index];
  const lines =
    current && current.quantity === 1
      ? state.lines.filter((_, i) => i !== index)
      : state.lines.map((line, i) =>
          i === index ? { ...line, quantity: line.quantity - 1 } : line,
        );
  return { lines };
}

const CartContext = createContext<{
  state: CartState;
  add: (item: MenuItem, extras?: CartExtra[]) => void;
  remove: (id: string) => void;
  clear: () => void;
} | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });
  const value = useMemo(
    () => ({
      state,
      add: (item: MenuItem, extras?: { name: string; price: number }[]) =>
        dispatch({ type: "add", item, extras }),
      remove: (id: string) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return value;
}
