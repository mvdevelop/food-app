import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { currency } from "@/src/data/marketplace";
import { useCart } from "@/src/state/cart";

export default function CartScreen() {
  const { state, add, remove } = useCart();
  const subtotal = state.lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const delivery = subtotal > 0 ? 4.99 : 0;
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }}>
        <View className="flex-row items-center">
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={() => router.back()}
          >
            <Text className="text-3xl text-slate-900">‹</Text>
          </Pressable>
          <Text className="ml-4 h1-bold text-slate-900">Seu carrinho</Text>
        </View>
        {state.lines.length === 0 ? (
          <View className="items-center py-28">
            <Text className="text-5xl">🛍️</Text>
            <Text className="h3-bold mt-5 text-slate-900">Seu carrinho está vazio</Text>
            <Text className="body-regular mt-2 text-center text-slate-500">
              Explore os restaurantes e encontre algo delicioso.
            </Text>
            <Pressable
              onPress={() => router.replace("/")}
              className="mt-6 rounded-full bg-orange-500 px-6 py-3"
            >
              <Text className="paragraph-bold text-white">Explorar restaurantes</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {state.lines.map((line) => (
              <View
                key={line.item.id}
                className="mt-4 flex-row items-center rounded-2xl bg-white p-3"
              >
                <Image source={line.item.image} className="h-20 w-20 rounded-xl" />
                <View className="ml-3 flex-1">
                  <Text className="paragraph-bold text-slate-900">{line.item.name}</Text>
                  <Text className="body-medium mt-1 text-slate-500">
                    {currency(line.item.price)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Pressable
                    accessibilityLabel={`Remover ${line.item.name}`}
                    onPress={() => remove(line.item.id)}
                    className="h-8 w-8 items-center justify-center rounded-full bg-orange-100"
                  >
                    <Text className="text-lg text-orange-600">−</Text>
                  </Pressable>
                  <Text className="paragraph-bold text-slate-900">{line.quantity}</Text>
                  <Pressable
                    accessibilityLabel={`Adicionar ${line.item.name}`}
                    onPress={() => add(line.item)}
                    className="h-8 w-8 items-center justify-center rounded-full bg-orange-500"
                  >
                    <Text className="text-lg text-white">+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
      {state.lines.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-6 pt-5 shadow-lg">
          <View className="flex-row justify-between">
            <Text className="body-medium text-slate-500">Subtotal</Text>
            <Text className="paragraph-bold text-slate-900">{currency(subtotal)}</Text>
          </View>
          <View className="mt-2 flex-row justify-between">
            <Text className="body-medium text-slate-500">Entrega</Text>
            <Text className="paragraph-bold text-slate-900">{currency(delivery)}</Text>
          </View>
          <View className="mt-3 flex-row justify-between">
            <Text className="h3-bold text-slate-900">Total</Text>
            <Text className="h3-bold text-orange-600">{currency(subtotal + delivery)}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/checkout")}
            className="mt-4 items-center rounded-2xl bg-orange-500 py-4"
          >
            <Text className="base-bold text-white">Continuar para pagamento</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
