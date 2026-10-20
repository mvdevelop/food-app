import { images } from "@/constants";
import {
  CategoryArraySchema,
  ComboArraySchema,
  MenuItemArraySchema,
  RestaurantArraySchema,
} from "@/src/schemas/food";

export const categories = CategoryArraySchema.parse([
  { id: "all", name: "Todos", emoji: "✨" },
  { id: "burger", name: "Hambúrguer", emoji: "🍔" },
  { id: "pizza", name: "Pizza", emoji: "🍕" },
  { id: "japanese", name: "Japonesa", emoji: "🍣" },
  { id: "healthy", name: "Saudável", emoji: "🥗" },
  { id: "dessert", name: "Doces", emoji: "🍰" },
]);

export const restaurants = RestaurantArraySchema.parse([
  {
    id: "burger-house",
    name: "Burger House",
    cuisine: "Hambúrguer • Americana",
    image: images.burgerOne,
    rating: 4.8,
    reviews: 1240,
    deliveryTime: "25–35 min",
    deliveryFee: 0,
    badge: "Entrega grátis",
    category: "burger",
  },
  {
    id: "pizza-verde",
    name: "Pizza Verde",
    cuisine: "Pizza • Italiana",
    image: images.pizzaOne,
    rating: 4.7,
    reviews: 892,
    deliveryTime: "30–40 min",
    deliveryFee: 4.99,
    category: "pizza",
  },
  {
    id: "bowl-fresh",
    name: "Bowl Fresh",
    cuisine: "Saudável • Bowls",
    image: images.salad,
    rating: 4.9,
    reviews: 563,
    deliveryTime: "20–30 min",
    deliveryFee: 2.99,
    badge: "Mais pedidos",
    category: "healthy",
  },
]);

export const menuItems = MenuItemArraySchema.parse([
  {
    id: "classic-burger",
    restaurantId: "burger-house",
    name: "Classic House",
    description: "Blend artesanal, queijo cheddar, alface e molho da casa",
    image: images.burgerOne,
    price: 29.9,
    popular: true,
  },
  {
    id: "double-burger",
    restaurantId: "burger-house",
    name: "Double Bacon",
    description: "Dois blends, bacon crocante e cheddar cremoso",
    image: images.burgerTwo,
    price: 36.9,
    popular: true,
  },
  {
    id: "margherita",
    restaurantId: "pizza-verde",
    name: "Margherita",
    description: "Molho de tomate, mozzarella fresca e manjericão",
    image: images.pizzaOne,
    price: 42.9,
    popular: true,
  },
  {
    id: "green-bowl",
    restaurantId: "bowl-fresh",
    name: "Green Power",
    description: "Mix de folhas, avocado, tomate e molho cítrico",
    image: images.salad,
    price: 31.9,
    popular: true,
  },
]);

export const combos = ComboArraySchema.parse([
  {
    id: "combo-house",
    restaurantId: "burger-house",
    name: "Combo House",
    description: "Classic House + fritas + bebida",
    price: 39.9,
    discount: 15,
    items: ["classic-burger", "fries", "soda"],
  },
  {
    id: "combo-pizza",
    restaurantId: "pizza-verde",
    name: "Pizza em dobro",
    description: "Duas pizzas grandes selecionadas",
    price: 69.9,
    discount: 20,
    items: ["margherita", "pizza-special"],
  },
]);
export const toppings = [
  { id: "extra-cheese", name: "Queijo extra", price: 3.5 },
  { id: "bacon", name: "Bacon crocante", price: 4.9 },
  { id: "fries", name: "Fritas", price: 9.9 },
];
export const currency = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`;
