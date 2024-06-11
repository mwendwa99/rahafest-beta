import { StyleSheet, View, Text, FlatList } from "react-native";
import { Article } from "../../../components";
import { AriticleData } from "./data";

export default function News() {
  return (
    <View style={styles.container}>
      {/* <Text>Current Event Deals For Your Broke Ass!</Text> */}
      <FlatList
        style={styles.eventCardContainer}
        data={AriticleData}
        renderItem={({ item }) => <Article news={item} />}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  eventCardContainer: {
    flexDirection: "column",
  }
});
