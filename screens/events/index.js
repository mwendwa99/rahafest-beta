import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "../../components";
import Events from "./Events";
import CheckoutNavigator from "./checkout";
import EventScreen from "./event";
import CheckoutScreen from "./event/Checkout";
import { SecureCheckout } from "./event/CyberSource";

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
      <Stack.Screen
        name="CyberSource"
        component={SecureCheckout}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
// Export the Events component directly
export { Events };
