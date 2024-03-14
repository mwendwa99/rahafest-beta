import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CText } from "../../components";

import Home from "./Home";
import Playlist from "./Playlist";

const Stack = createNativeStackNavigator();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
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
            <CText
              value={"Playlist"}
              {...props}
              textStyle={{ fontSize: 24, lineHeight: 32 }}
            />
          ),
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};
