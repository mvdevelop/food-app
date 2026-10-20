import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { restaurants } from "@/src/data/marketplace";

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      restaurants.filter((item) =>
        `${item.name} ${item.cuisine}`.toLowerCase().includes(query.toLowerCase().trim()),
      ),
    [query],
  );
  return (
    <SafeAreaView className="flex-1 bg-stone-50 px-5">
      <Text className="mt-4 h1-bold text-slate-900">Buscar</Text>
      <View className="mt-5 flex-row items-center rounded-2xl bg-white px-4">
        <Text className="mr-3 text-lg">⌕</Text>
        <TextInput
          accessibilityLabel="Buscar"
          autoFocus
          placeholder="Restaurantes, pratos ou categorias"
          placeholderTextColor="#94a3b8"
          value={query}
          onChangeText={setQuery}
          className="h-14 flex-1 font-quicksand-medium text-slate-900"
        />
      </View>
      <Text className="mt-7 h3-bold text-slate-900">
        {query ? `${results.length} resultados` : "Restaurantes populares"}
      </Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 14, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: "/restaurant/[id]", params: { id: item.id } })}
            className="flex-row items-center rounded-2xl bg-white p-3"
          >
            <Image source={item.image} className="h-20 w-20 rounded-xl" />
            <View className="ml-3 flex-1">
              <Text className="paragraph-bold text-slate-900">{item.name}</Text>
              <Text className="body-regular mt-1 text-slate-500">{item.cuisine}</Text>
              <Text className="body-medium mt-2 text-slate-700">
                ★ {item.rating} • {item.deliveryTime}
              </Text>
            </View>
            <Text className="text-xl text-slate-400">›</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text className="py-12 text-center body-medium text-slate-500">
            Nenhum resultado encontrado.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
