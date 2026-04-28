import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 11,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTitleStyle: {
          fontFamily: "Inter_700Bold",
          color: colors.foreground,
          fontSize: 18,
        },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () => (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.card },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Feather name="grid" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => (
            <Feather name="box" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-cart" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbound"
        options={{
          title: "Inbound",
          tabBarIcon: ({ color }) => (
            <Feather name="download" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="returns"
        options={{
          title: "Returns",
          tabBarIcon: ({ color }) => (
            <Feather name="refresh-ccw" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
