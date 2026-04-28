import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { Segmented } from "@/components/ui/Segmented";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useListOrders,
  useUpdateOrderStatus,
  useDeleteOrder,
  getListOrdersQueryKey,
  getGetDashboardStatsQueryKey,
  getGetOrdersShippedSeriesQueryKey,
  type OrderStatus,
  type Order,
} from "@workspace/api-client-react";

type Filter = "all" | OrderStatus;

const NEXT: Record<OrderStatus, OrderStatus | null> = {
  pending_pick: "ready_to_ship",
  ready_to_ship: "shipped",
  shipped: null,
  cancelled: null,
};

const NEXT_LABEL: Record<OrderStatus, string | null> = {
  pending_pick: "Mark Ready",
  ready_to_ship: "Ship Order",
  shipped: null,
  cancelled: null,
};

export default function OrdersScreen() {
  const c = useColors();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");

  const { data, isFetching, refetch } = useListOrders(
    filter === "all" ? {} : { status: filter },
  );
  const orders = data ?? [];

  const updateMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });
    qc.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
    qc.invalidateQueries({
      queryKey: getGetOrdersShippedSeriesQueryKey(),
    });
  };

  const advance = (order: Order) => {
    const next = NEXT[order.status];
    if (!next) return;
    updateMutation.mutate(
      { id: order.id, data: { status: next } },
      { onSuccess: invalidate },
    );
  };

  const onDelete = (order: Order) => {
    Alert.alert(
      "Delete order?",
      `This will permanently remove ${order.orderNumber}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteMutation.mutate(
              { id: order.id },
              { onSuccess: invalidate },
            ),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ padding: 16, gap: 12 }}>
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          items={[
            { value: "all", label: "All" },
            { value: "pending_pick", label: "Pending" },
            { value: "ready_to_ship", label: "Ready" },
            { value: "shipped", label: "Shipped" },
          ]}
        />
        <Text
          style={{
            fontSize: 12,
            color: c.mutedForeground,
            fontFamily: "Inter_500Medium",
            paddingHorizontal: 4,
          }}
        >
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 120,
          gap: 12,
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
              icon="shopping-cart"
              title="No orders"
              message="New orders will appear here."
            />
          )
        }
        renderItem={({ item }) => {
          const nextLabel = NEXT_LABEL[item.status];
          return (
            <Card style={{ gap: 12 }}>
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
                    {item.orderNumber}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Inter_700Bold",
                      color: c.foreground,
                      marginTop: 2,
                    }}
                  >
                    {item.customer}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Inter_500Medium",
                      color: c.mutedForeground,
                      marginTop: 2,
                    }}
                  >
                    {item.itemCount} {item.itemCount === 1 ? "item" : "items"}
                  </Text>
                </View>
                <StatusPill status={item.status} />
              </View>

              {(nextLabel || item.status !== "cancelled") && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {nextLabel ? (
                    <Button
                      title={nextLabel}
                      icon={
                        item.status === "ready_to_ship" ? "send" : "check"
                      }
                      onPress={() => advance(item)}
                      style={{ flex: 1 }}
                      size="sm"
                    />
                  ) : null}
                  <Pressable
                    onPress={() => onDelete(item)}
                    style={({ pressed }) => ({
                      width: 40,
                      height: 40,
                      borderRadius: c.radius,
                      borderWidth: 1,
                      borderColor: c.border,
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Feather name="trash-2" size={16} color={c.destructive} />
                  </Pressable>
                </View>
              )}
            </Card>
          );
        }}
      />

      <Pressable
        onPress={() => router.push("/order/new")}
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
