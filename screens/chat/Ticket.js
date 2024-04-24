import { StyleSheet, View, Text } from "react-native";

export default function Ticket({ route }) {
    const ticket = route?.params;
    console.log(ticket)
    return (
        <View style={styles.container}>
            <Text>{ticket.event_name}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})