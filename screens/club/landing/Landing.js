import { StyleSheet, View, FlatList, Alert } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { NavCard, Text } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "../../../redux/auth/authActions";

const navigationItems = [
  { id: "1", icon: "globe", title: "Live Chat", link: "Live" },
  { id: "2", icon: "inbox", title: "Messages", link: "Friends" },
  { id: "3", icon: "tags", title: "Merchandise", link: "Merchandise" },
  { id: "4", icon: "camera-retro", title: "Media", link: "Media" },
  { id: "5", icon: "user", title: "Account", link: "Account" },
  // { id: "6", icon: "newspaper-o", title: "News", link: "News" },
];

const rahaClubDescription =
  "Welcome to Raha Club, your exclusive RahaFest companion";

export default function Landing({ navigation }) {
  const { user, token, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // console.log(user);

  useEffect(() => {
    if (!token) {
      navigation.navigate("Login");
    }
  }, [token]);

  useEffect(() => {
    if (!user && token) {
      dispatch(fetchUser());
    }
  }, [token]);

  const handlePress = (link) => {
    if (link === null || link === undefined) {
      Alert.alert("Coming Soon!", "Stay tuned for updates!");
    } else {
      navigation.navigate(link);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  // console.log(user);

  return (
    <View style={styles.container}>
      <View>
        <Text
          value={`Hello, ${user?.first_name || ""}`}
          variant="subtitle"
          color="#000"
        />

        <Text value={rahaClubDescription} variant="body" color="#000" />
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    justifyContent: "center",
  },
  cardList: {
    marginTop: 24,
  },
});
