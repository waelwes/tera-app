import React from "react";
import { Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

type Variant = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

const labelMap: Record<string, { label: string; variant: Variant }> = {
  in_stock: { label: "In Stock", variant: "success" },
  low_stock: { label: "Low Stock", variant: "warning" },
  out_of_stock: { label: "Out of Stock", variant: "danger" },

  pending_pick: { label: "Pending Pick", variant: "warning" },
  ready_to_ship: { label: "Ready to Ship", variant: "info" },
  shipped: { label: "Shipped", variant: "success" },
  cancelled: { label: "Cancelled", variant: "neutral" },

  pending: { label: "Pending", variant: "neutral" },
  in_transit: { label: "In Transit", variant: "info" },
  received: { label: "Received", variant: "success" },

  inspecting: { label: "Inspecting", variant: "warning" },
  approved: { label: "Approved", variant: "info" },
  rejected: { label: "Rejected", variant: "danger" },
  restocked: { label: "Restocked", variant: "success" },
};

export function statusLabel(status: string): string {
  return labelMap[status]?.label ?? status;
}

export function StatusPill({
  status,
  size = "md",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const c = useColors();
  const meta = labelMap[status] ?? { label: status, variant: "neutral" as const };
  const palette: Record<Variant, { bg: string; fg: string }> = {
    success: { bg: "#DCFCE7", fg: "#15803D" },
    warning: { bg: "#FEF3C7", fg: "#B45309" },
    danger: { bg: "#FEE2E2", fg: "#B91C1C" },
    info: { bg: "#DBEAFE", fg: "#1D4ED8" },
    neutral: { bg: c.muted, fg: c.mutedForeground },
    primary: { bg: c.accent, fg: c.primary },
  };
  const colors = palette[meta.variant];
  const padV = size === "sm" ? 3 : 5;
  const padH = size === "sm" ? 8 : 10;
  const fs = size === "sm" ? 11 : 12;
  return (
    <View
      style={{
        backgroundColor: colors.bg,
        paddingVertical: padV,
        paddingHorizontal: padH,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: colors.fg,
          fontSize: fs,
          fontFamily: "Inter_600SemiBold",
        }}
      >
        {meta.label}
      </Text>
    </View>
  );
}
