import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Segmented } from "@/components/ui/Segmented";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useListItems,
  type ItemStatusFilter,
} from "@workspace/api-client-react";

export default function InventoryScreen() {
  const c = useColors();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ItemStatusFilter>("all");

  const { data, isFetching, refetch } = useListItems({
    search: search || undefined,
    status: filter,
  });

  const items = data ?? [];

  const counts = useMemo(() => {
    return {
      all: items.length,
      low: items.filter((i) => i.status === "low_stock").length,
      out: items.filter((i) => i.status === "out_of_stock").length,
    };
  }, [items]);

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ padding: 16, gap: 12 }}>
        {/* Search */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: c.card,
            borderRadius: c.radius,
            borderWidth: 1,
            borderColor: c.border,
            paddingHorizontal: 12,
          }}
        >
          <Feather name="search" size={18} color={c.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search SKU or name…"
            placeholderTextColor={c.mutedForeground}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 10,
              fontFamily: "Inter_500Medium",
              fontSize: 14,
              color: c.foreground,
            }}
          />
          {search.length > 0 ? (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x-circle" size={18} color={c.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        <Segmented<ItemStatusFilter>
          value={filter}
          onChange={setFilter}
          items={[
            { value: "all", label: "All" },
            { value: "in_stock", label: "In Stock" },
            { value: "low_stock", label: "Low" },
            { value: "out_of_stock", label: "Out" },
          ]}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: c.mutedForeground,
              fontFamily: "Inter_500Medium",
            }}
          >
            {items.length} {items.length === 1 ? "item" : "items"}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: c.warning,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {counts.low} low • {counts.out} out
          </Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 120,
          gap: 10,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={c.primary}
          />
        }
        ListEmptyComponent={
          isFetching ? null : (
            <EmptyState
              icon="box"
              title="No items found"
              message="Try a different filter or add a new item."
            />
          )
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/item/${item.id}`)}>
            <Card style={{ padding: 14, gap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Inter_700Bold",
                      color: c.primary,
                      letterSpacing: 0.5,
                    }}
                  >
                    {item.sku}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Inter_700Bold",
                      color: c.foreground,
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </View>
                <StatusPill status={item.status} size="sm" />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Feather name="map-pin" size={12} color={c.mutedForeground} />
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Inter_500Medium",
                      color: c.mutedForeground,
                    }}
                  >
                    {item.location}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Inter_800ExtraBold",
                    color: item.quantity === 0 ? c.destructive : c.foreground,
                    letterSpacing: -0.3,
                  }}
                >
                  {item.quantity}
                </Text>
              </View>
            </Card>
          </Pressable>
        )}
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/item/new")}
        style={({ pressed }) => ({
          position: "absolute",
          right: 20,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 999,
          backgroundColor: c.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#FF751F",
          shadowOpacity: 0.35,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
