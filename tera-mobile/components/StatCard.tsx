import React from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";

export function StatCard({
  label,
  value,
  icon,
  accent = "primary",
  delta,
}: {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  accent?: "primary" | "success" | "warning" | "danger" | "info";
  delta?: { text: string; up?: boolean };
}) {
  const c = useColors();
  const palette: Record<string, { bg: string; fg: string }> = {
    primary: { bg: c.accent, fg: c.primary },
    success: { bg: "#DCFCE7", fg: "#15803D" },
    warning: { bg: "#FEF3C7", fg: "#B45309" },
    danger: { bg: "#FEE2E2", fg: "#B91C1C" },
    info: { bg: "#DBEAFE", fg: "#1D4ED8" },
  };
  const p = palette[accent];

  return (
    <Card style={{ flex: 1, gap: 10, padding: 14 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: p.bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name={icon} size={18} color={p.fg} />
        </View>
        {delta ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Feather
              name={delta.up ? "arrow-up-right" : "arrow-down-right"}
              size={12}
              color={delta.up ? "#15803D" : "#B91C1C"}
            />
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Inter_600SemiBold",
                color: delta.up ? "#15803D" : "#B91C1C",
              }}
            >
              {delta.text}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={{ gap: 2 }}>
        <Text
          style={{
            fontSize: 22,
            fontFamily: "Inter_800ExtraBold",
            color: c.foreground,
            letterSpacing: -0.5,
          }}
        >
          {value}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_500Medium",
            color: c.mutedForeground,
          }}
        >
          {label}
        </Text>
      </View>
    </Card>
  );
}
