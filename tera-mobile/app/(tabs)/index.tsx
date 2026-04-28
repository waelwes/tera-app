import React from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/StatCard";
import { MiniBarChart } from "@/components/MiniBarChart";
import { CategoryBars } from "@/components/CategoryBars";
import { StatusPill } from "@/components/ui/StatusPill";
import { useColors } from "@/hooks/useColors";
import {
  useGetDashboardStats,
  useGetOrdersShippedSeries,
  useGetInventoryByCategory,
  useGetTopSkus,
  useListItems,
} from "@workspace/api-client-react";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function dayLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return DOW[d.getDay()] ?? iso;
}

export default function DashboardScreen() {
  const c = useColors();
  const stats = useGetDashboardStats();
  const series = useGetOrdersShippedSeries();
  const cats = useGetInventoryByCategory();
  const top = useGetTopSkus();
  const items = useListItems({});

  const onRefresh = () => {
    stats.refetch();
    series.refetch();
    cats.refetch();
    top.refetch();
    items.refetch();
  };

  const refreshing =
    stats.isFetching ||
    series.isFetching ||
    cats.isFetching ||
    items.isFetching;

  const lowStockItems =
    items.data?.filter(
      (i) => i.status === "low_stock" || i.status === "out_of_stock",
    ) ?? [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={c.primary}
        />
      }
    >
      {/* Hero header */}
      <View
        style={{
          backgroundColor: c.sidebar,
          borderRadius: c.radius,
          padding: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            style={{
              color: "#94A3B8",
              fontSize: 12,
              fontFamily: "Inter_600SemiBold",
              letterSpacing: 0.5,
            }}
          >
            WAREHOUSE 01 • LIVE
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 22,
              fontFamily: "Inter_800ExtraBold",
              letterSpacing: -0.5,
            }}
          >
            Welcome back, Alex
          </Text>
          <Text
            style={{
              color: "#CBD5E1",
              fontSize: 13,
              fontFamily: "Inter_400Regular",
            }}
          >
            Here's what's moving through the floor today.
          </Text>
        </View>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: c.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="package" size={22} color="#FFFFFF" />
        </View>
      </View>

      {/* KPIs */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <StatCard
          label="Total SKUs"
          value={stats.data ? String(stats.data.totalSkus) : "—"}
          icon="layers"
          accent="primary"
        />
        <StatCard
          label="Shipped Today"
          value={stats.data ? String(stats.data.shippedToday) : "—"}
          icon="truck"
          accent="success"
          delta={{ text: "+12%", up: true }}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <StatCard
          label="Pending Orders"
          value={stats.data ? String(stats.data.pendingOrders) : "—"}
          icon="clock"
          accent="warning"
        />
        <StatCard
          label="Low Stock"
          value={stats.data ? String(stats.data.lowStockCount) : "—"}
          icon="alert-triangle"
          accent="danger"
        />
      </View>

      {/* Inventory value bar */}
      <Card>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 4 }}>
            <Text
              style={{
                color: c.mutedForeground,
                fontSize: 12,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: 0.5,
              }}
            >
              INVENTORY VALUE
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Inter_800ExtraBold",
                color: c.foreground,
                letterSpacing: -0.5,
              }}
            >
              {stats.data ? formatCurrency(stats.data.inventoryValue) : "—"}
            </Text>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <Text
              style={{
                color: c.mutedForeground,
                fontSize: 11,
                fontFamily: "Inter_500Medium",
              }}
            >
              Pick accuracy
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Inter_700Bold",
                color: "#15803D",
              }}
            >
              {stats.data ? `${stats.data.pickAccuracy.toFixed(1)}%` : "—"}
            </Text>
          </View>
        </View>
      </Card>

      {/* Orders shipped 7-day chart */}
      <Card>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Inter_700Bold",
              color: c.foreground,
            }}
          >
            Orders shipped — last 7 days
          </Text>
          <View
            style={{
              backgroundColor: c.accent,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                color: c.primary,
                fontSize: 11,
                fontFamily: "Inter_700Bold",
              }}
            >
              7D
            </Text>
          </View>
        </View>
        <MiniBarChart
          data={
            series.data?.map((d) => ({
              label: dayLabel(d.day),
              value: d.count,
            })) ?? []
          }
        />
      </Card>

      {/* Inventory by category */}
      <Card>
        <Text
          style={{
            fontSize: 15,
            fontFamily: "Inter_700Bold",
            color: c.foreground,
            marginBottom: 14,
          }}
        >
          Inventory by category
        </Text>
        <CategoryBars data={cats.data ?? []} />
      </Card>

      {/* Top SKUs */}
      <Card>
        <Text
          style={{
            fontSize: 15,
            fontFamily: "Inter_700Bold",
            color: c.foreground,
            marginBottom: 12,
          }}
        >
          Top SKUs
        </Text>
        <View style={{ gap: 10 }}>
          {(top.data ?? []).map((t) => (
            <View
              key={t.sku}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Inter_700Bold",
                    color: c.primary,
                  }}
                >
                  {t.sku}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Inter_400Regular",
                    color: c.mutedForeground,
                  }}
                  numberOfLines={1}
                >
                  {t.name}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter_700Bold",
                  color: c.foreground,
                }}
              >
                {t.shipped}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Critical inventory */}
      <Card>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Inter_700Bold",
              color: c.foreground,
            }}
          >
            Critical inventory
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Inter_600SemiBold",
              color: c.primary,
            }}
            onPress={() => router.push("/inventory")}
          >
            View all →
          </Text>
        </View>
        {lowStockItems.length === 0 ? (
          <Text
            style={{
              color: c.mutedForeground,
              fontSize: 13,
              fontFamily: "Inter_400Regular",
            }}
          >
            All stock levels are healthy.
          </Text>
        ) : (
          <View style={{ gap: 12 }}>
            {lowStockItems.slice(0, 5).map((it) => (
              <View
                key={it.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Inter_600SemiBold",
                      color: c.foreground,
                    }}
                    numberOfLines={1}
                  >
                    {it.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Inter_500Medium",
                      color: c.mutedForeground,
                    }}
                  >
                    {it.sku} • Qty {it.quantity}
                  </Text>
                </View>
                <StatusPill status={it.status} size="sm" />
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
}
