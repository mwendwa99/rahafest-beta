import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList, Image, ImageBackground, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/auth/authActions";
import { Card, Text } from "../../components";
import { getEvents } from "../../redux/events/eventsActions";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native-paper";

const bg = require("../../assets/images/dashboard.jpg");

export default function Dashboard({navigation}) {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { events, loading } = useSelector((state) => state.events);
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
        dispatch(getUser(token));
    }, [dispatch, token]);

    useEffect(() => {
        dispatch(getEvents(token));
    }, [dispatch, token]);
    
    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getEvents(token));
        setRefreshing(false);
    };
    handleCardPress = (item) => navigation.navigate("Event", item);
    console.log(events)
    return(
        <ImageBackground
            source={bg}
            style={{ flex: 1, position: "relative", marginTop: 0, height: "25%" }}
        >
            <StatusBar style="light" />
            <View style={styles.container}>
                <View style={{ marginTop: 250}}>
                    <Text variant="title" value="Upcoming events" textStyle={{color: "brown"}}/>
                </View>
                {loading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="deeppink"/>
                    </View>
                ) : (
                    // <FlatList
                    //     contentContainerStyle={{ justifyContent: "center", alignItems: "center"}}
                    //     data={events}
                    //     showsVerticalScrollIndicator={false}
                    //     keyExtractor={(item) => item.id.toString()}
                    //     style={styles.flatlist}
                    //     refreshControl={
                    //         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    //     }
                    //     ListEmptyComponent={<Text variant="body" value="no events available" textStyle={{color: "black"}}/>}
                    //     renderItem={({item}) => (
                    //         <TouchableOpacity onPress={() => handleCardPress(item)}>
                    //             <Card 
                    //                 title={item.title}
                    //                 description={item.desc} 
                    //                 image={item.image}
                    //                 active={true}
                    //             />
                    //         </TouchableOpacity>
                    //     )}
                    // />
                    <Text variant="title" value="Upcoming events" textStyle={{color: "brown"}}/>

                )}
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    flatlist: {
        width: "90%",
        paddingBottom: 50
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});
