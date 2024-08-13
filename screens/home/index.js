import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "../../components";

import Home from "./Home";
import Settings from "./Settings";
import Faqs from "./Faqs";
import Gallery from "../club/landing/Gallery";
import News from "../news/News";

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomePage">
      <Stack.Screen
        name="HomePage"
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
            <Text
              value={"Settings"}
              {...props}
              variant={"subtitle"}
              style={{ color: "#fff" }}
            />
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={Gallery}
        options={{
          headerShown: false,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"Gallery"} {...props} variant={"subtitle"} />
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
            <Text
              value={"Faqs"}
              {...props}
              variant={"subtitle"}
              style={{ color: "#fff" }}
            />
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="News"
        component={News}
        options={{
          headerShown: false,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text
              value={"News"}
              {...props}
              variant={"subtitle"}
              style={{ color: "#fff" }}
            />
          ),
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}
