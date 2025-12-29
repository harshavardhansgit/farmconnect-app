import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // NEW: error message
    const [error, setError] = useState("");

    // NEW: loading state
    const [loading, setLoading] = useState(false);

    // TEMP — we will replace this with backend request
    const handleLogin = async () => {
        setError(""); // clear previous error

        // Basic validation
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }
        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        setLoading(true);

        try {
            // 1. CALL BACKEND API
            const response = await fetch("http://192.168.1.58:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            // 2. CONVERT RESPONSE TO JSON
            const data = await response.json();

            // 3. IF BACKEND RETURNS ERROR
            if (!response.ok) {
                setError(data.error || "Login failed.");
                setLoading(false);
                return;
            }

            // 4. SAVE TOKEN TO ASYNC STORAGE
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));

            setLoading(false);

            // 5. GO TO HOME SCREEN
            navigation.replace("MainTabs");


        } catch (err) {
            setLoading(false);
            setError("Something went wrong. Check your internet or backend.");
            console.log(err);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            <Text style={{ fontSize: 28, marginBottom: 20 }}>Login</Text>

            {error ? (
                <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}

            <Text>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                autoCapitalize="none"
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    marginBottom: 15,
                    borderRadius: 6,
                }}
            />

            <Text>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 6,
                }}
            />

            <Button
                title={loading ? "Loading..." : "Login"}
                onPress={handleLogin}
                disabled={loading}
            />

            <View style={{ marginTop: 20 }}>
                <Button
                    title="Create an Account"
                    onPress={() => navigation.navigate("Signup")}
                />
            </View>
        </View>
    );
}
