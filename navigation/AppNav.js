import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";

import { Text } from "../components";

import { HomeNavigator } from "../screens/home";
import { MenuNavigator } from "../screens/menu";
import { ScheduleNavigator } from "../screens/schedule";
import { NewsfeedNavigator } from "../screens/news";

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
        component={ScheduleNavigator}
        options={{
          title: "Schedule",
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"Schedule"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
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
        name="Newsfeed"
        component={NewsfeedNavigator}
        options={{
          title: "For You",
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"News updates"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="newspaper"
              color={focused ? "orange" : "#fafafa"}
              size={size}
            />
          ),
        }}
      />

      <BottomTab.Screen
        name="Menu"
        component={MenuNavigator}
        options={{
          title: "Menu",
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#212529",
          },
          headerTitle: (props) => (
            <Text value={"Menu"} {...props} variant={"subtitle"} />
          ),
          headerTitleAlign: "center",
          tabBarIcon: ({ size, focused }) => (
            <MaterialCommunityIcons
              name="food"
              color={focused ? "orange" : "#fafafa"}
              size={size}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
