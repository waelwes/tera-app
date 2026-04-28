import React from "react";
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
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useListPurchaseOrders,
  useUpdatePurchaseOrderStatus,
  useDeletePurchaseOrder,
  getListPurchaseOrdersQueryKey,
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "@workspace/api-client-react";

const NEXT: Record<PurchaseOrderStatus, PurchaseOrderStatus | null> = {
  pending: "in_transit",
  in_transit: "received",
  received: null,
  cancelled: null,
};

const NEXT_LABEL: Record<PurchaseOrderStatus, string | null> = {
  pending: "Mark In Transit",
  in_transit: "Receive",
  received: null,
  cancelled: null,
};

export default function InboundScreen() {
  const c = useColors();
  const qc = useQueryClient();
  const { data, isFetching, refetch } = useListPurchaseOrders();
  const items = data ?? [];

  const updateMutation = useUpdatePurchaseOrderStatus();
  const deleteMutation = useDeletePurchaseOrder();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListPurchaseOrdersQueryKey() });
  };

  const advance = (po: PurchaseOrder) => {
    const next = NEXT[po.status];
    if (!next) return;
    updateMutation.mutate(
      { id: po.id, data: { status: next } },
      { onSuccess: invalidate },
    );
  };

  const onDelete = (po: PurchaseOrder) => {
    Alert.alert("Delete purchase order?", `Remove ${po.poNumber}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteMutation.mutate(
            { id: po.id },
            { onSuccess: invalidate },
          ),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{
          padding: 16,
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
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 12,
              color: c.mutedForeground,
              fontFamily: "Inter_500Medium",
              paddingBottom: 12,
              paddingHorizontal: 4,
            }}
          >
            {items.length} inbound shipment{items.length === 1 ? "" : "s"}
          </Text>
        }
        ListEmptyComponent={
          isFetching ? null : (
            <EmptyState
              icon="download"
              title="No inbound shipments"
              message="Create a purchase order to track new stock."
            />
          )
        }
        renderItem={({ item }) => {
          const next = NEXT_LABEL[item.status];
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
                    {item.poNumber}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "Inter_700Bold",
                      color: c.foreground,
                      marginTop: 2,
                    }}
                  >
                    {item.supplier}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    <Feather name="calendar" size={12} color={c.mutedForeground} />
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "Inter_500Medium",
                        color: c.mutedForeground,
                      }}
                    >
                      ETA {item.eta}
                    </Text>
                  </View>
                </View>
                <StatusPill status={item.status} />
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {next ? (
                  <Button
                    title={next}
                    icon={item.status === "in_transit" ? "check-circle" : "truck"}
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
            </Card>
          );
        }}
      />

      <Pressable
        onPress={() => router.push("/po/new")}
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
