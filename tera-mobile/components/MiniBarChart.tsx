import React from "react";
import { Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Datum {
  label: string;
  value: number;
}

export function MiniBarChart({ data }: { data: Datum[] }) {
  const c = useColors();
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: 120,
          gap: 6,
        }}
      >
        {data.map((d, i) => {
          const h = Math.max(4, (d.value / max) * 110);
          return (
            <View
              key={i}
              style={{ flex: 1, alignItems: "center", gap: 4 }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Inter_600SemiBold",
                  color: c.mutedForeground,
                }}
              >
                {d.value}
              </Text>
              <View
                style={{
                  height: h,
                  width: "78%",
                  backgroundColor: c.primary,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                }}
              />
            </View>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
          gap: 6,
        }}
      >
        {data.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Inter_500Medium",
                color: c.mutedForeground,
              }}
            >
              {d.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
