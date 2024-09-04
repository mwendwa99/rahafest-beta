import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Checkout from "./Checkout";
import ClubNavigator from "../../club";

const Stack = createNativeStackNavigator();

export default function CheckoutNavigator() {
  return (
    <Stack.Navigator initialRouteName="Checkout">
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{ headerShown: false, headerShadowVisible: false }}
      />
      <Stack.Screen
        name="ClubNavigator"
        component={ClubNavigator}
        options={{ headerShown: false, headerShadowVisible: false }}
      />
    </Stack.Navigator>
  );
}
