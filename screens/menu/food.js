import { View, StyleSheet, Text } from "react-native";

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