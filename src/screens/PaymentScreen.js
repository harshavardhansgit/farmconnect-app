import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

export default function PaymentScreen({ route }) {
    const totalAmount = route?.params?.totalAmount ?? 0;
    const [selectedMethod, setSelectedMethod] = useState("COD");
    const [loading, setLoading] = useState(false);
    const cartitems = route?.params?.cartItems;
    const handlePay = () => {
        setLoading(true);
        setTimeout(() => {
            alert("Payment successful!");
            setLoading(false);
        }, 10000);
    };

    return (
        <View>
            <Text>this is PaymentScreen</Text>
            <Text>Total amount:{totalAmount}</Text>
            <TouchableOpacity>
                {cartitems?.map((item) => (
                    <View key={item.id}>
                        <Text>{item.title}</Text>
                        <Text>Qty: {item.qty}</Text>
                        <Text>Price: ₹{item.price}</Text>
                    </View>
                ))}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setSelectedMethod("COD")}
            >
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    Cash on Delivery
                </Text>

                {selectedMethod === "COD" && (
                    <Text>
                        Selected
                    </Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePay} disabled={loading}>
                <Text style={{ color: loading ? "#aaa" : "#7c0a0aff" }}>Pay ₹{totalAmount}</Text>
            </TouchableOpacity>
        </View>
    )
}