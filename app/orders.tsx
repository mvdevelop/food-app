import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { api } from "@/src/services/api";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<{ id: string; status: string; total: number }[]>([]);
  useEffect(() => {
    api
      .orders("user-001")
      .then((data) => setOrders(data as { id: string; status: string; total: number }[]))
      .catch(() => setOrders([]));
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row items-center">
          <Pressable accessibilityLabel="Voltar" onPress={() => router.back()}>
            <Text className="text-3xl text-slate-900">‹</Text>
          </Pressable>
          <Text className="ml-4 h1-bold text-slate-900">Meus pedidos</Text>
        </View>
        {orders.map((order) => (
          <Text key={order.id} className="mt-3 body-medium text-slate-500">
            Pedido sincronizado: {order.id} • {order.status} • R${" "}
            {order.total.toFixed(2).replace(".", ",")}
          </Text>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: "/order/[id]", params: { id: "order-10482" } })}
          className="mt-7 rounded-3xl bg-white p-5 shadow-sm"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="base-bold text-slate-900">Burger House</Text>
              <Text className="body-medium mt-1 text-slate-500">Pedido #10482 • Hoje, 12:32</Text>
            </View>
            <Text className="small-bold rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700">
              A caminho
            </Text>
          </View>
          <View className="mt-6 flex-row items-center justify-between">
            <View className="items-center">
              <Text className="text-xl">✓</Text>
              <Text className="small-bold mt-1 text-slate-700">Recebido</Text>
            </View>
            <View className="h-1 flex-1 bg-orange-500" />
            <View className="items-center">
              <Text className="text-xl">🍳</Text>
              <Text className="small-bold mt-1 text-slate-700">Preparando</Text>
            </View>
            <View className="h-1 flex-1 bg-orange-200" />
            <View className="items-center">
              <Text className="text-xl">🛵</Text>
              <Text className="small-bold mt-1 text-slate-400">A caminho</Text>
            </View>
          </View>
          <Text className="mt-6 body-medium text-slate-500">Previsão de entrega</Text>
          <Text className="base-bold mt-1 text-slate-900">12:55 – 13:05</Text>
          <Pressable
            onPress={() => router.push("/")}
            className="mt-5 items-center rounded-xl bg-orange-100 py-3"
          >
            <Text className="paragraph-bold text-orange-700">Pedir novamente</Text>
          </Pressable>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
