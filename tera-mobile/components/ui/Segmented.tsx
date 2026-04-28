import React from "react";
import { Pressable, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Item<T extends string> {
  value: T;
  label: string;
}

export function Segmented<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: Item<T>[];
}) {
  const c = useColors();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: c.muted,
        borderRadius: c.radius,
        padding: 4,
        gap: 4,
      }}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <Pressable
            key={it.value}
            onPress={() => onChange(it.value)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: c.radius - 4,
              backgroundColor: active ? c.card : "transparent",
              alignItems: "center",
              ...(active
                ? {
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 1,
                  }
                : {}),
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: active ? "Inter_700Bold" : "Inter_500Medium",
                color: active ? c.foreground : c.mutedForeground,
              }}
              numberOfLines={1}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
