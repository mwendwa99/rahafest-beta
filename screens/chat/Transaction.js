import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "../../components";

export default function Transaction({ route }){
    const transaction = route?.params;
    console.log(transaction)
    return (
    <View style={styles.container}>
        <View style={styles.landing}>
            <Text variant="subtitle" value="Recipient: " textStyle={{color: "black"}}/>
            <Text variant="body" value={transaction.recipient} textStyle={{color: "black"}}/>
            <Text variant="subtitle" value="Amount: " textStyle={{color: "black"}}/>
            <Text variant="body" value={transaction.amount} textStyle={{color: "black"}}/>
        </View>
        <FlatList />
    </View>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    landing: {
        height: 200,
        width: "100%",
        backgroundColor: "wheat",
        justifyContent: "center",
        padding: 30
    },
});