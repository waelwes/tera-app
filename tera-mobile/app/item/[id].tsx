import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryPicker } from "@/components/CategoryPicker";
import { useColors } from "@/hooks/useColors";
import {
  useGetItem,
  useUpdateItem,
  useDeleteItem,
  getListItemsQueryKey,
  getGetItemQueryKey,
  getGetDashboardStatsQueryKey,
  getGetInventoryByCategoryQueryKey,
  getGetTopSkusQueryKey,
  type ItemCategory,
} from "@workspace/api-client-react";

export default function EditItemScreen() {
  const c = useColors();
  const qc = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading } = useGetItem(id);
  const update = useUpdateItem();
  const del = useDeleteItem();

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [category, setCategory] = useState<ItemCategory>("electronics");

  useEffect(() => {
    if (item) {
      setSku(item.sku);
      setName(item.name);
      setLocation(item.location);
      setQuantity(String(item.quantity));
      setCategory(item.category);
    }
  }, [item]);

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: getListItemsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetItemQueryKey(id) });
    qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetInventoryByCategoryQueryKey() });
    qc.invalidateQueries({ queryKey: getGetTopSkusQueryKey() });
  };

  const save = () => {
    if (!sku.trim() || !name.trim() || !location.trim()) {
      Alert.alert("Missing fields", "SKU, name, and location are required.");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty < 0) {
      Alert.alert("Invalid quantity", "Quantity must be 0 or greater.");
      return;
    }
    update.mutate(
      {
        id,
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
          invalidateAll();
          router.back();
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Could not save";
          Alert.alert("Error", msg);
        },
      },
    );
  };

  const remove = () => {
    Alert.alert("Delete item?", `${sku} will be permanently removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          del.mutate(
            { id },
            {
              onSuccess: () => {
                invalidateAll();
                router.back();
              },
            },
          ),
      },
    ]);
  };

  if (isLoading || !item) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: c.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={c.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ padding: 16, gap: 14 }}
      keyboardShouldPersistTaps="handled"
    >
      <Input
        label="SKU"
        value={sku}
        onChangeText={setSku}
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <Input label="Name" value={name} onChangeText={setName} />
      <Input
        label="Location"
        value={location}
        onChangeText={setLocation}
        autoCapitalize="characters"
      />
      <Input
        label="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
      />
      <CategoryPicker value={category} onChange={setCategory} />

      <View style={{ marginTop: 12, gap: 10 }}>
        <Button
          title="Save Changes"
          icon="check"
          onPress={save}
          loading={update.isPending}
          fullWidth
          size="lg"
        />
        <Button
          title="Delete Item"
          icon="trash-2"
          variant="secondary"
          onPress={remove}
          loading={del.isPending}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}
