import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DirectMessage from "./DirectMessage";

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  //change this var here to test auth true || false
  const user = null;
  return user ? (
    <Stack.Navigator initialRouteName="Chat">
      <Stack.Screen
        name="DirectMessage"
        component={DirectMessage}
        options={{ headerShown: false, headerShadowVisible: false }}
      />
    </Stack.Navigator>
  ) : (
    alert("Log in to continue!")
  );
}
