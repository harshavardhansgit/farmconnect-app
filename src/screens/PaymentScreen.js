import { TouchableOpacity,View,Text } from "react-native";

export default function PaymentScreen({route}){
    const totalAmount=route?.params?.totalAmount ?? 0;
    return(
        <View>
            <Text>this is PaymentScreen</Text>
            <Text>Total amount:{totalAmount}</Text>
            <TouchableOpacity>
                <Text>pay{totalAmount}</Text>
            </TouchableOpacity>
        </View>
    )
}