import React from "react";
import { Pressable, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { ItemCategory } from "@workspace/api-client-react";

const OPTIONS: { value: ItemCategory; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "home_goods", label: "Home Goods" },
  { value: "apparel", label: "Apparel" },
  { value: "office", label: "Office" },
  { value: "tech_accessories", label: "Tech Accessories" },
];

export function CategoryPicker({
  value,
  onChange,
}: {
  value: ItemCategory;
  onChange: (v: ItemCategory) => void;
}) {
  const c = useColors();
  return (
    <View style={{ gap: 6 }}>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 13,
          color: c.foreground,
        }}
      >
        Category
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {OPTIONS.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: active ? c.primary : c.border,
                backgroundColor: active ? c.accent : c.card,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: active ? "Inter_700Bold" : "Inter_500Medium",
                  color: active ? c.primary : c.foreground,
                }}
              >
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
