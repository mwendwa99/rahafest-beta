import { StyleSheet, View, Text } from "react-native";

export default function () {
    return(
        <View style={styles.container}>
            <Text>Faq</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})