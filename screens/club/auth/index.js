import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import Register from "./Register";
import Text from "../../../components/Text";

const Stack = createNativeStackNavigator();

export default function AuthNav({ routes }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        // options={{
        //   headerShown: true,
        //   headerShadowVisible: false,
        //   headerTintColor: "#fff",
        //   headerStyle: {
        //     backgroundColor: "#212529",
        //   },
        //   headerTitle: (props) => (
        //     <Text value={"Login"} {...props} variant={"subtitle"} />
        //   ),
        //   headerTitleAlign: "center",
        // }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        // options={{
        //   headerShown: true,
        //   headerShadowVisible: false,
        //   headerTintColor: "#fff",
        //   headerStyle: {
        //     backgroundColor: "#212529",
        //   },
        //   headerTitle: (props) => (
        //     <Text value={"Register"} {...props} variant={"subtitle"} />
        //   ),
        //   headerTitleAlign: "center",
        // }}
      />
    </Stack.Navigator>
  );
}
