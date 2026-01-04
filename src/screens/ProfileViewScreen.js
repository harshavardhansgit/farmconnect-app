import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderHistoryScreen from "./OrderHistoryScreen";

export default function ProfileViewScreen({ navigation }) {

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        navigation.replace("Login");
    };

    return (
        <View style={{ flex: 1, padding: 20, top: 20, backgroundColor: "#fff" }}>

            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
                Profile
            </Text>

            {/* My Orders */}
            <TouchableOpacity
                onPress={() => navigation.navigate("OrderHistory")}
                style={{
                    padding: 15,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 10,
                    marginBottom: 15,
                }}
            >
                <Text style={{ fontSize: 16 }}>My Orders</Text>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
                onPress={handleLogout}
                style={{
                    padding: 15,
                    backgroundColor: "#ffdddd",
                    borderRadius: 10,
                }}
            >
                <Text style={{ fontSize: 16, color: "red" }}>Logout</Text>
            </TouchableOpacity>

        </View>
    );
}
