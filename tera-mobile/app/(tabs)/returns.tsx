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
  useListReturns,
  useUpdateReturnStatus,
  useDeleteReturn,
  getListReturnsQueryKey,
  type ReturnRMA,
  type ReturnStatus,
} from "@workspace/api-client-react";

const NEXT: Record<ReturnStatus, ReturnStatus | null> = {
  inspecting: "approved",
  approved: "restocked",
  restocked: null,
  rejected: null,
};

const NEXT_LABEL: Record<ReturnStatus, string | null> = {
  inspecting: "Approve",
  approved: "Restock",
  restocked: null,
  rejected: null,
};

export default function ReturnsScreen() {
  const c = useColors();
  const qc = useQueryClient();
  const { data, isFetching, refetch } = useListReturns();
  const items = data ?? [];

  const updateMutation = useUpdateReturnStatus();
  const deleteMutation = useDeleteReturn();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListReturnsQueryKey() });
  };

  const advance = (r: ReturnRMA) => {
    const next = NEXT[r.status];
    if (!next) return;
    updateMutation.mutate(
      { id: r.id, data: { status: next } },
      { onSuccess: invalidate },
    );
  };

  const reject = (r: ReturnRMA) => {
    updateMutation.mutate(
      { id: r.id, data: { status: "rejected" } },
      { onSuccess: invalidate },
    );
  };

  const onDelete = (r: ReturnRMA) => {
    Alert.alert("Delete return?", `Remove ${r.rmaNumber}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteMutation.mutate({ id: r.id }, { onSuccess: invalidate }),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
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
            {items.length} active return{items.length === 1 ? "" : "s"}
          </Text>
        }
        ListEmptyComponent={
          isFetching ? null : (
            <EmptyState
              icon="refresh-ccw"
              title="No returns"
              message="Returns and RMAs will show here."
            />
          )
        }
        renderItem={({ item }) => {
          const next = NEXT_LABEL[item.status];
          const showReject = item.status === "inspecting";
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
                    {item.rmaNumber}
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
                    {item.reason}
                  </Text>
                </View>
                <StatusPill status={item.status} />
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {next ? (
                  <Button
                    title={next}
                    icon={item.status === "approved" ? "package" : "check"}
                    onPress={() => advance(item)}
                    style={{ flex: 1 }}
                    size="sm"
                  />
                ) : null}
                {showReject ? (
                  <Button
                    title="Reject"
                    variant="secondary"
                    onPress={() => reject(item)}
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
        onPress={() => router.push("/return/new")}
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
