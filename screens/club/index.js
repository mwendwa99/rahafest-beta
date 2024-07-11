import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect } from "react";

import { Text } from "../../components";
import DirectMessage from "./chat/DirectMessage";
import Feed from "./chat/Feed";
import LiveChat from "./chat/LiveChat";
import Checkout from "../events/Events";
import Friends from "./friends/Friends";
import AllUsers from "./friends/AllUsers";
import Messages from "./chat/Messages";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Landing from "./landing/Landing";
import Merchandise from "./landing/Merchandise";
import Media from "./landing/Media";

const Stack = createNativeStackNavigator();

export default function ClubNavigator({ navigation }) {
  const { token, message } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   // Check if the user is authenticated

  // }, [token, message]);

  const isAuthenticated = () => {
    if (token && message === "Login Success") {
      return true;
    } else {
      return false;
    }
  };

  return isAuthenticated ? (
    <Stack.Navigator initialRouteName="Club">
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
            <Text value={"Raha Club"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
        }}
      />
      {/* <Stack.Screen
        name="Feed"
        component={LiveChat}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => <Text value={""} {...props} />,
          headerTitleAlign: "center",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                <FontAwesome5
                  name="inbox"
                  size={24}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity> 
               <TouchableOpacity onPress={() => navigation.navigate("Friends")}>
                <FontAwesome5
                  name="user-friends"
                  size={24}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
               <TouchableOpacity onPress={() => navigation.navigate("AllUsers")}>
                <FontAwesome5
                  name="globe"
                  size={24}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity> 
            </View>
          ),
        })}
      /> */}
      <Stack.Screen
        name="Feed"
        component={LiveChat}
        options={({ navigation }) => ({
          headerShown: false,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => <Text value={""} {...props} />,
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
            <Text value={"Direct messages"} {...props} variant={"subtitle"} />
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
            <Text value={"Direct Messages"} {...props} variant={"subtitle"} />
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
            <Text value={"Friends"} {...props} variant={"subtitle"} />
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
            <Text value={"AllUsers"} {...props} variant={"subtitle"} />
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
            <Text value={"Merchandise"} {...props} variant={"subtitle"} />
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
            <Text value={"Raha Fest Media"} {...props} variant={"subtitle"} />
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
          headerTitle: (props) => (
            <Text value={""} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator initialRouteName="Login">
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
            <Text value={"Login"} {...props} variant={"subtitle"} />
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
            <Text value={"Register"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}
