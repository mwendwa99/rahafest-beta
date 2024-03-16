import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Text } from "../../components";
import DirectMessage from "./DirectMessage";
import { Register } from "../auth";

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  //change this var here to test auth true || false
  const user = null;
  return user ? (
    <Stack.Navigator initialRouteName="DirectMessage">
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
    <Stack.Navigator initialRouteName="Register">
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
