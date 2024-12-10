import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, TouchableOpacity, Linking } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/auth/authActions";
import { clearError } from "../../redux/auth/authSlice";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Text } from "../../components";

import Live from "./chat/Live";
import Friends from "./friends";
import AllUsers from "./friends/wsFriends/AllUsers";
import FriendRequests from "./friends/wsFriends/FriendRequests";
import DirectMessages from "./friends/wsFriends/DirectMessages";
import Account from "../account";
import Deals from "./deals";
import Landing from "./landing/Landing";
import Merchandise from "./landing/Merchandise";
import CheckoutNavigator from "../events/checkout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { persistor } from "../../redux/store";
import { warning } from "../../utils/toast";
import NotificationsContainer from "../../Notifications";

const Stack = createNativeStackNavigator();

export default function ClubNavigator() {
  const navigation = useNavigation();
  const { token, error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, []);

  useEffect(() => {
    if (error && error.message === "Permission denied") {
      warning("please login again!", 2000);
      persistor.purge();
    }
  }, [error]);

  useEffect(() => {
    if (!token) {
      navigation.navigate("Login");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token]);

  return (
    <NotificationsContainer>
      <Stack.Navigator initialRouteName="Club">
        {token ? (
          <>
            <Stack.Screen
              name="Club"
              component={Landing}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    value={"Raha Club"}
                    {...props}
                    variant={"subtitle"}
                    style={{ color: "#fff" }}
                  />
                ),
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="Live"
              component={Live}
              options={({ navigation }) => ({
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitleAlign: "center",
                headerTitle: (props) => (
                  <View style={styles.row}>
                    <Text
                      value={"Live Chat"}
                      variant={"subtitle"}
                      style={styles.headerTitleText}
                    />
                  </View>
                ),
                headerRight: () => (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() =>
                      Linking.openURL("https://support.rahafest.com")
                    }
                  >
                    <MaterialCommunityIcons
                      name="alert-outline"
                      size={20}
                      color="yellow"
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      // value={`${allUsers.length} members`}
                      value="report"
                      variant={"body"}
                      style={{ color: "yellow" }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Friends"
              component={Friends}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    value={"Friends"}
                    {...props}
                    style={{ color: "#fff" }}
                    variant={"subtitle"}
                  />
                ),
                headerRight: () => (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() =>
                      Linking.openURL("https://support.rahafest.com")
                    }
                  >
                    <MaterialCommunityIcons
                      name="alert-outline"
                      size={20}
                      color="yellow"
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      value="report"
                      variant={"body"}
                      style={{ color: "yellow" }}
                    />
                  </TouchableOpacity>
                ),
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="DirectMessages"
              component={DirectMessages}
              options={({ route }) => ({
                headerShown: true,

                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    value={route.params?.friendSlug || "Direct Messages"}
                    {...props}
                    style={{ color: "#fff" }}
                    variant={"subtitle"}
                  />
                ),
                headerRight: () => (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() =>
                      Linking.openURL("https://support.rahafest.com")
                    }
                  >
                    <MaterialCommunityIcons
                      name="alert-outline"
                      size={20}
                      color="yellow"
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      value="report"
                      variant={"body"}
                      style={{ color: "yellow" }}
                    />
                  </TouchableOpacity>
                ),
                headerTitleAlign: "center",
              })}
            />
            <Stack.Screen
              name="Pending"
              component={FriendRequests}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    value={"Pending Requests"}
                    {...props}
                    style={{ color: "#fff" }}
                    variant={"subtitle"}
                  />
                ),
                headerRight: () => (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() =>
                      Linking.openURL("https://support.rahafest.com")
                    }
                  >
                    <MaterialCommunityIcons
                      name="alert-outline"
                      size={20}
                      color="yellow"
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      value="report"
                      variant={"body"}
                      style={{ color: "yellow" }}
                    />
                  </TouchableOpacity>
                ),
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="Users"
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    value={"All Users"}
                    {...props}
                    style={{ color: "#fff" }}
                    variant={"subtitle"}
                  />
                ),
                headerRight: () => (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() =>
                      Linking.openURL("https://support.rahafest.com")
                    }
                  >
                    <MaterialCommunityIcons
                      name="alert-outline"
                      size={20}
                      color="yellow"
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      // value={`${allUsers.length} members`}
                      value="report"
                      variant={"body"}
                      style={{ color: "yellow" }}
                    />
                  </TouchableOpacity>
                ),
                headerTitleAlign: "center",
              }}
              component={AllUsers}
            />
            <Stack.Screen
              name="Merchandise"
              component={Merchandise}
              options={{
                headerShown: false,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    value="Merchandise"
                    variant={"subtitle"}
                    style={{ color: "#fff" }}
                  />
                ),
                headerTitleAlign: "center",
              }}
            />

            <Stack.Screen
              name="Account"
              component={Account}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    value={"Account"}
                    {...props}
                    variant={"subtitle"}
                    style={{ color: "#fff" }}
                  />
                ),
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="Deals"
              component={Deals}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    value={"Deals"}
                    {...props}
                    variant={"subtitle"}
                    style={{ color: "#fff" }}
                  />
                ),
                headerTitleAlign: "center",
              }}
            />

            <Stack.Screen
              name="CheckoutNavigator"
              component={CheckoutNavigator}
              options={{
                headerShown: false,
                headerShadowVisible: false,
                headerTintColor: "#000",
                headerStyle: {
                  backgroundColor: "#fff", // Ensure background color is set correctly
                  elevation: 0, // Remove shadow on Android
                  shadowOpacity: 0, // Remove shadow on iOS
                  borderBottomWidth: 0, // Remove bottom border
                },
                headerTitle: (props) => (
                  <Text
                    value={""}
                    {...props}
                    variant={"subtitle"}
                    style={{ color: "#000" }}
                  />
                ),
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    {...props}
                    style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}
                  >
                    Login
                  </Text>
                ),
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: "#212529",
                },
                headerTitle: (props) => (
                  <Text
                    {...props}
                    style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}
                  >
                    Register
                  </Text>
                ),
                headerTitleAlign: "center",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NotificationsContainer>
  );
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleText: {
    color: "#fff",
    textAlign: "center",
  },
});
