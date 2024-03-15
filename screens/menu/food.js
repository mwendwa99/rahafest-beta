import { StyleSheet } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default function food() {
    return (
        <View style={styles.container}>
            <Text>Food</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})