import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { Text } from "../../components";
import DirectMessage from "./DirectMessage";
import Feed from "./Feed";
import { Register, Login } from "../auth";

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  const { user, token } = useSelector((state) => state.auth);

  return token ? (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{
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
