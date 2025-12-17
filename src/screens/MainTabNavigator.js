import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import CartScreen from "../screens/CartScreen";
import OrderHistoryScreen from "./OrderHistoryScreen";

// Temporary placeholder screens
function CategoriesScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Categories Screen</Text>
        </View>
    );
}

function SearchScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Search Screen</Text>
        </View>
    );
}

function ProfileScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Profile Screen</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarStyle: {
                    height: 60,
                    backgroundColor: "#eaf4eaff",
                    borderTopWidth: 1,
                    borderTopColor: "#cee6ceff",
                },

                tabBarActiveTintColor: "#2E7D32",   // green highlight
                tabBarInactiveTintColor: "#888",   // grey for inactive

                tabBarIcon: ({ color, size }) => {
                    let iconName = "home";

                    if (route.name === "Home") iconName = "home";
                    else if (route.name === "Categories") iconName = "grid";
                    else if (route.name === "Search") iconName = "search";
                    else if (route.name === "Profile") iconName = "person";
                    else if (route.name === "Cart") iconName = "cart";

                    return <Ionicons name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Categories" component={CategoriesScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Profile" component={OrderHistoryScreen} />
        </Tab.Navigator>
    );
}
