import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { currency, menuItems, restaurants } from "@/src/data/marketplace";
import { useCart } from "@/src/state/cart";

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurant = restaurants.find((item) => item.id === id) ?? restaurants[0];
  const restaurantId = restaurant?.id ?? "";
  const items = useMemo(
    () => menuItems.filter((item) => item.restaurantId === restaurantId),
    [restaurantId],
  );
  const { add, state } = useCart();
  if (!restaurant) {
    return null;
  }
  const count = state.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View className="relative">
          <Image source={restaurant.image} className="h-56 w-full" resizeMode="cover" />
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={() => router.back()}
            className="absolute left-5 top-4 h-11 w-11 items-center justify-center rounded-full bg-white/90"
          >
            <Text className="text-xl">‹</Text>
          </Pressable>
        </View>
        <View className="-mt-5 rounded-t-3xl bg-stone-50 px-5 pt-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="h1-bold text-slate-900">{restaurant.name}</Text>
              <Text className="body-regular mt-1 text-slate-500">{restaurant.cuisine}</Text>
            </View>
            <View className="items-center rounded-xl bg-emerald-50 px-3 py-2">
              <Text className="paragraph-bold text-emerald-700">★ {restaurant.rating}</Text>
              <Text className="small-bold text-emerald-700">{restaurant.reviews} avaliações</Text>
            </View>
          </View>
          <View className="mt-5 flex-row gap-4">
            <Text className="body-medium text-slate-700">⌛ {restaurant.deliveryTime}</Text>
            <Text className="body-medium text-slate-700">
              {restaurant.deliveryFee === 0 ? "Entrega grátis" : currency(restaurant.deliveryFee)}
            </Text>
          </View>
          <Text className="mt-8 h3-bold text-slate-900">Mais pedidos</Text>
          {items.map((item) => (
            <View
              key={item.id}
              className="mt-3 flex-row items-center rounded-2xl bg-white p-3 shadow-sm"
            >
              <Image source={item.image} className="h-24 w-24 rounded-xl" resizeMode="cover" />
              <View className="ml-3 flex-1">
                <Text className="base-bold text-slate-900">{item.name}</Text>
                <Text numberOfLines={2} className="body-regular mt-1 text-slate-500">
                  {item.description}
                </Text>
                <Text className="paragraph-bold mt-2 text-slate-900">{currency(item.price)}</Text>
              </View>
              <Pressable
                accessibilityLabel={`Adicionar ${item.name}`}
                accessibilityRole="button"
                onPress={() => add(item)}
                className="h-11 w-11 items-center justify-center rounded-full bg-orange-500"
              >
                <Text className="text-2xl text-white">+</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      {count > 0 && (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/cart")}
          className="absolute bottom-5 left-5 right-5 flex-row items-center justify-between rounded-2xl bg-orange-500 px-5 py-4 shadow-lg"
        >
          <Text className="paragraph-bold text-white">Ver carrinho ({count})</Text>
          <Text className="base-bold text-white">Revisar pedido →</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
