import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "../../components";

import Home from "./Home";
import Playlist from "./Playlist";
import Settings from "./Settings";
import Faqs from "./Faqs";
// import Map from "./Map";

import ChatNavigator from "../chat";

const Stack = createNativeStackNavigator();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false, headerShadowVisible: false }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"Settings"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Playlist"
        component={Playlist}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"Playlist"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Faqs"
        component={Faqs}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"Faqs"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
