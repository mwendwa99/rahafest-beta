import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { fetchUser } from "../../redux/auth/authActions";
import { StyleSheet, View } from "react-native";
import { clearError } from "../../redux/auth/authSlice";

import { Text } from "../../components";

import DirectMessage from "./chat/DirectMessage";
import Live from "./chat/Live";
import Checkout from "../events/Events";
import Friends from "./friends";
import Account from "../account";
import AllUsers from "./friends/AllUsers";
import Messages from "./chat/Messages";
import Landing from "./landing/Landing";
import Merchandise from "./landing/Merchandise";
import Gallery from "./landing/Gallery";
import EventDeals from "./landing/Deals";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { persistor } from "../../redux/store";
import { warning } from "../../utils/toast";

const Stack = createNativeStackNavigator();

export default function ClubNavigator() {
  const navigation = useNavigation();
  const { token, allUsers, error } = useSelector((state) => state.auth);
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
                <View style={styles.row}>
                  <Text
                    value={`${allUsers.length} members`}
                    style={styles.onlineCount}
                    variant={"body"}
                  />
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="Messages"
            component={Messages}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitle: (props) => (
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  Direct messages
                </Text>
              ),
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="DirectMessage"
            component={DirectMessage}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitle: (props) => (
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  Direct Messages
                </Text>
              ),
              headerTitleAlign: "center",
            }}
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
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="AllUsers"
            component={AllUsers}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitle: (props) => (
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  AllUsers
                </Text>
              ),
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Merchandise"
            component={Merchandise}
            options={{
              headerShown: true,
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
          {/* <Stack.Screen
            name="Gallery"
            component={Gallery}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitle: (props) => (
                <Text
                  value={"Gallery"}
                  {...props}
                  variant={"subtitle"}
                  style={{ color: "#fff" }}
                />
              ),
              headerTitleAlign: "center",
            }}
          /> */}
          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="EventDeals"
            component={EventDeals}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitle: (props) => (
                <Text
                  value={"Event Deals"}
                  {...props}
                  variant="subtitle"
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
  onlineCount: {
    color: "limegreen",
    textAlign: "right",
  },
});
