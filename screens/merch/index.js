import MerchPage from "./MerchPage";
import Merchandise from "../club/landing/Merchandise";
import ItemPage from "./ItemPage";
import PayWithCard from "./PayWithCard";
import CartScreen from "./CartScreen";
import CheckoutScreen from "./CheckoutScreen";
import Market from "./Market";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import PaymentScreen from "./PaymentScreen";

const Stack = createNativeStackNavigator();

export default function MerchNavigator() {
  const { state } = useCart();
  const navigation = useNavigation();

  return (
    <Stack.Navigator initialRouteName="Market">
      <Stack.Screen
        name="Market"
        component={Market}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: "Market Place",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Merchandise"
        component={MerchPage}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: "Merchandise",
          // Add to your navigation options
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Cart")}
              style={styles.cartButton}
            >
              <Text>🛒</Text>
              <Text style={styles.cartCounter}>
                {` ${
                  state?.items?.reduce(
                    (total, item) => total + item.quantity,
                    0
                  ) || 0
                }`}
              </Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ItemPage"
        component={ItemPage}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitleAlign: "center",
          headerTitle: (props) => (
            <View style={styles.row}>
              <Text
                value={"Live Chat"}
                variant={"subtitle"}
                style={styles.headerTitleText}
              />
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => Linking.openURL("https://support.rahafest.com")}
            >
              <MaterialCommunityIcons
                name="alert-outline"
                size={20}
                color="yellow"
                style={{ marginRight: 2 }}
              />
              <Text
                // value={`${allUsers.length} members`}
                value="report"
                variant={"body"}
                style={{ color: "yellow" }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PayWithCard" component={PayWithCard} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleText: {
    color: "#fff",
    textAlign: "center",
  },
  cartButton: {
    marginRight: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
    padding: 8,
  },
  cartCounter: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
  },
});
