import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import DirectMessage from "./chat/DirectMessage";
import Live from "./chat/Live";
import Checkout from "../events/Events";
import Friends from "./friends/Friends";
import AllUsers from "./friends/AllUsers";
import Messages from "./chat/Messages";
import Landing from "./landing/Landing";
import Merchandise from "./landing/Merchandise";
import Media from "./landing/Media";
import EventDeals from "./landing/Deals";
import News from "./landing/News";
import AuthNav from "./auth";
import Login from "./auth/Login";
import Register from "./auth/Register";

const Stack = createNativeStackNavigator();

export default function ClubNavigator() {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigation.navigate("Login");
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
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  Raha Club
                </Text>
              ),
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Feed"
            component={Live}
            options={({ navigation }) => ({
              headerShown: false,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitleAlign: "center",
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
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  Friends
                </Text>
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
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  Merchandise
                </Text>
              ),
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Media"
            component={Media}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitle: (props) => (
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  Raha Fest Media
                </Text>
              ),
              headerTitleAlign: "center",
            }}
          />
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
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  Event Deals
                </Text>
              ),
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="News"
            component={News}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#212529",
              },
              headerTitle: (props) => (
                <Text {...props} style={{ fontWeight: "bold", fontSize: 18 }}>
                  Raha Fest News
                </Text>
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
