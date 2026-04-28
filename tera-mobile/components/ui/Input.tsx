import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, style, ...rest }: Props) {
  const c = useColors();
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 13,
            color: c.foreground,
          }}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={c.mutedForeground}
        {...rest}
        style={[
          {
            borderWidth: 1,
            borderColor: error ? c.destructive : c.border,
            borderRadius: c.radius,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            fontFamily: "Inter_400Regular",
            color: c.foreground,
            backgroundColor: c.card,
          },
          style,
        ]}
      />
      {error ? (
        <Text
          style={{
            color: c.destructive,
            fontSize: 12,
            fontFamily: "Inter_500Medium",
          }}
        >
          {error}
        </Text>
      ) : hint ? (
        <Text
          style={{
            color: c.mutedForeground,
            fontSize: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
