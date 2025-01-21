import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import { Text } from "react-native";

import HomeNavigator from "./home";
import EventNavigator from "./events";
import ClubNavigator from "./club";
// import Merchandise from "./club/landing/Merchandise";
import Merchandise from "./merch";

const BottomTab = createBottomTabNavigator();

export default function App({ expoToken }) {
  const appRoutes = [
    {
      key: "HomeNav",
      name: "Home",
      component: HomeNavigator,
      icon_focused: "home",
      icon_default: "home-outline",
    },
    {
      key: "EventNav",
      name: "Events",
      component: EventNavigator,
      icon_focused: "calendar-multiple-check",
      icon_default: "calendar-multiple",
    },
    {
      key: "Merchandise",
      name: "Market Place",
      component: Merchandise,
      icon_focused: "shopping",
      icon_default: "shopping-outline",
    },
    {
      key: "Club",
      name: "Raha Club",
      component: ClubNavigator,
      icon_focused: "cards-club",
      icon_default: "cards-club-outline",
    },
  ];

  return <AppNav routes={appRoutes} />;
}

function AppNav({ routes }) {
  return (
    <BottomTab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, descriptors, navigation }) => (
        <BottomNavigation.Bar
          version={3}
          navigationState={state}
          safeAreaInsets={state.insets}
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
            return options?.tabBarIcon
              ? options.tabBarIcon({ focused, size: 24 })
              : null;
          }}
          getLabelText={({ route }) =>
            descriptors[route.key]?.options?.title ?? route.name
          }
          activeIndicatorStyle={{
            backgroundColor: "transparent",
            color: "white",
          }}
          style={{
            backgroundColor: "#212529",
            activeColor: "orange",
            inactiveColor: "lightgrey",
          }}
          renderLabel={({ route, focused }) => (
            <Text
              style={{
                color: focused ? "orange" : "lightgrey",
                fontSize: 12, // Optional: Adjust font size if needed
                textAlign: "center",
              }}
            >
              {descriptors[route.key]?.options?.title ?? route.name}
            </Text>
          )}
        />
      )}
    >
      {routes.map((route) => (
        <BottomTab.Screen
          barStyle={{ backgroundColor: "#694fad" }}
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
