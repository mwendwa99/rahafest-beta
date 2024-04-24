import React from "react";
import { Text } from "../../components";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button } from 'react-native-paper';

export default function Event({ route }) {
    const event = route?.params;
    return (
        <View style={styles.container}>
            <View style={styles.landing}>
                <Image style={styles.eventImg} source={{ uri: "https://api.rahafest.com/media_files/media_/nviiri.jpeg" }}/>
            </View>
            <ScrollView>
                <View style={styles.content}>
                    <Text variant="title" value={event.title} textStyle={{color: "black"}}/>
                    <View style={styles.wrapper}>
                        <Text variant="subtitle" value="Venue: " textStyle={{color: "black"}}/>
                        <Text variant="body" value={event.venue} textStyle={{color: "black"}}/>
                    </View>
                    <View style={styles.wrapper}>
                        <Text variant="subtitle" value="Location: " textStyle={{color: "black"}}/>
                        <Text variant="body" value={event.location} textStyle={{color: "black"}}/>
                    </View>
                    <View style={styles.wrapper}>
                        <Text variant="subtitle" value="Time: " textStyle={{color: "black"}}/>
                        <Text variant="body" value={event.time} textStyle={{color: "black"}}/>
                    </View>
                    <Text variant="subtitle" value="Description" textStyle={{color: "black"}}/>
                    <Text variant="body" value={event.desc} textStyle={{color: "black"}}/>
                </View>
                <View style={styles.wrapper}>
                    <Button icon="ticket" mode="contained" onPress={() => console.log('Pressed')}>
                        Book Event
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    eventImg: {
        height: "100%",
        width: "auto"
    },
    landing: {
        height: "30%",
        backgroundColor: "wheat",
        width: "100%"
    },
    content: {
        display: "flex",
        padding: 30
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    }
});