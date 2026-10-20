import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { categories, currency, restaurants } from "@/src/data/marketplace";
import { useCart } from "@/src/state/cart";

export default function Index() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const { state } = useCart();
  const filtered = useMemo(
    () =>
      restaurants.filter((restaurant) => {
        const matchesCategory = category === "all" || restaurant.category === category;
        const text = `${restaurant.name} ${restaurant.cuisine}`.toLowerCase();
        return matchesCategory && text.includes(query.toLowerCase().trim());
      }),
    [category, query],
  );
  const itemCount = state.lines.reduce((total, line) => total + line.quantity, 0);
  const cartTotal = state.lines.reduce((total, line) => total + line.item.price * line.quantity, 0);

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5 pt-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="body-medium text-slate-500">ENTREGAR EM</Text>
              <Text accessibilityRole="button" className="base-bold text-slate-900">
                📍 Rua Augusta, 120 ▾
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Abrir perfil"
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-full bg-orange-100"
            >
              <Text className="text-xl">🙂</Text>
            </Pressable>
          </View>
          <Text className="mt-7 h1-bold text-slate-900">O que você vai pedir hoje?</Text>
          <View className="mt-4 flex-row items-center rounded-2xl bg-white px-4 shadow-sm">
            <Text className="mr-3 text-lg">⌕</Text>
            <TextInput
              accessibilityLabel="Buscar restaurantes e pratos"
              placeholder="Buscar por prato ou restaurante"
              placeholderTextColor="#94a3b8"
              value={query}
              onChangeText={setQuery}
              className="h-14 flex-1 font-quicksand-medium text-slate-900"
            />
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 pl-5"
          contentContainerStyle={{ gap: 10 }}
        >
          {categories.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: category === item.id }}
              onPress={() => setCategory(item.id)}
              className={`items-center rounded-2xl px-4 py-3 ${category === item.id ? "bg-slate-900" : "bg-white"}`}
            >
              <Text className="text-xl">{item.emoji}</Text>
              <Text
                className={`mt-1 body-medium ${category === item.id ? "text-white" : "text-slate-600"}`}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View className="mt-7 px-5">
          <View className="flex-row items-center justify-between">
            <Text className="h3-bold text-slate-900">Perto de você</Text>
            <Text className="body-medium text-orange-600">Ver todos</Text>
          </View>
        </View>
        <FlatList
          data={filtered}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 14 }}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, nota ${item.rating}`}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >
              <Image source={item.image} className="h-40 w-full" resizeMode="cover" />
              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="base-bold text-slate-900">{item.name}</Text>
                  <View className="rounded-lg bg-emerald-50 px-2 py-1">
                    <Text className="small-bold text-emerald-700">★ {item.rating}</Text>
                  </View>
                </View>
                <Text className="body-regular mt-1 text-slate-500">{item.cuisine}</Text>
                <View className="mt-3 flex-row items-center">
                  <Text className="body-medium text-slate-700">⌛ {item.deliveryTime}</Text>
                  <Text className="mx-2 text-slate-300">•</Text>
                  <Text className="body-medium text-slate-700">
                    {item.deliveryFee === 0 ? "Entrega grátis" : currency(item.deliveryFee)}
                  </Text>
                  {item.badge && (
                    <Text className="ml-auto small-bold text-orange-600">{item.badge}</Text>
                  )}
                </View>
              </View>
            </Pressable>
          )}
        />
        {filtered.length === 0 && (
          <Text className="px-5 py-12 text-center body-medium text-slate-500">
            Não encontramos nada por aqui. Tente outra busca.
          </Text>
        )}
      </ScrollView>
      {itemCount > 0 && (
        <Pressable
          accessibilityRole="button"
          className="absolute bottom-5 left-5 right-5 flex-row items-center justify-between rounded-2xl bg-orange-500 px-5 py-4 shadow-lg"
        >
          <View>
            <Text className="paragraph-bold text-white">
              {itemCount} {itemCount === 1 ? "item" : "itens"} no carrinho
            </Text>
            <Text className="body-medium text-orange-100">Toque para revisar seu pedido</Text>
          </View>
          <Text className="base-bold text-white">{currency(cartTotal)} →</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
