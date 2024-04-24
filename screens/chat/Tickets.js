import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTickets } from "../../redux/tickets/ticketsAction";
import { ActivityIndicator } from "react-native-paper";

export default function Tickets({navigation}){
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { tickets, loading } = useSelector((state) => state.tickets);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(getTickets(token));
    }, [dispatch, token]);

    handleCardPress = (item) => navigation.navigate("Ticket", item);
    
    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getTickets(token));
        setRefreshing(false);
    };
    console.log("TIKO::\t",tickets)
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text value={"Next event"} variant={"body"}/>
                <Text value={"Fom yetu"} variant={"title"}/>
            </View>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="deeppink"/>
                </View>
            ): (
                <FlatList
                    data={tickets}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.ticket_id.toString()}
                    style={styles.flatlist}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => handleCardPress(item)}>
                            <Card
                                title={item.event_name}
                                description={item.ticket_type}
                                active={true}
                            />
                        </TouchableOpacity>
                    )}
                />
                // <Text variant="title" value="no tickets" textStyle={{color: "brown"}}/>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        height: 180,
        width: "100%",
        backgroundColor: "#625f63",
        justifyContent: "center",
        alignItems: "center"
    },
    loading: {
        flex: 1,
        // marginTop: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    flatlist: {
        width: "90%",
        marginTop: 20
    }
});