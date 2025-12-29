import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OrderDetailsScreen({ route }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `http://192.168.1.58:5000/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setOrder(data.order);
      setItems(data.items);
    };

    fetchOrderDetails();
  }, []);

  if (!order) return null;

  return (
    <View style={{ flex: 1, top: 30, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Order Details
      </Text>

      <Text style={{ marginVertical: 10 }}>
        Total: ₹{order.total_amount}
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginBottom: 10,
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 16 }}>
              {item.products.title}
            </Text>

            <Text style={{ marginTop: 4 }}>
              Quantity: {item.quantity}
            </Text>

            <Text style={{ marginTop: 2, color: "#2E7D32" }}>
              ₹{item.price} / {item.products.unit}
            </Text>

          </View>
        )}
      />

    </View>
  );
}
