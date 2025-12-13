import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native";

export default function ProductDetailsScreen({ route }) {
    const { product } = route.params;

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
