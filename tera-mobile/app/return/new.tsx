import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import {
  useCreateReturn,
  getListReturnsQueryKey,
} from "@workspace/api-client-react";

export default function NewReturnScreen() {
  const c = useColors();
  const qc = useQueryClient();
  const create = useCreateReturn();
  const [customer, setCustomer] = useState("");
  const [reason, setReason] = useState("");

  const submit = () => {
    if (!customer.trim() || !reason.trim()) {
      Alert.alert("Missing fields", "Customer and reason are required.");
      return;
    }
    create.mutate(
      { data: { customer: customer.trim(), reason: reason.trim() } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListReturnsQueryKey() });
          router.back();
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Could not create";
          Alert.alert("Error", msg);
        },
      },
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ padding: 16, gap: 14 }}
      keyboardShouldPersistTaps="handled"
    >
      <Input
        label="Customer"
        value={customer}
        onChangeText={setCustomer}
        placeholder="e.g. Lily Brown"
      />
      <Input
        label="Reason"
        value={reason}
        onChangeText={setReason}
        placeholder="e.g. Wrong size"
        multiline
      />
      <View style={{ marginTop: 12 }}>
        <Button
          title="Create RMA"
          icon="plus"
          onPress={submit}
          loading={create.isPending}
          fullWidth
          size="lg"
        />
      </View>
    </ScrollView>
  );
}
