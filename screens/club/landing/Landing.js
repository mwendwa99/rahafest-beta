import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../../store/auth/authActions";
import api from "../../../services/club.api.service";
import { useNotification } from "../../../Notifications";
import { ActivityIndicator } from "react-native-paper";
import { AdCarousel, NavCard, Text } from "../../../components";
import * as Device from "expo-device";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const numColumns = screenWidth >= 700 ? 4 : 2;

const navigationItems = [
  { id: "1", icon: "globe", title: "Live Chat", link: "Live" },
  { id: "2", icon: "mail", title: "Messages", link: "Friends" },
  { id: "3", icon: "star", title: "Exclusive Offers", link: "Deals" },
  { id: "4", icon: "person", title: "Account", link: "Account" },
  { id: "5", icon: "home", title: "House of Raha", link: "HouseOfRaha" },
];

const rahaClubDescription =
  "Welcome to Raha Club, your exclusive lifestyle companion.";

export default function Landing({ navigation }) {
  const { expoPushToken } = useNotification();
  const { user, token, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);

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

  useEffect(() => {
    if (user?.id && expoPushToken && !isDeviceRegistered) {
      console.info("Attempting device registration...");

      api
        .post("device", {
          expo_token: expoPushToken,
          device_name: Device.deviceName,
          user_id: user.id,
          device_type: Device.osName.toLowerCase(),
        })
        .then((response) => {
          console.info("Device registered:", JSON.stringify(response.data));
          setIsDeviceRegistered(true);
        })
        .catch((error) => {
          console.error("Failed to register device:", error);
          if (error.response?.status === 409) {
            // Conflict - device already registered
            setIsDeviceRegistered(true);
          }
        });
    }
  }, [user?.id, expoPushToken, isDeviceRegistered]);

  const handlePress = (link) => {
    if (link == null) {
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

  // Header component to display greeting and description
  const ListHeader = () => (
    <View style={styles.header}>
      <Text
        value={`Hello, ${user?.first_name || ""}`}
        variant="subtitle"
        color="#000"
      />
      <Text value={rahaClubDescription} variant="body" color="#000" />
    </View>
  );

  // Footer component for the ads section
  const ListFooter = () => (
    <View style={styles.ads}>
      <AdCarousel data={[]} variant="XL" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        key={numColumns}
        data={navigationItems}
        renderItem={({ item }) => (
          <NavCard
            icon={item.icon}
            title={item.title}
            onPress={() => handlePress(item.link)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
      />

      <StatusBar barStyle="light-content" />
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
  listContent: {
    padding: 10,
    // Ensure the content takes up enough space for proper scrolling
    minHeight: screenHeight,
  },
  header: {
    marginBottom: 20,
  },
  ads: {
    height: 200,
    marginVertical: 20,
    width: screenWidth - 20,
    alignSelf: "center",
  },
});
