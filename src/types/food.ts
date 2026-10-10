/**
 * Type definitions for Food App domain entities.
 * These types ensure type-safety across the application and prevent
 * runtime errors from malformed data.
 */

/**
 * A food category for filtering offers.
 * @example { id: "1", name: "All" }
 */
export interface Category {
  readonly id: string;
  readonly name: string;
}

/**
 * A promotional offer card displayed on the home screen.
 * @example { id: 1, title: "SUMMER COMBO", image: burgerOne, color: "#D33B0D" }
 */
export interface Offer {
  readonly id: number;
  readonly title: string;
  /** Image asset handle from require() */
  readonly image: any;
  /** Background color in hex format — validated by schema */
  readonly color: string;
}

/**
 * A side dish option (e.g., Fries, Onion Rings).
 * @example { name: "Fries", image: fries, price: 3.5 }
 */
export interface Side {
  readonly name: string;
  readonly image: any;
  readonly price: number;
}

/**
 * A pizza topping option (e.g., Avocado, Bacon).
 * @example { name: "Avocado", image: avocado, price: 1.5 }
 */
export interface Topping {
  readonly name: string;
  readonly image: any;
  readonly price: number;
}

/**
 * Centralized image asset map — all PNGs bundled with the app.
 * Used for consistent image rendering across screens.
 */
export interface ImageAssetMap {
  readonly [key: string]: any;
}
