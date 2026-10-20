import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/src/state/auth";

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("marina@example.com");
  const [password, setPassword] = useState("demo-password");
  const [error, setError] = useState("");
  const submit = async () => {
    setError("");
    const success = await signIn(email.trim(), password);
    if (success) {
      router.replace("/(tabs)/" as never);
    } else {
      setError("E-mail ou senha inválidos.");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-stone-50 px-5">
      <View className="flex-1 justify-center">
        <Text className="text-5xl">🍔</Text>
        <Text className="mt-5 h1-bold text-slate-900">Bem-vindo de volta</Text>
        <Text className="body-regular mt-2 text-slate-500">
          Entre para acompanhar seus pedidos e favoritos.
        </Text>
        <Text className="label mt-8">E-mail</Text>
        <TextInput
          accessibilityLabel="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          className="input mt-2 bg-white"
        />
        <Text className="label mt-5">Senha</Text>
        <TextInput
          accessibilityLabel="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="input mt-2 bg-white"
        />
        {error ? <Text className="mt-3 body-medium text-red-600">{error}</Text> : null}
        <Pressable
          accessibilityRole="button"
          onPress={submit}
          disabled={loading}
          className="mt-7 items-center rounded-2xl bg-orange-500 py-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="base-bold text-white">Entrar</Text>
          )}
        </Pressable>
        <Text className="mt-5 text-center small-bold text-slate-400">
          Demo: marina@example.com / demo-password
        </Text>
      </View>
    </SafeAreaView>
  );
}
