import MerchPage from "./MerchPage";
import Merchandise from "../club/landing/Merchandise";
import ItemPage from "./ItemPage";
import CartScreen from "./CartScreen";
import CheckoutScreen from "./CheckoutScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";

const Stack = createNativeStackNavigator();

export default function MerchNavigator() {
  const { state } = useCart();
  const navigation = useNavigation();

  return (
    <Stack.Navigator initialRouteName="Merchandise">
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
          headerTitle: (props) => (
            <Text
              value={"Raha Club"}
              {...props}
              variant={"subtitle"}
              style={{ color: "#fff" }}
            />
          ),
          // Add to your navigation options
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Cart")}
              style={{ marginRight: 15, flexDirection: "row" }}
            >
              <Text style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
                🛒
              </Text>
              <Text style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
                {`(${state.items.length})`}
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
});
