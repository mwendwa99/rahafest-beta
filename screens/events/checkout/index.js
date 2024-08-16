import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Checkout from "./Checkout";

const Stack = createNativeStackNavigator();

export default function CheckoutNavigator() {
  return (
    <Stack.Navigator initialRouteName="Checkout">
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{ headerShown: false, headerShadowVisible: false }}
      />
    </Stack.Navigator>
  );
}
