import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/src/state/auth";
import { useFavorites } from "@/src/state/favorites";

const rows = [
  { icon: "📍", label: "Meus endereços", action: "Gerencie seus locais de entrega" },
  { icon: "💳", label: "Formas de pagamento", action: "Cartões e métodos salvos" },
  { icon: "❤️", label: "Favoritos", action: "Seus restaurantes favoritos" },
  { icon: "🔔", label: "Notificações", action: "Preferências de comunicação" },
];
export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const logout = () => {
    signOut();
    router.replace("/login");
  };
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="h1-bold text-slate-900">Meu perfil</Text>
        <View className="mt-6 flex-row items-center rounded-3xl bg-slate-900 p-5">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Text className="text-3xl">🙂</Text>
          </View>
          <View className="ml-4">
            <Text className="base-bold text-white">{user?.name ?? "Visitante"}</Text>
            <Text className="body-medium mt-1 text-slate-300">
              {user?.email ?? "Entre para acessar sua conta"}
            </Text>
          </View>
        </View>
        <Text className="mt-8 h3-bold text-slate-900">Conta</Text>
        {rows.map((row) => (
          <Pressable
            key={row.label}
            accessibilityRole="button"
            className="mt-3 flex-row items-center rounded-2xl bg-white p-4"
          >
            <Text className="text-2xl">{row.icon}</Text>
            <View className="ml-4 flex-1">
              <Text className="paragraph-bold text-slate-900">{row.label}</Text>
              <Text className="body-regular mt-1 text-slate-500">
                {row.label === "Favoritos" ? `${favorites.length} restaurantes salvos` : row.action}
              </Text>
            </View>
            <Text className="text-xl text-slate-400">›</Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/orders")}
          className="mt-3 flex-row items-center rounded-2xl bg-white p-4"
        >
          <Text className="text-2xl">📦</Text>
          <Text className="ml-4 flex-1 paragraph-bold text-slate-900">Meus pedidos</Text>
          <Text className="text-xl text-slate-400">›</Text>
        </Pressable>
        {user ? (
          <Pressable
            accessibilityRole="button"
            onPress={logout}
            className="mt-8 items-center rounded-2xl border border-red-200 py-4"
          >
            <Text className="paragraph-bold text-red-600">Sair da conta</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/login")}
            className="mt-8 items-center rounded-2xl bg-orange-500 py-4"
          >
            <Text className="paragraph-bold text-white">Entrar na conta</Text>
          </Pressable>
        )}
        <Text className="mt-8 text-center body-medium text-slate-400">Food App • versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
