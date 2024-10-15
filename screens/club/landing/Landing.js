import { StyleSheet, View, FlatList, Alert, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { AdCarousel, NavCard, Text } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "../../../redux/auth/authActions";
import { StatusBar } from "expo-status-bar";
import { fetchAds } from "../../../redux/events/eventActions";

const navigationItems = [
  { id: "1", icon: "globe", title: "Live Chat", link: "Live" },
  { id: "2", icon: "inbox", title: "Messages", link: "Friends" },
  { id: "5", icon: "user", title: "Account", link: "Account" },
];

const rahaClubDescription =
  "Welcome to Raha Club, your exclusive RahaFest companion";

// const ads = [
//   {
//     image: require("../../../assets/sns.gif"),
//     title: "Found in Translation: The Treasure of the Italian Language",
//     description:
//       "The Embassy of Italy and the Italian Cultural Institute of Nairobi are pleased to invite you to a special event organized to celebrate this important occasion.",
//     is_active: false,
//     url: "https://forms.gle/ypPWEa5sgXMmSnGi6",
//   },
// ];

export default function Landing({ navigation }) {
  const { user, token, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { ads } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchAds());
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
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

      {/* Place Ads View directly after the FlatList */}
      <View style={styles.ads}>
        <AdCarousel data={ads} />
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 20,
  },
  ads: {
    height: 200,
    marginVertical: 20,
    width: Dimensions.get("window").width,
  },
});
