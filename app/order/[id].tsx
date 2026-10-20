import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/src/services/api";
import { currency } from "@/src/data/marketplace";

type Order = {
  id: string;
  status: string;
  total: number;
  estimatedDelivery?: string;
  createdAt?: string;
};
const steps = [
  { key: "received", label: "Pedido recebido", icon: "✓" },
  { key: "preparing", label: "Preparando seu pedido", icon: "🍳" },
  { key: "on_the_way", label: "Saiu para entrega", icon: "🛵" },
  { key: "delivered", label: "Pedido entregue", icon: "🏠" },
];
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      api
        .order(id)
        .then((data) => setOrder(data as Order))
        .catch(() => setOrder(null))
        .finally(() => setLoading(false));
    }
  }, [id]);
  const current = Math.max(
    0,
    steps.findIndex((step) => step.key === order?.status),
  );
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Pressable accessibilityLabel="Voltar" onPress={() => router.back()}>
          <Text className="text-3xl text-slate-900">‹</Text>
        </Pressable>
        <Text className="mt-4 h1-bold text-slate-900">Acompanhar pedido</Text>
        {loading ? (
          <ActivityIndicator className="mt-12" color="#f97316" />
        ) : !order ? (
          <View className="items-center py-20">
            <Text className="h3-bold text-slate-900">Pedido não encontrado</Text>
            <Text className="body-regular mt-2 text-slate-500">
              Verifique se o mock backend está ativo.
            </Text>
          </View>
        ) : (
          <>
            <View className="mt-7 rounded-3xl bg-white p-5">
              <Text className="paragraph-bold text-slate-900">
                Pedido #{order.id.replace("order-", "")}
              </Text>
              <Text className="body-medium mt-1 text-slate-500">
                Previsão: {order.estimatedDelivery ?? "Em breve"}
              </Text>
              {steps.map((step, index) => (
                <View key={step.key} className="mt-6 flex-row items-center">
                  <View
                    className={`h-10 w-10 items-center justify-center rounded-full ${index <= current ? "bg-orange-500" : "bg-slate-100"}`}
                  >
                    <Text>{step.icon}</Text>
                  </View>
                  <Text
                    className={`ml-4 paragraph-bold ${index <= current ? "text-slate-900" : "text-slate-400"}`}
                  >
                    {step.label}
                  </Text>
                </View>
              ))}
            </View>
            <View className="mt-4 flex-row justify-between rounded-2xl bg-white p-5">
              <Text className="h3-bold text-slate-900">Total</Text>
              <Text className="h3-bold text-orange-600">{currency(order.total)}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
