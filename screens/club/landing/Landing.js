import { StyleSheet, View, Text, FlatList, Alert } from "react-native";
import NavCard from "../../../components/NavCard";

const navigationItems = [
  { id: "1", icon: "globe", title: "Live Chat", link: "Feed" },
  { id: "2", icon: "users", title: "Friends", link: "Friends" },
  { id: "3", icon: "tags", title: "Merchandise", link: "Merchandise" },
  { id: "4", icon: "camera-retro", title: "Media", link: "Media" },
<<<<<<< HEAD
  { id: "5", icon: "ticket", title: "Event Deals", link: "EventDeals" },
  { id: "6", icon: "newspaper-o", title: "News", link: "News" },
];

const userName = "Brian Mwendwa";
=======
  // { id: "5", icon: "ticket", title: "Event Deals", link: "Checkout" },
  // { id: "6", icon: "newspaper-o", title: "News", link: "News" },
];

const userName = "Raha Fan";
>>>>>>> 744c17ce36b8f699374430de4b88f6e795ce72ea
const memberDate = "2024";
const rahaClubDescription =
  "Welcome to Raha Club, your exclusive RahaFest companion";

export default function Landing({ navigation }) {
<<<<<<< HEAD
  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Hi {userName}</Text>
        <Text style={{ fontSize: 12, color: "gray" }}>
          Member since {memberDate}
        </Text>
=======
  const handlePress = (link) => {
    if (link === "Friends" || link === "Media") {
      Alert.alert(
        "Coming Soon!",
        "You will be able to interact with friends stay tuned for updates!"
      );
    } else {
      navigation.navigate(link);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Hello there {userName}
        </Text>

>>>>>>> 744c17ce36b8f699374430de4b88f6e795ce72ea
        <Text style={{ fontSize: 16, marginTop: 16 }}>
          {rahaClubDescription}
        </Text>
      </View>

      <FlatList
        style={styles.cardList}
        data={navigationItems}
        renderItem={({ item }) => (
          <NavCard
            icon={item.icon}
            title={item.title}
            onPress={() => handlePress(item.link)}
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
    marginTop: 24,
  },
});
