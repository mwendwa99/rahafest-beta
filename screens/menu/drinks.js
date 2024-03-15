import { StyleSheet } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default drinks = () => {
    return (
        <View style={styles.container}>
            <Text>Drinks</Text>
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