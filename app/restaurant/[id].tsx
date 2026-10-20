import React, { useEffect, useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { combos, currency, menuItems, restaurants } from "@/src/data/marketplace";
import { useCart } from "@/src/state/cart";
import { useFavorites } from "@/src/state/favorites";
import { api } from "@/src/services/api";

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurant = restaurants.find((item) => item.id === id) ?? restaurants[0];
  const restaurantId = restaurant?.id ?? "";
  const items = useMemo(
    () => menuItems.filter((item) => item.restaurantId === restaurantId),
    [restaurantId],
  );
  const { add, state } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const [reviews, setReviews] = useState<
    { id: string; userName: string; rating: number; comment: string }[]
  >([]);
  const [customizing, setCustomizing] = useState<(typeof menuItems)[number] | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);
  const extras = [
    { name: "Queijo extra", price: 3.5 },
    { name: "Bacon crocante", price: 4.9 },
    { name: "Fritas", price: 9.9 },
  ];
  const restaurantCombos = combos.filter((combo) => combo.restaurantId === restaurantId);
  useEffect(() => {
    api
      .reviews(restaurantId)
      .then((data) =>
        setReviews(data as { id: string; userName: string; rating: number; comment: string }[]),
      )
      .catch(() => setReviews([]));
  }, [restaurantId]);
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
              <View className="flex-row items-center">
                <Text className="h1-bold flex-1 text-slate-900">{restaurant.name}</Text>
                <Pressable
                  accessibilityLabel="Favoritar restaurante"
                  accessibilityRole="button"
                  onPress={() => toggle(restaurant.id)}
                >
                  <Text className="text-2xl">{isFavorite(restaurant.id) ? "♥" : "♡"}</Text>
                </Pressable>
              </View>
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
          {reviews.length > 0 && (
            <>
              <Text className="mt-8 h3-bold text-slate-900">O que nossos clientes dizem</Text>
              {reviews.map((review) => (
                <View key={review.id} className="mt-3 rounded-2xl bg-white p-4">
                  <View className="flex-row justify-between">
                    <Text className="paragraph-bold text-slate-900">{review.userName}</Text>
                    <Text className="small-bold text-amber-600">★ {review.rating}</Text>
                  </View>
                  <Text className="body-regular mt-2 text-slate-600">{review.comment}</Text>
                </View>
              ))}
            </>
          )}
          {restaurantCombos.length > 0 && (
            <>
              <Text className="mt-8 h3-bold text-slate-900">Combos e ofertas</Text>
              {restaurantCombos.map((combo) => (
                <View key={combo.id} className="mt-3 rounded-2xl bg-orange-50 p-4">
                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <Text className="base-bold text-slate-900">{combo.name}</Text>
                      <Text className="body-regular mt-1 text-slate-600">{combo.description}</Text>
                    </View>
                    <Text className="paragraph-bold text-orange-600">{currency(combo.price)}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      const item = menuItems.find((entry) => entry.id === combo.items[0]);
                      if (item) {
                        add(item);
                      }
                    }}
                    className="mt-3 items-center rounded-xl bg-orange-500 py-2"
                  >
                    <Text className="paragraph-bold text-white">Adicionar combo</Text>
                  </Pressable>
                </View>
              ))}
            </>
          )}
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
                onPress={() => {
                  setCustomizing(item);
                  setSelectedExtras([]);
                }}
                className="h-11 w-11 items-center justify-center rounded-full bg-orange-500"
              >
                <Text className="text-2xl text-white">+</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={customizing !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setCustomizing(null)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white p-5">
            <View className="flex-row items-center justify-between">
              <Text className="h3-bold text-slate-900">Personalize seu pedido</Text>
              <Pressable accessibilityLabel="Fechar" onPress={() => setCustomizing(null)}>
                <Text className="text-2xl text-slate-500">×</Text>
              </Pressable>
            </View>
            <Text className="base-bold mt-5 text-slate-900">{customizing?.name}</Text>
            <Text className="body-medium mt-1 text-slate-500">Escolha seus adicionais</Text>
            {extras.map((extra) => {
              const selected = selectedExtras.some((item) => item.name === extra.name);
              return (
                <Pressable
                  key={extra.name}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  onPress={() =>
                    setSelectedExtras((current) =>
                      selected
                        ? current.filter((item) => item.name !== extra.name)
                        : [...current, extra],
                    )
                  }
                  className="mt-3 flex-row items-center justify-between rounded-xl bg-stone-50 p-4"
                >
                  <Text className="paragraph-bold text-slate-900">
                    {selected ? "✓" : "○"} {extra.name}
                  </Text>
                  <Text className="body-medium text-slate-600">+ {currency(extra.price)}</Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => {
                if (customizing) {
                  add(customizing, selectedExtras);
                }
                setCustomizing(null);
              }}
              className="mt-5 items-center rounded-2xl bg-orange-500 py-4"
            >
              <Text className="base-bold text-white">Adicionar ao carrinho</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
