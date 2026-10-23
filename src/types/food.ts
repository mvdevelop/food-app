import type { ImageSourcePropType } from "react-native";

export type FoodImage = ImageSourcePropType;

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly emoji?: string;
}

export interface Offer {
  readonly id: number;
  readonly title: string;
  readonly subtitle?: string;
  readonly image: FoodImage;
  readonly color: string;
}

export interface Restaurant {
  readonly id: string;
  readonly name: string;
  readonly cuisine: string;
  readonly image?: FoodImage;
  readonly rating: number;
  readonly reviews: number;
  readonly deliveryTime: string;
  readonly deliveryFee: number;
  readonly badge?: string;
  readonly category: string;
}

export interface MenuItem {
  readonly id: string;
  readonly restaurantId: string;
  readonly name: string;
  readonly description: string;
  readonly image: FoodImage;
  readonly price: number;
  readonly popular?: boolean;
}

export interface Combo {
  readonly id: string;
  readonly restaurantId: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly discount: number;
  readonly items: string[];
}

export interface Side {
  readonly name: string;
  readonly image: FoodImage;
  readonly price: number;
}
export interface Topping {
  readonly name: string;
  readonly image: FoodImage;
  readonly price: number;
}
export interface ImageAssetMap {
  readonly [key: string]: FoodImage;
}
