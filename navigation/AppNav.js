import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";

const BottomTab = createBottomTabNavigator();

export default function AppNav({ routes }) {
  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          version={3}
          style={{
            backgroundColor: "#212529",
            margin: 0,
            padding: 0,
          }}
          activeIndicatorStyle={{
            backgroundColor: "#212529",
          }}
          activeColor="orange"
          inactiveColor="lightgrey"
          shifting={false}
          keyboardHidesNavigationBar={true}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      {routes.map((route) => (
        <BottomTab.Screen
          key={route.key}
          name={route.name}
          component={route.component}
          options={{
            title: route.name,
            tabBarIcon: ({ size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? route.icon_focused : route.icon_default}
                color={focused ? "orange" : "#fafafa"}
                size={size}
              />
            ),
          }}
        />
      ))}
    </BottomTab.Navigator>
  );
}
