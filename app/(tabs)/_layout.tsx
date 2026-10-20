import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: { fontFamily: "QuickSand-SemiBold" },
        tabBarStyle: { height: 68, paddingBottom: 8, paddingTop: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ focused }) => <Text className={focused ? "text-xl" : "text-lg"}>⌂</Text>,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ focused }) => <Text className={focused ? "text-xl" : "text-lg"}>⌕</Text>,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ focused }) => <Text className={focused ? "text-xl" : "text-lg"}>▣</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => <Text className={focused ? "text-xl" : "text-lg"}>●</Text>,
        }}
      />
    </Tabs>
  );
}
