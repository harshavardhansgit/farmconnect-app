import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function CartScreen() {
    const [cartItems, setCartItems] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const loadCart = async () => {
                const storedCart = await AsyncStorage.getItem("cart");
                if (storedCart) {
                    setCartItems(JSON.parse(storedCart));
                } else {
                    setCartItems([]);
                }
            };

            loadCart();
        }, [])
    );

    // Calculate total price (derived state)
    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const updateQuantity = async (productId, change) => {
        const updatedCart = cartItems
            .map((item) => {
                if (item.id === productId) {
                    return { ...item, qty: item.qty + change };
                }
                return item;
            })
            .filter((item) => item.qty > 0); // remove if qty becomes 0

        setCartItems(updatedCart);
        await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const placeOrder = async () => {
        try {
            // 1. Get auth token
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                alert("Please login again");
                return;
            }

            // 2. Prepare order payload
            const orderPayload = {
                items: cartItems,
                total: totalAmount,
            };

            // 3. Call backend
            const response = await fetch("http://192.168.1.58:5000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Order failed");
                return;
            }

            // 4. Clear cart
            await AsyncStorage.removeItem("cart");
            setCartItems([]);

            alert("Order placed successfully 🎉");
        } catch (error) {
            console.log("Order error:", error);
            alert("Something went wrong");
        }
    };
    if (cartItems.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#F4F6F8",
                    padding: 20,
                }}
            >
                <Text style={{ fontSize: 48 }}>🛒</Text>

                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginTop: 16,
                    }}
                >
                    Your cart is empty
                </Text>

                <Text
                    style={{
                        color: "#777",
                        marginTop: 6,
                        textAlign: "center",
                    }}
                >
                    Add fresh farm products to place an order
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20, top: 30, marginBottom: 25, backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
                Your Cart
            </Text>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: "row",
                            marginBottom: 15,
                            padding: 10,
                            backgroundColor: "#f9f9f9",
                            borderRadius: 10,
                            shadowColor: "#131313d5",
                            shadowOpacity: 0.06,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <Image
                            source={{ uri: item.image_url }}
                            style={{ width: 70, height: 70, borderRadius: 8 }}
                        />

                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={{ fontSize: 15, fontWeight: "600" }}>
                                {item.title}
                            </Text>

                            <Text style={{ marginTop: 4,color: "#2E7D32", marginVertical: 4 }}>
                                ₹{item.price} / {item.unit}
                            </Text>

                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, -1)}
                                    style={{
                                        backgroundColor: "#eee",
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 6,
                                    }}
                                >
                                    <Text style={{ fontSize: 18 }}>−</Text>
                                </TouchableOpacity>

                                <Text style={{ marginHorizontal: 12, fontWeight: "600" }}>
                                    {item.qty}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, 1)}
                                    style={{
                                        backgroundColor: "#2E7D32",
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 6,
                                    }}
                                >
                                    <Text style={{ fontSize: 18, color: "#fff" }}>+</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                )}
            />

            {/* TOTAL */}
            <View
                style={{
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    paddingTop: 15,
                    marginTop: 10,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    Total: ₹{totalAmount}
                </Text>
            </View>
            <TouchableOpacity
                onPress={placeOrder}
                style={{
                    backgroundColor: "#08890fff",
                    paddingVertical: 14,
                    borderRadius: 10,
                    marginTop: 20,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                    Place Order
                </Text>
            </TouchableOpacity>
        </View>
    );
}
