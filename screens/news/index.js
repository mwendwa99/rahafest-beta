import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearError } from "../../redux/auth/authSlice";

import { Text } from "../../components";

import News from "./News";

const Stack = createNativeStackNavigator();

export default function ClubNavigator() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, []);

  return (
    <Stack.Navigator initialRouteName="News">
      <Stack.Screen
        name="News"
        component={News}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text
              value={"Raha News"}
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
