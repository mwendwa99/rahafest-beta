import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Text } from "../../components";
import Events from "./Events";

const Stack = createNativeStackNavigator();

export default function EventNavigator() {
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen
        name="Events"
        component={Events}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"Events"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}
