import { FlatList, StyleSheet, View, TouchableOpacity, RefreshControl } from "react-native";
import { Avatar, Text } from "../../components";
import { ActivityIndicator, Button } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTransactions } from "../../redux/transactions/transactionsAction";
import { getWallet } from "../../redux/wallet/walletActions";
import { StatusBar } from "expo-status-bar";
import { getPoints } from "../../redux/points/pointsActions";

export default function Wallet({navigation}){
    const dispatch = useDispatch();
    const { transactions, loading } = useSelector((state) => state.transactions);
    const { wallet } = useSelector((state) => state.wallet);
    const { token } = useSelector((state) => state.auth);
    const [refreshing, setRefreshing] = useState(false);
    const { points } = useSelector((state) => state.points);

    const onRefresh = () => {
      setRefreshing(true);
      dispatch(getTransactions(token));
      setRefreshing(false);
    };
    useEffect(() => {
        dispatch(getTransactions(token));
    }, [dispatch, token]);

    useEffect(() => {
        dispatch(getWallet(token));
    }, [dispatch, token]);

    useEffect(() => {
        dispatch(getPoints(token));
    }, [dispatch, token]);
    console.log(wallet)

    gotoTransaction = (item) => navigation.navigate("Transaction", item);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <View style={styles.wallet}>
                    <Text value={"Wallet Total"} variant={"body"}/>
                    {wallet ? (<Text value={wallet.wallet} variant={"title"}/>) :(
                        <ActivityIndicator size="small" color="#fff"/>
                    )}
                </View>
                <View style={styles.points}>
                    <Text variant="body" value="Club Points: " textStyle={{color: "#fff"}}/>
                    { points ? (<Text variant="title" value={points.points} textStyle={{color: "#fff"}}/>) : (
                        <ActivityIndicator size="small" color="#fff"/>
                    )}
                </View>
            </View>

            <View style={styles.transaction}>
                { loading ? (
                    <ActivityIndicator size="large" color="deeppink"/>
                ) :(
                <FlatList
                    ListHeaderComponent={
                        <View style={styles.services}>
                            <Text value={"Services"} variant={"subtitle"} textStyle={{color: "purple"}}/>
                            <View style={styles.serviceWrapper}>
                                <Button 
                                    icon="wallet-plus"
                                    mode="contained"
                                    onPress={() => console.log('Pressed')}
                                    style={{ borderRadius: 50 }}
                                >
                                    Top Up
                                </Button>
                                <Button 
                                    icon="wallet"
                                    mode="contained"
                                    onPress={() => console.log('Pressed')}
                                    style={{ borderRadius: 50 }}
                                >
                                    Pay
                                </Button>
                            </View>
                            <Text value={"Recent transactions"} variant={"subtitle"} textStyle={{color: "purple"}}/>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.flatlist}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => gotoTransaction(item)}>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                backgroundColor:"white",
                                padding: 10,
                                borderRadius: 10,
                                marginVertical: 10,
                                gap: 8,
                                alignItems: "center",
                                // justifyContent: "center"
                            }}>
                                <Avatar 
                                    size={40}
                                    bgColor={"gray"}
                                />
                                <View style={{
                                    display: "flex",
                                    flex: 1,
                                    flexDirection: "row",
                                    // alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <View>
                                        <Text value={item.recipient} variant={"body"} textStyle={{color: "black"}}/>
                                        <Text value={item.timeStamp} variant={"small"} textStyle={{color: "grey"}}/>
                                    </View>
                                    <View>
                                        <Text value={item.amount} variant={"important"} textStyle={{color: "black"}}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e7d8f0"
    },
    header: {
        flexDirection: "row",
        height: 180,
        backgroundColor: "#625f63",
        justifyContent: "space-evenly",
        alignItems: "center",  
    },
    wallet: {
        justifyContent: "center",
        alignItems: "center"
    },
    points: {
        // flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    services: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        // flex: 1
    },
    serviceWrapper:{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        paddingVertical: 10
    },
    transaction: {
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
        flex: 1
    },
    flatlist: {
        width: "85%",
        paddingBottom: 50,
    }
});