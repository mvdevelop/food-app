import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { MenuItem } from "@/src/types/food";

type Line = { item: MenuItem; quantity: number };
type State = { lines: Line[] };
type Action = { type: "add"; item: MenuItem } | { type: "remove"; id: string } | { type: "clear" };
const CartContext = createContext<{
  state: State;
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  clear: () => void;
} | null>(null);
function reducer(state: State, action: Action): State {
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
    return { lines: [...state.lines, { item: action.item, quantity: 1 }] };
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
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const value = useMemo(
    () => ({
      state,
      add: (item: MenuItem) => dispatch({ type: "add", item }),
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
