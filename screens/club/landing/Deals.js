import { StyleSheet, View, Text, FlatList } from "react-native";
import EventCard from "../../../components/EventDealCard";
import { DealData } from "./data";

export default function EventDeals() {
  return (
    <View style={styles.container}>
      {/* <Text>Current Event Deals For Your Broke Ass!</Text> */}
      <FlatList
        style={styles.eventCardContainer}
        data={DealData}
        renderItem={({ item }) => <EventCard deal={item} />}
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
