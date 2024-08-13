import { StyleSheet, FlatList } from "react-native";
import { EventCard } from "../../components";
import { DealData } from "../../data";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Events() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DealData}
        renderItem={({ item }) => <EventCard deal={item} />}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
  },
  contentContainer: {
    padding: 0,
    margin: 0,
    flexGrow: 1, // Ensure FlatList takes up available space
  },
});
