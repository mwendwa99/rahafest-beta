import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { Text } from "../../components";
import DirectMessage from "./DirectMessage";
import Feed from "./Feed";
import Friends from "./Friends";
import AllUsers from "./AllUsers";
import { Register, Login } from "../auth";

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  const { user, token } = useSelector((state) => state.auth);

  return token ? (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"Global Chat"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              {/* You can add multiple icons or components here */}
              {/* <TouchableOpacity onPress={() => navigation.navigate("Friends")}>
                <FontAwesome5
                  name="user-friends"
                  size={24}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity> */}
              {/* <TouchableOpacity onPress={() => navigation.navigate("AllUsers")}>
                <FontAwesome5
                  name="globe"
                  size={24}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity> */}
            </View>
          ),
        })}
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
