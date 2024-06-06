import { StyleSheet, View, Text, FlatList } from "react-native";
import NavCard from "../../../components/NavCard";

const navigationItems = [
  { id: "1", icon: "globe", title: "Global Chat", link: "Feed" },
  { id: "2", icon: "users", title: "Friends", link: "Friends" },
  { id: "3", icon: "tags", title: "Merchandise", link: "Merchandise" },
  { id: "4", icon: "camera-retro", title: "Media", link: "Media" },
  { id: "5", icon: "ticket", title: "Event Deals", link: "Deals" },
  { id: "6", icon: "newspaper-o", title: "News", link: "News" },
];


export default function Landing({navigation}) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Hi Brian</Text>
        <Text style={{ fontSize: 12, color: "gray" }}>Member since 2023</Text>
        <Text style={{ fontSize: 16, marginTop: 16 }}>
          Welcome to Raha Club, your exclusive RahaFest companion
        </Text>
      </View>

      <FlatList
        style={styles.cardList}
        data={navigationItems}
        renderItem={({ item }) => (
          <NavCard
            icon={item.icon}
            title={item.title}
            onPress={() => navigation.navigate(item.link)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  grid: {
    justifyContent: "center",
  },
  cardList: {
    marginTop: 48,
  },
});
