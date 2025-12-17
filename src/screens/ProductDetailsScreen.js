import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductDetailsScreen({ route }) {
    const { product } = route.params;
    const handleAddToCart = async () => {
        try {
            // 1. Get existing cart
            const storedCart = await AsyncStorage.getItem("cart");
            let cart = storedCart ? JSON.parse(storedCart) : [];

            // 2. Check if product already exists
            const existingIndex = cart.findIndex(
                (item) => item.id === product.id
            );

            if (existingIndex !== -1) {
                // Product exists → increase quantity
                cart[existingIndex].qty += 1;
            } else {
                // New product → add with qty = 1
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    unit: product.unit,
                    image_url: product.image_url,
                    qty: 1,
                });
            }

            // 3. Save updated cart
            await AsyncStorage.setItem("cart", JSON.stringify(cart));

            alert("Added to cart 🛒");
        } catch (error) {
            console.log("Add to cart error:", error);
            alert("Failed to add to cart");
        }
    };


    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>

            {/* Product Image */}
            <Image
                source={{ uri: product.image_url }}
                style={{
                    width: "100%",
                    top: 25,
                    height: 300,
                    borderRadius: 12,
                    marginBottom: 30,
                }}
                resizeMode="cover"
            />

            {/* Product Title */}
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {product.title}
            </Text>

            {/* Category */}
            <Text style={{ color: "#777", marginVertical: 6 }}>
                {product.category}
            </Text>

            {/* Price */}
            <Text style={{ fontSize: 20, color: "#2E7D32", marginVertical: 10 }}>
                ₹{product.price} / {product.unit}
            </Text>

            {/* Description */}
            <Text style={{ fontSize: 16, color: "#444" }}>
                {product.description}
            </Text>

            <TouchableOpacity
                onPress={handleAddToCart}
                style={{
                    backgroundColor: "#2E7D32",
                    paddingVertical: 14,
                    borderRadius: 10,
                    marginTop: 30,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                    Add to Cart
                </Text>
            </TouchableOpacity>
        </View>

    );
}
