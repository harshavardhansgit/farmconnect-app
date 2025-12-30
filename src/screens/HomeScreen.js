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
        const response = await fetch("http://192.168.1.58:5000/products");
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

  if (loadingProducts) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Ionicons name="leaf" size={40} color="#2E7D32" />
        <Text style={{ marginTop: 10, color: "#777" }}>
          Loading fresh products...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ top: 20, paddingHorizontal: 12, paddingBottom: 30, backgroundColor: "#F4F6F8" }}
      ListHeaderComponent={
        <>
          {/* Greeting */}
          {user && (
            <Text
              style={{
                fontSize: 18,
                marginHorizontal: 16,
                marginTop: 20,
                marginBottom: 8,
                fontWeight: "500",
              }}
            >
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
                    onPress={() =>
                      setSelectedCategory(
                        selectedCategory === item.name ? "" : item.name
                      )
                    }
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


            {/* BANNERS */}
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
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginVertical: 10,
              marginLeft: 10,
            }}
          >
            Fresh Products
          </Text>
        </>
      }

      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetails", { product: item })
          }
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 12,
            marginBottom: 15,
            width: "48%",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Image
            source={{ uri: item.image_url }}
            style={{
              height: 100,
              width: "100%",
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
            }}
          />

          <Text style={{ fontWeight: "600", fontSize: 15, marginTop: 8 }}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{item.category}</Text>
          <Text style={{ color: "#2E7D32", fontWeight: "700", fontSize: 15, marginTop: 6 }}>
            ₹{item.price} / {item.unit}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
