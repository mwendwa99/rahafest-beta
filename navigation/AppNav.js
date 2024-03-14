import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";

import { HomeNavigator } from "../screens/home";
import { Chat as ChatScreen } from "../screens/chat";

const BottomTab = createBottomTabNavigator();

export default function AppNav() {
  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          version={3}
          style={{
            backgroundColor: "#212529",
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
      <BottomTab.Screen
        name="HomeNav"
        component={HomeNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="home"
              color={focused ? "orange" : "#fafafa"}
              size={size}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Schedule"
        component={HomeNavigator}
        options={{
          title: "Schedule",
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome5
              name="compact-disc"
              color={focused ? "orange" : "#fafafa"}
              size={size}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Lineup"
        component={HomeNavigator}
        options={{
          title: "Lineup",
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="calendar-clock"
              color={focused ? "orange" : "#fafafa"}
              size={size}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: "Chat",
          headerShown: true,
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="chat"
              color={focused ? "orange" : "#fafafa"}
              size={size}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
