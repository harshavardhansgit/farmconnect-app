import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OrderHistoryScreen({ navigation }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch("http://192.168.1.58:5000/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setOrders(data);
        };

        fetchOrders();
    }, []);

    return (
        <View style={{ flex: 1, top: 20, padding: 20, backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                My Orders
            </Text>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("OrderDetails", { orderId: item.id })
                        }
                        style={{
                            padding: 15,
                            marginBottom: 12,
                            backgroundColor: "#f5f5f5",
                            borderRadius: 10,
                        }}
                    >
                        <Text style={{ fontWeight: "600" }}>
                            Order ID: {item.id}
                        </Text>

                        <Text style={{ marginTop: 6 }}>
                            Total: ₹{item.total_amount}
                        </Text>

                        <Text style={{ marginTop: 4, color: "#777" }}>
                            Placed on: {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
