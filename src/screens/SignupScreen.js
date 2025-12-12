import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function SignupScreen({ navigation }) {
    // STATE for inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // STATE for errors
    const [error, setError] = useState("");

    // STATE for loading
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setError("");

        // Validation
        if (!name.trim()) {
            setError("Name is required");
            return;
        }
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        if (!password.trim()) {
            setError("Password is required");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://192.168.1.55:5000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: "consumer"     // we will later add UI to change this
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Signup failed.");
                setLoading(false);
                return;
            }

            // Success
            alert("Signup Successful! Please login.");
            setLoading(false);

            // Go back to login page
            navigation.goBack();

        } catch (err) {
            setLoading(false);
            setError("Something went wrong. Check backend or network.");
            console.log(err);
        }
    };


    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>

            <Text style={{ fontSize: 28, marginBottom: 20 }}>Create Account</Text>

            {error ? (
                <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}

            <Text>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 6,
                }}
            />

            <Text>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                autoCapitalize="none"
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 6,
                }}
            />

            <Text>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 6,
                }}
            />

            <Text>Confirm Password</Text>
            <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
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
                title={loading ? "Creating Account..." : "Sign Up"}
                onPress={handleSignup}
                disabled={loading}
            />

            <View style={{ marginTop: 20 }}>
                <Button title="Back to Login" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
}
