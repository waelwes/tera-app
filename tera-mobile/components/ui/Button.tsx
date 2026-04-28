import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
  type ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends Omit<PressableProps, "children" | "style"> {
  title: string;
  variant?: Variant;
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "md" | "lg" | "sm";
  style?: ViewStyle;
}

export function Button({
  title,
  variant = "primary",
  icon,
  loading,
  fullWidth,
  size = "md",
  disabled,
  style,
  ...rest
}: Props) {
  const c = useColors();

  const palette: Record<Variant, { bg: string; fg: string; border: string }> = {
    primary: { bg: c.primary, fg: c.primaryForeground, border: c.primary },
    secondary: { bg: c.card, fg: c.foreground, border: c.border },
    ghost: { bg: "transparent", fg: c.foreground, border: "transparent" },
    danger: { bg: c.destructive, fg: c.destructiveForeground, border: c.destructive },
  };
  const palette_ = palette[variant];
  const padV = size === "lg" ? 14 : size === "sm" ? 8 : 12;
  const padH = size === "lg" ? 18 : size === "sm" ? 12 : 16;
  const fs = size === "lg" ? 16 : size === "sm" ? 13 : 15;

  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: palette_.bg,
          borderColor: palette_.border,
          borderWidth: 1,
          borderRadius: c.radius,
          paddingVertical: padV,
          paddingHorizontal: padH,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: disabled || loading ? 0.6 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        } as ViewStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette_.fg} size="small" />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon ? <Feather name={icon} size={fs + 2} color={palette_.fg} /> : null}
          <Text
            style={{
              color: palette_.fg,
              fontSize: fs,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
