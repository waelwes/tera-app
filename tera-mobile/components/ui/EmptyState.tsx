import React from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export function EmptyState({
  icon = "inbox",
  title,
  message,
}: {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message?: string;
}) {
  const c = useColors();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 24,
        gap: 8,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          backgroundColor: c.accent,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <Feather name={icon} size={26} color={c.primary} />
      </View>
      <Text
        style={{
          fontFamily: "Inter_700Bold",
          fontSize: 16,
          color: c.foreground,
        }}
      >
        {title}
      </Text>
      {message ? (
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: c.mutedForeground,
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
