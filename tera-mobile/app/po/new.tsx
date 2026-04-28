import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import {
  useCreatePurchaseOrder,
  getListPurchaseOrdersQueryKey,
} from "@workspace/api-client-react";

export default function NewPoScreen() {
  const c = useColors();
  const qc = useQueryClient();
  const create = useCreatePurchaseOrder();
  const [supplier, setSupplier] = useState("");
  const [eta, setEta] = useState("");

  const submit = () => {
    if (!supplier.trim() || !eta.trim()) {
      Alert.alert("Missing fields", "Supplier and ETA are required.");
      return;
    }
    create.mutate(
      { data: { supplier: supplier.trim(), eta: eta.trim() } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
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
        label="Supplier"
        value={supplier}
        onChangeText={setSupplier}
        placeholder="e.g. Global Electronics Ltd."
      />
      <Input
        label="ETA"
        value={eta}
        onChangeText={setEta}
        placeholder="e.g. Tomorrow, Oct 24"
      />
      <View style={{ marginTop: 12 }}>
        <Button
          title="Create PO"
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
