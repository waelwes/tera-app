import React from "react";
import { Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electronics",
  home_goods: "Home Goods",
  apparel: "Apparel",
  office: "Office",
  tech_accessories: "Tech Accessories",
};

const PALETTE = ["#FF751F", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

export function CategoryBars({
  data,
}: {
  data: { category: string; total: number }[];
}) {
  const c = useColors();
  const max = Math.max(1, ...data.map((d) => d.total));

  return (
    <View style={{ gap: 12 }}>
      {data.map((d, i) => {
        const pct = (d.total / max) * 100;
        const color = PALETTE[i % PALETTE.length];
        return (
          <View key={d.category} style={{ gap: 6 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Inter_500Medium",
                  color: c.foreground,
                }}
              >
                {CATEGORY_LABELS[d.category] ?? d.category}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Inter_700Bold",
                  color: c.foreground,
                }}
              >
                {d.total}
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: c.muted,
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  backgroundColor: color,
                  borderRadius: 999,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
