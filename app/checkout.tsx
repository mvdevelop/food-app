import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { currency } from "@/src/data/marketplace";
import { useCart } from "@/src/state/cart";
import { useAuth } from "@/src/state/auth";
import { api } from "@/src/services/api";

export default function CheckoutScreen() {
  const { state, clear } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const subtotal = state.lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const total = subtotal + 4.99;
  const placeOrder = async () => {
    if (!state.lines.length) {
      Alert.alert("Carrinho vazio", "Adicione um item antes de continuar.");
      return;
    }
    setSubmitting(true);
    const order = {
      id: `order-${Date.now()}`,
      userId: user?.id ?? "user-001",
      restaurantId: state.lines[0]?.item.restaurantId ?? "burger-house",
      status: "received",
      subtotal,
      deliveryFee: 4.99,
      total,
      note,
      createdAt: new Date().toISOString(),
      items: state.lines.map((line) => ({ dishId: line.item.id, quantity: line.quantity })),
    };
    try {
      await api.createOrder(order);
    } catch {
      // The local demo remains usable when json-server is offline.
    } finally {
      setSubmitting(false);
      clear();
      Alert.alert("Pedido confirmado!", "Seu pedido está sendo preparado.", [
        { text: "Acompanhar pedido", onPress: () => router.replace("/orders") },
      ]);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="flex-row items-center">
          <Pressable accessibilityLabel="Voltar" onPress={() => router.back()}>
            <Text className="text-3xl text-slate-900">‹</Text>
          </Pressable>
          <Text className="ml-4 h1-bold text-slate-900">Finalizar pedido</Text>
        </View>
        <Text className="mt-8 h3-bold text-slate-900">Endereço de entrega</Text>
        <View className="mt-3 rounded-2xl bg-white p-4">
          <Text className="paragraph-bold text-slate-900">📍 Casa</Text>
          <Text className="body-regular mt-1 text-slate-500">Rua Augusta, 120 — Consolação</Text>
          <Text className="body-medium mt-2 text-orange-600">Alterar endereço</Text>
        </View>
        <Text className="mt-7 h3-bold text-slate-900">Forma de pagamento</Text>
        <View className="mt-3 rounded-2xl border-2 border-orange-500 bg-orange-50 p-4">
          <Text className="paragraph-bold text-slate-900">💳 Cartão de crédito</Text>
          <Text className="body-regular mt-1 text-slate-500">•••• 4242</Text>
        </View>
        <Text className="mt-7 h3-bold text-slate-900">Instruções para entrega</Text>
        <TextInput
          accessibilityLabel="Instruções para entrega"
          value={note}
          onChangeText={setNote}
          placeholder="Ex.: tocar o interfone"
          placeholderTextColor="#94a3b8"
          multiline
          className="mt-3 min-h-24 rounded-2xl bg-white p-4 font-quicksand-medium text-slate-900"
        />
        <View className="mt-8 rounded-2xl bg-white p-4">
          <View className="flex-row justify-between">
            <Text className="body-medium text-slate-500">Subtotal</Text>
            <Text className="paragraph-bold text-slate-900">{currency(subtotal)}</Text>
          </View>
          <View className="mt-2 flex-row justify-between">
            <Text className="body-medium text-slate-500">Entrega</Text>
            <Text className="paragraph-bold text-slate-900">{currency(4.99)}</Text>
          </View>
          <View className="mt-4 flex-row justify-between">
            <Text className="h3-bold text-slate-900">Total</Text>
            <Text className="h3-bold text-orange-600">{currency(total)}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={placeOrder}
          className="mt-5 items-center rounded-2xl bg-orange-500 py-4"
        >
          <Text className="base-bold text-white">
            {submitting ? "Enviando pedido..." : "Confirmar pedido"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
