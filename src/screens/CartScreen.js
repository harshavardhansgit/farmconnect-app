import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function CartScreen() {
    const navigation=useNavigation();
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
        <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>

            {/* CART ITEMS */}
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 140, // space for sticky bar
                }}
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

                            <Text style={{ marginTop: 4, color: "#2E7D32", marginVertical: 4 }}>
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

            {/* STICKY CHECKOUT BAR */}
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    padding: 16,
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <Text style={{ color: "#777" }}>Total Amount</Text>
                    <Text style={{ fontSize: 18, fontWeight: "700" }}>
                        ₹{totalAmount}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={()=>navigation.navigate("Payment",{
                        totalAmount,cartItems
                    })}
                    style={{
                        backgroundColor: "#08890fff",
                        paddingVertical: 14,
                        borderRadius: 10,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: "600",
                        }}
                    >
                        Proceed to Payment
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
