import React, { createContext, useContext, useMemo, useState } from "react";

type FavoritesContextValue = {
  favorites: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
};
const FavoritesContext = createContext<FavoritesContextValue | null>(null);
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const value = useMemo(
    () => ({
      favorites,
      toggle: (id: string) =>
        setFavorites((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        ),
      isFavorite: (id: string) => favorites.includes(id),
    }),
    [favorites],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return value;
}
