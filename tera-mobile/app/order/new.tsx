import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import {
  useCreateOrder,
  getListOrdersQueryKey,
  getGetDashboardStatsQueryKey,
} from "@workspace/api-client-react";

export default function NewOrderScreen() {
  const c = useColors();
  const qc = useQueryClient();
  const create = useCreateOrder();
  const [customer, setCustomer] = useState("");
  const [count, setCount] = useState("1");

  const submit = () => {
    const c2 = customer.trim();
    const n = parseInt(count, 10);
    if (!c2) {
      Alert.alert("Missing customer", "Customer name is required.");
      return;
    }
    if (Number.isNaN(n) || n < 1) {
      Alert.alert("Invalid count", "Item count must be at least 1.");
      return;
    }
    create.mutate(
      { data: { customer: c2, itemCount: n } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          router.back();
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Could not create order";
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
        label="Customer name"
        value={customer}
        onChangeText={setCustomer}
        placeholder="e.g. Sarah Jenkins"
      />
      <Input
        label="Item count"
        value={count}
        onChangeText={setCount}
        keyboardType="number-pad"
      />
      <View style={{ marginTop: 12 }}>
        <Button
          title="Create Order"
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
