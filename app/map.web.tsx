import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
export default function MapScreen() {
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          onPress={() => router.back()}
        >
          <Text className="text-3xl text-slate-900">‹</Text>
        </Pressable>
        <View className="ml-4">
          <Text className="h3-bold text-slate-900">Restaurantes no mapa</Text>
          <Text className="body-regular text-slate-500">Perto de Rua Augusta, 120</Text>
        </View>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-5xl">🗺️</Text>
        <Text className="h3-bold mt-5 text-center text-slate-900">
          Mapa disponível no app mobile
        </Text>
        <Text className="body-regular mt-2 text-center text-slate-500">
          A integração Google Maps usa o build nativo. No navegador, consulte a lista de
          restaurantes.
        </Text>
      </View>
    </SafeAreaView>
  );
}
