import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryPicker } from "@/components/CategoryPicker";
import { useColors } from "@/hooks/useColors";
import {
  useCreateItem,
  getListItemsQueryKey,
  getGetDashboardStatsQueryKey,
  getGetInventoryByCategoryQueryKey,
  getGetTopSkusQueryKey,
  type ItemCategory,
} from "@workspace/api-client-react";

export default function NewItemScreen() {
  const c = useColors();
  const qc = useQueryClient();
  const create = useCreateItem();

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [category, setCategory] = useState<ItemCategory>("electronics");

  const submit = () => {
    if (!sku.trim() || !name.trim() || !location.trim()) {
      Alert.alert("Missing fields", "SKU, name, and location are required.");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty < 0) {
      Alert.alert("Invalid quantity", "Quantity must be 0 or greater.");
      return;
    }
    create.mutate(
      {
        data: {
          sku: sku.trim().toUpperCase(),
          name: name.trim(),
          location: location.trim().toUpperCase(),
          quantity: qty,
          category,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListItemsQueryKey() });
          qc.invalidateQueries({
            queryKey: getGetDashboardStatsQueryKey(),
          });
          qc.invalidateQueries({
            queryKey: getGetInventoryByCategoryQueryKey(),
          });
          qc.invalidateQueries({ queryKey: getGetTopSkusQueryKey() });
          router.back();
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Could not create item";
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
        label="SKU"
        placeholder="ELEC-W01"
        value={sku}
        onChangeText={setSku}
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <Input
        label="Name"
        placeholder="Wireless Headphones"
        value={name}
        onChangeText={setName}
      />
      <Input
        label="Location"
        placeholder="A1-B2"
        value={location}
        onChangeText={setLocation}
        autoCapitalize="characters"
      />
      <Input
        label="Quantity"
        placeholder="0"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
      />
      <CategoryPicker value={category} onChange={setCategory} />
      <View style={{ marginTop: 12 }}>
        <Button
          title="Create Item"
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
