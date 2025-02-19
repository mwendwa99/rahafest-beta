import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "../../components";
import Events from "./Events";
import CheckoutNavigator from "./checkout";
import EventScreen from "./event";
import CheckoutScreen from "./event/Checkout";

const Stack = createNativeStackNavigator();

export default function EventNavigator() {
  return (
    <Stack.Navigator initialRouteName="Raha Events">
      <Stack.Screen
        name="Raha Events"
        component={Events}
        options={{
          headerShown: false, // Hide header for the Events screen
        }}
      />
      <Stack.Screen
        name="Event"
        component={EventScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="CheckoutNavigator"
        component={CheckoutNavigator}
        options={{
          headerShown: false,
          headerShadowVisible: false,
          headerTintColor: "#000",
          headerStyle: {
            backgroundColor: "#fff", // Ensure background color is set correctly
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            borderBottomWidth: 0, // Remove bottom border
          },
          headerTitle: (props) => (
            <Text
              value={""}
              {...props}
              variant={"subtitle"}
              style={{ color: "#000" }}
            />
          ),
        }}
      /> */}
    </Stack.Navigator>
  );
}
// Export the Events component directly
export { Events };
