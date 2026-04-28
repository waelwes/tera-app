import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

export function Card({ style, children, ...rest }: ViewProps) {
  const c = useColors();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: c.card,
          borderRadius: c.radius,
          borderWidth: 1,
          borderColor: c.border,
          padding: 16,
        } as ViewStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}
