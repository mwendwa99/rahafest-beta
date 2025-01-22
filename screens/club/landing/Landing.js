import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../../redux/auth/authActions";
import { fetchAds } from "../../../redux/events/eventActions";
import { authInstance } from "../../../services/api.service";
import { useNotification } from "../../../Notifications";

import { ActivityIndicator } from "react-native-paper";
import { AdCarousel, NavCard, Text } from "../../../components";

import * as Device from "expo-device";

const navigationItems = [
  { id: "1", icon: "globe", title: "Live Chat", link: "Live" },
  { id: "2", icon: "inbox", title: "Messages", link: "Friends" },
  { id: "3", icon: "star", title: "Exclusive Offers", link: "Deals" },
  { id: "4", icon: "user", title: "Account", link: "Account" },
];

const rahaClubDescription =
  "Welcome to Raha Club, your exclusive lifestyle companion.";

export default function Landing({ navigation }) {
  // Move ALL hooks to the top, before any conditional logic
  const { expoPushToken } = useNotification();
  const { user, token, loading } = useSelector((state) => state.auth);
  const { ads } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);

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

  useEffect(() => {
    if (user?.id && expoPushToken && !isDeviceRegistered) {
      console.info("Attempting device registration...");

      authInstance
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
          // Only set registered to true if it's not a server error
          // This allows retrying on actual failures
          if (error.response?.status === 409) {
            // Conflict - device already registered
            setIsDeviceRegistered(true);
          }
        });
    }
  }, [user?.id, expoPushToken, isDeviceRegistered]);

  const handlePress = (link) => {
    if (link === null || link === undefined) {
      Alert.alert("Coming Soon!", "Stay tuned for updates!");
    } else {
      navigation.navigate(link);
    }
  };

  // Move the conditional render AFTER all hooks
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

      <View style={styles.ads}>
        <AdCarousel data={ads} variant="XL" />
      </View>

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
