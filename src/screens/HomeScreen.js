import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);


  const categories = [
    { id: "1", name: "Vegetables" },
    { id: "2", name: "Fruits" },
    { id: "3", name: "Dairy" },
    { id: "4", name: "Grains & Pulses" },
    { id: "5", name: "Natural Products" },
    { id: "6", name: "Organic Specials" },
  ];

  const banners = [
    {
      id: "1",
      title: "Fresh from Local Farms",
      color: "#C8E6C9",
    },
    {
      id: "2",
      title: "100% Organic Produce",
      color: "#DCEDC8",
    },
    {
      id: "3",
      title: "Support Local Farmers",
      color: "#F0F4C3",
    },
  ];

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.1.55:5000/products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (item) => item.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>

      {/* TOP BAR */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 40,
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        {/* App Title */}
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2E7D32" }}>
          FarmConnect
        </Text>

        {/* Icons */}
        <View style={{ flexDirection: "row", gap: 20 }}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="cart" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting */}
      {user && (
        <Text style={{ fontSize: 18, margin: 20 }}>
          Hello, {user.email} 👋
        </Text>
      )}

      {/* CATEGORY CHIPS */}
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 20 }}>
          Shop by Category
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, paddingLeft: 20 }}
        >
          {categories.map((item) => {
            const isSelected = selectedCategory === item.name;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedCategory(item.name)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: isSelected ? "#2E7D32" : "#E8F5E9",
                  borderRadius: 20,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: isSelected ? "#fff" : "#2E7D32",
                    fontWeight: "500",
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* CAROUSEL */}
      <View style={{ marginTop: 20 }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {banners.map((item) => (
            <View
              key={item.id}
              style={{
                width: 350,
                height: 150,
                backgroundColor: item.color,
                borderRadius: 12,
                marginRight: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#2E7D32",
                  textAlign: "center",
                }}
              >
                {item.title}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* PRODUCTS GRID */}
      <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Fresh Products
        </Text>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductDetails", { product: item })
              }
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 10,
                marginBottom: 15,
                width: "48%",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
              }}
            >
              {/* PRODUCT IMAGE */}
              <Image
                source={{ uri: item.image_url }}
                style={{
                  height: 100,
                  width: "100%",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                resizeMode="cover"
              />

              {/* PRODUCT INFO */}
              <Text style={{ fontWeight: "600" }}>{item.title}</Text>

              <Text style={{ fontSize: 12, color: "#777" }}>
                {item.category}
              </Text>

              <Text style={{ color: "#2E7D32", marginTop: 4 }}>
                ₹{item.price} / {item.unit}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>



    </View>
  );
}
